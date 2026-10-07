import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { owners, projects, sections } from "./schema";
import * as schema from "./schema";
import { profile, projects as seedProjects, sections as seedSections } from "@/data/profile";

function createDb() {
  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const sqlite = new Database(path.join(dataDir, "portfolio.db"), { timeout: 5000 });
  sqlite.pragma("journal_mode = WAL");
  const db = drizzle(sqlite, { schema });
  try {
    migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    seed(db);
  } catch {
    // Another worker may be migrating/seeding concurrently; if the schema
    // is already in place this second attempt failing is harmless.
    db.select().from(owners).limit(1).all();
  }
  return db;
}

function seed(db: ReturnType<typeof drizzle>) {
  const hasOwner = db.select().from(owners).limit(1).all();
  if (hasOwner.length > 0) return;
  const ownerId = "owner-1";
  db.insert(owners)
    .values({ id: ownerId, name: profile.name, role: profile.role, bio: profile.bio, email: profile.email })
    .run();
  for (const s of seedSections) {
    db.insert(sections)
      .values({ id: s.id, ownerId, heading: s.heading, body: s.body, sortOrder: s.sortOrder })
      .run();
  }
  for (const p of seedProjects) {
    db.insert(projects)
      .values({
        id: p.id,
        ownerId,
        title: p.title,
        description: p.description,
        tags: JSON.stringify(p.tags),
        link: p.link ?? null,
        shelf: p.shelf,
        sortOrder: p.sortOrder,
      })
      .run();
  }
}

const globalForDb = globalThis as unknown as { db?: ReturnType<typeof createDb> };
export const db = globalForDb.db ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;
