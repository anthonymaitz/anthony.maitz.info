# Portfolio Site Phase 2 — Multi-Page Restructure

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild anthony.maitz.info as a multi-page Vite site with home, portfolio (discipline filters), and resume pages, replacing the old CodeKit single-page site.

**Architecture:** Three separate HTML entry points (index.html, portfolio/index.html, resume/index.html) share a CSS design system (src/css/) and data layer (src/data/). Portfolio and resume pages render from JSON via vanilla JS modules. Existing media/ images are copied to assets/ with unchanged filenames (already URL-safe). Puppeteer pre-generates resume.pdf at build time. GitHub Actions deploys dist/ to gh-pages.

**Tech Stack:** Vite 5, vanilla HTML/CSS/JS, Google Fonts (Lora), Puppeteer (PDF), GitHub Actions + peaceiris/actions-gh-pages (deploy)

---

## File Map

**Create:**
- `portfolio/index.html` — portfolio page entry point
- `resume/index.html` — resume page entry point
- `src/css/main.css` — design tokens, base reset, Google Fonts @import
- `src/css/components.css` — .site-header, .site-footer, .card, .project-grid
- `src/css/portfolio.css` — .filter-tabs, .filter-tab, stub card styles
- `src/css/home.css` — .home-bio, .home-status, .home-section-title
- `src/css/resume.css` — .resume-*, @media print
- `src/js/portfolio.js` — render projects from JSON, filter + URL hash logic
- `src/js/resume.js` — render resume from JSON, print button
- `src/data/projects.json` — 24 project entries
- `src/data/resume.json` — stub resume content
- `assets/` — copy of media/ (same filenames)
- `scripts/generate-pdf.js` — Puppeteer PDF generation
- `public/CNAME` — anthony.maitz.info
- `public/favicon.ico` — copied from root
- `public/favicon.png` — copied from root
- `.github/workflows/deploy.yml` — GitHub Pages deploy

**Modify:**
- `index.html` — replace CodeKit page with new home page
- `vite.config.js` — add rollupOptions.input for multi-page
- `package.json` — update build script (assets copy + PDF); add puppeteer

---

## Task 1: Multi-Page Vite Config

**Files:**
- Modify: `vite.config.js`
- Create: `portfolio/index.html`
- Create: `resume/index.html`
- Create: `src/css/` directory with empty placeholder files
- Create: `src/js/` directory with empty placeholder files
- Create: `src/data/` directory

- [ ] **Step 1: Update vite.config.js for three entry points**

Replace the full file content:

```js
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portfolio: resolve(__dirname, 'portfolio/index.html'),
        resume: resolve(__dirname, 'resume/index.html'),
      },
    },
  },
})
```

- [ ] **Step 2: Create directory scaffolding**

```bash
mkdir -p portfolio resume src/css src/js src/data
touch src/css/main.css src/css/components.css src/css/portfolio.css src/css/home.css src/css/resume.css
touch src/js/portfolio.js src/js/resume.js
```

- [ ] **Step 3: Create portfolio/index.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Portfolio — Anthony Maitz</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/favicon.png">
  <link rel="stylesheet" href="/src/css/main.css">
  <link rel="stylesheet" href="/src/css/components.css">
  <link rel="stylesheet" href="/src/css/portfolio.css">
</head>
<body>
  <header class="site-header">
    <a class="site-header__name" href="/">Anthony Maitz</a>
    <nav class="site-header__nav">
      <a href="/portfolio/" aria-current="page">Portfolio</a>
      <a href="/resume/">Resume</a>
    </nav>
  </header>

  <div class="filter-tabs" role="tablist" aria-label="Filter by discipline">
    <button class="filter-tab active" data-filter="all" role="tab">All</button>
    <button class="filter-tab" data-filter="interactive" role="tab">Interactive &amp; Game Design</button>
    <button class="filter-tab" data-filter="product" role="tab">Product</button>
    <button class="filter-tab" data-filter="game-production" role="tab">Game Production</button>
    <button class="filter-tab" data-filter="production-design" role="tab">Production Design</button>
  </div>

  <main class="project-grid" id="portfolio-grid"></main>

  <footer class="site-footer">
    <a href="mailto:anthony@forevrgames.com">anthony@forevrgames.com</a>
  </footer>

  <script type="module" src="/src/js/portfolio.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create resume/index.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Resume — Anthony Maitz</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/favicon.png">
  <link rel="stylesheet" href="/src/css/main.css">
  <link rel="stylesheet" href="/src/css/components.css">
  <link rel="stylesheet" href="/src/css/resume.css">
