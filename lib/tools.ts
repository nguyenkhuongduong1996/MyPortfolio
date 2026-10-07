import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { tool } from "ai";
import { z } from "zod";
import { db } from "@/db";
import { leads, projects, sections } from "@/db/schema";
import { getOwner, getProjects } from "@/lib/data";

function projectSummaries() {
  return getProjects().map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    tags: JSON.parse(p.tags) as string[],
    shelf: p.shelf,
  }));
}

export const visitorTools = {
  highlightProjects: tool({
    description: "Find projects matching a query and highlight them to the visitor.",
    inputSchema: z.object({ query: z.string() }),
    execute: async ({ query }) => {
      const q = query.toLowerCase();
      const matches = projectSummaries().filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
      return { matches: matches.length ? matches : projectSummaries() };
    },
  }),
  tailorFeatured: tool({
    description: "Retailor the Featured shelf for a stated audience by scoring and re-shelving projects.",
    inputSchema: z.object({ audience: z.string() }),
    execute: async ({ audience }) => {
      const owner = getOwner();
      if (!owner) return { error: "No owner." };
      const terms = audience.toLowerCase().split(/\W+/).filter(Boolean);
      const scored = projectSummaries()
        .map((p) => ({
          ...p,
          score: terms.reduce(
            (acc, t) =>
              acc +
              (p.title.toLowerCase().includes(t) ||
              p.description.toLowerCase().includes(t) ||
              p.tags.some((tag) => tag.toLowerCase().includes(t))
                ? 1
                : 0),
            0,
          ),
        }))
        .sort((a, b) => b.score - a.score);
      const featured = scored.slice(0, 3);
      const rest = scored.slice(3);
      featured.forEach((p, i) => {
        db.update(projects).set({ shelf: "featured", sortOrder: i }).where(eq(projects.id, p.id)).run();
      });
      rest.forEach((p, i) => {
        db.update(projects).set({ shelf: "more", sortOrder: i }).where(eq(projects.id, p.id)).run();
      });
      return { featured: featured.map((p) => p.title), audience };
    },
  }),
  draftContactMessage: tool({
    description: "Draft and save a contact message from the visitor as a lead.",
    inputSchema: z.object({
      name: z.string(),
      email: z.string(),
      message: z.string(),
    }),
    execute: async ({ name, email, message }) => {
      const owner = getOwner();
      if (!owner) return { error: "No owner." };
      db.insert(leads)
        .values({ id: randomUUID(), ownerId: owner.id, name, email, message })
        .run();
      return { saved: true };
    },
  }),
};

export const ownerTools = {
  ...visitorTools,
  createProject: tool({
    description: "Create a new project card.",
    inputSchema: z.object({
      title: z.string(),
      description: z.string().default(""),
      tags: z.array(z.string()).default([]),
      link: z.string().optional(),
      shelf: z.enum(["featured", "more"]).default("more"),
    }),
    execute: async ({ title, description, tags, link, shelf }) => {
      const owner = getOwner();
      if (!owner) return { error: "No owner." };
      const existing = getProjects().filter((p) => p.shelf === shelf);
      const id = randomUUID();
      db.insert(projects)
        .values({ id, ownerId: owner.id, title, description, tags: JSON.stringify(tags), link: link ?? null, shelf, sortOrder: existing.length })
        .run();
      return { id, title };
    },
  }),
  updateProject: tool({
    description: "Update fields of an existing project.",
    inputSchema: z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      link: z.string().optional(),
    }),
    execute: async ({ id, title, description, tags, link }) => {
      const patch: Partial<typeof projects.$inferInsert> = {};
      if (title !== undefined) patch.title = title;
      if (description !== undefined) patch.description = description;
      if (tags !== undefined) patch.tags = JSON.stringify(tags);
      if (link !== undefined) patch.link = link;
      db.update(projects).set(patch).where(eq(projects.id, id)).run();
      return { updated: id };
    },
  }),
  moveProject: tool({
    description: "Move a project to a shelf.",
    inputSchema: z.object({ id: z.string(), shelf: z.enum(["featured", "more"]) }),
    execute: async ({ id, shelf }) => {
      db.update(projects).set({ shelf }).where(eq(projects.id, id)).run();
      return { moved: id, shelf };
    },
  }),
  deleteProject: tool({
    description: "Delete a project card.",
    inputSchema: z.object({ id: z.string() }),
    execute: async ({ id }) => {
      db.delete(projects).where(eq(projects.id, id)).run();
      return { deleted: id };
    },
  }),
  rewriteSection: tool({
    description: "Rewrite the body copy of a section.",
    inputSchema: z.object({ id: z.string(), body: z.string() }),
    execute: async ({ id, body }) => {
      db.update(sections).set({ body }).where(eq(sections.id, id)).run();
      return { rewritten: id };
    },
  }),
};
