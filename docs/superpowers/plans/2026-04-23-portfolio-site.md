# Portfolio Site — Vite Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Get the existing site running locally with Vite replacing CodeKit, then iterate from there.

**Architecture:** The site is already a working single-page app — `index.html` (compiled by CodeKit), `styles/style.css`, `styles/print.css`, images in `media/`, jQuery and Fancybox from CDNs. Vite just serves the existing files with HMR for development, and bundles/copies them for production output.

**Tech Stack:** Vite 5, existing vanilla JS/CSS/HTML, GitHub Actions for deploy

---

## Task 1: Add Vite, Verify Existing Site Runs

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "anthony-maitz-info",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
  },
})
```

- [ ] **Step 3: Add .gitignore entries**

Read the existing `.gitattributes` to confirm there's no `.gitignore` already, then create one:

```
node_modules/
dist/
.DS_Store
```

- [ ] **Step 4: Fix protocol-relative font URL in index.html**

The existing `index.html` has:
```html
<link rel="stylesheet" href="//brick.freetls.fastly.net/Libre+Caslon+Text:400,700,400i">
```

Change to `https://`:
```html
<link rel="stylesheet" href="https://brick.freetls.fastly.net/Libre+Caslon+Text:400,700,400i">
```

- [ ] **Step 5: Install and start dev server**

```bash
cd /Users/anthonymaitz/Repositories/anthony.maitz.info
npm install
npm run dev
```

Expected: `Local: http://localhost:5173/`

- [ ] **Step 6: Verify the site looks and works correctly**

Open http://localhost:5173/ in a browser. Check:
- Font loads (Libre Caslon Text)
- Resume tab shows with content
- Portfolio tab shows project images
- Clicking a project image opens Fancybox lightbox
- Nav tabs switch between resume and portfolio

If anything is broken, note which asset path is failing (check browser devtools Network tab) and fix the path.

- [ ] **Step 7: Verify build output**

```bash
npm run build
```

Expected: `dist/` created with `index.html`, `styles/`, `media/`, `favicon.png`, `favicon.ico`.

Open `dist/index.html` in a browser (or `npm run preview`) and confirm it works the same as dev.

- [ ] **Step 8: Commit**

```bash
git add package.json vite.config.js .gitignore index.html
git commit -m "chore: add vite, replace codekit build"
```

---

## After This Task

Once the existing site is running with Vite, subsequent tasks (to be planned separately) will cover:
- Restructuring to home / portfolio / resume as separate pages
- New content (ForeVR, Insummary, Jetpack Geography, etc.)
- GitHub Actions deploy
- PDF generation
