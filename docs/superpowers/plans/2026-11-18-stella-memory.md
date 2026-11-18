# Stella's Memory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pull every Granola and Fathom call into ClientOS with its full transcript, write a call summary and suggested vault facts for each, and let Stella answer from layered, hybrid search instead of keyword search.

**Architecture:** A sync job lists calls from both APIs, merges duplicates, matches them to projects, cuts personnel and private stretches, and stores one row per call in `clientos.transcripts` linked to projects through `transcript_accounts`. A digest step writes the summary, per-project headlines and `vault_suggestions`. An index step chunks vault files, chapters, summaries and transcripts into `clientos.chunks` with Voyage embeddings. One SQL function (`clientos.search_chunks`) does hybrid search with access, layer, date and recency in the query. Stella's tools call it.

**Tech Stack:** Next.js 14 app router, TypeScript, Supabase Postgres with pgvector, `@supabase/supabase-js`, Anthropic SDK (`claude-opus-5-5` for Stella; a cheaper model for screen and digest), Voyage embeddings over HTTP, `node --test` with `--experimental-strip-types`.

**Spec:** `docs/superpowers/specs/2026-11-18-stella-memory-design.md`

## Global Constraints

- Never read, write or grep any `.env` file. Recursive greps carry `--exclude='.env*'`. Read variable names from code (`process.env.X`). New keys needed: `VOYAGE_API_KEY` (Tauseef adds it to `.env.local`). Existing: `GRANOLA_API_KEY`, `FATHOM_API_KEY`, `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- All service calls to Granola and Fathom are read-only.
- Ask Tauseef before any paid bulk run (screen, digest or embed of the backfill), showing the cost estimate first.
- Never run `next build` while the dev server runs (`docs/BUILD-LOG.md`, 14 Nov).
- Pure logic lives in modules without `import "server-only"`, so `node --test` can import them with a `.ts` extension, as `tests/formats.test.ts` does.
- Database changes go in `supabase/migrations/` and are applied to the Client OS project (`chgkhaxogaipafngvjqx`) only after Tauseef approves.
- Values pinned by the spec: summary 5 to 8 lines; chunks about 1,200 characters on speaker turns with a small overlap; embeddings 1024 dimensions; 6 passages per search by default, about 600 characters each; recency half-weight at about 60 days; at most about 8 tool calls per answer; gone-at-source calls hidden after 14 days; redaction marker `[personnel section removed, N min]`.
- User-facing copy is plain English, with no internal jargon.

## Review Focus

1. **Calls with no transcript yet** (Fathom still processing, a Granola note without a transcript): stored as `status = 'pending'` and retried next sync, never stored with an empty body as if digested. Test in Task 5.
2. **The same meeting recorded twice in Fathom by two people** (seen on 17 Nov: Darkroom x Breakr, Breakr x Supernal, Adam Hodson): merged into one call with the second link in `alt_url`. Test in Task 3.
3. **Rate limits mid-sync** (Fathom 429 during the 18 Nov pull): the sync stops cleanly, keeps what it stored, and resumes from its cursor next run. Test in Task 5.
4. **A person with no projects, and admins:** the search returns nothing for the former and everything for the latter. A strategist never gets a chunk from a call none of whose projects they can see. Test in Task 8.
5. **Very long calls** (three-hour workshops): chunking stays bounded, and `read_call` returns a window, never the whole body unless asked. Tests in Tasks 6 and 8.

---

## File Structure

```
supabase/migrations/20261119000000_stella_memory.sql   schema, data move, search function
lib/memory/types.ts        SourceCall, Turn, StoredCall, ChunkInput, SearchHit (pure)
lib/memory/sources/fathom.ts   list + transcript fetch, normalize (fetch is server-side; normalize pure)
lib/memory/sources/granola.ts  same for Granola
lib/memory/match.ts        mergeDuplicates, matchCall (pure)
lib/memory/screen.ts       applyCuts (pure) + screenCall (model call)
lib/memory/plan-sync.ts    planSync (pure: what to insert, update, mark gone)
lib/memory/sync.ts         runSync (server: orchestrates, writes the database)
lib/memory/digest.ts       digestCall (model call), estimateCost (pure)
lib/memory/chunk.ts        chunkTurns, chunkText (pure)
lib/memory/embed.ts        embed (Voyage), indexPending (server)
lib/memory/search.ts       recencyWeight, callWindow (pure) + searchChunks (server)
lib/stella/agent.ts        tools, rules, header (modified)
lib/stella/corpus.ts       keyword search removed; listSources/readSource kept for vault files
app/api/admin/memory/route.ts   POST sync | digest | index, with estimates
app/admin/memory/page.tsx  sync runs, screened calls, gone calls, match rules
components/project/ArtifactGallery.tsx   recordings show headline, summary, transcript panel
components/project/VaultSuggestions.tsx  accept or reject suggested facts in the file view
lib/data/db.ts             importToDb stops writing transcripts; seeds match_rules
tests/memory-*.test.ts     unit tests per pure module
eval/questions.json, scripts/eval.mjs   layer questions and scoring
app/api/admin/selftest/route.ts   live safety checks
```

---

### Task 1: Schema, data move and search function

**Files:**
- Create: `supabase/migrations/20261119000000_stella_memory.sql`
- Create: `lib/memory/types.ts`

**Interfaces:**
- Produces tables: `clientos.transcripts` (one row per call: `id, provider, external_id, title, met_at, participants, speakers jsonb, summary, body, alt_url, url, kind, status ('pending'|'digested'|'failed'|'personnel'), cuts jsonb, gone_at timestamptz, synced_at, pulled_at`, unique `(provider, external_id)`); `clientos.transcript_accounts (transcript_id, account_id, headline, source ('auto'|'manual'), primary key both)`; `clientos.transcript_overrides (transcript_id, account_id null, action ('assign'|'unassign'|'personnel'|'not_personnel'), by, at)`; `clientos.match_rules (account_id, kind ('keyword'|'email'|'domain'), value, source ('seed'|'accountos'|'manual'))`; `clientos.vault_suggestions (id, account_id, file_path, section, text, transcript_id, met_at, status ('pending'|'accepted'|'rejected'), decided_by, decided_at)`; `clientos.sync_state (provider primary key, cursor, last_run_at, last_error)`.
- `clientos.chunks` gains `layer ('vault'|'chapter'|'summary'|'transcript')`, `met_at`, `speakers text[]`, `seq int`; `owner_id` gets a foreign key with cascade per owner type (transcripts via a `transcript_id` column; vault files via `vault_file_id`; chapters via `chapter_id`). New `clientos.chunk_accounts (chunk_id, account_id)`, an HNSW index on `embedding vector_cosine_ops`, and the existing GIN full-text index kept.
- Produces SQL function `clientos.search_chunks(q_embedding vector(1024), q_text text, account_ids uuid[], layers text[], since timestamptz, until timestamptz, speakers text[], k int) returns table(chunk_id uuid, transcript_id uuid, account_id uuid, layer text, label text, body text, met_at timestamptz, speakers text[], score real)`. Reciprocal-rank fusion of vector and full-text ranks, multiplied by the recency weight `power(0.5, age_days / 60.0)` only when both `since` and `until` are null; filters `usable`, the layers, the date range, speakers overlap and `account_ids` through `chunk_accounts`.
- `lib/memory/types.ts` exports `Turn { speaker: string; start: number | null; text: string }`, `SourceCall { provider: "granola" | "fathom"; externalId: string; title: string; metAt: string; participants: { name: string; email: string | null }[]; url: string; sourceSummary: string; turns: Turn[] | null }`, `Layer = "vault" | "chapter" | "summary" | "transcript"`, `SearchHit { chunkId: string; transcriptId: string | null; slug: string; layer: Layer; label: string; excerpt: string; metAt: string | null; speakers: string[]; score: number }`.

- [ ] **Step 1: Write the migration.** Order: new tables; move existing per-project `transcripts` rows into one row per `(provider, external_id)` plus `transcript_accounts` rows carrying each old row's `summary` as `headline`; drop `transcripts.account_id` and the `(account_id, provider, external_id)` key; add the unique `(provider, external_id)`; alter `chunks`; create `search_chunks`; enable RLS on new tables with no anon policies (service role only, matching the other `clientos` tables).
- [ ] **Step 2: Dry-run it on a Supabase branch** (`create_branch` with the Supabase tools, apply, then `execute_sql`): `select count(*) from clientos.transcripts` equals the count of distinct `(provider, external_id)` before the move, and `select count(*) from clientos.transcript_accounts` equals the old row count. Expected: both match. Delete the branch.
- [ ] **Step 3: Ask Tauseef to approve applying it to Client OS**, then apply with `apply_migration` named `stella_memory`.
- [ ] **Step 4: Update `lib/data/db.ts` `loadFromDb`** to read recordings through `transcript_accounts` (headline per project, summary per call), and stop `importToDb` from deleting or inserting `transcripts`. Instead it upserts `match_rules` rows (`source = 'seed'`) from each `data/transcripts/<slug>.json` `searched` array. It also adds client contact emails and domains (`source = 'accountos'`) from the Account OS stakeholders, when the Account OS keys are configured (skipped otherwise).
- [ ] **Step 5: Run `npm run typecheck && npm test && npm run test:live`.** Expected: all pass, and the Recordings tab still shows the same counts per project as on 18 Nov.
- [ ] **Step 6: Commit** `feat(memory): one row per call, project links, match rules, suggestions, hybrid search function`.

### Task 2: Source clients

**Files:**
- Create: `lib/memory/sources/fathom.ts`, `lib/memory/sources/granola.ts`
- Test: `tests/memory-sources.test.ts` with fixtures `tests/fixtures/fathom-meeting.json`, `tests/fixtures/granola-note.json`

**Interfaces:**
- Consumes: `SourceCall`, `Turn` from Task 1.
- Produces: `normalizeFathom(raw: unknown): SourceCall`, `normalizeGranola(raw: unknown): SourceCall` (pure); `listFathom(since: string | null, cursor: string | null): Promise<{ calls: SourceCall[]; cursor: string | null; rateLimited: boolean }>` and `listGranola(...)` with the same shape (server); `fetchTranscript(provider, externalId): Promise<Turn[] | null>`.

- [ ] **Step 1: Confirm the transcript endpoints with the real keys.** Extend the 18 Nov probe (`scratchpad/probe-meetings.mjs`) to fetch one transcript from each provider and print only its turn count and field names. Tauseef runs it with `node --env-file=.env.local`. Save the printed field names, with all text replaced by placeholders, as the two fixtures.
- [ ] **Step 2: Write failing tests:** `normalizeFathom(fixture)` returns `provider "fathom"`, a non-empty `externalId`, an ISO `metAt`, and `turns` whose length equals the fixture's entry count; `normalizeGranola(fixture)` likewise; a fixture with no transcript gives `turns: null`.
- [ ] **Step 3: Run `npm test`.** Expected: FAIL, module not found.
- [ ] **Step 4: Implement both modules.** Keys come from `process.env.FATHOM_API_KEY` and `GRANOLA_API_KEY`; an HTTP 429 returns `rateLimited: true` with the cursor to resume from, not a throw.
- [ ] **Step 5: Run `npm test`.** Expected: PASS.
- [ ] **Step 6: Commit** `feat(memory): Fathom and Granola source clients`.

### Task 3: Merging and matching

**Files:**
- Create: `lib/memory/match.ts`
- Test: `tests/memory-match.test.ts`

**Interfaces:**
- Produces: `mergeDuplicates(calls: SourceCall[]): (SourceCall & { altUrl: string | null })[]`; `matchCall(call: SourceCall, rules: Map<string, { keywords: string[]; emails: string[]; domains: string[] }>): { slug: string; strength: "strong" | "mention" }[]`.

- [ ] **Step 1: Write failing tests:**
  - a Granola and a Fathom call with the same title and starts 3 minutes apart merge into one Granola call with the Fathom URL in `altUrl`;
  - two Fathom recordings of "Breakr x Supernal" on 2026-11-17 by different recorders merge into one;
  - two "Daily standup" calls on different days do not merge;
  - a call with a `@worldemblem.com` participant is `strong` for `world-emblem`;
  - a "Weekly Pipeline Meeting" whose source summary mentions "RxVIP" once is `mention` for `rxvip`;
  - a call matching nothing returns `[]`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement.** Merge when the normalized titles are equal (or one contains the other) and the start times are within 10 minutes, or when the start times are within 10 minutes and at least 60% of participant emails are shared. Prefer Granola. Domain or email hits are `strong`; keyword hits in the title are `strong`; keyword hits only in the summary are `mention`.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** `feat(memory): merge duplicate recordings and match calls to projects`.

### Task 4: Personnel and private-data screen

**Files:**
- Create: `lib/memory/screen.ts`
- Test: `tests/memory-screen.test.ts`

**Interfaces:**
- Produces: `applyCuts(turns: Turn[], cuts: { from: number; to: number; reason: "personnel" | "private" }[]): Turn[]` (pure; indexes are turn indexes, inclusive); `screenCall(call: SourceCall): Promise<{ verdict: "clean" | "cut" | "personnel"; cuts: { from: number; to: number; reason: "personnel" | "private" }[] } | { verdict: "error" }>` (model call).

- [ ] **Step 1: Write failing tests:**
  - cutting turns 3 to 5 of a 10-turn call leaves 8 entries, with entry 3 being `{ speaker: "", text: "[personnel section removed, N min]" }`, where N comes from the cut turns' start times, rounded up, minimum 1;
  - a `private` cut uses `[private details removed, N min]`;
  - no cuts returns the turns unchanged;
  - overlapping cuts collapse into one marker.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement `applyCuts`; then `screenCall`** with the cheap model, given the numbered turns and the source summary. It returns JSON turn ranges for personnel matters (performance, compensation, departures, personal matters) and for private details of a client's own customers (the `_SPEC.md` rule). A whole-call personnel conversation returns `verdict: "personnel"`. Any API or parse failure returns `{ verdict: "error" }`; the caller treats that as do-not-store.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** `feat(memory): screen personnel and private stretches before storage`.

### Task 5: Sync job

**Files:**
- Create: `lib/memory/plan-sync.ts`, `lib/memory/sync.ts`, `app/api/admin/memory/route.ts`
- Test: `tests/memory-plan-sync.test.ts`

**Interfaces:**
- Consumes: Tasks 2, 3 and 4.
- Produces: `planSync(input: { incoming: (SourceCall & { altUrl: string | null; matches: { slug: string; strength: string }[] })[]; existing: { provider: string; externalId: string; goneAt: string | null; status: string }[]; overrides: { externalKey: string; slug: string | null; action: string }[]; listedInFull: boolean; now: string }): { upserts: ...; links: { externalKey: string; slug: string; source: "auto" | "manual" }[]; markGone: string[]; unGone: string[]; hide: string[] }`, where `externalKey = provider + ":" + externalId`; `runSync(opts: { since: string | null }): Promise<{ added: number; updated: number; pending: number; gone: number; rateLimited: boolean; log: string[] }>`.
- Route: `POST /api/admin/memory` with body `{ action: "sync" }`, admin only (`currentAccess().admin`), returns the `runSync` result.

- [ ] **Step 1: Write failing tests for `planSync`:**
  - a manual `unassign` override beats an automatic match;
  - a manual `assign` adds a link the matcher did not find;
  - an existing call absent from a full listing is marked gone with `now`;
  - a call gone for 15 days is in `hide`, and one gone for 13 days is not;
  - a gone call that reappears is in `unGone`;
  - an absent call is never marked gone when `listedInFull` is false (a rate-limited run);
  - a call with `turns: null` is upserted with status `pending`;
  - a `personnel` override keeps the row and drops any body.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement `planSync`; then `runSync`.** For each provider: read `sync_state.cursor`, list pages until done or rate-limited, and save the cursor after each page. Merge, match (rules from `match_rules`, overrides from `transcript_overrides`), screen each call with turns, then apply the plan. Store the body only for `clean` or `cut` calls (body = `applyCuts` output as speaker-labelled text, `cuts` saved). `error` keeps the call `pending` with no body. `personnel` stores a title-only row with status `personnel`. Only `strong` matches link automatically; `mention` matches go through one cheap model call ("is this project a substantial topic of this call?") before linking as `multi`.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Run one sync for World Emblem calls from 1 to 17 Nov only** (`since` set, matching restricted to `world-emblem`). Ask Tauseef first: it includes screen calls. Expected: the calls appear with bodies, no personnel text, and links only to `world-emblem` or the multi projects.
- [ ] **Step 6: Commit** `feat(memory): sync calls from Granola and Fathom into ClientOS`.

### Task 6: Chunking and embeddings

**Files:**
- Create: `lib/memory/chunk.ts`, `lib/memory/embed.ts`
- Modify: `app/api/admin/memory/route.ts` (adds `action: "index"`)
- Test: `tests/memory-chunk.test.ts`

**Interfaces:**
- Produces: `chunkTurns(turns: Turn[], target = 1200, overlap = 150): { seq: number; text: string; speakers: string[] }[]`; `chunkText(markdown: string, target = 1200): { seq: number; text: string }[]`; `embed(texts: string[], kind: "document" | "query"): Promise<number[][]>` (Voyage, 1024 dimensions, batches of 128); `indexPending(): Promise<{ chunks: number; tokens: number }>`, which re-chunks any owner changed since its chunks were made (vault files, chapters, summaries, transcripts) and links each chunk to its owner's projects in `chunk_accounts`.

- [ ] **Step 1: Write failing tests:**
  - turns never split mid-turn unless a single turn exceeds 2 × `target`;
  - every chunk is at most 2 × `target` characters;
  - consecutive chunks share at most `overlap` characters;
  - each chunk lists the speakers in it;
  - a 3-hour fixture (generated as 900 turns of 150 characters) yields between 100 and 130 chunks;
  - `chunkText` splits on headings first, then paragraphs.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement `chunk.ts`, `embed.ts` and `indexPending`.** `usable` is false when the owner is hidden, archived, deleted, sensitive, `personnel`, or gone for more than 14 days. Stop and ask Tauseef if `VOYAGE_API_KEY` is missing.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Index the World Emblem calls from Task 5 plus all vault files and chapters.** Expected: `select layer, count(*) from clientos.chunks group by layer` shows all four layers.
- [ ] **Step 6: Commit** `feat(memory): chunk and embed vault, chapters, summaries and transcripts`.

### Task 7: Digest (summary, headlines, suggested facts)

**Files:**
- Create: `lib/memory/digest.ts`, `components/project/VaultSuggestions.tsx`
- Modify: `app/api/admin/memory/route.ts` (adds `action: "digest"`, `action: "estimate"`), the vault file view under `app/projects/[slug]/`
- Test: `tests/memory-digest.test.ts`

**Interfaces:**
- Produces: `estimateCost(calls: { chars: number }[]): { calls: number; inputTokens: number; dollars: number }` (pure, at 4 characters per token with the cheap model's price constants in the file); `digestCall(transcriptId: string): Promise<{ summary: string; headlines: Record<string, string>; suggestions: { slug: string; filePath: string; section: string; text: string }[] }>`; `decideSuggestion(id: string, accept: boolean, by: string): Promise<void>`, where accepting appends the text under its section through the existing `updateFile` in `lib/data/db.ts`, so a version is saved.

- [ ] **Step 1: Write failing tests:**
  - `estimateCost([{ chars: 40000 }, { chars: 80000 }])` returns `calls: 2`, `inputTokens: 30000`, and `dollars` greater than 0;
  - a `validateDigest(raw)` helper (export it) rejects a summary under 5 or over 8 lines, a suggestion whose `filePath` is not one of the project's vault paths, and a headline for a project the call is not linked to.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement.** `digestCall` reads the cut body and the project's vault file paths and section headings, and returns JSON that `validateDigest` checks. It writes the summary, sets the per-project `headline` on `transcript_accounts`, inserts suggestions as `pending`, and marks the call `digested`. The route's `digest` action requires `{ confirm: true, maxDollars }` and refuses if the estimate is over `maxDollars`. `VaultSuggestions` shows pending items under each section of the file view, highlighted, with Accept and Reject. Only people for whom `canAssign` is true see the buttons.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Digest the World Emblem calls from Task 5** (estimate shown to Tauseef first). Expected: summaries of 5 to 8 lines, and suggestions visible in the vault file view.
- [ ] **Step 6: Commit** `feat(memory): call summaries, project headlines and suggested vault facts`.

### Task 8: Retrieval and Stella's tools

**Files:**
- Create: `lib/memory/search.ts`
- Modify: `lib/stella/agent.ts` (tools, rules, header, budget), `lib/stella/corpus.ts` (remove `search` and `searchExpertise` keyword ranking; keep `listSources` and `readSource` for vault files)
- Test: `tests/memory-search.test.ts`

**Interfaces:**
- Consumes: `search_chunks` (Task 1), `embed` (Task 6).
- Produces: `recencyWeight(ageDays: number): number` (pure, `0.5 ** (ageDays / 60)`); `callWindow(body: string, around: string, chars = 3000): string` (pure); `searchChunks(opts: { slugs: string[]; query: string; layers: Layer[]; since?: string; until?: string; speakers?: string[]; k?: number }): Promise<SearchHit[]>` (server; empty `slugs` returns `[]`; maps slugs to account ids; excerpts trimmed to 600 characters).
- Stella's tools become:
  - `search_context { query, project?, limit? }`: layers vault and chapter;
  - `search_calls { query, project?, depth: "summaries" | "transcripts", since?, until?, speakers?, limit? }`;
  - `read_call { id, around? }`: the summary, or a `callWindow` around a passage; the whole body only when `full: true` and the strategist asked;
  - `search_expertise`: same signature as today, now on `searchChunks` across delivered projects the person can see;
  - `list_sources` and `read_source`: unchanged.

- [ ] **Step 1: Write failing tests:**
  - `recencyWeight(0) === 1` and `recencyWeight(60) === 0.5`, with `recencyWeight(180)` between 0.12 and 0.13;
  - `callWindow` on a 200,000-character body returns at most 3,000 characters containing `around`;
  - `callWindow` with `around` missing returns the first 3,000 characters.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement `search.ts` and change `agent.ts`:**
  - `scopeHeader` adds a 10-line "last 30 days" digest per project, built from that project's call headlines (no model call);
  - `RULES` gains the escalation rule from the spec, quoted: "answer from the highest layer that is enough; go to summaries when the vault is silent or stale; go to transcripts for exact wording, who said what, or when summaries are vague; widen the date range when the question is historical or results are thin. Newer sources win; name the change and its date. Label suggested vault facts as unconfirmed.";
  - stop the loop after 8 tool calls with a final answer turn;
  - enable Anthropic context editing that clears tool results older than the last 4 tool uses.

  Scope slugs are already filtered by `canSee` before `searchChunks`.
- [ ] **Step 4: Run `npm test && npm run typecheck`.** Expected: PASS.
- [ ] **Step 5: Add live checks to `app/api/admin/selftest/route.ts`:**
  - searching as a person with no assignments returns `[]`;
  - searching `world-emblem` content as a person assigned only to `rxvip` returns no World Emblem transcript chunks, except from calls also linked to `rxvip`;
  - no hit ever comes from a `personnel` call;
  - a call marked gone 15 days ago returns no hits.

  Run `npm run test:live`. Expected: all pass.
- [ ] **Step 6: Commit** `feat(stella): layered hybrid search over vault, summaries and transcripts`.

### Task 9: Screens for strategists and admins

**Files:**
- Modify: `components/project/ArtifactGallery.tsx` (recordings show headline, summary, a transcript side panel with cut markers visible)
- Create: `app/admin/memory/page.tsx` (last sync per provider, counts, Sync now; screened calls with override; gone calls with Keep or Delete; match rules per project with add and remove)
- Test: extend `tests/export-and-access.test.ts`

**Interfaces:**
- Consumes: Task 5 route actions; adds `POST /api/admin/memory` actions `override { transcriptId, slug?, action }`, `gone { transcriptId, keep: boolean }`, `rule { slug, kind, value, remove? }`, all admin-only except `override` with `assign` or `unassign`, which needs `canAssign` for that slug.

- [ ] **Step 1: Write failing tests** with a pure helper `canOverride(access: AccessLike, slug: string | null, action: string): boolean` (add it to `lib/auth/rules.ts`): an admin can do every action; a strategist on `rxvip` can `assign` or `unassign` on `rxvip` only; a member cannot `personnel` or `not_personnel`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement the helper, the route actions and both screens.**
  - The admin page also lists unassigned calls (no project links), so they can be assigned.
  - `not_personnel` re-fetches the body through `fetchTranscript`, screens it for private details only, and queues it for digest and index.
  - `personnel` deletes the body, the chunks and the call's pending suggestions.
  - The transcript panel loads the body only when opened. Copy is plain: "Sync now", "Removed for privacy", "No longer in Granola or Fathom".
- [ ] **Step 4: Run `npm test && npm run typecheck`, then check the screens in the running dev server.** Expected: tests pass; the Recordings tab shows summaries and opens transcripts; the admin page lists sync state.
- [ ] **Step 5: Commit** `feat(memory): recordings panel and memory admin page`.

### Task 10: Backfill, evaluation and build log

**Files:**
- Modify: `eval/questions.json`, `scripts/eval.mjs`, `docs/BUILD-LOG.md`

**Interfaces:**
- Consumes everything above.
- `eval/questions.json` entries gain `layer: "header" | "vault" | "summaries" | "transcripts"` and optional `within_days`.

- [ ] **Step 1: Add 20 questions** across World Emblem, RxVIP, Heritage, Breakr and Sunflower Wellness, at least 4 per layer, including the spec's three examples. Each has required facts taken from the stored summaries.
- [ ] **Step 2: Change `scripts/eval.mjs`** to read the deepest layer reached from tool summaries, and to report per question: facts found, layer reached versus expected, tool calls, input tokens.
- [ ] **Step 3: Run the evaluation on today's Stella** (before switching the tools, from the commit before Task 8) and save the baseline. Ask Tauseef first: about $0.10 to $0.30 a question.
- [ ] **Step 4: Run the full backfill:** sync all providers, then show Tauseef the estimate, then digest and index. Expected: about 1,500 calls, about 45,000 chunks, under $1 for embeddings plus the digest estimate.
- [ ] **Step 5: Run the evaluation again.** Expected: facts score at or above the baseline, input tokens per answer at or below the baseline, and layer reached matching the expected layer for at least 16 of 20 questions.
- [ ] **Step 6: Add a build-log entry** (what shipped, counts, evaluation numbers, the open items). Then commit `docs: Stella memory build log and evaluation`, and push.

---

## Added 18 Nov at Tauseef's request (scoping a new deal)

Today a strategist can't start scoping a new deal from ClientOS alone: the vault has no upload, and the scoping workflows read only vault files. Task 11 runs first (it depends on nothing above); Task 12 runs after Task 8.

### Task 11: Upload files to a project's vault

**Files:**
- Create: `lib/vault-upload.ts` (pure: `uploadKind`, `toMarkdown` for text kinds, `uploadTitle`), `app/api/vault/upload/route.ts`, `components/project/VaultUpload.tsx`
- Modify: `components/project/VaultView.tsx` (an "Upload files" button at the top of the vault), `lib/data/index.ts` only if `addDocumentFile` needs a `source` note
- Test: `tests/vault-upload.test.ts`

**Interfaces:**
- Consumes: `addDocumentFile(slug, group, title, content, by)` in `lib/data/index.ts` (the same path Stella's "Save to vault" uses); `currentAccess()`, `canSee` from `lib/auth`; the Anthropic SDK for PDF conversion.
- Produces: `uploadKind(name: string, mime: string): "markdown" | "text" | "csv" | "json" | "html" | "pdf" | null` (pure; null = refused); `toMarkdown(kind, name, text): string` (pure; csv becomes a markdown table up to 200 rows, json a fenced block, html stripped to text, text and markdown kept); `uploadTitle(name): string` (pure; file name without extension, tidied). `POST /api/vault/upload` (multipart: `slug`, `group`, one or more `file`) returns `{ saved: { name, path }[]; refused: { name, reason }[] }`.

- [ ] **Step 1: Write failing tests** for `uploadKind` (accepts .md, .txt, .csv, .json, .html, .pdf by extension or mime; refuses .docx, .png, .exe and empty names), `toMarkdown` (csv with quoted commas becomes a table with a header row; more than 200 rows ends with "… N more rows"; json is fenced; html loses tags and scripts), and `uploadTitle` ("Acme RFP v2.pdf" → "Acme RFP v2").
- [ ] **Step 2: Run `npm test`.** Expected: FAIL, module not found.
- [ ] **Step 3: Implement.** Limits match Stella's attachments: PDFs up to 6 MB, text kinds up to 300 KB; larger files are refused with a plain reason. The route checks `canSee(access, slug)` server-side and refuses otherwise (403). Text kinds go through `toMarkdown`. A PDF is converted to markdown with one `claude-opus-5-5` call (document block plus "transcribe this document to markdown faithfully; keep headings, lists and tables; do not summarise"); a refusal or error refuses that file with a reason, never saves an empty file. Each saved file starts with a line `Uploaded by <name> on <date> from <file name>.` and goes into the group the strategist picked (default: the first group). The button opens a file picker that accepts several files, shows progress and the saved/refused list, and refreshes the vault. Copy: "Upload files", "Saved to the vault", "Not uploaded: …".
- [ ] **Step 4: Run `npm test && npm run typecheck`,** then upload a markdown file and a small PDF on a test deal in the running dev server. Expected: both appear as vault files with content, and the deal's Work tab can run Sales intake against them.
- [ ] **Step 5: Commit** `feat(vault): upload files to a project's vault`.

