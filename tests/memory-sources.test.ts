import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeFathom, listFathom, fetchFathomTranscript, hmsToSeconds } from "../lib/memory/sources/fathom.ts";
import { normalizeGranola, listGranola, fetchGranolaTranscript } from "../lib/memory/sources/granola.ts";
import { fetchTranscript } from "../lib/memory/sources/index.ts";

const load = (name: string) => JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8"));
const isIso = (s: string) => !Number.isNaN(Date.parse(s)) && /^\d{4}-\d{2}-\d{2}T/.test(s);

type Reply = { status: number; body?: unknown };
/** A fake fetch that answers from a queue and records the URLs and headers it was called with. */
function fakeFetch(replies: Reply[]) {
  const calls: { url: string; headers: Record<string, string> }[] = [];
  const fn = async (url: string, init?: { headers?: Record<string, string> }) => {
    calls.push({ url, headers: init?.headers ?? {} });
    const r = replies.shift();
    if (!r) throw new Error("unexpected fetch");
    return { ok: r.status >= 200 && r.status < 300, status: r.status, json: async () => r.body, text: async () => "secret body" };
  };
  return { fn, calls };
}

// ---------------- Fathom normalize

test("normalizeFathom maps the fixture", () => {
  const raw = load("fathom-meeting.json");
  const c = normalizeFathom(raw);
  assert.equal(c.provider, "fathom");
  assert.equal(c.externalId, "123456789");
  assert.ok(isIso(c.metAt));
  assert.equal(Date.parse(c.metAt), Date.parse(raw.recording_start_time));
  assert.equal(c.title, "<title>");
  assert.equal(c.url, raw.share_url);
  assert.equal(c.turns?.length, raw.transcript.length);
  assert.deepEqual(c.turns?.[0], { speaker: "<display_name>", start: 83, text: "<text>" });
  assert.equal(c.sourceSummary, "");
});

test("normalizeFathom: participants are invitees plus recorder, deduped by email", () => {
  const raw = load("fathom-meeting.json");
  raw.calendar_invitees = [
    { name: "Ann", email: "ann@a.com" },
    { name: "Bob", email: "BOB@b.com" },
    { name: "Ann again", email: "ann@a.com" },
  ];
  raw.recorded_by = { name: "Bob", email: "bob@b.com" };
  const c = normalizeFathom(raw);
  assert.deepEqual(c.participants, [{ name: "Ann", email: "ann@a.com" }, { name: "Bob", email: "BOB@b.com" }]);
});

test("normalizeFathom: metAt falls back recording -> scheduled -> created; summary markdown object", () => {
  const raw = load("fathom-meeting.json");
  raw.recording_start_time = null;
  raw.scheduled_start_time = "2026-11-10T09:00:00Z";
  raw.default_summary = { template_name: "general", markdown_formatted: "## Summary\nok" };
  delete raw.share_url;
  let c = normalizeFathom(raw);
  assert.equal(c.metAt, "2026-11-10T09:00:00.000Z");
  assert.equal(c.sourceSummary, "## Summary\nok");
  assert.equal(c.url, raw.url);
  raw.scheduled_start_time = null;
  raw.created_at = "2026-11-01T08:00:00Z";
  c = normalizeFathom(raw);
  assert.equal(c.metAt, "2026-11-01T08:00:00.000Z");
});

test("normalizeFathom: no transcript gives turns null", () => {
  const raw = load("fathom-meeting.json");
  delete raw.transcript;
  assert.equal(normalizeFathom(raw).turns, null);
  raw.transcript = [];
  assert.equal(normalizeFathom(raw).turns, null);
});

test("normalizeFathom rejects a meeting with no recording id", () => {
  const raw = load("fathom-meeting.json");
  delete raw.recording_id;
  assert.throws(() => normalizeFathom(raw));
  assert.throws(() => normalizeFathom(null));
});

test("hmsToSeconds", () => {
  assert.equal(hmsToSeconds("00:01:23"), 83);
  assert.equal(hmsToSeconds("01:00:05"), 3605);
  assert.equal(hmsToSeconds("02:03"), 123);
  assert.equal(hmsToSeconds("x"), null);
  assert.equal(hmsToSeconds(undefined), null);
});

// ---------------- Granola normalize

test("normalizeGranola maps the fixture", () => {
  const raw = load("granola-note.json");
  const c = normalizeGranola(raw);
  assert.equal(c.provider, "granola");
  assert.equal(c.externalId, "id_placeholder");
  assert.ok(isIso(c.metAt));
  assert.equal(c.metAt, "2026-11-17T15:00:00.000Z");
  assert.equal(c.url, raw.web_url);
  assert.equal(c.sourceSummary, "<summary_markdown>");
  assert.equal(c.turns?.length, raw.transcript.length);
  assert.deepEqual(c.turns?.[0], { speaker: "<name>", start: 0, text: "<text>" });
});

