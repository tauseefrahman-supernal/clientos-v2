import { test } from "node:test";
import assert from "node:assert/strict";
import {
  turnsToBody, bodyToTurns, isUsable, batches, estimateTokens,
  vaultChunks, chapterChunks, callChunks, planOwner, applyPlan, splitHeader,
  type ChunkRow, type ExistingChunk, type ApplyDeps, type EmbedItem,
} from "../lib/memory/index-rules.ts";
import { voyageEmbedder } from "../lib/memory/voyage.ts";
import type { Turn } from "../lib/memory/types.ts";

const NOW = new Date("2026-11-18T12:00:00Z");
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

// ---------------------------------------------------------------- body <-> turns

test("a speaker-labelled body parses back into the turns it was made from", () => {
  const turns: Turn[] = [
    { speaker: "Ann Lee", start: 0, text: "Morning. Shall we start?" },
    { speaker: "Bob", start: 3725, text: "Yes: the budget first." },
    { speaker: "", start: 3800, text: "[personnel section removed, 4 min]" },
    { speaker: "Ann Lee", start: null, text: "Back to the plan." },
  ];
  const body = turnsToBody(turns);
  assert.equal(body.split("\n")[0], "[00:00:00] Ann Lee: Morning. Shall we start?");
  assert.equal(body.split("\n")[1], "[01:02:05] Bob: Yes: the budget first.");
  assert.deepEqual(bodyToTurns(body), turns);
});

test("turn text with line breaks stays one line per turn", () => {
  const body = turnsToBody([{ speaker: "Ann", start: null, text: "one\ntwo\n\nthree" }]);
  assert.equal(body, "Ann: one two three");
  assert.deepEqual(bodyToTurns(body), [{ speaker: "Ann", start: null, text: "one two three" }]);
});

test("unlabelled lines become speakerless turns and blank lines are skipped", () => {
  assert.deepEqual(bodyToTurns("just a note\n\n[private details removed, 2 min]\n"), [
    { speaker: "", start: null, text: "just a note" },
    { speaker: "", start: null, text: "[private details removed, 2 min]" },
  ]);
  assert.deepEqual(bodyToTurns(""), []);
});

// ---------------------------------------------------------------- usable

test("usable is false for hidden, archived, deleted, sensitive, personnel and long-gone owners", () => {
  assert.equal(isUsable({ state: "active" }, NOW), true);
  assert.equal(isUsable({ state: "active", shown: true }, NOW), true);
  assert.equal(isUsable({ state: "active", shown: null }, NOW), true);
  for (const state of ["hidden", "archived", "deleted"]) assert.equal(isUsable({ state }, NOW), false, state);
  assert.equal(isUsable({ state: "active", shown: false }, NOW), false);
  assert.equal(isUsable({ sensitive: true }, NOW), false);
  assert.equal(isUsable({ status: "personnel" }, NOW), false);
  assert.equal(isUsable({ status: "digested", goneAt: daysAgo(13) }, NOW), true);
  assert.equal(isUsable({ status: "digested", goneAt: daysAgo(15) }, NOW), false);
  assert.equal(isUsable({ status: "pending", goneAt: null }, NOW), true);
});

// ---------------------------------------------------------------- batching and estimates

test("batches cut into groups of 128 and estimateTokens is chars / 4", () => {
  const xs = Array.from({ length: 300 }, (_, i) => i);
  const b = batches(xs);
  assert.deepEqual(b.map((x) => x.length), [128, 128, 44]);
  assert.deepEqual(b.flat(), xs);
  assert.deepEqual(batches([]), []);
  assert.equal(estimateTokens(["abcd", "abcdefgh", "ab"]), 4);
});

// ---------------------------------------------------------------- chunk rows

test("a vault file yields vault-layer rows tied to the file and its project", () => {
  const content = "# Goals\n\n" + Array.from({ length: 6 }, (_, i) => `Paragraph ${i} ` + "word ".repeat(80)).join("\n\n");
  const rows = vaultChunks({ id: "f1", account_id: "a1", path: "Deal Strategy/Goals", content, state: "active", shown: null }, NOW);
  assert.ok(rows.length > 1);
  rows.forEach((r, i) => {
    assert.equal(r.layer, "vault");
    assert.equal(r.ownerType, "file");
    assert.equal(r.ownerId, "f1");
    assert.equal(r.accountId, "a1");
    assert.deepEqual(r.accounts, ["a1"]);
    assert.equal(r.seq, i);
    assert.equal(r.usable, true);
    assert.equal(r.metAt, null);
    assert.match(r.label, /^File Deal Strategy\/Goals\.md/);
    assert.equal(splitHeader(r.body).header, "File: Deal Strategy/Goals");
    assert.ok(content.includes(splitHeader(r.body).text.split("\n")[0]));
  });
  assert.deepEqual(vaultChunks({ id: "f2", account_id: "a1", path: "X/Empty", content: "", state: "active", shown: null }, NOW), []);
  assert.equal(vaultChunks({ id: "f3", account_id: "a1", path: "X/H", content: "hi", state: "hidden", shown: null }, NOW)[0].usable, false);
});

