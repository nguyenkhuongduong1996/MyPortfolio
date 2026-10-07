import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { isOwner } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  if (!(await isOwner())) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Bad body." }, { status: 400 });
  const patch: Partial<typeof projects.$inferInsert> = {};
  if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
  if (typeof body.description === "string") patch.description = body.description;
  if (Array.isArray(body.tags)) patch.tags = JSON.stringify(body.tags.filter((t: unknown) => typeof t === "string"));
  if (typeof body.link === "string" || body.link === null) patch.link = body.link || null;
  if (body.shelf === "featured" || body.shelf === "more") patch.shelf = body.shelf;
  if (typeof body.sortOrder === "number") patch.sortOrder = body.sortOrder;
  db.update(projects).set(patch).where(eq(projects.id, id)).run();
  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await isOwner())) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  db.delete(projects).where(eq(projects.id, id)).run();
  return Response.json({ ok: true });
}
