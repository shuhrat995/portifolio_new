#!/usr/bin/env node
/**
 * Pulls the GitHub profile + every public repository and writes them to
 * `data/profile.json` and `data/projects.json`.
 *
 * Usage:
 *   node scripts/sync-github.mjs                 # uses GITHUB_USERNAME or shuhrat995
 *   node scripts/sync-github.mjs someuser
 *   GITHUB_TOKEN=ghp_xxx node scripts/sync-github.mjs   # higher rate limits
 *
 * Manual edits made in the /qw admin panel are preserved: this script only
 * refreshes the fields it owns (description -> only when empty, stars, language,
 * homepage URL, topics) and never overwrites `featured`, `image` or `order`.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const USERNAME = process.argv[2] || process.env.GITHUB_USERNAME || "shuhrat995";
const TOKEN = process.env.GITHUB_TOKEN || "";
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");

const UA = "Mozilla/5.0 (compatible; portfolio-sync/1.0)";
const headers = { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" };
const apiHeaders = {
  "User-Agent": UA,
  Accept: "application/vnd.github+json",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, init = {}) {
  const res = await fetch(url, init);
  if (!res.ok) return null;
  return res;
}

async function getText(url) {
  const res = await get(url, { headers });
  return res ? res.text() : null;
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s) {
  return decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

async function fetchProfile() {
  if (TOKEN) {
    const res = await get(`https://api.github.com/users/${USERNAME}`, { headers: apiHeaders });
    if (res) {
      const u = await res.json();
      return {
        name: u.name || u.login,
        username: u.login,
        headline: u.bio || "",
        location: u.location || "",
        company: u.company || "",
        avatarUrl: u.avatar_url,
        followers: u.followers,
        following: u.following,
        publicRepos: u.public_repos,
        github: u.html_url,
        blog: u.blog || "",
        twitter: u.twitter_username ? `https://twitter.com/${u.twitter_username}` : "",
      };
    }
  }

  const html = await getText(`https://github.com/${USERNAME}`);
  if (!html) throw new Error(`Could not load https://github.com/${USERNAME}`);

  const pick = (re) => {
    const m = html.match(re);
    return m ? stripTags(m[1]) : "";
  };

  const vcard = html.match(/<div class="vcard-details"[\s\S]*?<\/ul>/)?.[0] || html;
  const detail = (itemprop) => {
    const m = vcard.match(new RegExp(`itemprop="${itemprop}"[^>]*>([\\s\\S]*?)</(?:li|span|a)>`));
    return m ? stripTags(m[1]) : "";
  };

  const blogMatch = vcard.match(/itemprop="url"[^>]*>\s*<a[^>]*href="([^"]+)"/) ||
    vcard.match(/<a[^>]*class="[^"]*Link--primary[^"]*"[^>]*href="([^"]+)"/);

  return {
    name: pick(/<span class="p-name vcard-fullname[^"]*"[^>]*>([\s\S]*?)<\/span>/) || USERNAME,
    username: USERNAME,
    headline: pick(/<div class="p-note user-profile-bio[^"]*"[^>]*>([\s\S]*?)<\/div>/),
    location: detail("homeLocation"),
    company: detail("worksFor"),
    avatarUrl: `https://github.com/${USERNAME}.png?size=460`,
    followers: Number(pick(/text-bold color-fg-default">([\d,]+)<\/span>\s*followers/) || 0) || undefined,
    following: Number(pick(/text-bold color-fg-default">([\d,]+)<\/span>\s*following/) || 0) || undefined,
    publicRepos: undefined,
    github: `https://github.com/${USERNAME}`,
    blog: blogMatch ? blogMatch[1] : "",
    twitter: "",
  };
}

/* ------------------------------------------------------------------ */
/* Repositories                                                        */
/* ------------------------------------------------------------------ */

