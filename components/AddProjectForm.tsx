"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProjectForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [link, setLink] = useState("");
  const [shelf, setShelf] = useState<"featured" | "more">("more");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        link: link || undefined,
        shelf,
      }),
    });
    setTitle("");
    setDescription("");
    setTags("");
    setLink("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-4 rounded bg-signal px-4 py-2 text-sm font-semibold text-ink">
        Add project
      </button>
    );
  }

  return (
    <form onSubmit={add} className="mt-4 rounded-lg bg-surface p-5">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded bg-ink px-2 py-1" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="mt-2 w-full rounded bg-ink px-2 py-1 text-sm text-muted" />
      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags, comma separated" className="mt-2 w-full rounded bg-ink px-2 py-1 text-sm" />
      <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="link" className="mt-2 w-full rounded bg-ink px-2 py-1 text-sm" />
      <select value={shelf} onChange={(e) => setShelf(e.target.value as "featured" | "more")} className="mt-2 rounded bg-ink px-2 py-1 text-sm">
        <option value="featured">Featured</option>
        <option value="more">More work</option>
      </select>
      <div className="mt-3 flex gap-2">
        <button className="rounded bg-signal px-3 py-1 text-sm font-semibold text-ink">Add</button>
        <button type="button" onClick={() => setOpen(false)} className="rounded bg-ink px-3 py-1 text-sm text-muted">Cancel</button>
      </div>
    </form>
  );
}
