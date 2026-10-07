import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { owners, projects, sections } from "@/db/schema";

export function getOwner() {
  return db.select().from(owners).limit(1).all()[0];
}

export function getSections() {
  const owner = getOwner();
  if (!owner) return [];
  return db.select().from(sections).where(eq(sections.ownerId, owner.id)).orderBy(asc(sections.sortOrder)).all();
}

export function getProjects(shelf?: "featured" | "more") {
  const owner = getOwner();
  if (!owner) return [];
  const rows = db.select().from(projects).where(eq(projects.ownerId, owner.id)).orderBy(asc(projects.sortOrder)).all();
  return shelf ? rows.filter((r) => r.shelf === shelf) : rows;
}

export type ProjectRow = ReturnType<typeof getProjects>[number];
export type SectionRow = ReturnType<typeof getSections>[number];
