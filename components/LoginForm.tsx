"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Invalid credentials.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 flex w-full max-w-sm flex-col gap-3">
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="rounded bg-surface px-3 py-2 outline-none" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="rounded bg-surface px-3 py-2 outline-none" />
      <button className="rounded bg-signal px-4 py-2 font-semibold text-ink">Sign in</button>
      {error && <p className="text-sm text-signal">{error}</p>}
    </form>
  );
}
