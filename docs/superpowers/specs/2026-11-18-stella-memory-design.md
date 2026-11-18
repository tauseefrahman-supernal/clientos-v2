# Stella's memory: transcripts, call summaries and layered search

Date: 18 Nov 2026. Status: draft for Tauseef's approval.

## Why

AI strategists run several accounts each (Q4 target: 3 to 4 accounts, or $400K to $1M managed revenue per strategist). To do that they need a clear history of every account, and full context on the last month of calls, without reading transcripts themselves. Stella is the way they get it. Today she only sees the vault, the book and a one-line list of meetings; she cannot see what was said on a call. And her keyword search often takes several tries, and every try stays in her context for the rest of the answer.

## Goals

1. Every Granola and Fathom call for a project is pulled into ClientOS, with its **full transcript kept** (all history, no expiry).
2. Every call gets a **brief summary of the whole call** (about 5 to 8 lines: what was decided, commitments and owners, risks, what changed).
3. Facts from calls are **filed into the project's vault** where a template has a place for them (stakeholders, scope, pricing, decisions, open items), marked with the call and date they came from.
4. Stella answers from **layers**, from the most digested to the raw transcript, and only goes deeper when she has to. Recent calls rank first by default; older ones are searched when the question is about the past or recent results are thin.
5. Stella's cost per answer stays flat as the archive grows.

## Non-goals

- No change to how strategists edit the vault, approve documents or run workflows.
- No new place for transcripts outside ClientOS (no separate mempalace or vector service). Everything lives in the Client OS Supabase project.
- No Slack, Drive or Linear ingestion in this piece of work.

## Anti-goals (a failure even if it works)

- Stella reads whole transcripts to answer ordinary questions.
- Personnel matters (performance reviews, compensation, departures, personal 1:1s) end up stored or searchable.
- A strategist sees calls from a project their role does not give them.
- Facts extracted from calls silently overwrite what a person wrote in the vault.
- ClientOS keeps showing a call that was deleted at the source.

## Decided (Tauseef, 18 Nov)

- Keep the full transcript of every call, all history.
- Keep a brief summary of the whole call for every call.
- Populate the vault from transcripts where possible.
- Strategists want full context on the last 30 days of calls; older calls are history.
- Sources: the Fathom API key (checked 18 Nov: team-wide, 17 recorders, 600+ calls since June) and the Granola API key (checked: 576 notes from 15 owners since March, including everyone's Team Space notes). Both keys are in `.env.local`, which only Tauseef edits.

## Approaches considered

1. **Supabase, inside ClientOS (chosen).** Transcripts in `clientos.transcripts.body`, search pieces in `clientos.chunks` (pgvector embeddings plus Postgres full-text), one hybrid search query that filters by project, date, role and sensitivity. Deploys with the app, keeps the existing access rules, small and cheap at this scale (about 250 MB today, plus about 280 MB a year).
2. **mempalace sidecar, as in RIC OS.** Quick to try on Tauseef's Mac, but cannot deploy with ClientOS for Jaime and Sven, and sits outside ClientOS's hidden, sensitive and role filters. Rejected.
3. **Store nothing, fetch transcripts live from Granola and Fathom.** Least data held, but slow, rate-limited (Fathom limits were hit during the 18 Nov pull) and no search across what was said. Rejected; kept only as a fallback for a call whose transcript failed to import.

## How it works

### 1. Ingest (a sync job)

- Lists new and changed calls from both APIs since the last run. Runs on demand from the admin page at first; a daily schedule later.
- **Matches each call to projects** the way the 18 Nov recordings lists were built (`data/transcripts/_SPEC.md`): client name and variants, client contacts' emails and domains, project keywords. One call can belong to several projects (kind `multi`). Calls that match no project are kept unassigned and not searchable until a strategist assigns them.
- **Merges duplicates**: the same meeting in Granola and Fathom becomes one call (Granola preferred, Fathom link in `alt_url`), matched by title and start time within a few minutes, or shared attendees.
- **Screens out personnel matters before anything is stored**: a classifier pass (Stella, cheap model) marks a call `personnel` from its title and summary; those calls are recorded as a title-only row with no body, no chunks, and are never shown. A strategist can override in either direction.
- **Deletions**: a call that no longer exists at the source is marked gone and handled as set out under "Settled after the builder check".
- Stores the transcript in `transcripts.body`, speaker-labelled, with timestamps where the source has them.

### 2. Digest (per call, once)

- **Call summary**: 5 to 8 lines in Stella's own words. Stored in `transcripts.summary` (replaces today's one-liner; the one-liner moves to a new `headline` column for the Recordings list).
- **Vault facts**: Stella reads the call against the project's vault templates and proposes additions to specific files and sections. Each addition is tagged `from call: <title>, <date>` with a link. Additions go into the file as **pending** (shown highlighted, like a suggested edit) until a strategist accepts or rejects; accepted facts become ordinary vault content. Nothing a person wrote is replaced: if a call contradicts the vault, the proposal says so and shows both.
- Runs on the default Stella model for summaries and facts; cost is roughly a few cents per call. Backfill of the ~1,500 existing calls is a one-off run Tauseef starts and approves the estimate for first.

