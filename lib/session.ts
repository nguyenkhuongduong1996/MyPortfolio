import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "portfolio_session";

function secret(): Buffer {
  return createHmac("sha256", "portfolio-session")
    .update(`${process.env.OWNER_USER}:${process.env.OWNER_PASSWORD}`)
    .digest();
}

export function sessionValue(): string {
  return createHmac("sha256", secret()).update("owner-authenticated").digest("hex");
}

export async function isOwner(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE)?.value;
  if (!value) return false;
  const expected = sessionValue();
  return value.length === expected.length && timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export function checkCredentials(username: string, password: string): boolean {
  return username === process.env.OWNER_USER && password === process.env.OWNER_PASSWORD;
}