test("normalizeGranola never carries the owner's private notes", () => {
  const raw = load("granola-note.json");
  raw.private_notes_text = "PRIVATE-TEXT-SENTINEL";
  raw.private_notes_markdown = "PRIVATE-MD-SENTINEL";
  raw.summary_markdown = null;
  raw.summary_text = null;
  const json = JSON.stringify(normalizeGranola(raw));
  assert.ok(!json.includes("PRIVATE-TEXT-SENTINEL"));
  assert.ok(!json.includes("PRIVATE-MD-SENTINEL"));
  assert.ok(!json.includes("private_notes"));
});

test("normalizeGranola: turn starts are seconds from the first turn; speaker falls back to attribution then source", () => {
  const raw = load("granola-note.json");
  raw.transcript = [
    { text: "a", start_time: "2026-11-17T15:00:10Z", speaker: { source: "microphone", attribution: "Me", name: null } },
    { text: "b", start_time: "2026-11-17T15:01:40.500Z", speaker: { source: "speaker", name: "" } },
    { text: "c", start_time: "garbage", speaker: {} },
  ];
  const c = normalizeGranola(raw);
  assert.deepEqual(c.turns, [
    { speaker: "Me", start: 0, text: "a" },
    { speaker: "speaker", start: 90.5, text: "b" },
    { speaker: "Unknown", start: null, text: "c" },
  ]);
});

test("normalizeGranola: metAt from calendar start else created_at; summary_text fallback; participants deduped", () => {
  const raw = load("granola-note.json");
  raw.calendar_event = null;
  raw.created_at = "2026-11-02T10:00:00Z";
  raw.summary_markdown = null;
  raw.summary_text = "plain";
  raw.owner = { name: "Owner", email: "own@x.com" };
  raw.attendees = [{ name: "Ann", email: "ann@a.com" }, { name: "Own", email: "OWN@x.com" }];
  let c = normalizeGranola(raw);
  assert.equal(c.metAt, "2026-11-02T10:00:00.000Z");
  assert.equal(c.sourceSummary, "plain");
  assert.deepEqual(c.participants, [{ name: "Ann", email: "ann@a.com" }, { name: "Own", email: "OWN@x.com" }]);
  raw.calendar_event = { event_title: "Cal", invitees: [{ email: "new@n.com" }, { email: "ann@a.com" }], scheduled_start_time: "2026-11-03T10:00:00Z" };
  raw.title = null;
  c = normalizeGranola(raw);
  assert.equal(c.metAt, "2026-11-03T10:00:00.000Z");
  assert.equal(c.title, "Cal");
  assert.deepEqual(c.participants.map((p) => p.email), ["ann@a.com", "OWN@x.com", "new@n.com"]);
  assert.equal(c.participants[2].name, "new@n.com");
});

test("normalizeGranola: a listed note without transcript gives turns null", () => {
  const raw = load("granola-note.json");
  delete raw.transcript;
  assert.equal(normalizeGranola(raw).turns, null);
});

// ---------------- Fathom listing

test("listFathom pages with cursor, sends key and created_after, and includes transcripts", async () => {
  const m = load("fathom-meeting.json");
  const f = fakeFetch([
    { status: 200, body: { items: [m], next_cursor: "c2" } },
    { status: 200, body: { items: [{ ...m, recording_id: 2 }], next_cursor: null } },
  ]);
  const r = await listFathom("2026-11-01T00:00:00Z", null, { fetch: f.fn, key: "k" });
  assert.equal(r.rateLimited, false);
  assert.equal(r.cursor, null);
  assert.deepEqual(r.calls.map((c) => c.externalId), ["123456789", "2"]);
  assert.equal(f.calls[0].headers["X-Api-Key"], "k");
  const u0 = new URL(f.calls[0].url);
  assert.equal(u0.origin + u0.pathname, "https://api.fathom.ai/external/v1/meetings");
  assert.equal(u0.searchParams.get("include_transcript"), "true");
  assert.equal(u0.searchParams.get("created_after"), "2026-11-01T00:00:00Z");
  assert.equal(u0.searchParams.get("cursor"), null);
  assert.equal(new URL(f.calls[1].url).searchParams.get("cursor"), "c2");
});

test("listFathom on 429 returns calls so far and the cursor to resume from", async () => {
  const m = load("fathom-meeting.json");
  const f = fakeFetch([{ status: 200, body: { items: [m], next_cursor: "c2" } }, { status: 429 }]);
  const r = await listFathom(null, "c1", { fetch: f.fn, key: "k" });
  assert.equal(r.rateLimited, true);
  assert.equal(r.cursor, "c2");
  assert.equal(r.calls.length, 1);
  assert.equal(new URL(f.calls[0].url).searchParams.get("cursor"), "c1");
});

