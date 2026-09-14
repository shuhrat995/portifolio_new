#!/usr/bin/env node
/**
 * Applies hand-written polish on top of the raw GitHub data produced by
 * `scripts/sync-github.mjs`.
 *
 * Why this exists: a GitHub sync can only ever know repo names, languages and
 * whatever the README says. This script layers real marketing copy, tech-stack
 * chips, categories and featured flags on top — and it is safe to re-run after
 * any sync, because `data/*.json` is always the input *and* the output.
 *
 * Usage: node scripts/curate.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA = path.join(process.cwd(), "data");

/** Repos that are not portfolio pieces (profile README repo, scratch repos). */
const EXCLUDE = new Set(["shuhrat995"]);

/** The single source of truth for each project's presentation. */
const CURATION = {
  anime: {
    name: "Anime Platform",
    category: "Full-Stack",
    featured: true,
    description:
      "Full-stack anime platform with a Next.js frontend and a dedicated Express API — browse, search and discover titles in a fast, media-rich interface.",
    longDescription:
      "A complete anime discovery product rather than a UI exercise: the Next.js client renders a responsive, image-heavy catalogue while a separate Express backend owns the data layer. Built with care for loading states, empty states and a layout that holds together on small screens.",
    tech: ["Next.js", "Express", "TypeScript", "REST API", "Vercel"],
    topics: ["nextjs", "express", "anime", "fullstack"],
  },
  "28-maktab_xonqa": {
    name: "School Platform — 28-maktab Xonqa",
    category: "Full-Stack",
    featured: true,
    description:
      "Modern school web platform for news, internal statistics and graduate data, complete with a protected admin panel for content management.",
    longDescription:
      "A platform built around the everyday needs of a school: announcements, an information hub, statistics dashboards and a granular admin area so staff can publish and manage content without touching code. Currently in production use for the school's public site.",
    tech: ["Next.js", "TypeScript", "Admin Panel", "Dashboards", "Vercel"],
    topics: ["nextjs", "typescript", "admin-panel", "education"],
  },
  "task-management": {
    name: "TaskFlow — Kanban & Crypto",
    category: "Full-Stack",
    featured: true,
    description:
      "Full-stack Kanban task manager on the Next.js App Router, paired with a live crypto market view and a typed internal API layer.",
    longDescription:
      "Two products in one codebase: a Kanban board with draggable columns and a crypto market panel fed by a public API. Next.js route handlers form a typed internal API, and optimistic UI updates keep the board feeling instant even on a slow connection.",
    tech: ["Next.js", "App Router", "TypeScript", "Kanban", "CoinGecko API", "Vercel"],
    topics: ["nextjs", "kanban", "crypto", "typescript"],
  },
  onlayn_savdo: {
    name: "Onlayn Savdo — E-Commerce",
    category: "Frontend",
    featured: true,
    description:
      "E-commerce storefront focused on UI/UX craft — product listing, cart flow and a clean, reusable component architecture.",
    longDescription:
      "An e-commerce front end built with a modern, fast stack and a deliberate focus on user experience: browsing, product detail and cart flows are wired end to end, with reusable components and clean-code conventions throughout.",
    tech: ["JavaScript", "REST API", "E-Commerce", "Responsive UI", "Vercel"],
    topics: ["ecommerce", "javascript", "ui-ux"],
  },
  xonatr: {
    name: "XonAtr",
    category: "Frontend",
    featured: true,
    description:
      "Next.js 16 application with global state via Zustand, animated transitions and a Tailwind CSS design system.",
    longDescription:
      "A modern Next.js 16 / React 19 app that leans on Zustand for global state, Framer Motion for motion design and Axios for data fetching — assembled into a Tailwind v4 design system with lucide icons.",
    tech: ["Next.js 16", "TypeScript", "Zustand", "Framer Motion", "Tailwind CSS", "Axios"],
    topics: ["nextjs", "zustand", "framer-motion", "tailwindcss"],
  },
  lugat: {
    name: "LingoUz — Vocabulary App",
    category: "Mobile",
    featured: true,
    description:
      "LingoUz — a 14,000+ word vocabulary app built with React and shipped to Android through Capacitor.",
    longDescription:
      "A dictionary and vocabulary trainer with a 14,000+ word dataset (roadmap: 80,000). Built with React 19, React Router and Vite, then wrapped with Capacitor so the exact same codebase runs as a native Android app as well as on the web.",
    tech: ["React 19", "Vite", "Capacitor", "Android", "React Router", "GitHub Pages"],
    topics: ["react", "capacitor", "android", "dictionary"],
  },
  ob_xavo: {
    name: "Ob-Havo — Weather App",
    category: "Frontend",
    featured: true,
    description:
      "Live weather application showing current conditions and forecasts from a public weather API, styled with a clean, mobile-first CSS layout.",
    longDescription:
      "A weather app that fetches live conditions for any queried city and renders them in a tidy, mobile-first card layout — a compact exercise in API integration, async state and resilient loading/error handling.",
    tech: ["JavaScript", "Weather API", "CSS3", "Responsive", "Vercel"],
    topics: ["javascript", "weather-api", "css"],
  },
  valyutalar_kanverdi: {
    name: "Valyuta Kursi — Currency Converter",
    category: "Mobile",
    description:
      "Currency converter with live exchange rates, packaged as an installable Android app with Capacitor.",
    longDescription:
      "A focused utility: pick two currencies, get a live rate and an instant conversion. Built with React and Vite, then shipped to Android with Capacitor so it installs and runs like a native app.",
    tech: ["React", "Vite", "Capacitor", "Android", "Exchange Rate API", "Vercel"],
    topics: ["react", "capacitor", "currency"],
  },
  portifolio: {
    name: "Neon Portfolio",
    category: "Frontend",
    description:
      "Neon-styled personal portfolio built with hand-written HTML, CSS and vanilla JavaScript — the project that started this one.",
    longDescription:
      "The original portfolio: no framework, no build step, just carefully hand-written HTML, CSS and JavaScript with a glow-heavy neon aesthetic. A useful baseline for how much the Next.js version gained.",
    tech: ["HTML5", "CSS3", "JavaScript", "Neon UI"],
    topics: ["html", "css", "portfolio"],
  },
  "2d_o-yin_ish_uchun": {
    name: "Arkanoid — NES Edition",
    category: "Game",
    description:
      "Arkanoid clone rendered on HTML5 Canvas — brick physics, paddle control and NES-inspired pixel visuals in pure vanilla JavaScript.",
    longDescription:
      "A browser game written from scratch with no engine and no dependencies: a requestAnimationFrame loop drives ball physics and collision detection on HTML5 Canvas, with a retro NES palette applied throughout.",
    tech: ["JavaScript", "HTML5 Canvas", "CSS3", "Game Loop"],
    topics: ["javascript", "canvas", "game"],
  },
  react_todos: {
    name: "React Todos",
    category: "Mini App",
    description:
      "Todo application covering the full CRUD cycle with React hooks and local persistence.",
    tech: ["React", "Hooks", "CRUD"],
    topics: ["react", "crud"],
  },
  react_info_generator: {
    name: "React Info Generator",
    category: "Mini App",
    description:
      "Small React app that surfaces 20 useful facts about React, demonstrating component state and conditional rendering.",
    tech: ["React", "Vite", "CSS", "Component State"],
    topics: ["react", "vite"],
  },
  react_savollar_javoblar: {
    name: "Quiz — Questions & Answers",
    category: "Mini App",
    description:
      "Question and answer quiz app with instant answer feedback and score tracking.",
    tech: ["React", "Vite", "State Management"],
    topics: ["react", "quiz"],
  },
  timer: {
    name: "Countdown Timer",
    category: "Mini App",
    description:
      "Countdown timer with start, pause and reset controls, built on React hooks and effects.",
    tech: ["React", "Vite", "useEffect", "Hooks"],
    topics: ["react", "timer"],
  },
  experiences: {
    name: "Experiences UI",
    category: "Frontend",
    description:
      "UI section library exploring experience and timeline layouts, crafted with react-icons.",
    tech: ["React", "react-icons", "UI Sections"],
    topics: ["react", "ui"],
  },
  "javascript-qalqulyatr": {
    name: "JavaScript Calculator",
    category: "Mini App",
    description:
      "Calculator that accepts both mouse and keyboard input, written in vanilla JavaScript with DOM-driven state.",
    longDescription:
      "A no-framework calculator: expression parsing, operator precedence and keyboard event handling implemented by hand on top of the DOM. A compact demonstration of core JavaScript.",
    tech: ["JavaScript", "HTML5", "CSS3", "DOM"],
    topics: ["javascript", "calculator"],
  },
  react_new_app: {
    name: "React Scratch App",
    category: "Mini App",
    description:
      "Early React scratch project that marked the move from plain JavaScript into component-based development.",
    tech: ["React", "Vite", "ESLint", "HMR"],
    topics: ["react", "learning"],
    liveUrl: "",
  },
};

