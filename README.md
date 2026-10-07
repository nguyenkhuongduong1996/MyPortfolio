# MyPortfolio

Creator portfolio MVP. Next.js app, SQLite via Drizzle, owner edit mode, AI chat (OpenRouter).

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `OWNER_USER`, `OWNER_PASSWORD`, `OPENROUTER_API_KEY`
3. `npm run dev`

Public portfolio at `/`. Owner signs in at `/login` and edits inline. Leads inbox at `/inbox`.
Database file: `data/portfolio.db` (auto-created, migrated, seeded from `data/profile.ts`).
