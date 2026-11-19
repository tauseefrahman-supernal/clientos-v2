import { test } from "node:test";
import assert from "node:assert/strict";
import { clearPersonnelCalls, rejectPatch, REJECTED_BY } from "../lib/memory/personnel-cleanup.ts";

const fake = () => {
  const log: string[] = [];
  const op = (name: string) => async (ids: string[]) => { log.push(`${name}:${ids.join(",")}`); };
  return { log, ops: { deleteChunks: op("chunks"), rejectSuggestions: op("suggestions"), dropBodies: op("bodies"), blankHeadlines: op("headlines") } };
};

test("a call that turns personnel loses its chunks and its pending suggested facts", async () => {
  const { log, ops } = fake();
  await clearPersonnelCalls(["t1", "t2"], ops, { dropBodies: false });
  assert.deepEqual(log, ["chunks:t1,t2", "suggestions:t1,t2", "headlines:t1,t2"]);
});

test("dropping bodies also rejects suggestions, in batches", async () => {
  const { log, ops } = fake();
  const ids = Array.from({ length: 3 }, (_, i) => `t${i}`);
  await clearPersonnelCalls(ids, ops, { dropBodies: true, batch: 2 });
  assert.deepEqual(log, ["chunks:t0,t1", "suggestions:t0,t1", "bodies:t0,t1", "headlines:t0,t1", "chunks:t2", "suggestions:t2", "bodies:t2", "headlines:t2"]);
});

test("nothing to clear does nothing; the reject patch names the screen", async () => {
  const { log, ops } = fake();
  await clearPersonnelCalls([], ops, { dropBodies: true });
  assert.deepEqual(log, []);
  const p = rejectPatch(new Date("2026-11-18T00:00:00Z"));
  assert.deepEqual(p, { status: "rejected", decided_by: REJECTED_BY, decided_at: "2026-11-18T00:00:00.000Z" });
});
