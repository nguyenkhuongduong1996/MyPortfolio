"use client";

import { useRouter } from "next/navigation";

export default function AuthControls({ owner }: { owner: boolean }) {
  const router = useRouter();
  if (!owner) {
    return (
      <a href="/login" className="text-sm text-tealtext">
        Owner sign in
      </a>
    );
  }
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.refresh();
      }}
      className="text-sm text-tealtext"
    >
      Sign out
    </button>
  );
}
