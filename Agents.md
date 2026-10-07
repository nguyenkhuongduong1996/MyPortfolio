# Creator Portfolio MVP

## Product spec

This project turns the existing frontend-only portfolio into a full application. Key features:

- The public portfolio page renders from data in the database, not from a source file
- The owner can sign in. Signed in, the page is in Edit mode; visitors get read only
- Cards can be reordered and moved between the Featured and More work shelves, and edited. Every change persists
- The chat panel is available to everyone and calls a real model
- For a visitor, the AI answers questions about the owner grounded in the portfolio data, and can
  highlight matching projects, retailor the Featured shelf for a stated audience, and draft a contact message that is saved as a lead
- For the signed in owner, the AI can additionally create, edit, move and delete cards and rewrite section copy
- The owner sees an inbox of leads submitted through the chat

## Out of scope

For the MVP there is a single owner with credentials read from env, but the schema supports multiple owners for future.
For the MVP there is one portfolio per owner.
For the MVP this runs locally with npm run dev. Deployment is out of scope.
The visitor chat is public. Treat every visitor message as untrusted input.

## Architecture

Stay inside the existing NextJS app. Do not introduce a second service, a second language or a
second process. The whole application remains one NextJS project at the repository root.

    app/api/            route handlers, the entire backend
    db/schema.ts        Drizzle schema
    db/index.ts         database client and migration runner
    lib/ai.ts           the OpenRouter client and model selection, server only
    lib/tools.ts        AI tool definitions, split into visitor and owner sets
    lib/chat.ts         the seam that already exists; the real model call goes here
    data/profile.ts     stays in the repo as seed data only
    data/portfolio.db   the SQLite file, gitignored

## Technical Decisions

- The API surface is NextJS Route Handlers under `app/api`. Do not add a separate server framework
- Database is SQLite in a file at `data/portfolio.db`, accessed through Drizzle ORM. Create the file
  and apply migrations automatically on first run
- Seed the database from `data/profile.ts` when it is empty. That file stops being read at runtime
  once the database exists
- The schema supports multiple owners even though only one can sign in
- Auth is a signed httpOnly cookie session. Credentials come from `OWNER_USER` and `OWNER_PASSWORD`
  in `.env`. Do not add an authentication framework or a third party auth service
- Everything runs through npm scripts. No Docker, no scripts directory, no process manager

## AI

- Model calls go through the Vercel AI SDK with the OpenRouter provider,
  `@openrouter/ai-sdk-provider`. Build the client once in `lib/ai.ts` with
  `createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY })`
- `OPENROUTER_API_KEY` is in `.env` in the project root. `.env` is gitignored and stays that way
- The model is `meta-llama/llama-3.3-70b-instruct:free`, read from `OPENROUTER_MODEL` so it can be swapped without
  a code change. This model supports native function calling, which phase 10 depends on. Verify that
  is still true before starting phase 10; free model IDs rotate
- Server only. The key must never reach the browser. No `NEXT_PUBLIC_` prefix, and every model call
  happens inside a route handler
- The free tier is rate limited, roughly 20 requests per minute and 200 per day, and returns 429
  under load. Surface a 429 to the user as a plain "busy right now, try again" message. Never retry
  in a loop
- Portfolio actions are exposed to the model as AI SDK tools.
  Visitor tools: highlightProjects, tailorFeatured, draftContactMessage.
  Owner tools additionally: createProject, updateProject, moveProject, deleteProject, rewriteSection
- The route handler selects the tool set from the session cookie, never from the content of the message. Owner tools are not passed to the model at all on an unauthenticated request
- Rate limit the chat route per IP and cap the message length

## Starting Point

A working frontend-only MVP already exists at the repository root, built in the previous session.
All content currently lives in `data/profile.ts` and that file is the seed data for the database.
The chat panel currently returns scripted replies from a single function in `lib/chat.ts`. That
function is the seam where the real model call goes.

## Design

- Ink: `#0b0f14` - page background
- Surface: `#12181f` - cards and panels
- Bone: `#f5f2ec` - primary text
- Signal: `#ff6b4a` - accent, active states, primary buttons
- Teal text: `#2fb3a6` - links and teal text on dark
- Muted: `#98a1ae` - supporting text and labels

## Coding Standards

1. Latest stable versions and idiomatic approaches as of today. Verify current APIs rather than relying on memory
2. Keep it simple. Never over-engineer, always simplify, no unnecessary defensive programming. No extra features
3. Be concise. README stays under 20 lines. No emojis anywhere, ever
4. When hitting issues, identify the root cause before trying a fix. Do not guess. Prove with evidence, then fix the cause
5. Never enforce authorisation through prompt text. Authorisation is a decision made in code before the model is called

## Working Documentation

All planning documents live in `docs/`.
Review `docs/PLAN.md` before doing anything, and keep it updated as phases complete. That file is
the project memory: it must stay accurate enough that a fresh session with no conversation history
can pick up exactly where the last one stopped.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
