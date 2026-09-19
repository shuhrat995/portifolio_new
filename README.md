# Shuhrat Madaminov — Portfolio

A dark, responsive personal portfolio built with **Next.js (App Router)**, **TypeScript**
and **Tailwind CSS v4**, with a password-protected admin panel at `/qw` for managing
projects and profile content.

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
and Russian at `/uz`, `/en`, and `/ru`; opening `/` redirects to Uzbek. The admin panel
at `/qw` remains Uzbek-only for adding and editing projects.

### Set your admin password first

The admin password lives in `.env.local` (git-ignored):

```bash
ADMIN_PASSWORD=your-own-password
```

A starter value is already in the file so you can log in immediately —
**change it before you deploy**. See `.env.example` for every option.

---

## The admin panel

Go to **`/qw`**. You'll be asked for the password; enter it once and you stay signed in
for 12 hours on that device.

The panel has two tabs:

**Projects** — add, edit, delete, reorder, feature and hide projects. Order is drag-free
(↑ / ↓ buttons) and is exactly the order visitors see. Hiding a project keeps it in the
data but removes it from the public site.

**Profile** — name, headline, rotating roles, bio paragraphs, location, links, quote,
interests, the skills list, and repeatable experience and education entries.

Nothing is hard-coded in the components: pages read from `data/profile.json` and
`data/projects.json`, so an edit appears on the site as soon as the save completes.

### Security notes

- Sessions are signed with HMAC-SHA256 and stored in an `httpOnly` cookie.
- Failed logins are throttled: 6 attempts, then a 10-minute lockout.
- `/qw` and `/api/*` are excluded in `robots.txt`, and the admin pages send
  `noindex` headers.
- Always set a real `ADMIN_PASSWORD` (and ideally an `ADMIN_SECRET`) in your host's
  environment variables, not just locally.

---

## Keeping the data in sync with GitHub

Three scripts do all the work:

```bash
npm run sync          # pull profile + every public repo from GitHub
npm run curate        # re-apply the hand-written copy, tech chips and categories
npm run check-links   # verify every live demo URL still works
```

`npm run sync` scrapes the public GitHub pages by default. Set `GITHUB_TOKEN` for a much
higher API rate limit and cleaner data:

```bash
GITHUB_TOKEN=ghp_xxx npm run sync
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

## Where admin edits are saved

| Setup | Behaviour |
| --- | --- |
| No `GITHUB_TOKEN` | Written to `data/*.json` on the local disk. Commit and push to publish. |
| `GITHUB_TOKEN` + `GITHUB_DATA_REPO` | Committed to GitHub via the API; Vercel redeploys automatically. |

The second mode is what makes the panel work on Vercel, where the filesystem is
read-only. To enable it, create a **fine-grained Personal Access Token** with
*Contents: Read and write* on your repository and set:

```bash
GITHUB_TOKEN=github_pat_xxx
GITHUB_DATA_REPO=shuhrat995/your-repo
GITHUB_DATA_BRANCH=main
GITHUB_DATA_PATH=data
```

---

## Deploying

### Vercel

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from `.env.example` in
  **Settings → Environment Variables** — `ADMIN_PASSWORD` is required, and
  `GITHUB_TOKEN` + `GITHUB_DATA_REPO` are required for editing content from the live site.
4. Deploy. Set `NEXT_PUBLIC_SITE_URL` to your final domain so the sitemap is correct.

Any other Node host works too — `npm run build && npm start`.

---

## Project structure

```
app/
  page.tsx                 the portfolio page
  layout.tsx               fonts, metadata, social preview
  globals.css              design tokens + component classes
  qw/page.tsx              admin password gate
  qw/dashboard/page.tsx    protected dashboard
  api/                     auth, projects and profile endpoints
components/                public site sections
components/admin/          login, dashboard, editors
data/
  profile.json             bio, skills, experience, stats
  projects.json            one record per project
lib/
  data.ts                  read/write the JSON data, optional GitHub commits
  auth.ts                  password hashing, sessions, throttling
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
