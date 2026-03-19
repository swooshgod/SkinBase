# CLAUDE.md

## Project
**Project:** SkinBase
**Stack:** React Native + Supabase + Expo (TBD)
**Goal:** Skincare tracking and recommendation app

## gstack
Use `/browse` from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available skills: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`,
`/design-consultation`, `/review`, `/ship`, `/browse`, `/qa`, `/qa-only`, `/design-review`,
`/setup-browser-cookies`, `/retro`, `/debug`, `/document-release`

If gstack skills aren't working, run: `cd .claude/skills/gstack && ./setup`

## Session Hook
A session-start hook runs automatically on every new session. It:
- Prints current branch + last 5 commits
- Shows git status
- Installs npm deps
- Checks required env vars

## Standards
- Always run `/review` before `/ship`
- Always run `/qa` after major features
- Target QA health score 80+ before launch
- Start with `/office-hours` on every new feature