### 3. Index

- **Chunking**: transcripts split on speaker turns into pieces of about 1,200 characters with a small overlap; each piece keeps its call id, date, speakers and project ids. Vault files, book chapters and call summaries are chunked too, so one search covers all layers.
- **Embeddings**: Voyage (`voyage-3.5` or `-lite`, 1024 dimensions, matching the existing `vector(1024)` column). Needs a `VOYAGE_API_KEY` in `.env.local` (Tauseef adds it). Under $1 to embed today's archive.
- **Schema changes**: `chunks` gains `layer` (`vault`, `summary`, `transcript`, `chapter`), `met_at`, `speakers`, and a join table `chunk_accounts` for calls that belong to several projects; HNSW index on `embedding`; `transcripts` gains `headline`, `personnel`, `status` (`pending`, `digested`, `failed`), `synced_at`.

### 4. Retrieval: how Stella finds things

Layers, cheapest first:

| Layer | What | How Stella gets it |
|---|---|---|
| 1. Project header | Stage, owners, this week, a 10-line digest of the last 30 days of calls | Always in her (cached) instructions |
| 2. Vault | Curated facts | `search_context` (layer `vault`) |
| 3. Call summaries | The timeline of every call | `search_calls` with `depth: "summaries"` |
| 4. Transcript passages | Exact words | `search_calls` with `depth: "transcripts"` |

- **One hybrid query** (pgvector similarity plus full-text, fused) with filters in SQL: project ids the user may see, `usable`, layer, date range, speakers.
- **Recency by default**: ranking leans to recent calls (score decays with age, half-weight at about 60 days) unless Stella passes an explicit date range. Current-state questions land on recent calls without extra steps.
- **Escalation rule** in her instructions: answer from the highest layer that is enough; go to summaries when the vault is silent or stale; go to transcripts for exact wording, who said what, or when summaries are vague; widen the date range when the question is historical ("when did", "why did they", "first time") or when results are thin. Every result carries its date and match strength so she can see thin results.
- **Newer wins**: when sources disagree, she reports the newer one and names the change and date.
- **Small results**: 6 passages per search by default, each about 600 characters, with call title, date, speakers and link. `read_call` returns one call's summary, or a window of the transcript around a passage, never the whole transcript unless the strategist asks.
- **Budget**: at most about 8 tool calls per answer; results older than the last few tool steps are cleared from her context as she works.
- The keyword search in `lib/stella/corpus.ts` is replaced by this query.

### 5. Access

