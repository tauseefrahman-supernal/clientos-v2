// What happens to a call that is (or becomes) a personnel call: its chunks go, its pending suggested vault facts
// are rejected, its body goes (when dropping bodies) and its project headlines are blanked. Pure orchestration;
// lib/memory/sync.ts passes the database operations in, so node --test can check the steps.

export const REJECTED_BY = "personnel screen";

/** The vault_suggestions update for pending facts of a personnel call. */
export const rejectPatch = (now: Date) => ({ status: "rejected" as const, decided_by: REJECTED_BY, decided_at: now.toISOString() });

export interface PersonnelOps {
  deleteChunks(ids: string[]): Promise<void>;
  rejectSuggestions(ids: string[]): Promise<void>;
  dropBodies(ids: string[]): Promise<void>;
  blankHeadlines(ids: string[]): Promise<void>;
}

/** Safety writes first: chunks and suggestions go before the body and headlines, batch by batch. */
export async function clearPersonnelCalls(ids: string[], ops: PersonnelOps, opts: { dropBodies: boolean; batch?: number }): Promise<void> {
  const n = opts.batch ?? 100;
  for (let i = 0; i < ids.length; i += n) {
    const part = ids.slice(i, i + n);
    await ops.deleteChunks(part);
    await ops.rejectSuggestions(part);
    if (opts.dropBodies) await ops.dropBodies(part);
    await ops.blankHeadlines(part);
  }
}