</head>
<body>
  <header class="site-header">
    <a class="site-header__name" href="/">Anthony Maitz</a>
    <nav class="site-header__nav">
      <a href="/portfolio/">Portfolio</a>
      <a href="/resume/" aria-current="page">Resume</a>
    </nav>
  </header>

  <main class="resume-page" id="resume-content"></main>

  <footer class="site-footer">
    <a href="mailto:anthony@forevrgames.com">anthony@forevrgames.com</a>
  </footer>

  <script type="module" src="/src/js/resume.js"></script>
</body>
</html>
```

- [ ] **Step 5: Verify dev server serves all three routes**

```bash
npm run dev
```

Open each URL and confirm 200, no console errors:
- http://localhost:5173/ (or whichever port Vite picks)
- http://localhost:5173/portfolio/
- http://localhost:5173/resume/

Expected: blank pages with no 404s in Network tab.

- [ ] **Step 6: Verify build includes all three entry points**

```bash
npm run build
ls dist/index.html dist/portfolio/index.html dist/resume/index.html
```

Expected: all three files present.

- [ ] **Step 7: Commit**

```bash
git add vite.config.js portfolio/ resume/ src/
git commit -m "feat: multi-page vite config, portfolio and resume scaffolding"
```

---

## Task 2: Design System CSS

**Files:**
- Modify: `src/css/main.css`
- Modify: `src/css/components.css`
- Modify: `src/css/home.css`
- Modify: `src/css/portfolio.css`
- Modify: `src/css/resume.css`

- [ ] **Step 1: Write src/css/main.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap');

:root {
  --color-text: #222;
  --color-bg: #fafafa;
  --color-card: #fff;
  --color-border: #ecf0f1;
  --color-muted: #7e7e7e;
  --color-highlight: #fff5d1;
  --font-family: 'Lora', serif;
  --font-size-base: 19px;
  --gutter: 2rem;
}

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  font-size: var(--font-size-base);
}

body {
  font-family: var(--font-family);
  color: var(--color-text);
  background: var(--color-bg);
  margin: 0;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--color-text);
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

p {
  margin: 0 0 1em;
}
```

- [ ] **Step 2: Write src/css/components.css**

```css
/* ── Header ── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--gutter);
  height: 56px;
}

.site-header__name {
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.01em;
}

.site-header__nav a {
  margin-left: 1.5rem;
  font-size: 0.9rem;
  color: var(--color-muted);
  background-image: linear-gradient(var(--color-highlight), var(--color-highlight));
  background-repeat: no-repeat;
  background-size: 0 8px;
  background-position: left 85%;
  transition: background-size 0.2s ease, color 0.2s ease;
}

.site-header__nav a:hover,
.site-header__nav a[aria-current="page"] {
  color: var(--color-text);
  background-size: 100% 8px;
}

/* ── Footer ── */
.site-footer {
  padding: 2rem var(--gutter);
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-muted);
  border-top: 1px solid var(--color-border);
  margin-top: 4rem;
}

.site-footer a {
  color: var(--color-muted);
}

.site-footer a:hover {
  color: var(--color-text);
}

/* ── Card ── */
.card {
  display: block;
  background: var(--color-card);
  text-decoration: none;
}

.card__image-wrap {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card__image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card__image-wrap img {
  transform: scale(1.03);
}

.card__body {
  padding: 0.6rem 0 1rem;
  text-align: center;
}

.card__title {
  font-size: 0.85rem;
  font-weight: 700;
  display: inline;
  background-image: linear-gradient(var(--color-highlight), var(--color-highlight));
  background-repeat: no-repeat;
  background-size: 0 8px;
  background-position: left 85%;
  transition: background-size 0.2s ease;
}

.card:hover .card__title {
  background-size: 100% 8px;
}

.card__meta {
  font-size: 0.8rem;
  color: var(--color-muted);
  margin-top: 0.3rem;
}

/* ── Project grid (shared by home and portfolio) ── */
.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 2rem var(--gutter);
}

@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Write src/css/home.css**

```css
.home-bio {
  max-width: 640px;
  padding: 3rem var(--gutter) 1.5rem;
}

