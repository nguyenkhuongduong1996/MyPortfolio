import { APICallError } from "ai";
import { reply } from "@/lib/chat";
import { isOwner } from "@/lib/session";

const MAX_LENGTH = 2000;
const WINDOW_MS = 60_000;
const LIMIT = 20;

const globalForRate = globalThis as unknown as { rate?: Map<string, { count: number; reset: number }> };
const rate = globalForRate.rate ?? new Map();
globalForRate.rate = rate;

function tooMany(ip: string): boolean {
  const now = Date.now();
  const entry = rate.get(ip);
  if (!entry || entry.reset < now) {
    rate.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (tooMany(ip)) {
    return Response.json({ error: "Busy right now, try again." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.slice(0, MAX_LENGTH) : "";
  if (!message.trim()) {
    return Response.json({ error: "Message required." }, { status: 400 });
  }
  try {
    const text = await reply(message, { owner: await isOwner() });
    return Response.json({ reply: text });
  } catch (err) {
    if (APICallError.isInstance(err) && err.statusCode === 429) {
      return Response.json({ error: "Busy right now, try again." }, { status: 429 });
    }
    throw err;
  }
}
