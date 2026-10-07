import { createSession, checkCredentials } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { username, password } = body ?? {};
  if (typeof username !== "string" || typeof password !== "string" || !checkCredentials(username, password)) {
    return Response.json({ error: "Invalid credentials." }, { status: 401 });
  }
  await createSession();
  return Response.json({ ok: true });
}