### Task 12: Scoping workflows read the deal's calls

**Files:**
- Modify: `lib/data/runs.ts` (`runWorkflow` instructions and tool set), `lib/stella/agent.ts` only to export what the workflow runner needs
- Test: extend `tests/scoping.test.ts` with a pure `workflowBrief(workflow, inputs, callCount)` helper

**Interfaces:**
- Consumes: Task 8's `search_calls` and `read_call` tools and `searchChunks`.
- Produces: `workflowBrief(w: { name: string; inputs: string[] }, callCount: number): string` (pure) in `lib/data/runs.ts` or a new pure `lib/workflow-brief.ts`.

- [ ] **Step 1: Write failing tests:** with `callCount > 0` the brief tells Stella to search the project's calls (summaries first, transcripts for exact wording) as well as the vault files, and to cite calls by title and date; with `callCount === 0` it says there are no calls yet and marks call-dependent facts as gaps.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement.** `runWorkflow` counts the project's linked, usable calls, builds the brief with `workflowBrief`, and runs Stella with the Task 8 tools available and scoped to that one project. Same tool budget and context editing as Task 8.
- [ ] **Step 4: Run `npm test && npm run typecheck`,** then run Sales intake on a deal whose calls have synced. Expected: the draft cites at least one call by title and date.
- [ ] **Step 5: Commit** `feat(workflows): scoping workflows read the deal's calls`.

