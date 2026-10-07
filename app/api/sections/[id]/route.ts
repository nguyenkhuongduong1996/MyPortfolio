import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { isOwner } from "@/lib/session";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isOwner())) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Bad body." }, { status: 400 });
  const patch: Partial<typeof sections.$inferInsert> = {};
  if (typeof body.heading === "string" && body.heading.trim()) patch.heading = body.heading.trim();
  if (typeof body.body === "string") patch.body = body.body;
  db.update(sections).set(patch).where(eq(sections.id, id)).run();
  return Response.json({ ok: true });
}
