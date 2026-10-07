import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { isOwner } from "@/lib/session";

export async function POST(req: Request) {
  if (!(await isOwner())) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const ids: unknown = body?.ids;
  if (!Array.isArray(ids) || ids.some((i) => typeof i !== "string")) {
    return Response.json({ error: "ids required." }, { status: 400 });
  }
  ids.forEach((id, index) => {
    db.update(projects).set({ sortOrder: index }).where(eq(projects.id, id as string)).run();
  });
  return Response.json({ ok: true });
}
