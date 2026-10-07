import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { getOwner } from "@/lib/data";
import { isOwner } from "@/lib/session";

export async function POST(req: Request) {
  if (!(await isOwner())) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const { title, description, tags, link, shelf } = body ?? {};
  if (typeof title !== "string" || !title.trim()) return Response.json({ error: "Title required." }, { status: 400 });
  const owner = getOwner();
  if (!owner) return Response.json({ error: "No owner." }, { status: 500 });
  const existing = db.select().from(projects).where(eq(projects.ownerId, owner.id)).all();
  const target = shelf === "more" ? "more" : "featured";
  const sortOrder = existing.filter((p) => p.shelf === target).length;
  const id = randomUUID();
  db.insert(projects)
    .values({
      id,
      ownerId: owner.id,
      title: title.trim(),
      description: typeof description === "string" ? description : "",
      tags: JSON.stringify(Array.isArray(tags) ? tags.filter((t) => typeof t === "string") : []),
      link: typeof link === "string" && link ? link : null,
      shelf: target,
      sortOrder,
    })
    .run();
  return Response.json({ id }, { status: 201 });
}