.home-bio p {
  font-size: 1.05rem;
  line-height: 1.7;
}

.home-status {
  color: var(--color-muted);
  font-style: italic;
}

.home-section-title {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
  padding: 0 var(--gutter);
  margin: 0.5rem 0 0;
}
```

- [ ] **Step 4: Write src/css/portfolio.css**

```css
.filter-tabs {
  display: flex;
  gap: 0.25rem;
  padding: 1rem var(--gutter);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.filter-tab {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  font-family: var(--font-family);
  cursor: pointer;
  border: none;
  border-radius: 2px;
  background: none;
  color: var(--color-muted);
  transition: color 0.15s ease, background 0.15s ease;
}

.filter-tab:hover {
  color: var(--color-text);
}

.filter-tab.active {
  background: var(--color-highlight);
  color: var(--color-text);
  font-weight: 700;
}

.project-card[hidden] {
  display: none;
}

.card__placeholder-text {
  font-size: 0.8rem;
  color: var(--color-muted);
  font-style: italic;
}
```

- [ ] **Step 5: Write src/css/resume.css**

```css
.resume-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 3rem var(--gutter) 4rem;
}

.resume-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  align-items: center;
}

.resume-actions a,
.resume-actions button {
  font-size: 0.85rem;
  font-family: var(--font-family);
  color: var(--color-muted);
  border: 1px solid var(--color-border);
  background: none;
  cursor: pointer;
  padding: 0.4rem 0.9rem;
  border-radius: 2px;
  transition: color 0.15s, border-color 0.15s;
  text-decoration: none;
}

.resume-actions a:hover,
.resume-actions button:hover {
  color: var(--color-text);
  border-color: var(--color-text);
}

.resume-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.resume-title {
  font-size: 1rem;
  color: var(--color-muted);
  margin: 0 0 0.4rem;
}

.resume-contact {
  font-size: 0.9rem;
  margin: 0 0 2.5rem;
}

.resume-contact a {
  color: var(--color-muted);
}

.resume-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.resume-section-title {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin: 0 0 1.25rem;
}

.resume-role {
  margin-bottom: 1.5rem;
}

.resume-role__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.4rem;
}

.resume-role__title {
  font-weight: 700;
  font-size: 0.95rem;
}

.resume-role__company {
  font-size: 0.95rem;
}

.resume-role__years {
  font-size: 0.85rem;
  color: var(--color-muted);
  white-space: nowrap;
}

.resume-role ul {
  margin: 0.5rem 0 0 1.25rem;
  padding: 0;
  font-size: 0.9rem;
  color: #444;
}

.resume-role li {
  margin-bottom: 0.35rem;
  line-height: 1.5;
}

