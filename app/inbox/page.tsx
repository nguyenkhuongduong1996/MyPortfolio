import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { getOwner } from "@/lib/data";
import { isOwner } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  if (!(await isOwner())) redirect("/login");
  const owner = getOwner();
  const rows = owner
    ? db.select().from(leads).where(eq(leads.ownerId, owner.id)).orderBy(desc(leads.createdAt)).all()
    : [];
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Inbox</h1>
      <p className="mt-1 text-sm text-muted">Leads collected through the chat.</p>
      <div className="mt-8 flex flex-col gap-4">
        {rows.length === 0 && <p className="text-muted">No leads yet.</p>}
        {rows.map((l) => (
          <article key={l.id} className="rounded-lg bg-surface p-5">
            <p className="font-semibold">{l.name}</p>
            <p className="text-sm text-tealtext">{l.email}</p>
            <p className="mt-2 text-sm text-muted">{l.message}</p>
            <p className="mt-2 text-xs text-muted">{new Date(l.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