test("a chapter yields chapter-layer rows with its sources", () => {
  const rows = chapterChunks({ id: "c1", account_id: "a1", sort: 0, title: "Why now", body: "The case.", sources: ["Call 3 Jun"], project: "World Emblem" });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].layer, "chapter");
  assert.equal(rows[0].ownerType, "chapter");
  assert.equal(rows[0].label, "Book, chapter 1: Why now");
  assert.ok(rows[0].body.startsWith("Book: World Emblem — Why now\nThe case."));
  assert.ok(rows[0].body.includes("Sources: Call 3 Jun"));
  assert.deepEqual(rows[0].accounts, ["a1"]);
});

const call = (over: Partial<Parameters<typeof callChunks>[0]> = {}) => ({
  id: "t1", title: "Weekly sync", met_at: "2026-11-10T15:00:00Z", status: "digested", summary: "We agreed the plan.",
  body: turnsToBody(Array.from({ length: 30 }, (_, i) => ({ speaker: i % 2 ? "Bob" : "Ann", start: i * 60, text: `Point ${i} ` + "word ".repeat(40) }))),
  gone_at: null, speakers: [], accounts: ["a1", "a2"], ...over,
});

test("a digested call yields one summary row and transcript rows, linked to every project", () => {
  const rows = callChunks(call(), NOW);
  const summary = rows.filter((r) => r.layer === "summary");
  const parts = rows.filter((r) => r.layer === "transcript");
  assert.equal(summary.length, 1);
  assert.ok(summary[0].body.startsWith("Weekly sync (2026-11-10)"));
  assert.ok(summary[0].body.includes("We agreed the plan."));
  assert.deepEqual(summary[0].speakers, ["Ann", "Bob"]);
  assert.ok(parts.length > 1);
  parts.forEach((r, i) => {
    assert.equal(r.seq, i);
    assert.ok(r.speakers.length > 0);
    // the header names the call and is not mistaken for a turn once split off
    const { header, text } = splitHeader(r.body);
    assert.equal(header, "Call: Weekly sync, 2026-11-10");
    const turns = bodyToTurns(text);
    assert.ok(turns.length > 0 && turns.every((t) => t.speaker === "Ann" || t.speaker === "Bob"));
  });
  for (const r of rows) {
    assert.equal(r.ownerType, "transcript");
    assert.equal(r.ownerId, "t1");
    assert.equal(r.accountId, null);
    assert.deepEqual(r.accounts, ["a1", "a2"]);
    assert.equal(r.metAt, "2026-11-10T15:00:00Z");
    assert.equal(r.usable, true);
  }
});

test("a pending call indexes its body but not its summary; personnel and empty calls index nothing", () => {
  const pending = callChunks(call({ status: "pending" }), NOW);
  assert.ok(pending.length > 0 && pending.every((r) => r.layer === "transcript"));
  assert.deepEqual(callChunks(call({ status: "pending", body: "  " }), NOW), []);
  assert.deepEqual(callChunks(call({ status: "personnel", body: null, summary: "" }), NOW), []);
  assert.deepEqual(callChunks(call({ status: "failed" }), NOW).filter((r) => r.layer === "summary"), []);
  assert.ok(callChunks(call({ gone_at: daysAgo(20) }), NOW).every((r) => r.usable === false));
});

test("summary speakers fall back to the call's speakers field when given", () => {
  const rows = callChunks(call({ body: null, speakers: [{ name: "Cara" }, "Dev"] }), NOW);
  assert.deepEqual(rows.map((r) => r.layer), ["summary"]);
  assert.deepEqual(rows[0].speakers, ["Cara", "Dev"]);
});

// ---------------------------------------------------------------- planning against what is stored

const want = (seq: number, body: string, over: Partial<ChunkRow> = {}): ChunkRow => ({
  layer: "vault", ownerType: "file", ownerId: "f1", accountId: "a1", seq, label: `File X.md (part ${seq + 1})`, body,
  metAt: null, speakers: [], usable: true, accounts: ["a1"], ...over,
});
const have = (id: string, seq: number, body: string, over: Partial<ExistingChunk> = {}): ExistingChunk => ({
  id, layer: "vault", seq, label: `File X.md (part ${seq + 1})`, body, metAt: null, speakers: [], usable: true, accountId: "a1", accounts: ["a1"], ...over,
});