@media print {
  .site-header,
  .site-footer,
  .resume-actions {
    display: none !important;
  }

  body {
    background: #fff;
    color: #000;
    font-size: 11pt;
  }

  .resume-page {
    max-width: 100%;
    padding: 0;
    margin: 0;
  }

  .resume-section,
  .resume-role {
    break-inside: avoid;
  }
}
```

- [ ] **Step 6: Verify CSS loads on all three pages**

With dev server running, open each page and confirm:
- Lora font loads (check Network tab — fonts.googleapis.com request)
- Header is sticky and styled: name left, nav right, 1px bottom border
- Footer shows email address
- No 404s for CSS files

- [ ] **Step 7: Commit**

```bash
git add src/css/
git commit -m "feat: design system CSS — tokens, header, footer, cards, grid, resume, print"
```

---

## Task 3: Data Layer

**Files:**
- Modify: `src/data/projects.json`
- Modify: `src/data/resume.json`

`discipline` values: `"interactive"`, `"product"`, `"game-production"`, `"production-design"`.
`thumbnail` is the filename under `/assets/`, or `null` for stubs.

- [ ] **Step 1: Write src/data/projects.json**

```json
[
  {
    "slug": "jetpack-geography",
    "title": "Jetpack Geography!",
    "discipline": ["game-production", "interactive"],
    "year": 2025,
    "thumbnail": null,
    "description": "Indie game, 2 awards."
  },
  {
    "slug": "forevr-games",
    "title": "ForeVR Games",
    "discipline": ["game-production"],
    "year": 2026,
    "thumbnail": null,
    "description": "Senior Producer."
  },
  {
    "slug": "insummary",
    "title": "Insummary",
    "discipline": ["product"],
    "year": 2024,
    "thumbnail": null,
    "description": "Head of Product."
  },
  {
    "slug": "pariveda",
    "title": "Pariveda",
    "discipline": ["product"],
    "year": 2023,
    "thumbnail": null,
    "description": "Principal Consultant."
  },
  {
    "slug": "playsets",
    "title": "Playsets",
    "discipline": ["product"],
    "year": 2022,
    "thumbnail": "playsets-0.jpg",
    "description": ""
  },
  {
    "slug": "collagio",
    "title": "Collagio",
    "discipline": ["interactive"],
    "year": 2014,
    "thumbnail": "collagio-0.jpg",
    "description": ""
  },
  {
    "slug": "startraders",
    "title": "Star Traders",
    "discipline": ["interactive"],
    "year": 2013,
    "thumbnail": "startraders-0.jpg",
    "description": ""
  },
  {
    "slug": "dance-cam-slam",
    "title": "Dance Cam Slam",
    "discipline": ["interactive"],
    "year": 2013,
    "thumbnail": "dancecamslam-0.jpg",
    "description": ""
  },
  {
    "slug": "miss-connect",
    "title": "Miss Connect",
    "discipline": ["interactive"],
    "year": 2012,
    "thumbnail": null,
    "description": ""
  },
  {
    "slug": "movie-mob",
    "title": "Movie Mob",
    "discipline": ["interactive"],
    "year": 2012,
    "thumbnail": "moviemob-0.jpg",
    "description": ""
  },
  {
    "slug": "shine",
    "title": "Shine",
    "discipline": ["interactive"],
    "year": 2014,
    "thumbnail": "shine-0.jpg",
    "description": ""
  },
  {
    "slug": "toyota-faceoff",
    "title": "Toyota Faceoff",
    "discipline": ["interactive"],
    "year": 2011,
    "thumbnail": "corollafaceoff-0.jpg",
    "description": ""
  },
  {
    "slug": "yawho",
    "title": "YaWho?",
    "discipline": ["interactive"],
    "year": 2012,
    "thumbnail": "yawho-0.jpg",
    "description": ""
  },
  {
    "slug": "popup-video",
    "title": "PopUp Video",
    "discipline": ["interactive"],
    "year": 2013,
    "thumbnail": null,
    "description": ""
  },
  {
    "slug": "prudhub",
    "title": "Prudhub",
    "discipline": ["interactive"],
    "year": 2012,
    "thumbnail": null,
    "description": ""
  },
  {
    "slug": "adidas-all-in",
    "title": "Adidas All In",
    "discipline": ["production-design"],
    "year": 2012,
    "thumbnail": "adidasallin-0.jpg",
    "description": ""
  },
  {
    "slug": "ay-yo",
    "title": "Ay Yo",
    "discipline": ["production-design"],
    "year": 2011,
    "thumbnail": "ayyo-0.jpg",
    "description": ""
  },
  {
    "slug": "born-free",
    "title": "Born Free",
    "discipline": ["production-design"],
    "year": 2010,
    "thumbnail": "bornfree-0.jpg",
    "description": ""
  },
  {
    "slug": "i-got-a-lot",
    "title": "I Got a Lot (new new new)",
    "discipline": ["production-design"],
    "year": 2013,
    "thumbnail": "igotalot-0.jpg",
    "description": ""
  },
  {
    "slug": "jenkin-and-son",
    "title": "Jenkin and Son",
    "discipline": ["production-design"],
    "year": 2012,
    "thumbnail": null,
    "description": ""
  },
  {
    "slug": "execution-of-solomon-harris",
    "title": "The Execution of Solomon Harris",
    "discipline": ["production-design"],
    "year": 2009,
    "thumbnail": "theexecutionofsolomonharris-0.jpg",
    "description": ""
  },
  {
    "slug": "nature-between-us",
    "title": "The Nature Between Us",
    "discipline": ["production-design"],
    "year": 2009,
    "thumbnail": "thenaturebetweenus-0.jpg",
    "description": ""
  },
  {
    "slug": "when-two-islands-meet",
    "title": "When Two Islands Meet",
    "discipline": ["production-design"],
    "year": 2008,
    "thumbnail": "whentwoislandsmeet-0.jpg",
    "description": ""
  },
  {
    "slug": "you-are-a-tourist",
    "title": "You Are A Tourist",
    "discipline": ["production-design"],
    "year": 2011,
    "thumbnail": "youareatourist-0.jpg",
    "description": ""
  }
]
```

- [ ] **Step 2: Write src/data/resume.json**

```json
{
  "name": "Anthony Maitz",
  "title": "Product Designer & Game Producer",
  "email": "anthony@forevrgames.com",
  "featured": {
    "label": "Jetpack Geography!",
    "note": "Indie game, 2025 (2 awards)"
  },
  "experience": [
    {
      "role": "Senior Producer",
      "company": "ForeVR Games",
      "years": "2025–2026",
      "bullets": []
    },
    {
      "role": "Head of Product",
      "company": "Insummary",
      "years": "2023–2024",
      "bullets": []
    },
    {
      "role": "Principal Consultant",
      "company": "Pariveda",
      "years": "2022–2023",
      "bullets": []
    },
    {
      "role": "Freelance",
      "company": "Interactive Designer & Production Designer",
      "years": "2005–2022",
      "bullets": []
    }
  ],
  "education": [],
  "skills": []
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/
git commit -m "feat: projects and resume data JSON"
```

---

## Task 4: Asset Migration

**Files:**
- Create: `assets/` (copy of `media/`)
- Modify: `package.json` (build script)

Images in `media/` are already URL-safe (no spaces). Copy the directory as-is.

- [ ] **Step 1: Copy media/ to assets/**

```bash
cp -r media assets
```

Spot-check:
```bash
ls assets/shine-0.jpg assets/collagio-0.jpg assets/playsets-0.jpg assets/corollafaceoff-0.jpg
```

Expected: all four files listed without error.

- [ ] **Step 2: Update build script to copy assets/ instead of media/**

In `package.json`, change:
```json
"build": "vite build && cp -r media dist/ && cp favicon.ico dist/",
```
To:
```json
"build": "vite build && cp -r assets dist/ && cp favicon.ico dist/",
```

Note: `favicon.ico` stays in the manual copy until Task 9 moves it to `public/`, at which point Vite handles it automatically.

- [ ] **Step 3: Verify build still produces assets in dist/**

```bash
npm run build
ls dist/assets/shine-0.jpg dist/assets/collagio-0.jpg
```

Expected: both files present.

- [ ] **Step 4: Commit**

```bash
git add assets/ package.json
git commit -m "feat: copy media to assets/ for new URL structure"
```

---

## Task 5: Portfolio Page

**Files:**
- Modify: `src/js/portfolio.js`

(portfolio/index.html already written in Task 1.)

- [ ] **Step 1: Write src/js/portfolio.js**

```js
import projects from '../data/projects.json'

const FILTER_LABELS = {
  all: 'All',
  interactive: 'Interactive & Game Design',
  product: 'Product',
  'game-production': 'Game Production',
  'production-design': 'Production Design',
}

function cardHTML(project) {
  const image = project.thumbnail
    ? `<img src="/assets/${project.thumbnail}" alt="${project.title}" loading="lazy">`
    : `<span class="card__placeholder-text">Coming soon</span>`

  const disciplineLabel = project.discipline
    .map(d => FILTER_LABELS[d])
    .join(', ')

  return `
    <article
      class="card project-card"
      data-discipline="${project.discipline.join(',')}"
    >
      <div class="card__image-wrap">${image}</div>
      <div class="card__body">
        <div class="card__title">${project.title}</div>
        <div class="card__meta">${disciplineLabel} · ${project.year}</div>
      </div>
    </article>`
}

function getActiveFilter() {
  const hash = location.hash.slice(1)
  return Object.keys(FILTER_LABELS).includes(hash) ? hash : 'all'
}

function applyFilter(filter) {
  document.querySelectorAll('.project-card').forEach(card => {
    const disciplines = card.dataset.discipline.split(',')
    card.hidden = filter !== 'all' && !disciplines.includes(filter)
  })
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter)
  })
}