async function fetchRepoList() {
  if (TOKEN) {
    const out = [];
    for (let page = 1; page <= 5; page++) {
      const res = await get(
        `https://api.github.com/users/${USERNAME}/repos?per_page=100&page=${page}&sort=updated`,
        { headers: apiHeaders }
      );
      if (!res) break;
      const batch = await res.json();
      if (!Array.isArray(batch) || batch.length === 0) break;
      out.push(...batch);
      if (batch.length < 100) break;
    }
    if (out.length) {
      return out
        .filter((r) => !r.fork)
        .map((r) => ({
          name: r.name,
          description: r.description || "",
          homepage: r.homepage || "",
          language: r.language || "",
          topics: r.topics || [],
          stars: r.stargazers_count,
          forks: r.forks_count,
          updatedAt: r.pushed_at,
          createdAt: r.created_at,
          fork: r.fork,
          archived: r.archived,
          isTemplate: r.is_template,
        }));
    }
  }

  const repos = [];
  for (let page = 1; page <= 5; page++) {
    const html = await getText(`https://github.com/${USERNAME}?tab=repositories&page=${page}`);
    if (!html) break;
    const blocks = html.match(/<li class="col-12[\s\S]*?<\/li>/g) || [];
    if (blocks.length === 0) break;

    for (const b of blocks) {
      const name = b.match(/itemprop="name codeRepository"[^>]*>\s*([^<]+?)\s*<\/a>/);
      if (!name) continue;
      const lang = b.match(/itemprop="programmingLanguage">([^<]+)</);
      const updated = b.match(/<relative-time datetime="([^"]+)"/);
      const forks = b.match(/\/forks"[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)/);
      const stars = b.match(/\/stargazers"[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)/);
      repos.push({
        name: name[1],
        description: "",
        homepage: "",
        language: lang ? lang[1] : "",
        topics: [],
        stars: stars ? Number(stars[1].replace(/,/g, "")) : 0,
        forks: forks ? Number(forks[1].replace(/,/g, "")) : 0,
        updatedAt: updated ? updated[1] : "",
        createdAt: "",
        fork: /forked from|Forked from/.test(b),
        archived: /Public archive|Archived/.test(b),
        isTemplate: /Public template/.test(b),
      });
    }
    if (blocks.length < 30) break;
    await sleep(300);
  }
  return repos;
}

/** Extract the About-sidebar website, description and topics from a repo page. */
async function enrichRepo(repo) {
  const html = await getText(`https://github.com/${USERNAME}/${repo.name}`);
  if (html) {
    const aboutIdx = html.search(/>About</);
    const region = aboutIdx > 0 ? html.slice(aboutIdx, aboutIdx + 6000) : "";

    if (!repo.homepage) {
      const urlMatch = region.match(/data-component="Link"[^>]*href="(https?:\/\/[^"]+)"/) ||
        region.match(/href="(https?:\/\/[^"]+)"[^>]*target="_blank"[^>]*rel="noopener noreferrer nofollow"/) ||
        region.match(/href="(https?:\/\/[^"]+)"/);
      if (urlMatch && !urlMatch[1].includes("github.com")) repo.homepage = urlMatch[1];
    }

    const desc = html.match(/<p class="f4 my-3[^"]*"[^>]*>([\s\S]*?)<\/p>/);
    if (desc) repo.description = stripTags(desc[1]);

    const topics = [...region.matchAll(/class="topic-tag[^"]*"[^>]*>\s*([^<]+?)\s*</g)].map((m) =>
      m[1].trim()
    );
    if (topics.length) repo.topics = topics;

    const starCounter = html.match(/id="repo-stars-counter-star"[^>]*title="([\d,]+)"/);
    if (starCounter) repo.stars = Number(starCounter[1].replace(/,/g, ""));
    const forkCounter = html.match(/id="repo-network-counter"[^>]*title="([\d,]+)"/);
    if (forkCounter) repo.forks = Number(forkCounter[1].replace(/,/g, ""));
  }

  if (!repo.description) {
    for (const branch of ["main", "master"]) {
      const raw = await getText(
        `https://raw.githubusercontent.com/${USERNAME}/${repo.name}/${branch}/README.md`
      );
      if (!raw) continue;
      const text = raw
        .replace(/```[\s\S]*?```/g, "")
        .split("\n")
        .map((l) => l.trim())
        .filter(
          (l) =>
            l &&
            !l.startsWith("#") &&
            !l.startsWith("![") &&
            !l.startsWith("<") &&
            !/^[-*|>]/.test(l) &&
            !/^https?:\/\//.test(l) &&
            l.replace(/[^a-zA-Z]/g, "").length > 3
        );
      if (text.length) repo.description = text[0].slice(0, 240);
      break;
    }
  }

  return repo;
}

/* ------------------------------------------------------------------ */
/* Normalisation                                                       */
/* ------------------------------------------------------------------ */

const LANG_CATEGORY = {
  TypeScript: "Frontend",
  JavaScript: "Frontend",
  CSS: "Frontend",
  HTML: "Frontend",
  Vue: "Frontend",
  Python: "Backend",
  "C#": "Backend",
  Go: "Backend",
};

