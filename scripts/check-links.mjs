#!/usr/bin/env node
/**
 * Health-checks every `liveUrl` in `data/projects.json`.
 *
 * A portfolio with dead demo links is worse than one with no links at all, and
 * deployments quietly disappear — Vercel renames a project and the old
 * `<name>.vercel.app` alias starts returning 404. This script reports which
 * links are still alive so they can be fixed or cleared.
 *
 * Usage:
 *   npm run check-links            # report only
 *   npm run check-links -- --clear # also blank out the dead URLs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA = path.join(process.cwd(), "data", "projects.json");
const shouldClear = process.argv.includes("--clear");
const TIMEOUT_MS = 20_000;
const CONCURRENCY = 5;

/**
 * Host-specific "this deployment is gone" markers, checked in addition to the
 * status code.
 *
 * Kept deliberately narrow: a Next.js app ships the string "This page could not
 * be found" inside its own JS bundle, so a loose substring match reports healthy
 * sites as dead. The status code is the reliable signal; these only catch hosts
 * that return 200 for an empty project.
 */
const DEAD_MARKERS = [
  "DEPLOYMENT_NOT_FOUND",
  "Site not found &middot; GitHub Pages",
  "Site not found · GitHub Pages",
];

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const body = (await res.text()).slice(0, 20_000);
    const marker = DEAD_MARKERS.find((m) => body.includes(m));

    if (res.status >= 400) return { ok: false, reason: `HTTP ${res.status}` };
    if (marker) return { ok: false, reason: `dead page marker: "${marker}"` };

    const title = body.match(/<title[^>]*>([^<]*)</i)?.[1]?.trim().slice(0, 60) || "";
    return { ok: true, reason: title ? `“${title}”` : "reachable" };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { ok: false, reason: aborted ? `timed out after ${TIMEOUT_MS / 1000}s` : "network error" };
  } finally {
    clearTimeout(timer);
  }
}

/** Runs `worker` over `items` with a bounded number of in-flight requests. */
async function pool(items, worker, limit) {
  const results = new Array(items.length);
  let cursor = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await worker(items[index], index);
      }
    })
  );

  return results;
}

async function main() {
  const projects = JSON.parse(await readFile(DATA, "utf8"));
  const withUrls = projects.filter((p) => p.liveUrl);

  if (!withUrls.length) {
    console.log("No live demo URLs to check.");
    return;
  }

  console.log(`→ Checking ${withUrls.length} live demo links…\n`);

  const results = await pool(withUrls, (project) => check(project.liveUrl), CONCURRENCY);

  let dead = 0;
  let cleared = 0;

  results.forEach((result, i) => {
    const project = withUrls[i];
    if (result.ok) {
      console.log(`  ✓ ${project.name.padEnd(38)} ${result.reason}`);
    } else {
      dead++;
      console.log(`  ✗ ${project.name.padEnd(38)} ${project.liveUrl}`);
      console.log(`    ${" ".repeat(38)} ${result.reason}`);
    }
  });

  if (dead && shouldClear) {
    // Note: indexes must come from the original array, not a filtered copy.
    const deadUrls = new Set();
    results.forEach((result, i) => {
      if (!result.ok) deadUrls.add(withUrls[i].liveUrl);
    });

    const updated = projects.map((p) => {
      if (!deadUrls.has(p.liveUrl)) return p;
      cleared++;
      return { ...p, liveUrl: "" };
    });
    await writeFile(DATA, JSON.stringify(updated, null, 2) + "\n");
  }

  console.log();
  console.log(`${withUrls.length - dead} alive, ${dead} dead.`);
  if (cleared) {
    console.log(`Cleared ${cleared} dead URL(s) from data/projects.json.`);
    console.log("Run `npm run curate` afterwards so the change survives a re-sync.");
  } else if (dead) {
    console.log("Re-run with `npm run check-links -- --clear` to remove the dead links,");
    console.log("then update scripts/curate.mjs so a re-sync doesn't restore them.");
  }

  process.exitCode = dead ? 1 : 0;
}

main().catch((err) => {
  console.error("✗ Link check failed:", err.message);
  process.exit(1);
});
