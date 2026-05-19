---
name: claude-memory
description: Access curated context from previous Claude sessions for this project. Use when working on topics covered by memory files: video uploads (R2, Cloudflare), deployment/CI debugging, resume content editing, adding portfolio projects with images, or build workflow issues.
---

## Path to Claude memory files

```
~/.claude/projects/-Users-anthonymaitz-Repositories-anthony-maitz-info/memory/
```

## Memory files for this project

| File | When to read it |
|------|-----------------|
| `project_video_hosting.md` | Uploading videos, R2 bucket setup, CORS, iOS Safari quirks |
| `project_deployment.md` | Debugging CI/CD, touching deploy.yml, game deployment issues |
| `project_resume_sources.md` | Editing resume content — source files are employers.md, overview.md, projects/*.md (never resume.md) |
| `project_image_formats.md` | Adding new portfolio projects with images — thumbnail and lightbox image requirements |
| `feedback_build_after_changes.md` | After any content edit — always run the relevant build script before expecting changes to appear |
| `feedback_read_how_it_builds.md` | Before touching deploy.yml — read HOW-IT-BUILDS.md first |
| `MEMORY.md` | Index of all memory files above |

## Security note

Do NOT read the raw `.jsonl` session logs in `~/.claude/projects/-Users-anthonymaitz-Repositories-anthony-maitz-info/<session-id>.jsonl`. Those contain every API key, token, and credential pasted during the session in plaintext. Only use the curated `memory/*.md` files — they are clean, structured summaries without credentials.

If you need a credential that was used in a previous session (e.g., Cloudflare API token), ask the user to provide it rather than searching through session logs.

## How to replicate for another project

To set this up for a different project, copy this SKILL.md and update:
1. The path in the "Path to Claude memory files" section — find it at `~/.claude/projects/-<project-path>/memory/`
2. The table of memory files — list whatever `*.md` files exist in that project's memory directory
3. The security note path — update the session directory reference

The rest of the guidance (when to read each file, security note) applies universally.
