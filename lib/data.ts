import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Profile, Project, SaveMode } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const PROFILE_FILE = path.join(DATA_DIR, "profile.json");

export type { SaveMode };

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function getProfile(): Promise<Profile> {
  return readJson<Profile>(PROFILE_FILE, {} as Profile);
}

/**
 * @param includeHidden when true (admin only) projects with `visible: false`
 *                      are returned as well.
 */
export async function getProjects(includeHidden = false): Promise<Project[]> {
  const projects = await readJson<Project[]>(PROJECTS_FILE, []);
  const list = includeHidden ? projects : projects.filter((p) => p.visible !== false);
  return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

/**
 * Writes a data file. When `GITHUB_TOKEN` and `GITHUB_DATA_REPO` are set the
 * change is committed to GitHub instead of the local disk, which is what makes
 * the admin panel work on read-only hosts like Vercel — the commit triggers a
 * redeploy, so edits become public automatically.
 */
async function persist(fileName: string, contents: string): Promise<SaveMode> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_DATA_REPO; // "owner/name"
  const branch = process.env.GITHUB_DATA_BRANCH || "main";
  const dataPath = process.env.GITHUB_DATA_PATH || "data";

  if (token && repo) {
    const apiPath = `${dataPath}/${fileName}`;
    const url = `https://api.github.com/repos/${repo}/contents/${apiPath}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "portfolio-admin",
    };

    // A commit needs the blob sha of the file we are replacing.
    let sha: string | undefined;
    const existing = await fetch(`${url}?ref=${branch}`, { headers, cache: "no-store" });
    if (existing.ok) {
      sha = (await existing.json())?.sha;
    }

    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `content: update ${apiPath} from admin panel`,
        content: Buffer.from(contents, "utf8").toString("base64"),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`GitHub commit failed (${res.status}): ${detail.slice(0, 200)}`);
    }
    return "github";
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Content storage is not configured for this deployment. Set GITHUB_TOKEN and GITHUB_DATA_REPO in Vercel Environment Variables."
    );
  }

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(path.join(DATA_DIR, fileName), contents, "utf8");
  return "filesystem";
}

export async function saveProjects(projects: Project[]): Promise<SaveMode> {
  const ordered = projects.map((p, i) => ({ ...p, order: i }));
  return persist("projects.json", JSON.stringify(ordered, null, 2) + "\n");
}

export async function saveProfile(profile: Profile): Promise<SaveMode> {
  return persist("profile.json", JSON.stringify(profile, null, 2) + "\n");
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "project";
}

/** Builds a project record from partial admin input, filling sane defaults. */
export function normalizeProject(
  input: Partial<Project>,
  existing?: Project
): Project {
  const name = (input.name ?? existing?.name ?? "Untitled project").trim();
  const slug = input.slug?.trim() || existing?.slug || slugify(name);

  return {
    id: existing?.id ?? slug,
    slug,
    name,
    description: (input.description ?? existing?.description ?? "").trim(),
    longDescription: input.longDescription ?? existing?.longDescription ?? "",
    repoUrl: (input.repoUrl ?? existing?.repoUrl ?? "").trim(),
    liveUrl: (input.liveUrl ?? existing?.liveUrl ?? "").trim(),
    language: (input.language ?? existing?.language ?? "").trim(),
    category: (input.category ?? existing?.category ?? "Project").trim(),
    tech: normalizeList(input.tech ?? existing?.tech),
    topics: normalizeList(input.topics ?? existing?.topics),
    stars: Number(input.stars ?? existing?.stars ?? 0) || 0,
    forks: Number(input.forks ?? existing?.forks ?? 0) || 0,
    createdAt: input.createdAt ?? existing?.createdAt ?? new Date().toISOString(),
    updatedAt: input.updatedAt ?? existing?.updatedAt ?? new Date().toISOString(),
    image: (input.image ?? existing?.image ?? "").trim(),
    featured: input.featured ?? existing?.featured ?? false,
    visible: input.visible ?? existing?.visible ?? true,
    order: input.order ?? existing?.order ?? 0,
  };
}

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}
