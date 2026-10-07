"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type CardProject = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string | null;
  shelf: "featured" | "more";
};

export default function ProjectCard({
  project,
  editable,
  shelfIds,
  otherShelfIds,
}: {
  project: CardProject;
  editable: boolean;
  shelfIds: string[];
  otherShelfIds: string[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [tags, setTags] = useState(project.tags.join(", "));
  const [link, setLink] = useState(project.link ?? "");

  const index = shelfIds.indexOf(project.id);

  async function reorder(ids: string[]) {
    await fetch("/api/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    router.refresh();
  }

  function move(dir: -1 | 1) {
    const next = [...shelfIds];
    const i = next.indexOf(project.id);
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    reorder(next);
  }

  async function moveShelf() {
    const target = project.shelf === "featured" ? "more" : "featured";
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shelf: target, sortOrder: otherShelfIds.length }),
    });
    await fetch("/api/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: shelfIds.filter((id) => id !== project.id) }),
    });
    await fetch("/api/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...otherShelfIds, project.id] }),
    });
    router.refresh();
  }

  async function save() {
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        link: link || null,
      }),
    });
    setEditing(false);
    router.refresh();
  }

  async function remove() {
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.refresh();
  }

  if (editing) {
    return (
      <article className="rounded-lg bg-surface p-5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded bg-ink px-2 py-1" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 w-full rounded bg-ink px-2 py-1 text-sm text-muted" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags, comma separated" className="mt-2 w-full rounded bg-ink px-2 py-1 text-sm" />
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="link" className="mt-2 w-full rounded bg-ink px-2 py-1 text-sm" />
        <div className="mt-3 flex gap-2">
          <button onClick={save} className="rounded bg-signal px-3 py-1 text-sm font-semibold text-ink">Save</button>
          <button onClick={() => setEditing(false)} className="rounded bg-ink px-3 py-1 text-sm text-muted">Cancel</button>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-lg bg-surface p-5">
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <p className="mt-1 text-sm text-muted">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span key={t} className="rounded-full bg-ink px-2 py-0.5 text-xs text-tealtext">
            {t}
          </span>
        ))}
      </div>
      {project.link && (
        <a href={project.link} className="mt-3 inline-block text-sm text-tealtext">
          View project
        </a>
      )}
      {editable && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <button onClick={() => move(-1)} disabled={index <= 0} className="rounded bg-ink px-2 py-1 text-muted disabled:opacity-40">Up</button>
          <button onClick={() => move(1)} disabled={index >= shelfIds.length - 1} className="rounded bg-ink px-2 py-1 text-muted disabled:opacity-40">Down</button>
          <button onClick={moveShelf} className="rounded bg-ink px-2 py-1 text-muted">
            To {project.shelf === "featured" ? "More" : "Featured"}
          </button>
          <button onClick={() => setEditing(true)} className="rounded bg-ink px-2 py-1 text-muted">Edit</button>
          <button onClick={remove} className="rounded bg-ink px-2 py-1 text-signal">Delete</button>
        </div>
      )}
    </article>
  );
}
