# Shuhrat Madaminov — Portfolio

A dark, responsive personal portfolio built with **Next.js (App Router)**, **TypeScript**
and **Tailwind CSS v4**.

Every project in the site was pulled straight from
[github.com/shuhrat995](https://github.com/shuhrat995) — 17 repositories, 10 of them with a
verified working deployment.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000/uz>. The public portfolio is available in Uzbek, English,
and Russian at `/uz`, `/en`, and `/ru`; opening `/` redirects to Uzbek.

---

## Keeping the data in sync with GitHub

Three scripts do all the work:

```bash
npm run sync          # pull profile + every public repo from GitHub
npm run curate        # re-apply the hand-written copy, tech chips and categories
npm run check-links   # verify every live demo URL still works
```

`sync` preserves anything it doesn't own — your descriptions, tech lists, featured
flags, ordering and hidden state — so running it again never destroys your edits.
Run `sync` then `curate` when you push a new repository and want it to appear.

### Why live links need checking

Deployments quietly disappear: rename a Vercel project and the old
`<name>.vercel.app` alias starts returning 404, even though GitHub still advertises it
as the project homepage. Several links on this site were dead for exactly that reason.

`npm run check-links` requests every `liveUrl` and reports which ones are dead:

```bash
npm run check-links            # report only
npm run check-links -- --clear # also blank out the dead URLs
```

When a link dies, add the replacement (or an empty string) to `VERIFIED_LIVE_URLS` in
`scripts/curate.mjs` so a future `npm run sync` cannot restore the broken URL. Projects
without a working deployment simply show their GitHub link instead.

---

## Project structure

```
app/
  page.tsx                 the portfolio page
  layout.tsx               fonts, metadata, social preview
  globals.css              design tokens + component classes
components/                public site sections
data/
  profile.json             bio, skills, experience, stats
  projects.json            one record per project
lib/
  data.ts                  read and write portfolio data
scripts/
  sync-github.mjs          pull from GitHub
  curate.mjs               apply hand-written copy
  check-links.mjs          verify live demo URLs are still up
```

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run sync` | Pull profile and repos from GitHub |
| `npm run curate` | Re-apply curated descriptions and tech stacks |
| `npm run check-links` | Verify every live demo URL still works |
