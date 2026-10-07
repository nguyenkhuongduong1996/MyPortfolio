# Plan

## Phase 0 — Environment & credentials
- [x] Install Node.js LTS (brew, v26.10.0) and npm (11.19.1)
- [ ] `.env` with real `OPENROUTER_API_KEY` + owner credentials (user supplies later; placeholder `.env` present)
- [x] `docs/PLAN.md` created and kept current

## Phase 1 — Frontend-only MVP
- [x] Next.js scaffold at repo root (App Router, TS, Tailwind 4, ESLint, no src dir)
- [x] Design tokens in `app/globals.css`
- [x] `data/profile.ts` content source
- [x] Portfolio page reading profile/db data
- [x] Chat panel via `lib/chat.ts` seam

## Phase 2 — Database
- [x] `db/schema.ts` Drizzle schema (owners, projects, sections, leads)
- [x] `db/index.ts` client + auto-migrate + seed on first run, race-safe
- [x] `data/portfolio.db` gitignored

## Phase 3 — Auth
- [x] Signed httpOnly cookie session, login/logout/me API routes, env credentials, no framework

## Phase 4 — Edit mode
- [x] Owner-only edit mode: reorder/move/edit/delete cards, add project, edit sections; persisted via API routes; verified unauthenticated requests are rejected

## Phase 5 — AI chat
- [ ] Verify `meta-llama/llama-3.3-70b-instruct:free` still supports native function calling (check before live use)
- [x] `lib/ai.ts` OpenRouter client (`createOpenRouter`), `OPENROUTER_MODEL` env
- [x] `lib/tools.ts`: visitor set (highlightProjects, tailorFeatured, draftContactMessage) + owner additions (createProject, updateProject, moveProject, deleteProject, rewriteSection)
- [x] Chat route: tool set from session cookie only, 429 -> "Busy right now, try again.", per-IP rate limit (20/min), 2000-char cap

## Phase 6 — Leads inbox & close-out
- [x] Leads saved from chat via draftContactMessage, `/inbox` page (owner only, redirects to /login)
- [x] README rewritten (< 20 lines), no emojis
