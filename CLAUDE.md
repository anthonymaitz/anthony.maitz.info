# anthony.maitz.info

## Resume content — source of truth

The resume is **generated** from these files. Always edit these, never `resume.md`:

- `resume-data/employers.md` — employer blocks, role titles, dates, and role-level descriptions
- `resume-data/overview.md` — summary/overview variants
- `projects/*.md` — individual project entries; only files with `resume_section` in frontmatter appear on the resume

The build script (`scripts/build-resume.js`) reads those sources and writes the generated HTML into `index.html` between `<!-- RESUME_GENERATED_START -->` and `<!-- RESUME_GENERATED_END -->` markers.

`resume.md` does not exist and is not used. It was a legacy file.

## Build workflow

After **every** content change, run the build scripts so the dev server picks up the update:

```
node scripts/build-resume.js    # after any change to employers.md, overview.md, or projects/*.md
node scripts/build-portfolio.js # after any change to projects/*.md
```

The Vite dev server (`npm run dev`, port 5300) watches `index.html` and hot-reloads automatically once the build scripts write to it — no server restart needed.

For a full production build:
```
npm run build   # runs prebuild (both scripts) + vite build + PDF generation
```