/**
 * Live deployments that were actually reachable — verified by
 * `npm run check-links` (HTTP 200 with real content) on 2026-09-14.
 *
 * The `homepage` field on GitHub is unreliable: it still points at old Vercel
 * URLs such as `xon-atr.vercel.app` and `weather-uz-nu.vercel.app` that now
 * return 404. Anything not listed here has no working deployment, so only its
 * GitHub link is shown. Re-run `npm run check-links` after adding a project.
 */
const VERIFIED_LIVE_URLS = {
  anime: "",
  "28-maktab_xonqa": "https://28-maktab-xonqa.vercel.app",
  "2d_o-yin_ish_uchun": "https://2-d-oyin-ish-uchun.vercel.app",
  xonatr: "https://xonatr.vercel.app",
  onlayn_savdo: "https://onlayn-savdo.vercel.app",
  "task-management": "https://task-management-tau-rust.vercel.app",
  ob_xavo: "https://ob-xavo.vercel.app",
  lugat: "https://shuhrat995.github.io/Lugat/",
  valyutalar_kanverdi: "https://valyuta-kursi-lyart.vercel.app",
  portifolio: "https://shuhrat995.github.io/portifolio/",
  "javascript-qalqulyatr": "https://shuhrat995.github.io/JavaScript-qalqulyatr/",
  react_todos: "",
  react_info_generator: "",
  react_savollar_javoblar: "",
  timer: "",
  experiences: "",
  react_new_app: "",
};