const grid = document.getElementById('portfolio-grid')
grid.innerHTML = projects.map(cardHTML).join('')

document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter
    if (filter === 'all') {
      history.pushState('', document.title, location.pathname)
    } else {
      location.hash = filter
    }
    applyFilter(filter)
  })
})

window.addEventListener('hashchange', () => applyFilter(getActiveFilter()))
applyFilter(getActiveFilter())
```

- [ ] **Step 2: Verify portfolio page in browser**

Open http://localhost:PORT/portfolio/ and check:
- 24 project cards render in the 3-column grid
- Cards with thumbnails show images; stubs show "Coming soon"
- Clicking "Interactive & Game Design" hides product/game-production/production-design cards
- Clicking "All" shows all 24 cards
- URL updates: filter tab click appends `#interactive` (or removes hash for All)
- Reloading with `#production-design` in URL shows only production design cards

- [ ] **Step 3: Commit**

```bash
git add src/js/portfolio.js
git commit -m "feat: portfolio page with discipline filter tabs and URL hash state"
```

---

## Task 6: Home Page

**Files:**
- Modify: `index.html` (replace entirely with new home page)

- [ ] **Step 1: Replace index.html**

Completely overwrite `index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Anthony Maitz</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/favicon.png">
  <link rel="stylesheet" href="/src/css/main.css">
  <link rel="stylesheet" href="/src/css/components.css">
  <link rel="stylesheet" href="/src/css/home.css">
</head>
<body>
  <header class="site-header">
    <a class="site-header__name" href="/">Anthony Maitz</a>
    <nav class="site-header__nav">
      <a href="/portfolio/">Portfolio</a>
      <a href="/resume/">Resume</a>
    </nav>
  </header>

  <main>
    <section class="home-bio">
      <p>Product designer and game producer with fifteen years of experience shipping interactive work across games, apps, and emerging platforms.</p>
      <p class="home-status">Currently open to senior product and game production roles.</p>
    </section>

    <h2 class="home-section-title">Selected Work</h2>
    <div class="project-grid">
      <a class="card" href="/portfolio/#game-production">
        <div class="card__image-wrap">
          <span class="card__placeholder-text">Coming soon</span>
        </div>
        <div class="card__body">
          <div class="card__title">Jetpack Geography!</div>
          <div class="card__meta">Game Production · 2025</div>
        </div>
      </a>
      <a class="card" href="/portfolio/#interactive">
        <div class="card__image-wrap">
          <img src="/assets/shine-0.jpg" alt="Shine">
        </div>
        <div class="card__body">
          <div class="card__title">Shine</div>
          <div class="card__meta">Interactive &amp; Game Design · 2014</div>
        </div>
      </a>
      <a class="card" href="/portfolio/#product">
        <div class="card__image-wrap">
          <img src="/assets/playsets-0.jpg" alt="Playsets">
        </div>
        <div class="card__body">
          <div class="card__title">Playsets</div>
          <div class="card__meta">Product · 2022</div>
        </div>
      </a>
    </div>
  </main>

  <footer class="site-footer">
    <a href="mailto:anthony@forevrgames.com">anthony@forevrgames.com</a>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify home page in browser**

Open http://localhost:PORT/ and check:
- Sticky header: "Anthony Maitz" left, Portfolio/Resume nav right
- Bio and status paragraph render in Lora
- 3 featured project cards: Jetpack Geography stub, Shine image, Playsets image
- Hovering a card title shows yellow highlight animation
- Hovering nav links shows yellow highlight animation
- Clicking Portfolio navigates to /portfolio/ with all projects showing
- Clicking Resume navigates to /resume/

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: new home page with bio and featured projects"
```