function prettify(name) {
  const cleaned = name.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function humanizeDescription(repo) {
  if (repo.description) return repo.description;
  const n = repo.name.toLowerCase();
  const table = [
    [/anime/, "Anime discovery app with a fast, modern UI."],
    [/maktab|school/, "School website project built for a local school."],
    [/o.?yin|game/, "Small 2D browser game."],
    [/savdo|shop|market/, "Online store with a cart and product listing."],
    [/task/, "Task management app with full CRUD and persistence."],
    [/xavo|ob.?havo|weather/, "Live weather app powered by a public weather API."],
    [/lugat|dictionary/, "Dictionary app for looking up and saving words."],
    [/valyuta|currency/, "Currency converter with live exchange rates."],
    [/todo/, "Todo app demonstrating React state management."],
    [/info.?generator|generator/, "Random info generator built with React."],
    [/savol|quiz|javob/, "Quiz app with questions and instant answer feedback."],
    [/timer/, "Countdown timer with start, pause and reset controls."],
    [/qalqulyat|calculator/, "Calculator app with keyboard and mouse input."],
    [/portfolio|portifolio/, "Personal portfolio website."],
    [/experience/, "Project showcasing experience and timeline UI."],
  ];
  for (const [re, text] of table) if (re.test(n)) return text;
  return `${prettify(repo.name)} — a ${repo.language || "web"} project.`;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  console.log(`→ Syncing GitHub data for "${USERNAME}"${TOKEN ? " (authenticated)" : ""}…`);

  const [profile, repoList] = await Promise.all([fetchProfile(), fetchRepoList()]);
  console.log(`  found ${repoList.length} repositories`);

  const preservedProfile = await readJson(path.join(DATA_DIR, "profile.json"), {});
  const preservedProjects = await readJson(path.join(DATA_DIR, "projects.json"), []);
  const bySlug = new Map(preservedProjects.map((p) => [p.slug, p]));

  const enriched = [];
  for (const repo of repoList) {
    const withMeta = await enrichRepo(repo);
    const slug = repo.name.toLowerCase();
    const previous = bySlug.get(slug);

    enriched.push({
      // Carry over anything the sync does not own (tech chips, manual copy,
      // featured flags) so a re-sync never destroys hand-written polish.
      ...previous,
      id: previous?.id || slug,
      slug,
      name: previous?.name || prettify(repo.name),
      description: previous?.description || humanizeDescription(withMeta),
      longDescription: previous?.longDescription || "",
      repoUrl: `https://github.com/${USERNAME}/${repo.name}`,
      liveUrl: previous?.liveUrl || withMeta.homepage || "",
      language: withMeta.language || previous?.language || "",
      category: previous?.category || LANG_CATEGORY[withMeta.language] || "Other",
      topics: withMeta.topics?.length ? withMeta.topics : previous?.topics || [],
      stars: withMeta.stars ?? 0,
      forks: withMeta.forks ?? 0,
      createdAt: withMeta.createdAt || previous?.createdAt || "",
      updatedAt: withMeta.updatedAt || previous?.updatedAt || "",
      image: previous?.image || "",
      featured: previous?.featured ?? false,
      visible: previous?.visible ?? true,
      order: previous?.order ?? 0,
    });

    process.stdout.write(
      `\r  enriched ${enriched.length}/${repoList.length}  ${" ".repeat(20)}`
    );
    await sleep(120);
  }
  process.stdout.write("\n");

  enriched.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  enriched.forEach((p, i) => {
    if (!p.order) p.order = i;
  });

  const byLang = new Map();
  for (const p of enriched) {
    if (!p.language) continue;
    byLang.set(p.language, (byLang.get(p.language) || 0) + 1);
  }
  const languages = [...byLang.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const finalProfile = {
    ...preservedProfile,
    name: profile.name || preservedProfile.name || USERNAME,
    username: USERNAME,
    headline: profile.headline || preservedProfile.headline || "",
    location: profile.location || preservedProfile.location || "",
    company: profile.company || preservedProfile.company || "",
    avatarUrl: preservedProfile.avatarUrl || profile.avatarUrl || "",
    github: `https://github.com/${USERNAME}`,
    blog: profile.blog || preservedProfile.blog || "",
    email: preservedProfile.email || "",
    telegram: preservedProfile.telegram || "",
    linkedin: preservedProfile.linkedin || "",
    twitter: profile.twitter || preservedProfile.twitter || "",
    resumeUrl: preservedProfile.resumeUrl || "",
    stats: {
      followers: profile.followers ?? preservedProfile.stats?.followers,
      following: profile.following ?? preservedProfile.stats?.following,
      publicRepos: profile.publicRepos ?? enriched.length,
      stars: enriched.reduce((s, p) => s + (p.stars || 0), 0),
      liveDemos: enriched.filter((p) => p.liveUrl).length,
      languages,
    },
    skills: preservedProfile.skills?.length
      ? preservedProfile.skills
      : languages.map((l) => ({ name: l.name, category: LANG_CATEGORY[l.name] || "Tools" })),
    experience: preservedProfile.experience || [],
    education: preservedProfile.education || [],
    updatedAt: new Date().toISOString(),
  };

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(path.join(DATA_DIR, "profile.json"), JSON.stringify(finalProfile, null, 2) + "\n");
  await writeFile(path.join(DATA_DIR, "projects.json"), JSON.stringify(enriched, null, 2) + "\n");

  const withDemo = enriched.filter((p) => p.liveUrl).length;
  console.log(`✓ Wrote data/profile.json and data/projects.json`);
  console.log(`  ${enriched.length} projects, ${withDemo} with a live demo link`);
}

main().catch((err) => {
  console.error("✗ Sync failed:", err.message);
  process.exit(1);
});