const PROFILE_OVERRIDES = {
  name: "Shuhrat Madaminov",
  // Locally stored portrait (public/my-photo.jpg) rather than the GitHub avatar.
  avatarUrl: "/my-photo.jpg",
  headline: "Frontend Developer building fast, modern web apps",
  roles: [
    "Frontend Developer",
    "React & Next.js Developer",
    "TypeScript Enthusiast",
    "Mobile-first UI Builder",
  ],
  bio: [
    "I'm Shuhrat Madaminov, a frontend developer based in Khorezm, Uzbekistan. I started with plain HTML, CSS and JavaScript and now build full applications with React, Next.js and TypeScript.",
    "I'm currently a student at Xonqa IT Park (2024–2026) and work at a Junior+ level with about two years of hands-on practice. I've shipped projects in a professional team of two frontend and one backend developer, which is where I learned to work against an API contract instead of in isolation.",
    "My focus is the React ecosystem and mobile-first design. I care about turning Figma designs into pixel-perfect, accessible interfaces, and I keep coming back to three things: a clean component architecture, honest loading and error states, and code that the next person can read.",
  ],
  location: "Khorezm, Uzbekistan",
  company: "Xonqa IT Park — Student (2024–2026)",
  quote: "Har bir kichik qadam katta maqsadga olib boradi.",
  quoteTranslation: "Every small step leads to a big goal.",
  telegram: "https://t.me/Junior_dasturchi",
  linkedin: "https://www.linkedin.com/in/shuhrat-madaminov-a50161348/",
  skills: [
    { name: "HTML5", category: "Core", level: 95 },
    { name: "CSS3", category: "Core", level: 93 },
    { name: "JavaScript (ES6+)", category: "Core", level: 90 },
    { name: "TypeScript", category: "Core", level: 78 },
    { name: "React.js", category: "Framework", level: 88 },
    { name: "Next.js", category: "Framework", level: 80 },
    { name: "React Router", category: "Framework", level: 82 },
    { name: "Zustand", category: "Framework", level: 70 },
    { name: "Tailwind CSS", category: "Styling", level: 85 },
    { name: "Responsive / Mobile-first", category: "Styling", level: 92 },
    { name: "Framer Motion", category: "Styling", level: 72 },
    { name: "REST API integration", category: "Tooling", level: 84 },
    { name: "Git & GitHub", category: "Tooling", level: 86 },
    { name: "Vite", category: "Tooling", level: 85 },
    { name: "Capacitor (Android)", category: "Tooling", level: 74 },
    { name: "Figma → code", category: "Tooling", level: 88 },
    { name: "Vercel deployment", category: "Tooling", level: 88 },
  ],
  experience: [
    {
      role: "Frontend Developer",
      company: "Freelance & Team Projects",
      period: "2024 — Present",
      location: "Khorezm, Uzbekistan",
      highlights: [
        "Built and deployed a school platform with a content admin panel, now used for the school's public site.",
        "Shipped an e-commerce storefront and a full-stack Kanban task manager on the Next.js App Router.",
        "Worked in a team of two frontend and one backend developer, integrating against a shared API contract.",
      ],
    },
    {
      role: "Frontend Development Student",
      company: "Xonqa IT Park",
      period: "2024 — 2026",
      location: "Xonqa, Uzbekistan",
      highlights: [
        "Two-year practical programme covering HTML, CSS, JavaScript, React and modern tooling.",
        "Reached a Junior+ level of hands-on project experience alongside coursework.",
      ],
    },
  ],
  education: [
    {
      degree: "Frontend Development",
      school: "Xonqa IT Park",
      period: "2024 — 2026",
      location: "Xonqa, Khorezm, Uzbekistan",
    },
  ],
  interests: [
    "Keeping focus with music — Konsta and soft piano while coding.",
    "Trying out a new technology every day, even if it's just for an afternoon.",
  ],
};