---

## Task 7: Resume Page

**Files:**
- Modify: `src/js/resume.js`

(resume/index.html already written in Task 1.)

- [ ] **Step 1: Write src/js/resume.js**

```js
import resume from '../data/resume.json'

const container = document.getElementById('resume-content')

function resumeHTML(data) {
  const experienceRows = data.experience.map(role => `
    <div class="resume-role">
      <div class="resume-role__header">
        <div>
          <span class="resume-role__title">${role.role}</span>
          <span class="resume-role__company"> — ${role.company}</span>
        </div>
        <span class="resume-role__years">${role.years}</span>
      </div>
      ${role.bullets.length ? `<ul>${role.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    </div>`).join('')

  const educationSection = data.education.length ? `
    <div class="resume-section">
      <div class="resume-section-title">Education</div>
      ${data.education.map(ed => `
        <div class="resume-role">
          <div class="resume-role__header">
            <span class="resume-role__title">${ed.degree} — ${ed.school}</span>
            <span class="resume-role__years">${ed.years}</span>
          </div>
        </div>`).join('')}
    </div>` : ''

  const skillsSection = data.skills.length ? `
    <div class="resume-section">
      <div class="resume-section-title">Skills</div>
      <p>${data.skills.join(' · ')}</p>
    </div>` : ''

  const featuredSection = data.featured ? `
    <div class="resume-section">
      <div class="resume-section-title">Featured</div>
      <div class="resume-role">
        <div class="resume-role__header">
          <span class="resume-role__title">${data.featured.label}</span>
          <span class="resume-role__years">${data.featured.note}</span>
        </div>
      </div>
    </div>` : ''

  return `
    <div class="resume-actions">
      <button id="print-btn">Print / Save as PDF</button>
      <a href="/resume.pdf" download>Download PDF</a>
    </div>
    <h1 class="resume-name">${data.name}</h1>
    <div class="resume-title">${data.title}</div>
    <div class="resume-contact"><a href="mailto:${data.email}">${data.email}</a></div>
    ${featuredSection}
    <div class="resume-section">
      <div class="resume-section-title">Experience</div>
      ${experienceRows}
    </div>
    ${educationSection}
    ${skillsSection}`
}

