# How This Site Builds

## What this repo is

This repo (`anthony.maitz.info`) is the **portal site** at `anthony.maitz.work`. It hosts:
- Your resume (filtered by discipline)
- Your portfolio (lightbox gallery)
- Your contact page
- Every game you've shipped (each living at a subpath like `/shine`, `/playsets`, etc.)

The games are **separate GitHub repos**. This repo pulls them all in during the GitHub Actions build and stitches them together into one deployable folder.

---

## Local development

### Edit content, then run the build scripts

The resume, portfolio, and contact sections are **generated** — they're written to `index.html` by Node scripts. Never hand-edit the generated sections in `index.html`; your changes will be overwritten.

**Source files to edit:**
| What | File |
|------|------|
| Resume employer blocks, roles, dates | `resume-data/employers.md` |
| Resume overview/summary variants | `resume-data/overview.md` |
| Portfolio + resume project entries | `projects/*.md` |
| Contact page intro, links, game list | `contact-data/contact.md` |

**After editing, regenerate `index.html`:**
```sh
node scripts/build-resume.js      # updates <!-- RESUME_GENERATED_START/END --> section
node scripts/build-portfolio.js   # updates <!-- PORTFOLIO_GENERATED_START/END --> section
node scripts/build-contact.js     # updates <!-- CONTACT_GENERATED_START/END --> section
```

Or run all three at once with `npm run build` (which also runs Vite build + PDF generation).

### Dev server

```sh
npm run dev   # starts Vite on http://localhost:5300
```

Vite watches `index.html` and hot-reloads when the build scripts write to it. The scripts must be re-run manually after content edits — Vite doesn't watch the source `.md` files.

Routes `/resume` and `/portfolio` both serve `index.html`; the page reads `?view=` from the URL to show the right section. The dev server handles this via a custom Vite plugin in `vite.config.js`.

### Full production build

```sh
npm run build
```

This runs in sequence:
1. `prebuild`: all three build scripts (resume + portfolio + contact)
2. Vite build → `dist/`
3. Copies `media/` and `favicon.ico` into `dist/`
4. Puppeteer PDF generation → `dist/resume.pdf` (and variants)

---

## GitHub Actions deploy

**File:** `.github/workflows/deploy.yml`

**Triggers:**
- Push to `master`
- `repository_dispatch` event of type `game-updated` (game repos can ping this)
- Daily cron at 3 AM UTC (picks up any game repo changes)
- Manual via GitHub UI (`workflow_dispatch`)

### What it does

1. **Checks out this repo** into the runner workspace root.

2. **Checks out each game repo** into `_games/<name>/`:
   - `anthonymaitz/shine` → `_games/shine`
   - `anthonymaitz/jetpack-geography` → `_games/jetpack-geography`
   - `anthonymaitz/simplequest` → `_games/simplequest`
   - `anthonymaitz/playsets` → `_games/playsets`
   - `anthonymaitz/space-is-listening` → `_games/space-is-listening`
   - `anthonymaitz/click-comic` → `_games/click-comic`
   - `anthonymaitz/tactical-rpg` (branch: `feature/biome-entry`) → `_games/tactical-rpg`

   > `shine` and `jetpack-geography` have `continue-on-error: true` because they are private repos. The default `GITHUB_TOKEN` can't read private repos, so the build keeps going even if they fail to check out.

3. **Sets up Node 20 and pnpm.**

4. **Builds each game** with Vite using its subpath as the base (e.g., `--base /shine/`). Some games use pnpm workspaces and need special handling:
   - `playsets` is built twice: once as an app (app output stashed to `dist-app/`), then as a library so `tactical-rpg` can resolve its dependency.
   - A symlink is created so `tactical-rpg`'s pnpm workspace can resolve `playsets experiments/apps/client`.

5. **Builds this portal** (`npm run build`), which outputs to `dist/`.

6. **Copies each game's build** into `dist/<name>/`:
   ```
   dist/
   ├── (portal files)
   ├── shine/
   ├── simplequest/
   ├── playsets/
   ├── space-is-listening/
   ├── click-comic/
   └── tactical-rpg/
   ```

7. **Deploys `dist/` to GitHub Pages** using `peaceiris/actions-gh-pages`, with the CNAME `anthony.maitz.work`.

### Secrets required

| Secret | Used by |
|--------|---------|
| `VITE_SIGNALING_URL` | playsets (multiplayer WebRTC signaling server URL) |
| `VITE_SUPABASE_URL` | tactical-rpg |
| `VITE_SUPABASE_ANON_KEY` | tactical-rpg |
| `VITE_TACTICAL_SERVER_URL` | tactical-rpg (game server WebSocket URL) |
| `VITE_TACTICAL_API_URL` | tactical-rpg (REST API URL) |

These are set in this repo's GitHub Settings → Secrets → Actions.

### How game repos trigger a rebuild

A game repo can send a `repository_dispatch` event to this repo to trigger a deploy after the game ships a new build. This requires a PAT with `repo` scope stored as a secret in the game repo.

---

## File structure

```
anthony.maitz.info/
├── index.html              # Main page (contains generated sections — don't edit those)
├── styles/
│   ├── style.css           # Main styles
│   └── print.css           # Print / PDF styles
├── scripts/
│   ├── build-resume.js     # Generates resume HTML into index.html
│   ├── build-portfolio.js  # Generates portfolio HTML into index.html
│   ├── build-contact.js    # Generates contact HTML into index.html
│   └── generate-pdf.js     # Puppeteer: renders the page and saves resume PDFs
├── resume-data/
│   ├── employers.md        # Employer list (source of truth for resume)
│   └── overview.md         # Summary/overview variants by discipline
├── projects/
│   └── *.md                # One file per project; frontmatter controls resume + portfolio appearance
├── contact-data/
│   └── contact.md          # Contact page content
├── media/                  # Project images (committed to git, copied into dist/)
├── public/
│   ├── 404.html            # GitHub Pages SPA redirect hack (redirects 404s → / with path saved in sessionStorage)
│   └── resume.pdf          # Pre-generated PDF for local dev (replaced by Puppeteer on prod build)
├── vite.config.js          # Vite config: SPA middleware for /resume and /portfolio routes
├── vercel.json             # SPA rewrites and PDF redirects (used if previewing on Vercel)
├── manifesto.html          # Standalone page, not part of the main SPA
├── manifesto.md            # Text source for the manifesto
├── CNAME                   # github.com/peaceiris/actions-gh-pages reads this; sets custom domain
├── favicon.ico / .png      # Site icon
├── robots.txt
└── package.json
```

---

## How to add a new game

1. Create the game's GitHub repo under `anthonymaitz/`.
2. Make sure `vite build --base /<game-name>/` works in that repo.
3. Add a checkout step to `deploy.yml` under "Check out game repos".
4. Add a build step to `deploy.yml` under "Build games".
5. Add a copy step to `deploy.yml` under "Copy game builds".
6. Add a project entry in `projects/<game-name>.md` with `portfolio: true` and the appropriate frontmatter.
7. Run `node scripts/build-portfolio.js` locally and commit.

## How to add a new resume discipline

Disciplines control which resume entries are shown. They are defined in `resume-data/overview.md` and `resume-data/employers.md`. Project entries in `projects/*.md` list their disciplines in the `disciplines` frontmatter field. The JavaScript in `index.html` reads the `?discipline=` query param and shows/hides entries accordingly.
