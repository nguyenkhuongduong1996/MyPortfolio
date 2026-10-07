"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SectionView({
  id,
  heading,
  body,
  editable,
}: {
  id: string;
  heading: string;
  body: string;
  editable: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [h, setH] = useState(heading);
  const [b, setB] = useState(body);

  async function save() {
    await fetch(`/api/sections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heading: h, body: b }),
    });
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <section className="mt-10">
        <input value={h} onChange={(e) => setH(e.target.value)} className="w-full rounded bg-surface px-2 py-1 text-xl font-semibold" />
        <textarea value={b} onChange={(e) => setB(e.target.value)} className="mt-2 w-full rounded bg-surface px-2 py-1 text-muted" />
        <div className="mt-2 flex gap-2">
          <button onClick={save} className="rounded bg-signal px-3 py-1 text-sm font-semibold text-ink">Save</button>
          <button onClick={() => setEditing(false)} className="rounded bg-ink px-3 py-1 text-sm text-muted">Cancel</button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">{heading}</h2>
        {editable && (
          <button onClick={() => setEditing(true)} className="text-xs text-muted">Edit</button>
        )}
      </div>
      <p className="mt-2 text-muted">{body}</p>
    </section>
  );
}