container.innerHTML = resumeHTML(resume)
document.getElementById('print-btn').addEventListener('click', () => window.print())
```

- [ ] **Step 2: Verify resume page in browser**

Open http://localhost:PORT/resume/ and check:
- Name, title, email render
- "Jetpack Geography!" featured entry shows
- 4 experience entries show with correct company and year range
- "Print / Save as PDF" button visible; clicking it opens browser print dialog
- "Download PDF" link visible (will 404 until Task 8 generates the file)
- Cmd+P / Ctrl+P print preview shows: header, footer, and action buttons hidden; clean single-column layout

- [ ] **Step 3: Commit**

```bash
git add src/js/resume.js
git commit -m "feat: resume page renders from JSON with print support"
```

---

## Task 8: PDF Generation

**Files:**
- Create: `scripts/generate-pdf.js`
- Modify: `package.json`

- [ ] **Step 1: Install puppeteer**

```bash
npm install --save-dev puppeteer
```

Verify `puppeteer` appears in `devDependencies` in `package.json`.

- [ ] **Step 2: Create scripts/generate-pdf.js**

```js
import puppeteer from 'puppeteer'
import { createServer } from 'node:http'
import { createReadStream, existsSync } from 'node:fs'
import { extname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
}

async function generatePdf() {
  const server = createServer((req, res) => {
    let urlPath = req.url.split('?')[0]
    if (urlPath.endsWith('/')) urlPath += 'index.html'
    const filePath = join(distDir, urlPath)
    if (!existsSync(filePath)) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    res.setHeader('Content-Type', MIME[extname(filePath)] || 'text/plain')
    createReadStream(filePath).pipe(res)
  })

  await new Promise(res => server.listen(4174, res))

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:4174/resume/index.html', { waitUntil: 'networkidle0' })

  await page.pdf({
    path: join(distDir, 'resume.pdf'),
    format: 'A4',
    printBackground: false,
    margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
  })

  await browser.close()
  server.close()
  console.log('dist/resume.pdf generated')
}