function slugify(name) {
  return name.toLowerCase();
}

async function main() {
  const projectsPath = path.join(DATA, "projects.json");
  const profilePath = path.join(DATA, "profile.json");

  const projects = JSON.parse(await readFile(projectsPath, "utf8"));
  const profile = JSON.parse(await readFile(profilePath, "utf8"));

  const kept = [];
  const seen = new Set();

  for (const project of projects) {
    const key = slugify(project.slug || project.name);
    if (EXCLUDE.has(key)) continue;
    const patch = CURATION[key];
    const merged = {
      tech: [],
      topics: [],
      featured: false,
      visible: true,
      ...project,
      ...(patch || {}),
    };
    // A patch that explicitly sets liveUrl to "" means "there is no demo".
    if (patch && patch.liveUrl === "") merged.liveUrl = "";
    // Verified deployments beat whatever stale URL is sitting on GitHub.
    if (key in VERIFIED_LIVE_URLS) merged.liveUrl = VERIFIED_LIVE_URLS[key];
    if (!merged.category) merged.category = "Project";
    kept.push(merged);
    seen.add(key);
  }

  // Anything in CURATION that the sync never produced (e.g. a repo that has
  // since been deleted) is reported rather than silently dropped.
  const unmatched = Object.keys(CURATION).filter((k) => !seen.has(k));

  kept.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return String(b.updatedAt).localeCompare(String(a.updatedAt));
  });
  kept.forEach((p, i) => {
    p.order = i;
  });

  const finalProfile = { ...profile, ...PROFILE_OVERRIDES };

  await writeFile(projectsPath, JSON.stringify(kept, null, 2) + "\n");
  await writeFile(profilePath, JSON.stringify(finalProfile, null, 2) + "\n");

  console.log(`✓ Curated ${kept.length} projects (${kept.filter((p) => p.featured).length} featured)`);
  console.log(`  verified live demos: ${kept.filter((p) => p.liveUrl).length}`);
  const unchecked = kept.filter((p) => !(p.slug in VERIFIED_LIVE_URLS));
  if (unchecked.length) {
    console.log(
      `  ⚠ not link-checked yet: ${unchecked.map((p) => p.slug).join(", ")} — run npm run check-links`
    );
  }
  if (unmatched.length) console.log(`  ⚠ curation entries with no matching repo: ${unmatched.join(", ")}`);
}

main().catch((err) => {
  console.error("✗ Curation failed:", err.message);
  process.exit(1);
});
