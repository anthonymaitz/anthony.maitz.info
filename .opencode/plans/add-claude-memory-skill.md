# Plan: Add Claude Memory Skill for opencode

## Goal
Create a skill that gives opencode access to curated context from previous Claude sessions for this project, without exposing raw session logs containing credentials.

## Changes

### 1. Create `.opencode/skills/claude-memory/SKILL.md` (new file)

A skill that:
- Points to the Claude memory files at `~/.claude/projects/-Users-anthonymaitz-Repositories-anthony-maitz-info/memory/`
- Lists all 7 memory files with their purpose and when to read them (video hosting, deployment, resume sources, image formats, build workflow, HOW-IT-BUILDS.md reminder)
- Includes a security note: do NOT read raw `.jsonl` session logs — they contain credentials in plaintext. Only use curated `memory/*.md` files.
- Includes an inline comment explaining how to replicate for other projects (update the path and file list)

### 2. Update `CLAUDE.md` (edit — add section at end)

Add a "Claude Memory" section pointing to the skill, so it's discoverable at the top level of project docs.

## How to replicate for other projects
1. Find the memory directory: `~/.claude/projects/-<project-path>/memory/`
2. Copy the SKILL.md and update the path + file list
3. Add a brief pointer in that project's `CLAUDE.md`