generatePdf().catch(err => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 3: Update build script in package.json**

Change:
```json
"build": "vite build && cp -r assets dist/ && cp favicon.ico dist/",
```
To:
```json
"build": "vite build && cp -r assets dist/ && cp favicon.ico dist/ && node scripts/generate-pdf.js",
```

- [ ] **Step 4: Run full build and verify PDF**

```bash
npm run build
ls -lh dist/resume.pdf
```

Expected: `dist/resume.pdf` exists and is > 10KB.

Open the PDF and verify the resume content is readable and cleanly formatted.

- [ ] **Step 5: Commit**

```bash
git add scripts/ package.json package-lock.json
git commit -m "feat: puppeteer PDF generation for resume"
```

---

## Task 9: GitHub Actions Deploy + CNAME

**Files:**
- Create: `public/CNAME`
- Create: `public/favicon.ico`
- Create: `public/favicon.png`
- Create: `.github/workflows/deploy.yml`
- Modify: `package.json` (build script — no longer needs manual favicon copy since public/ handles it)

- [ ] **Step 1: Create public/ with CNAME and favicons**

```bash
mkdir public
printf "anthony.maitz.info" > public/CNAME
cp favicon.ico public/favicon.ico
cp favicon.png public/favicon.png
```

Vite automatically copies everything in `public/` to `dist/` at build time, including CNAME.

- [ ] **Step 2: Create .github/workflows/deploy.yml**

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - run: npm run build

      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: anthony.maitz.info
```

- [ ] **Step 3: Remove manual favicon copy from build script (public/ takes over)**

In `package.json`, change:

```json
"build": "vite build && cp -r assets dist/ && cp favicon.ico dist/ && node scripts/generate-pdf.js",
```

To:

```json
"build": "vite build && cp -r assets dist/ && node scripts/generate-pdf.js",
```

- [ ] **Step 4: Verify build produces expected dist/ output**

```bash
npm run build
ls dist/CNAME dist/favicon.ico dist/favicon.png dist/resume.pdf dist/assets/shine-0.jpg dist/index.html dist/portfolio/index.html dist/resume/index.html
```

Expected: all files listed without error.

- [ ] **Step 4: Commit**

```bash
git add public/ .github/ package.json
git commit -m "feat: github actions deploy to gh-pages with CNAME"
```

---

## After This Plan

Once all 9 tasks are complete and the build passes:

1. Run `npm run preview` and manually verify all three pages look correct end-to-end
2. Push to `master` — the GitHub Actions workflow deploys to `gh-pages` automatically
3. Confirm the site goes live at `anthony.maitz.info`

**Out of scope for this pass (next iterations):**
- Real project descriptions and resume bullets
- Images for stub projects (Jetpack Geography, ForeVR, Insummary, Pariveda, Miss Connect, PopUp Video, Prudhub, Jenkin and Son)
- Individual project detail pages or lightbox galleries
- Cover letter pages (`/cover/[slug]`)