### Task 13: Evidence behind each answer, not inline citations

Tauseef, 18 Nov: Stella's chat answers should read cleanly, without a source label after every claim; each answer gets an **Evidence** toggle underneath that opens to show where each point came from. Runs after Task 6b (no dependency on the memory tasks; Task 8 later adds call sources to the same panel).

**Files:**
- Create: `lib/stella/evidence.ts` (pure: `splitEvidence`, `Evidence` type), `components/stella/EvidencePanel.tsx`
- Modify: `lib/stella/agent.ts` (`RULES` citation lines; stream events), `app/api/stella/route.ts` if it relays events, `components/stella/store.ts` (`ChatMessage.evidence?: Evidence[]`, persisted with the chat), `components/stella/ChatThread.tsx` (render the toggle under assistant messages)
- Test: `tests/stella-evidence.test.ts`

**Interfaces:**
- Produces: `type Evidence = { point: string; source: string; quote: string | null; ref: { kind: "file" | "chapter" | "call" | "project" | "attachment" | "other"; slug: string | null; id: string | null; at: string | null } }`; `splitEvidence(text: string): { answer: string; evidence: Evidence[] }` (pure).

**Decisions:**
- Chat answers carry no bracketed source labels in the prose. Stella ends every factual answer with one fenced block tagged `evidence` holding a JSON array: for each key point, the point in a few words, the source label exactly as the tool gave it, and a short quote (≤ 200 characters) from that source. The rule "a claim you cannot source does not go in the answer" stays.
- `splitEvidence` removes that block from the shown answer and parses it; a malformed or missing block leaves the answer intact and evidence empty (never shows raw JSON). While streaming, the UI hides text from the opening fence onward.
- `ref` is resolved server-side from the label against what the tools returned in that turn (file path → vault link, chapter → book link; Task 8 adds calls with a link to the recording and its date). Unresolved labels show as plain text.
- The toggle reads "Evidence (N)", collapsed by default, under each assistant message; each row shows the point, the source as a link when resolvable, and the quote. Answers with no evidence show no toggle.
- Documents written with `create_document` keep their current inline citations (they leave ClientOS and need sources on the page); only chat replies change.

- [ ] **Step 1: Write failing tests** for `splitEvidence`: a well-formed block is removed and parsed; text before and after the block is kept; a malformed block gives `evidence: []` and the answer without the raw block; no block gives the text unchanged; a quote over 200 characters is trimmed; an answer that still contains `[File …]` labels is left as is.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement** the rules change, `splitEvidence`, ref resolution, persistence and `EvidencePanel`.
- [ ] **Step 4: Run `npm test && npm run typecheck`, then `npm run test:live`** (its Stella check must still pass), then ask Stella a question in the running app. Expected: a clean answer and an "Evidence (N)" toggle that opens to sources with quotes.
- [ ] **Step 5: Commit** `feat(stella): evidence toggle under each answer instead of inline citations`.
