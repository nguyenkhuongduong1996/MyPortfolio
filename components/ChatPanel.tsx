"use client";

import { useState } from "react";

export default function ChatPanel() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply ?? data.error ?? "No reply." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-4 rounded-lg bg-surface p-4">
      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "text-bone" : "text-tealtext"}>
            <span className="text-xs uppercase text-muted">{m.role}: </span>
            {m.text}
          </p>
        ))}
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 rounded bg-ink px-3 py-2 text-sm outline-none"
        />
        <button type="submit" disabled={pending} className="rounded bg-signal px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );
}
