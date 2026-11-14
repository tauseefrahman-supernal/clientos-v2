"use client";

import { useState, useTransition } from "react";
import { setPersonRoleAction } from "@/app/actions";

export function RoleToggle({ id, role, self }: { id: string; role: "admin" | "member"; self: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <span className="flex items-center gap-space-2">
      <select value={role} disabled={pending || self} title={self ? "You cannot remove your own admin role" : undefined} aria-label="Role"
        onChange={(e) => { const next = e.target.value as "admin" | "member"; start(async () => { setError(null); try { await setPersonRoleAction(id, next); } catch (er) { setError(er instanceof Error ? er.message : String(er)); } }); }}
        className="rounded-md border border-input bg-background px-space-2 py-1 text-sm disabled:opacity-60">
        <option value="member">Member: assigned projects</option>
        <option value="admin">Admin: every project</option>
      </select>
      {error && <span className="text-xs text-[hsl(var(--color-status-error-text))]">{error}</span>}
    </span>
  );
}