test("unchanged chunks are kept, changed and new ones re-embedded, leftovers removed", () => {
  const p = planOwner([want(0, "same"), want(1, "new text"), want(2, "added")], [have("k0", 0, "same"), have("k1", 1, "old text"), have("k3", 3, "gone")]);
  assert.deepEqual(p.embed.map((r) => r.seq), [1, 2]);
  assert.deepEqual(p.embed.map((r) => r.replaces), ["k1", undefined]);
  assert.deepEqual(p.remove, ["k3"]);
  assert.deepEqual(p.patch, []);
  assert.deepEqual(p.link, []);
  assert.deepEqual(p.unlink, []);
});

test("usable, label, date, speakers and project links are refreshed without re-embedding", () => {
  const p = planOwner(
    [want(0, "same", { usable: false, label: "File Y.md", metAt: "2026-11-01T00:00:00.000Z", speakers: ["Ann"], accounts: ["a1", "a2"] })],
    [have("k0", 0, "same", { metAt: "2026-11-01T00:00:00+00:00", accounts: ["a1", "a9"] })],
  );
  assert.deepEqual(p.embed, []);
  assert.deepEqual(p.remove, []);
  assert.deepEqual(p.patch, [{ id: "k0", fields: { usable: false, label: "File Y.md", speakers: ["Ann"] } }]);
  assert.deepEqual(p.link, [{ chunk_id: "k0", account_id: "a2" }]);
  assert.deepEqual(p.unlink, [{ chunk_id: "k0", account_id: "a9" }]);
});

test("layers are matched separately and duplicate stored chunks are removed", () => {
  const p = planOwner(
    [want(0, "summary", { layer: "summary" }), want(0, "part", { layer: "transcript" })],
    [have("s0", 0, "summary", { layer: "summary" }), have("t0", 0, "part", { layer: "transcript" }), have("t0b", 0, "part", { layer: "transcript" })],
  );
  assert.deepEqual(p.embed, []);
  assert.deepEqual(p.remove, ["t0b"]);
});

test("an owner with nothing left to index has all its chunks removed", () => {
  const p = planOwner([], [have("k0", 0, "a"), have("k1", 1, "b")]);
  assert.deepEqual(p.remove, ["k0", "k1"]);
});

// ---------------------------------------------------------------- Voyage client

type Call = { url: string; body: Record<string, unknown> };
const fakeFetch = (replies: ((body: Record<string, unknown>) => { status: number; json?: unknown })[]) => {
  const calls: Call[] = [];
  const fetch = async (url: string, init: { body: string }) => {
    const body = JSON.parse(init.body);
    calls.push({ url, body });
    const r = (replies[calls.length - 1] ?? replies[replies.length - 1])(body);
    return { ok: r.status < 300, status: r.status, json: async () => r.json, text: async () => JSON.stringify(r.json ?? "") };
  };
  return { calls, fetch };
};
const okReply = (body: Record<string, unknown>) => {
  const input = body.input as string[];
  return { status: 200, json: { data: input.map((_, i) => ({ index: i, embedding: [i, input.length] })).reverse(), usage: { total_tokens: input.length * 10 } } };
};

test("embed sends batches of 128 to Voyage and returns vectors in input order with token usage", async () => {
  const { calls, fetch } = fakeFetch([okReply]);
  const embedder = voyageEmbedder({ key: "k", fetch: fetch as never, sleep: async () => {} });
  const texts = Array.from({ length: 130 }, (_, i) => `t${i}`);
  const out = await embedder(texts, "document");
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://api.voyageai.com/v1/embeddings");
  assert.deepEqual({ ...calls[0].body, input: undefined }, { input: undefined, model: "voyage-3.5", input_type: "document", output_dimension: 1024 });
  assert.equal((calls[0].body.input as string[]).length, 128);
  assert.equal((calls[1].body.input as string[]).length, 2);
  assert.equal(out.vectors.length, 130);
  assert.deepEqual(out.vectors[0], [0, 128]);
  assert.deepEqual(out.vectors[129], [1, 2]);
  assert.equal(out.tokens, 1300);
});