test("listFathom throws with the status but not the body; missing key throws", async () => {
  const f = fakeFetch([{ status: 500 }]);
  await assert.rejects(listFathom(null, null, { fetch: f.fn, key: "k" }), (e: Error) => /500/.test(e.message) && !/secret/.test(e.message));
  await assert.rejects(listFathom(null, null, { fetch: f.fn, key: undefined }), /FATHOM_API_KEY/);
});

test("fetchFathomTranscript returns turns, null on 404 or empty", async () => {
  const m = load("fathom-meeting.json");
  let f = fakeFetch([{ status: 200, body: { transcript: m.transcript } }]);
  const turns = await fetchFathomTranscript("123", { fetch: f.fn, key: "k" });
  assert.equal(turns?.length, 3);
  assert.equal(f.calls[0].url, "https://api.fathom.ai/external/v1/recordings/123/transcript");
  f = fakeFetch([{ status: 404 }]);
  assert.equal(await fetchFathomTranscript("123", { fetch: f.fn, key: "k" }), null);
  f = fakeFetch([{ status: 200, body: { transcript: [] } }]);
  assert.equal(await fetchFathomTranscript("123", { fetch: f.fn, key: "k" }), null);
});

// ---------------- Granola listing

test("listGranola pages with cursor/hasMore, drops deleted and filters by updated_at", async () => {
  const n = load("granola-note.json");
  delete n.transcript;
  const f = fakeFetch([
    { status: 200, body: { notes: [{ ...n, id: "a", updated_at: "2026-11-10T00:00:00Z" }, { ...n, id: "old", updated_at: "2026-10-01T00:00:00Z" }], hasMore: true, cursor: "g2" } },
    { status: 200, body: { notes: [{ ...n, id: "gone", deleted_at: "2026-11-11T00:00:00Z", updated_at: "2026-11-11T00:00:00Z" }, { ...n, id: "b", updated_at: "2026-11-12T00:00:00Z" }], hasMore: false, cursor: null } },
  ]);
  const r = await listGranola("2026-11-01T00:00:00Z", null, { fetch: f.fn, key: "gk" });
  assert.equal(r.rateLimited, false);
  assert.equal(r.cursor, null);
  assert.deepEqual(r.calls.map((c) => c.externalId), ["a", "b"]);
  assert.ok(r.calls.every((c) => c.turns === null));
  assert.equal(f.calls[0].headers.Authorization, "Bearer gk");
  const u0 = new URL(f.calls[0].url);
  assert.equal(u0.origin + u0.pathname, "https://public-api.granola.ai/v1/notes");
  assert.equal(u0.searchParams.get("page_size"), "30");
  assert.equal(new URL(f.calls[1].url).searchParams.get("cursor"), "g2");
});

test("listGranola with no since returns every live note; 429 returns the resume cursor", async () => {
  const n = load("granola-note.json");
  const f = fakeFetch([{ status: 200, body: { notes: [n], hasMore: true, cursor: "g2" } }, { status: 429 }]);
  const r = await listGranola(null, null, { fetch: f.fn, key: "gk" });
  assert.equal(r.rateLimited, true);
  assert.equal(r.cursor, "g2");
  assert.equal(r.calls.length, 1);
  assert.equal(r.calls[0].turns, null);
});

test("listGranola throws on other errors without the body; missing key throws", async () => {
  const f = fakeFetch([{ status: 401 }]);
  await assert.rejects(listGranola(null, null, { fetch: f.fn, key: "gk" }), (e: Error) => /401/.test(e.message) && !/secret/.test(e.message));
  await assert.rejects(listGranola(null, null, { fetch: f.fn, key: undefined }), /GRANOLA_API_KEY/);
});

test("fetchGranolaTranscript asks for the transcript and returns turns, null on 404", async () => {
  const n = load("granola-note.json");
  let f = fakeFetch([{ status: 200, body: n }]);
  const turns = await fetchGranolaTranscript("id_placeholder", { fetch: f.fn, key: "gk" });
  assert.equal(turns?.length, 3);
  assert.equal(f.calls[0].url, "https://public-api.granola.ai/v1/notes/id_placeholder?include=transcript");
  f = fakeFetch([{ status: 404 }]);
  assert.equal(await fetchGranolaTranscript("x", { fetch: f.fn, key: "gk" }), null);
});

test("fetchTranscript dispatches by provider", async () => {
  let f = fakeFetch([{ status: 200, body: { transcript: load("fathom-meeting.json").transcript } }]);
  assert.equal((await fetchTranscript("fathom", "9", { fetch: f.fn, key: "k" }))?.length, 3);
  assert.match(f.calls[0].url, /api\.fathom\.ai\/external\/v1\/recordings\/9\/transcript$/);
  f = fakeFetch([{ status: 200, body: load("granola-note.json") }]);
  assert.equal((await fetchTranscript("granola", "n1", { fetch: f.fn, key: "k" }))?.length, 3);
  assert.match(f.calls[0].url, /public-api\.granola\.ai\/v1\/notes\/n1\?include=transcript$/);
});
