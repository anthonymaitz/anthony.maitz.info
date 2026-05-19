# anthony.maitz.info
This is my resume and portfolio.
I also host games and experiments at this domain.
I am particular with voice and style, do not make changes to the content or aesthetics unless told to do so.

## Resume content — source of truth
- `resume-data/employers.md` — employer blocks, role titles, dates, and role-level descriptions
- `resume-data/overview.md` — summary/overview variants
- `projects/*.md` — individual project entries; only files with `resume_section` in frontmatter appear on the resume

The build script (`scripts/build-resume.js`) reads those sources and writes the generated HTML into `index.html` between `<!-- RESUME_GENERATED_START -->` and `<!-- RESUME_GENERATED_END -->` markers.

## Build workflow
After **every** content change, run the build scripts so the dev server picks up the update:

```
node scripts/build-resume.js    # after any change to employers.md, overview.md, or projects/*.md
node scripts/build-portfolio.js # after any change to projects/*.md
```

The Vite dev server (`npm run dev`, port 5300) watches `index.html` and hot-reloads automatically once the build scripts write to it — no server restart needed.

For a full production build:
```
npm run build   # runs prebuild (all build scripts) + vite build + PDF generation
```

## Videos

Portfolio videos are hosted on **Cloudflare R2** (not committed to git). See `HOW-IT-BUILDS.md` → "How to add a new video" for the full upload workflow, R2 bucket details, and credential handling.

**Never stage or commit `.mp4` files.** Local video files belong in `media/videos/`, which is gitignored. If a video ends up staged, unstage it (`git restore --staged <file>`) and move it to `media/videos/`. Reference videos in project markdown files via their R2 public URL (`https://pub-3f46834975934832b6bf5b078116c7ee.r2.dev/<filename>.mp4`).

## Deployment

Before making any changes to `.github/workflows/deploy.yml`, read `HOW-IT-BUILDS.md` — the deployment has non-obvious constraints (private repo token, pnpm version pin, keep_files, game independence model).