- Transcripts, summaries and chunks follow the existing role rules (`lib/auth/access.ts`): a strategist sees calls of projects they are assigned to or their role covers. Multi-project calls are visible if any of their projects is.
- The Recordings tab shows the call headline, the summary and the link; the transcript opens in a side panel for people who can see it.

## How we'll know it works

- **Retrieval evaluation**: 20 or more questions in `scripts/eval.mjs`, each with the layer it should end at and facts it must contain (examples: "Where are we with World Emblem?" ends at layers 1 to 3; "What did Randy say about pricing last week?" needs layer 4 within 7 days; "When did cycle-fill first come up for RxVIP?" needs layer 4 across all dates). Measures right answer, layer reached, tool calls and tokens.
- **Cost**: tokens per answer on the evaluation set before and after; target is the same or lower than today despite the larger archive.
- **Safety checks** in `npm run test:live`: a strategist cannot retrieve another project's chunks; personnel calls never appear; a deleted source call disappears after sync.

## Left to the builder

- Exact chunk size and overlap, the score fusion formula and the recency curve (tune against the evaluation).
- Which model runs the personnel screen and the digest, within the per-call cost above.
- Admin page layout for sync runs and pending vault facts.
- Order of work, provided ingestion with the personnel screen lands before anything is embedded.

## Settled after the builder check

### Tauseef's answers (18 Nov)

- **Calls that cover several projects: one copy, whole call visible.** `transcripts` becomes one row per call with a `transcript_accounts` join table (replacing the per-project copies and the `(account_id, provider, external_id)` key). A strategist who can see any of the call's projects sees the whole transcript and summary. These are mostly internal Supernal meetings strategists attend anyway. Each project link keeps its own one-line headline ("RxVIP part: …") for that project's Recordings list; the 5 to 8 line summary is per call. Vault facts from such a call are proposed only to the projects they are about.
- **Mixed calls: cut the personnel part, keep the rest.** Before storage, the screen finds personnel stretches (performance, compensation, departures, personal matters) and removes them from the body, leaving a marker such as `[personnel section removed, 4 min]`. A call that is entirely personnel is kept as a title-only row with no body or chunks.

### Builder's calls (Tauseef can change any of these)

- **Personnel and private-data screen.** It also covers the private details of a client's own customers (for example a client family's estate, per `_SPEC.md`), with the same cut-and-mark treatment. It reads the transcript itself, plus the source's summary where there is one, before anything is stored. If it can't run, it fails safe: the call waits as `pending` and nothing is stored. Only admins can see a screened call and override it. Overriding to "not personnel" re-fetches the body from the source. Overriding to "personnel" deletes the body, chunks and any vault facts taken from it.
- **Calls that disappear from the API.** A call missing on the next sync (un-shared, owner left, or deleted) is not wiped. It is marked `gone_at_source`, hidden from search after 14 days, and listed for an admin, who can delete it for good or keep it. History is never lost to someone leaving.
- **Manual choices win.** A strategist assigning or unassigning a call, or an admin overriding the screen, is stored as an override that every later sync respects.
- **Match rules per project.** A new `match_rules` table per project holds keywords, name variants, contact emails and domains. It is seeded from the `searched` arrays in `data/transcripts/*.json` and from Account OS stakeholders, and strategists can edit it. A cheap model call decides whether a multi-account meeting gives a project enough attention to count, as the 18 Nov lists did by hand.
- **The JSON import retires for recordings.** The 18 Nov recordings lists become the seed for the first sync; after that `importToDb` stops touching `transcripts` (it currently deletes and re-inserts them). `chunks.owner_id` gets a real foreign key with cascade delete, so chunks never point at nothing.
- **Pending vault facts live in their own table** (`vault_suggestions`: project, file, section, text, source call, date, status), not in the file text. Strategists on the project accept or reject them in the file view, shown like suggested edits. Accepting writes them into `vault_files.content` as a normal versioned save. Stella can search pending facts but must label them unconfirmed. The book and exports leave them out.

## Open for Tauseef

None.
