# anthony.maitz.info — Portfolio Site Redesign

## Overview

Migrate the existing Ghost/midan site to a Vite-based static site hosted on GitHub Pages at `anthony.maitz.info`. Preserve and evolve the existing visual design. Add a structured home page, portfolio with discipline filters, printable resume, and PDF pre-generation.

## Goals

- Get the existing site running with Vite (replacing Gulp/Ghost build)
- Add new site structure: home, /portfolio, /resume
- Stub in recent work (ForeVR, Insummary, Pariveda, Jetpack Geography)
- Portfolio discipline filters
- Resume printable from browser + PDF pre-generated at build time
- Deploy via GitHub Actions to GitHub Pages at `anthony.maitz.info`

## Site Structure

```
/                  → Home: bio, links to CV + Portfolio, 3 featured projects
/portfolio/        → Full project grid with discipline filter tabs
/resume/           → CV page, printable + PDF download button
```

Cover letters are out of scope for this pass but the structure should make `/cover/[slug]` easy to add later.

## Tech Stack

- **Build tool**: Vite (replacing Gulp)
- **Language**: Vanilla HTML/CSS/JS — no framework
- **Styles**: Plain CSS with custom properties for design tokens
- **Data**: JSON files for project entries and resume content
- **PDF**: `@media print` CSS on resume + Puppeteer pre-generates `resume.pdf` during build
- **Deploy**: GitHub Actions → `gh-pages` branch; `CNAME` file for custom domain

## Design

Start from the midan Ghost theme and port its visual design directly:

- **Font**: Lora (Google Fonts), 19px base, serif
- **Colors**: `#222` text, `#FAFAFA` bg, `#fff` cards, `#ECF0F1` borders, `#7E7E7E` muted, `#FFF5D1` hover highlight
- **Header**: Sticky, white, 1px border-bottom. Name left, nav right.
- **Hover effect**: `linear-gradient` animated yellow underline on nav links and card titles
- **Cards**: 4:3 image ratio, centered title + meta below
- **Grid**: 3-col large / 2-col medium / 1-col small

Typography and presentation to be refined iteratively once the site is running live.

## Pages

### Home (`/`)

- Sticky header: "Anthony Maitz" (left) + Portfolio / Resume links (right)
- Short bio paragraph (1–2 sentences, placeholder for now)
- "Currently open to senior product and game production roles."
- Featured projects section: 3 tiles — Jetpack Geography, Shine, Playsets — each linking to `/portfolio/` for now; external live URLs to be swapped in when available
- Footer: email link

### Portfolio (`/portfolio/`)

- Same header/footer as home
- Discipline filter tabs at top: **All** · **Interactive & Game Design** · **Product** · **Game Production** · **Production Design**
- Project grid (same card style as current site)
- Clicking a filter shows only matching projects; "All" shows everything
- Filter state reflected in URL hash for shareability: `#all`, `#interactive`, `#product`, `#game-production`, `#production-design`

**Project entries (JSON):**

Each entry has: `title`, `slug`, `discipline` (array), `year`, `thumbnail`, `description`, `url` (optional — live link), `tags` (optional)

**All projects (with stubs for recent work):**

| Project | Discipline | Status |
|---|---|---|
| Jetpack Geography! | Game Production, Interactive & Game Design | Stub — no images yet |
| ForeVR Games (Senior Producer) | Game Production | Stub |
| Insummary (Head of Product) | Product | Stub |
| Pariveda (Principal Consultant) | Product | Stub |
| Playsets | Product | Stub |
| Collagio | Interactive & Game Design | Images exist |
| Startraders | Interactive & Game Design | Images exist |
| Dance Cam Slam | Interactive & Game Design | Images exist |
| Miss Connect | Interactive & Game Design | Images exist |
| Movie Mob | Interactive & Game Design | Images exist |
| Shine | Interactive & Game Design | Images exist |
| Toyota Faceoff | Interactive & Game Design | Images exist |
| YaWho? | Interactive & Game Design | Images exist |
| PopUp Video | Interactive & Game Design | Images exist |
| Prudhub | Interactive & Game Design | Images exist |
| Adidas All In | Production Design | Images exist |
| Ay Yo | Production Design | Images exist |
| Born Free | Production Design | Images exist |
| I Got a Lot (new new new) | Production Design | Images exist |
| Jenkin and Son | Production Design | Images exist |
| The Execution of Solomon Harris | Production Design | Images exist |
| The Nature Between Us | Production Design | Images exist |
| When Two Islands Meet | Production Design | Images exist |
| You Are A Tourist | Production Design | Images exist |

### Resume (`/resume/`)

- Same header/footer
- Structured CV layout: name/title, contact, experience (reverse chron), education, skills
- Print button triggers `window.print()`
- `@media print`: hides header/footer/button, full-width single-column, clean for PDF
- Pre-generated `resume.pdf` linked as "Download PDF"

**Resume content (stub — to be filled in):**

- **Anthony Maitz** — Product Designer & Game Producer
- Senior Producer, ForeVR Games (2025–2026)
- Head of Product, Insummary (2023–2024)
- Principal Consultant, Pariveda (2022–2023)
- Freelance / earlier work (interactive, production design)
- Jetpack Geography! — indie game, 2025 (2 awards)

## PDF Generation

`scripts/generate-pdf.js` — runs after `vite build`:
1. Starts a local server on the built output
2. Opens `http://localhost:PORT/resume/` with Puppeteer
3. Prints to PDF → `dist/resume.pdf`
4. Kills the server

`package.json` build script: `"build": "vite build && node scripts/generate-pdf.js"`

## GitHub Actions Deploy

`.github/workflows/deploy.yml`:
- Trigger: push to `main`
- Steps: checkout → install → build (includes PDF) → deploy `dist/` to `gh-pages` branch
- `CNAME` file in `public/` containing `anthony.maitz.info`

## Vite Config

```js
// vite.config.js
export default {
  base: '/',
  build: { outDir: 'dist' }
}
```

Multi-page: Vite needs each page's `index.html` listed as an entry point via `rollupOptions.input`.

## File Structure

```
anthony.maitz.info/
├── index.html              ← home
├── portfolio/
│   └── index.html
├── resume/
│   └── index.html
├── public/
│   ├── CNAME               ← anthony.maitz.info
│   └── favicon.ico
├── src/
│   ├── css/
│   │   ├── main.css        ← design tokens + base styles from midan
│   │   ├── components.css  ← header, cards, nav, footer
│   │   ├── portfolio.css   ← filter tabs, grid
│   │   ├── resume.css      ← CV layout + print styles
│   │   └── home.css        ← home page specific
│   ├── js/
│   │   ├── portfolio.js    ← filter logic
│   │   └── resume.js       ← print button
│   └── data/
│       ├── projects.json
│       └── resume.json
├── assets/                 ← existing portfolio images, copied from "cropped and sized/" with URL-safe filenames (spaces → hyphens)
├── scripts/
│   └── generate-pdf.js
├── .github/
│   └── workflows/
│       └── deploy.yml
├── vite.config.js
└── package.json
```

## Out of Scope (This Pass)

- Cover letters (`/cover/[slug]`)
- Individual project detail pages (portfolio entries link to external URLs or are lightbox-only for now)
- Contact form
- Dark mode
