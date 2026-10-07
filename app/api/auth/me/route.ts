import { isOwner } from "@/lib/session";

export async function GET() {
  return Response.json({ authenticated: await isOwner() });
}