test("embed backs off on 429 and retries, then throws after five tries", async () => {
  const waits: number[] = [];
  const sleep = async (ms: number) => { waits.push(ms); };
  const busy = () => ({ status: 429, json: { detail: "rate limited" } });
  const one = fakeFetch([busy, busy, okReply]);
  const out = await voyageEmbedder({ key: "k", fetch: one.fetch as never, sleep })(["a"], "query");
  assert.equal(one.calls.length, 3);
  assert.equal(one.calls[0].body.input_type, "query");
  assert.equal(out.vectors.length, 1);
  assert.ok(waits.length === 2 && waits[1] > waits[0]);

  const never = fakeFetch([busy]);
  await assert.rejects(voyageEmbedder({ key: "k", fetch: never.fetch as never, sleep })(["a"], "document"), /429/);
  assert.equal(never.calls.length, 5);
});

test("embed fails clearly on other errors and on a missing key", async () => {
  const bad = fakeFetch([() => ({ status: 400, json: { detail: "bad input" } })]);
  await assert.rejects(voyageEmbedder({ key: "k", fetch: bad.fetch as never, sleep: async () => {} })(["a"], "document"), /400/);
  assert.equal(bad.calls.length, 1);
  await assert.rejects(voyageEmbedder({ key: undefined, fetch: bad.fetch as never, sleep: async () => {} })(["a"], "document"), /VOYAGE_API_KEY is not set/);
  const empty = await voyageEmbedder({ key: undefined, fetch: bad.fetch as never, sleep: async () => {} })([], "document");
  assert.deepEqual(empty, { vectors: [], tokens: 0 });
});

// ---------------------------------------------------------------- applying a plan

const recorder = (embed: ApplyDeps["embed"]) => {
  const log: string[] = [];
  let n = 0;
  const deps: ApplyDeps = {
    embed: async (texts) => { log.push(`embed ${texts.length}`); return embed(texts); },
    insert: async (items) => { log.push(`insert ${items.map((i) => i.row.body).join(",")}`); },
    remove: async (ids) => { log.push(`remove ${ids.join(",")}`); },
    patch: async (p) => { log.push(`patch ${p.id} ${JSON.stringify(p.fields)}`); },
    link: async (rows) => { log.push(`link ${rows.map((r) => r.chunk_id).join(",")}`); },
    unlink: async (rows) => { log.push(`unlink ${rows.map((r) => r.chunk_id).join(",")}`); },
    newId: () => `n${n++}`,
  };
  return { log, deps };
};
const item = (body: string, over: Partial<EmbedItem> = {}): EmbedItem => ({ ...want(0, body), ...over });
const vectors = async (texts: string[]) => ({ vectors: texts.map(() => [0]), tokens: texts.length });

test("safety writes are applied even when embedding fails", async () => {
  const { log, deps } = recorder(async () => { throw new Error("VOYAGE_API_KEY is not set"); });
  await assert.rejects(applyPlan({
    embed: [item("new", { replaces: "old" })],
    remove: ["personnel-chunk"],
    patch: [{ id: "gone", fields: { usable: false } }, { id: "renamed", fields: { label: "L" } }],
    link: [{ chunk_id: "k", account_id: "a2" }],
    unlink: [{ chunk_id: "k", account_id: "a9" }],
  }, deps), /VOYAGE_API_KEY/);
  assert.deepEqual(log, ["remove personnel-chunk", 'patch gone {"usable":false}', "unlink k", "embed 1"]);
});

test("each replaced chunk is removed right after its replacement batch is inserted", async () => {
  const { log, deps } = recorder(vectors);
  const many = Array.from({ length: 130 }, (_, i) => item(`b${i}`, { seq: i, replaces: `old${i}` }));
  const out = await applyPlan({ embed: many, remove: [], patch: [{ id: "x", fields: { usable: true } }], link: [{ chunk_id: "x", account_id: "a" }], unlink: [] }, deps);
  assert.deepEqual(out, { embedded: 130, tokens: 130, skipped: 0 });
  assert.deepEqual(log.map((l) => l.split(" ")[0]), ["embed", "insert", "remove", "embed", "insert", "remove", "patch", "link"]);
  assert.equal(log[2], `remove ${many.slice(0, 128).map((r) => r.replaces).join(",")}`);
  assert.equal(log[5], "remove old128,old129");
});

test("rows that are not usable are not embedded, and the versions they replace are removed first", async () => {
  const { log, deps } = recorder(vectors);
  const out = await applyPlan({ embed: [item("hidden", { usable: false, replaces: "old" }), item("fresh hidden", { usable: false })], remove: [], patch: [], link: [], unlink: [] }, deps);
  assert.deepEqual(out, { embedded: 0, tokens: 0, skipped: 2 });
  assert.deepEqual(log, ["remove old"]);
});
