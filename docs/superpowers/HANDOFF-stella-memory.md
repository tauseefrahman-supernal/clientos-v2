# Handoff: Stella memory build (paused 18 Nov 2026)

Start here if you are picking this up in a new session (local or cloud).

- Spec: `docs/superpowers/specs/2026-11-18-stella-memory-design.md`
- Plan: `docs/superpowers/plans/2026-11-18-stella-memory.md` (Tasks 1–13, plus "Changes decided 18 Nov" at the end)
- Branch: `feat/stella-memory` (not merged to main). Run with superpowers:subagent-driven-development: one implementer per task, a review after each, then a final whole-branch review.
- The full working ledger is copied below ("Ledger"). It records every ruling, fix round and deferred minor item.

## Tauseef's decisions (binding)
- Keep every call's full transcript, screened before storage. The personnel screen cuts only an individual's performance/conduct, pay, health/family/personal life, unannounced departure, personal 1:1 matters, personal chatter, plus private details of a client's own customers. It keeps hiring/recruiting, staffing, training, org design and announced role changes.
- Summaries and suggested vault facts only for calls in the last 30 days (and new calls); older calls keep their headline and searchable transcript, summary on demand.
- Each summary ends with "N personnel sections were removed"; vault facts are dated statements.
- Stella's chat answers have no inline source labels; an "Evidence (N)" toggle sits under each answer. Documents keep inline citations.
- Recordings show the project's headline only; the detailed summary is behind a "Summary" toggle on summarised calls.
- Ask before any paid bulk run, with a full-request cost estimate and a cap on actual spend; offer a small sample first.

## State when paused
- Applied to Supabase "Client OS" (`chgkhaxogaipafngvjqx`): migration `stella_memory` (one row per call + `transcript_accounts`, match_rules, vault_suggestions, sync_state, chunk layers, `search_chunks`).
- Data: 1,218 calls, 77 with a screened transcript, 36 World Emblem calls digested; 3,394 search chunks; 152 pending suggested facts; nothing marked gone.
- Done and reviewed: Tasks 1–9, 11, 12, 13, the security hardening, rate-limit waits, eval prep.

## Next steps, in order
1. **Fix sync throughput.** A full-sync run re-lists Granola (578) and Fathom (to its rate limit, ~300–400) from the start each time, because the cursor is saved only when all of a page's calls are applied, and runs time out while screening — so only 2–16 transcripts get screened per run. Separate listing from screening: save listing progress per page as soon as rows are upserted (bodies may stay pending), and add a "process pending" action that fetches and screens stored pending rows within the time budget. Fathom rows have no stored recording id (needed for transcript fetch) — either store it (migration: ask Tauseef) or re-list by date window.
2. Resumable gone-detection (needs a column such as `listed_at`; migration — ask Tauseef first).
3. Finish the full sync → `index` → digest last 30 days (estimate first, ~$25) → fill the 8 TODO questions in `eval/layer-questions.json` → baseline eval on the pre-Task-8 code and the after eval (~$3 each; `node scripts/eval.mjs --set layer --dry` first).
4. Final whole-branch review → `docs/BUILD-LOG.md` entry → merge to main (ask first).

## Open with Tauseef
- `people.email` is empty for all 22 member rows, and sign-in linking is now email-only, so team members get no projects until their emails are filled in.
- Granola labels Randy as "Jim Kozel" on some World Emblem calls (speaker attribution at the source).

## Running it
- Never read or write `.env*` files. Variables the app reads (set them in the environment): `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `VOYAGE_API_KEY`, `GRANOLA_API_KEY`, `FATHOM_API_KEY` (check `process.env.*` uses in `lib/` for the full list).
- `npm test` (unit, no network), `npm run typecheck`, `npm run test:live` (needs a dev server on port 3100 and keys). Never run `next build` while the dev server runs.
- Admin actions: `POST /api/admin/memory` with `{action: "sync" | "index" | "estimate" | "digest" | "override" | "gone" | "rule", ...}` — see the route file for options (`preview`, `confirmFull`, `onlySlugs`, `since`, `rescreen`, `repairOnly`, `dryRun`, `confirm`, `maxDollars`, `transcriptIds`).

## Ledger
# SDD ledger — plan: docs/superpowers/plans/2026-11-18-stella-memory.md
Branch: feat/stella-memory (in place in main checkout; local env file + running Heritage agent live here). Base: ae99347.
Spec: docs/superpowers/specs/2026-11-18-stella-memory-design.md

## Pre-flight scan
| Pair / task | Produces vs consumes | Finding |
|---|---|---|
| T1→T2..T8 | types.ts SourceCall/Turn/Layer/SearchHit | consistent |
| T1→T8 | search_chunks returns account_id; SearchHit.slug | T8 maps id→slug; ok |
| T2→T5 | listX {calls,cursor,rateLimited}, fetchTranscript | consistent |
| T3→T5 | mergeDuplicates altUrl, matchCall strength | consistent |
| T4→T5 | screenCall verdicts clean/cut/personnel/error, applyCuts | consistent |
| T5 overrides | planSync keyed externalKey vs transcript_overrides keyed transcript_id | runSync maps; ok |
| T6 vs T7 | T6 Step5 expects all four layers incl. summary; summaries exist only after T7 digest | CONFLICT |
| T7→T9 | VaultSuggestions vs T9 personnel override deletes suggestions | consistent |
| T8 vs T10 | T10 baseline must run on pre-T8 commit | ok (checkout old commit) |
| T1 self | Step 2 dry run on a Supabase branch: branches replay migrations without prod data, so counts meaningless | CONFLICT |
| T1 self | Step 5 "same counts as 18 Nov": DB holds 15 Nov import; 18 Nov lists never imported, and T1 retires transcript import | CONFLICT |
| T2 self | Step 1 needs Tauseef to run probe | stop point |
| T5,T6,T7,T10 | paid runs / VOYAGE key | stop points |

Ruling: T6 Step 5 expects vault, chapter, transcript layers; summary layer verified in T7 Step 5 after digest + indexPending — summaries can't precede digest — cost if wrong: none.
Ruling: T1 dry run = migration inside BEGIN…ROLLBACK on Client OS via execute_sql with the count checks, after Tauseef approves; no branch (no data to check) — cost if wrong: brief locks.
Ruling: before applying T1 migration, run `npm run db:import` with the 18 Nov JSON from the pre-T1 code so the move carries the 18 Nov lists — cost if wrong: rows reloaded later by sync anyway.
Ruling: T1 split — implementer writes migration, types, db.ts (Steps 1,4) without applying; controller does dry run/apply with approval, then test:live.

## Progress
Note: Heritage JSON committed 551bbbb on branch (before T1 commits). T1 BASE for review = ae99347 but exclude 551bbbb: use 551bbbb as BASE.
Correction: commit order is ae99347 → 96c9e54 (T1) → 551bbbb (Heritage). T1 range = ae99347..96c9e54.
T1 implementer: DONE_WITH_CONCERNS 96c9e54. Live transcripts table is empty (0 rows) — pre-T1 import ruling stands. No Account OS client in repo → match_rules seeded from `searched` only. search_chunks null account_ids = all (admin). Review dispatched.
Pre-T1 import done 18 Nov (main checkout detached at ae99347, dev server on 3100 for Tauseef): DB transcripts per project match JSON (WE 351, heritage 202, rxvip 127...). Build work now in worktree /Users/tauseef/Supernal/ClientOS-v2/.worktrees/stella (branch feat/stella-memory). Main checkout stays detached for viewing until T1 is applied.
T1 review: Needs fixes. Important: (1) null account_ids = all projects; (2) HNSW filtered scan starves vector side.
Ruling: Account OS seeding in T1 Step 4 exempt — no Account OS client in v2 repo and data/pipeline.json holds no stakeholder emails; building a client is out of T1's scope — cost if wrong: weaker auto-matching for client emails until Account OS live sync lands (the next roadmap item). Parked for final review.
T1 fix round 1 includes cheap minors: coalesce merged fields, order transcript_accounts paging, lowercase keyword rules, chunk_accounts for transcript chunks derived from transcript_accounts.
Task 1: minor (deferred): chunks.layer nullable (make not null after backfill); recency uses now() (tests need fixed dates).
Task 1: fix round 1/5 (6 addressed, 0 open; commits 551bbbb..b9381fa). Re-review clean. Pre-apply live counts: 1173 rows, 1002 distinct calls. Awaiting Tauseef approval for dry run + apply.
T1 migration: dry run (BEGIN + raise exception) gave calls=1002 links=1173; rollback confirmed; applied as `stella_memory` with Tauseef's approval. test:live all pass on b9381fa (main checkout detached at b9381fa for dev server). Per-project link counts identical to JSON. db:import re-run to seed match_rules.
Task 1: complete (commits ae99347..b9381fa, review clean after 1 fix round)
Ruling: run T3 and T4 before T2 — they consume only types.ts; T2 waits on Tauseef running the transcript probe — cost if wrong: none.
T3 implementer DONE_WITH_CONCERNS 9b1a474 (thresholds: containment ≥8 chars; overlap 60% of smaller set). Review dispatched. T4 implementer dispatched in parallel (different files). Base for T4 = 9b1a474.
T3 review: Needs fixes — Important: participant-overlap merges solo-recorder calls / bridges groups. Fix round 1 sent with minors (turns carry-over, no-email dedupe, null guard, tests).
match_rules seeded: 194 rules across 15 projects; import left calls 1002 / links 1173 untouched.
Task 3: fix round 1/5 (5 addressed, 0 open; commits 9b1a474..21fa9d0). Re-review clean.
Task 3: complete (commits b9381fa..21fa9d0, review clean)
Task 3: minor (deferred): duplicates with differing titles and <2 shared emails no longer merge (intended trade-off).
T4 implementer DONE_WITH_CONCERNS 14e4433 (SDK 1.3.0 no temperature → output_config.format; long calls may exceed context and fail closed). Review dispatched.
T4 review: Needs fixes — Important: (1) 400-char per-turn truncation (my guidance) leaves text unscreened; (2) no bound/batching for very long calls. Ruling: guidance withdrawn; full text + 150k-char batching with global turn numbers. Fix round 1 sent with minors 3,5,6,7.
Carry to T5/T7: the source summary is never redacted; digest and summaries must be built from the screened body, never from call.sourceSummary; sourceSummary should not be stored for cut/personnel calls.
T4 fix round 1 committed dbeac9e; re-review dispatched. Open live check for T5 Step 5: confirm claude-haiku-5-5 accepts output_config.format JSON schema (else every screen fails closed).
Task 4: fix round 1/5 (5 addressed, 1 open — speaker not stripped of transcript tags; commits 14e4433..dbeac9e). Round 2 sent: unified sanitiser + clamp batch cuts to own range.
Task 4: minor (deferred): budget excludes title/summary length; batches run sequentially.
Task 4: fix round 2/5 (2 addressed, 0 open; commits dbeac9e..c191b91). Re-review clean.
Task 4: complete (commits 21fa9d0..c191b91, review clean after 2 rounds)
Task 4: minor (deferred): batch cut past its own `to` accepted (over-cut, not leak).
Ruling: probe not yet run, so T5 is split — 5a planSync (pure, tests) now; 5b runSync + route after T2 — planSync consumes only types — cost if wrong: none.
T5a review: Needs fixes — personnel content travels in plan; overrides on unlisted calls produce nothing. Ruling: belt and braces — T9 override route applies immediately AND planSync emits dropBodies/unlinks every run; add status "personnel". Round 1 sent.
Carry to T5b runSync: listedInFull false if either provider rate-limited (or call planSync per provider); the trial run with `since` must pass listedInFull false; unGone must clear any hidden flag.
User request 18 Nov (pending answer): wants vault upload + scoping from Granola. Proposed additions: vault upload button; workflows search the deal's calls. Awaiting go-ahead.
Task 5a: fix round 1/5 (4 addressed, 0 open; commits 004b9c8..c34b666). Re-review clean.
Task 5a: complete (commits c191b91..c34b666, review clean). T5b (runSync + route + trial run) waits on T2.
Carry to T5b: skip the mention model call for personnel calls / keys in dropBodies; write status "personnel" as title-only, delete chunks; apply dropBodies and unlinks every sync.
Now blocked: T2 needs Tauseef's probe run; T6 needs VOYAGE_API_KEY. Pure parts runnable meanwhile: T6 chunk.ts, T9 canOverride.
Ruling: T6 split — 6a chunk.ts (pure) now; 6b embed/indexPending after VOYAGE key — cost if wrong: none.
T6a review: Approved with Important: overlap inert on realistic turns. Ruling: overlap = tail of last turn(s) ≤150 chars at word/sentence boundary with speaker prefix; target counts fresh content only — keeps the 100–130 fixture band with real overlap. Round 1 sent.
Task 6a: minor (deferred): fence regex treats ``` and ~~~ alike; unclosed fence swallows doc (bounded).
Task 6a: fix round 1/5 (2 addressed, 0 open; commits ddb44ea..49c220c). Re-review clean.
Task 6a: complete (commits c34b666..49c220c, review clean). 6b (embed, indexPending, route) waits on VOYAGE key.
Ruling: while blocked, one dispatch builds the pure helpers of T7 (estimateCost, validateDigest) and T8 (recencyWeight, callWindow) with their tests — same shape, small, no I/O — cost if wrong: none.
Pricing (claude-api skill, cached 2026-11-03): haiku-5-5 $0.10/$0.50 per M (prompts ≤100K tokens; $0.50/$2.50 beyond); sonnet-5-5 $2/$10; opus-5-5 $4/$20. Structured outputs (output_config.format) supported on all models. Haiku 5.5 thinking is ON by default (adaptive, default effort medium) and non-default temperature 400s.
Ruling: digest model = claude-opus-5-5 (spec §2 "Runs on the default Stella model", few cents/call fits at $4/M); screen stays claude-haiku-5-5 (plan) — flag to Tauseef at the end.
Carry to T5b live check: screenCall on Haiku 5.5 — thinking tokens count toward max_tokens 4000; set output_config.effort "low" for the screen (in T5b or a T4 follow-up) so replies aren't cut off.
Pure T7/T8 helpers: complete (commits 49c220c..d04827b, review clean). Minors deferred: callWindow toLowerCase index drift; needle > chars returns > chars; validateDigest accepts missing headlines/suggestions (digestCall prompt must always supply them).
STATE 18 Nov: done T1, T3, T4, T5a, T6a, pure T7/T8. Blocked: T2 (probe run), T5b (after T2), T6b (VOYAGE key), T7 server + T8 server (after T6b embed), T9, T10. Pending user answer: vault upload + workflows read calls.
Tauseef 18 Nov: approved adding vault upload (Task 11) and workflows reading calls (Task 12) to the plan — committed d2abf29. Plan file of record is now the worktree copy (.worktrees/stella/docs/...). T11 runs now.
Out-of-scope finding: app/actions.ts server actions (saveFileAction, saveDocumentAction, setFileState...) don't check canSee/canAssign server-side — for final review.
T11 implementer DONE fa2d96d. Review: Needs fixes (small) — Important: raw SDK/API error text shown to users. Round 1 sent with minors 2–4, 9.
Task 11: minor (deferred): unclosed <script> body kept as text; formData parsed before access check; invalid group silently → group 0; uploadTitle strips short dotted suffixes; source saved as "stella".
Task 11: fix round 1/5 (5 addressed, 0 open; commits fa2d96d..4f55f8a). Re-review clean.
Task 11: complete (commits d2abf29..4f55f8a, review clean); browser check pending.
Task 11: minor (deferred): pdfConversionReady ignores ANTHROPIC_AUTH_TOKEN; NUL/surrogate entities pass; Next body-size limit may preempt 413 message.
Tauseef added VOYAGE_API_KEY 18 Nov. T6b dispatched (embed, indexPending w/ dryRun, route action index). Probe command re-sent to Tauseef.
Probe run by Tauseef 18 Nov: Fathom list?include_transcript=true returns transcript[] {speaker{display_name, matched_calendar_invitee_email}, text, timestamp "HH:MM:SS"}, default_summary, calendar_invitees, recorded_by, recording_id, share_url, url. Granola GET /v1/notes/{id}?include=transcript → transcript[] {text, start_time, end_time, speaker{source, attribution, name}}, summary_text/markdown, private_notes_*, deleted_at, attendees, calendar_event.scheduled_start_time, web_url. Fixtures (placeholders only; recording_id replaced) copied to worktree tests/fixtures (uncommitted; T2 implementer commits them).
Ruling for T2: never read or carry Granola private_notes_* (owner's private notes); deleted_at set → treat as absent from the listing (gone). Dispatch after T6b (no parallel implementers).
Tauseef 18 Nov: Task 13 evidence toggle added to plan (commit above). Queue: T6b → T13 → T2 → T5b.
Ruling: T13 implementer runs while T6b is in review — disjoint files (stella UI/agent vs memory/embed); each commits only its own files — cost if wrong: a commit collision to untangle.
T6b review: Needs fixes — Important: safety writes (personnel/unusable/unlink) only after all embedding; partial runs duplicate. Ruling: embed a one-line header per chunk (Call/File/Book) before the first paid run. Round 1 sent.
Task 6b: minor (deferred): seq-shift re-embeds rest of file; chapter re-import re-embeds all chapters (~142K chars) each import; bodyToTurns reads speakerless "Word: " as speaker; verify allowImportingTsExtensions with next build before merge (dev server must be stopped).
T13 implementer DONE 197dbef (evidence stored inside content as trailing block; not seen live). Review dispatched. T6b re-review running.
Task 6b: fix round 1/5 (5 addressed, 0 open; commits 51d1928..32b5433). Re-review clean.
Task 6b: complete (commits 4f55f8a..32b5433, review clean). Carry to T8: call splitHeader before bodyToTurns on stored bodies.
Task 6b: minor (deferred): `skipped` count repeats each run; empty project name in chapter header fallback; header adds a line past chunk budget.
T6 Step 5: dry run 2,029 chunks (vault 1,821, chapter 208), ~339K tokens; Tauseef approved the paid run 18 Nov; running on app checkout 32b5433.
T13 review: Needs fixes (small) — Important: evidence block leaks into failed run drafts (runs.ts). Round 1 sent with minors 3,4,5,7,8. Deferred: quote verification against tool text (Task 13 minor 6).
T6 Step 5 run FAILED cleanly: Voyage 429 — account has no payment method (3 RPM, 10K TPM). chunks table still empty. Asked Tauseef: add payment method (free tokens still apply) or slow run.
Task 13: fix round 1/5 (6 addressed, 0 open; commits 197dbef..14df77c). Re-review clean.
Task 13: complete (commits 32b5433..14df77c, review clean); live check pending.
Task 13: minor (deferred): FINAL_JSON misses final block when an earlier json block exists; brief flicker on bare ``` mid-line; quote verification.
T2 implementer DONE 1c2861d. Live checks pass on app at 14df77c (evidence toggle live for Tauseef).
T2 review: Needs fixes — Important: Fathom include_summary never sent; fetchTranscript null ambiguity / 429 throw. Round 1 sent with minors.
Carry to T5b: on 429 from fetchTranscript keep call pending, don't abort run; not_ready → pending, retry until N days old; 429 on first listing page returns cursor null = restart; persist `since` with cursor; Fathom created_after may miss late transcripts → use a lookback window (e.g. since − 3 days); Granola pages all history each sync.
Carry to T5b: Fathom may 404 while processing → treat 'gone' from fetchTranscript as final only after a grace period (e.g. 2 days after metAt).
Task 2: fix round 1/5 (7 addressed, 0 open; commits 1c2861d..1ae405a). Re-review clean.
Task 2: complete (commits 14df77c..1ae405a, review clean).
Task 2: minor (deferred): repeated cursor returns null (looks complete); all-digit strings read as seconds; skipped has no ids.
ID mismatch found: stored Fathom rows use the call id from url fathom.video/calls/<id> (e.g. 901312608); normalizeFathom uses recording_id (probe showed 204616658 — different id space). Granola ids match (note UUID).
Ruling for T5b: Fathom externalId = call id parsed from `url` (fallback share_url? no — fallback recording_id with a "rec:" prefix to avoid collisions); add optional `fetchId` on SourceCall carrying recording_id for transcript re-fetch; update normalizeFathom + tests in T5b. Seeded altUrl Fathom links (Granola rows) must be recognised when merging so a Fathom copy of a seeded Granola call doesn't create a new row.
T5b implementer DONE 09b3b28 (gone only on full listing; gone>2d → failed; first normal run screens all 1,002 over several runs). Review dispatched.
T5b review: Needs fixes — Important: stranded pending calls (cursor saved before apply); cross-run duplicates (+2 seeded pairs); personnel headlines still listed (Recordings query unfiltered); first full run marks gone blindly. Rulings: hold cursor until applied + retry pass for Granola pending rows; absorb by alt_url id / title+10min, fold seeded pairs; blank headlines + filter Recordings; preview mode required before first full run. Round 1 sent.
Task 5b: minor (deferred): per-process run guard; trial applies global dropBodies; mention link may attach to unscreened call; cursor per list call not per page.
Task 5b: fix round 1/5 (6 addressed, 1 new open — folds run on onlySlugs trial; commits 09b3b28..0f4fa39). Round 2 sent with minors (suggestions moved on fold; preview rejects onlySlugs/since; rekey log).
Task 5b: minor (deferred): fold not atomic (idempotent rerun); first huge full run re-lists each attempt; pre-fix stranded Fathom rows never retried.
Task 5b: fix round 2/5 (4 addressed, 0 open; commits 0f4fa39..0c1a869). Re-review clean.
Task 5b: complete (commits 1ae405a..0c1a869, review clean after 2 rounds). Step 5 trial awaits Tauseef approval.
Task 5b: minor (deferred): no tests for vault_suggestions move on fold or route 400 preview+onlySlugs.
Tauseef approved T5 Step 5 trial 18 Nov; app checkout at 0c1a869.
T5 Step 5 trial ran 18 Nov (210 s): granola 71 / fathom 77 listed since 1 Nov; 26 new, 15 updated; 41 with body (30 with cuts), 0 personnel, 0 pending; 6 mention links; nothing marked gone.
Screen stats (WE, 36 calls with body): 82 cuts, all 'personnel', 0 'private'; most calls 3–5 min cut; heaviest are "T3" FMDS meetings (15 cuts/22 min; 8 cuts/19 min incl. a 158-turn cut). Likely over-cutting staffing/operations talk — raise with Tauseef.
BUG found live: Granola REST ids are `not_…` public ids, seeded rows use web UUIDs → 20 duplicate rows created; url null on all 25 new Granola rows. Fix round 3 sent (same-provider rekey by title+15 min, repairOnly fold of the 20, store web_url).
Task 5b: fix round 3/5 (Granola id mismatch addressed; 1 new Important — ambiguous matches guessed; commits 0c1a869..4288b14). Round 4 sent (1:1 guard, body guard, fill-before-delete).
Ruling: rounds 4 resumes the same opus implementer rather than a fresh higher-tier one — findings are new issues surfaced by live data, not a stuck loop — cost if wrong: one more round.
Note: kept not_ rows have bodies but status pending — expected (digest sets digested in T7).
Screen sample shown to Tauseef (18 Nov T3): of 4 cuts only family chatter was personnel; recruiting KPIs/process, org design, announced role change were cut. Proposed narrowing; awaiting decision.
Tauseef approved narrowing the screen + re-screening WE calls (~$0.10) 18 Nov. Screen narrowing dispatched (task-4b). Rescreen option to be added to sync after round 4.
Task 4b (screen narrowing) def033c review: Needs fixes — precedence for named-person performance, unannounced removals, explicit tie-break. Round 1 sent.
Task 5b: fix round 4/5 (4 addressed, 0 open; commits 4288b14..9d2c371). Re-review clean. Running repairOnly on app checkout 9d2c371.
repairOnly ran 18 Nov: 23 folds (21 Granola web-UUID, 2 Fathom). Screen 4b round 1 committed cce8454; re-review dispatched.
Task 4b: fix round 1/5 (4 addressed; re-review clean with minors). Round 2 sent: 'unannounced departure' in tie-break; keep example for neutral work activity. Rescreen 841dd71 in review.
Task 4b: fix round 2/5 (2 addressed, 0 open; a8544c8). Re-review clean. Task 4b complete (commits 9d2c371..a8544c8 screen files). Minor deferred: substring pins only; "as announced" phrase trusted.
Rescreen 841dd71 review: Needs fixes — Important: no skip marker, re-runs never finish. Ruling: rescreenBefore via pulled_at. Ruling (spec-backed): not_personnel override ignores personnel verdict + personnel cuts but keeps private cuts, both paths. Round 1 sent.
Rescreen round 1 re-review: 1 open (personnel rows stamped on kept paths) — round 2 sent. WE has 0 personnel rows so the WE rescreen runs now on 8df24b2.
WE rescreen ran 18 Nov on 8df24b2 (222 s): 40 calls, cuts 84→94, marker-minutes 123→103 (markers round up to ≥1 min so short cuts inflate minutes), 0 personnel, 0 errors. 18 Nov T3: 8 cuts/19 min (incl 9-min HR-ODG block) → 7 short cuts (1 private, 6 personnel, each ≤13 turns, ≤1 min); recruiting KPIs now kept. Cuts are now short individual remarks, not big blocks.
Rescreen round 2 committed 047cc9b; re-review dispatched.
Rescreen: fix round 2/5 clean (047cc9b). Rescreen feature complete (commits a8544c8..047cc9b).
NEXT: T7 server (digestCall, decideSuggestion, VaultSuggestions UI, route digest/estimate) — digest model claude-opus-5-5 per ruling; carry: build summaries from screened body only, never sourceSummary for cut/personnel calls; digestCall prompt must always supply headlines + suggestions (validateDigest accepts missing). Then T8, T12, T9, T10. Voyage payment method still pending (index run blocked).
Voyage payment added by Tauseef 18 Nov. Index dry run: 3,358 chunks (vault 1821, chapter 208, transcript 1329), ~756K tokens (~$0.05). Running.
Index run 1 failed mid-way ("Supabase insert chunks: fetch failed") after vault 1821 + chapter 208 + transcript 19; run 2 (72 s) added 1,310 transcript chunks (446K tokens), kept 2,048. T6 Step 5 done for vault/chapter/transcript (summary layer after digest). Minor (deferred): insert batches of 128 vectors may be too large per request — consider 32 per insert.
T7 implementer DONE 9e8b24b; review dispatched.
T7 review: Needs fixes — Important: suggestions rendered as live markdown (exfiltration), section not cleaned; budget not enforced; no concurrent-run guard. Round 1 sent with minors 4–8. Out-of-scope check for final review: other ReactMarkdown renders of model/transcript text (Stella answers, recordings) — image/link exfiltration.
Task 7: fix round 1/5 (8 addressed; 1 new Important — image-strip bypass + section unstripped; commits 9e8b24b..9a0e64f). Round 2 sent: section char rejection, escape pass, VaultView blocks remote images. Minor deferred: bare URLs become clickable links after accept (click needed).
Carry to final/T8: Stella chat and book ReactMarkdown still load remote images — reuse SafeMarkdown (Stella answers include transcript-derived text after T8).
Task 7: fix round 2/5 clean (6d09801). Task 7 complete (commits 047cc9b..6d09801). Step 5 (WE digest) awaits estimate + approval.
Task 7: minor (deferred): bare URLs autolink after accept (click only); escaping shows backslashes inside code spans; strip fragments.
HARDENING task to schedule (after T8): suggestion text single paragraph (no newline/#/fence); escape call title in fromCallLine; SafeMarkdown in DocumentCard, ChatThread, FrameworkList, RunControl, LibraryView, book; untrusted links rendered as text in vault suggestions.
Tauseef approved WE digest 18 Nov: 36 calls, est $2.65, cap $3.00.
WE digest pass 1 (18 Nov): 23 calls digested, 0 failed, 98 suggestions; actual $3.53 vs est $2.65 for 36 — cap only checked estimate. Stopped. Tauseef reviewed samples: keep "N personnel sections were removed" line and dated-fact style; chose fix cost first (option 2). Cost fix dispatched: prompt caching of system+outline, slimmer outline, real-request estimate, cap on actual spend with in-flight reservation.
Cost fix 6003956 review: Needs fixes — warm-gate idles workers; aborted calls unbilled in gate; retries overshoot cap; outline filter drops live landing files (Weekly 11, Sales-Notes 7, Feature-Rationale 5...). Round 1 sent.
Cost fix round 1 clean (5cd1ea1). Task 7 + cost fix complete (6d09801..5cd1ea1). Minor deferred: failed retry undercounts attempt 2; thrown runDigest charged at estimate & not in remaining; no digestBatch loop test; abort test 100 ms margin.
Tauseef 18 Nov: digest only last 30 days (older calls keep one-liner + transcript search; on-demand later); finish WE 9 (~$1.30). Running WE remainder cap $2.
WE digest complete: 36/36, pass 2 $1.22 (avg $0.136/call). Plan updated with 18 Nov decisions.
Summary layer indexed (36). Plan decisions committed 6f8e857. T8 dispatched (search + tools + SafeMarkdown in Stella UI + selftest checks). Digest 30-day change in progress (same implementer as T7).
30-day digest change 3afb670: review Approved. Minor deferred: ids branch ignores since/onlySlugs as library call; UUID regex assumption (transcripts.id is uuid — ok); null met_at excluded; no count of out-of-window pending; candidates/route 400 untested.
T8 review: Needs fixes — selftest writes prod row; pending suggestions not filtered by call state (+ ensure personnel flip rejects pending suggestions). Access enforcement sound on all paths. Round 1 sent.
Task 8: fix round 1/5 clean (7753400). Task 8 complete (commits 3afb670..7753400). Minor deferred: recentCalls order on old PostgREST drops header digest; gone-14d invariant may fail until next index; pre-existing personnel calls' suggestions not retro-rejected (hidden at read); untested agent suggestion filter.
Memory saved 18 Nov (project + feedback_clientos_call_memory). Branch pushed to origin/feat/stella-memory at 7753400. App checkout at 7753400; test:live 16/16 pass. Next: T12.
T12 review: Approved with Important: count error → 'no calls' wording; decide route lacks access check (pre-existing). Round 1 sent incl. decide route canAssign.
Task 12: fix round 1/5 clean (ac4580e). Task 12 complete (commits 7753400..ac4580e). Step 4 (paid Sales intake on WE) pending — first live check of the count filter. Minor deferred: runProject ignores DB error (404, fails closed).
T9 review: Needs fixes — Important: strategist could assign any call by id to their project (read others' calls). Ruling: assign admin-only; unassign only for currently linked slug. Round 1 sent with minors.
Task 9: fix round 1/5 clean (8d03fc4). Task 9 complete (commits ac4580e..8d03fc4). Minor deferred: route.ts:130 comment says assign/unassign; apply-error wrap could turn NotThere into 500.
App checkout at 8d03fc4, test:live all pass. Hardening pass dispatched (SafeMarkdown everywhere + href filter, single-paragraph facts, escape call title, server-action access checks, new-route access audit). Then: T10 (full sync preview → confirm → index → digest 30 days ~$25 → eval), final whole-branch review, BUILD-LOG, merge.
Tauseef 18 Nov (screenshot): Recordings shows duplicate headline/summary and, for multi calls, another project's one-liner. Fix dispatched to T9 implementer: headline only; digested summary behind a 'Summary' toggle; summary not sent for undigested calls.
Hardening implementer DONE 3fb9356 (363 tests). Review dispatched. Recordings UI fix in progress (T9 implementer).
Recordings fix 5297b76 approved. Follow-up sent: read_call + summary-layer index only for digested calls; copy tweak.
Follow-up 3bf467b: read_call summary only for digested (callOverview tested); index already digested-only. Ruling: small, covered by unit test — folded into the final whole-branch review instead of a separate re-review — cost if wrong: caught at final review.
Hardening 3fb9356 review: Approved + Important: server-action errors masked in prod. Round 1 sent: return {error}, hide LibraryView approve for non-admins, personFor email-only linking (was first-name match), mailto no target. Deferred: proposeTemplate onlyAccount null on decline; addTemplateFile ignores onlyAccount; one flaky test run (352/1 fail, not reproduced).
Hardening round 1 committed 1281638 (367 tests); re-review dispatched. NOTE: people.email is empty for all 22 members — with email-only linking Jaime/Sven etc. won't get their projects until emails are filled. Ask Tauseef (don't guess first.last@).
Hardening: fix round 1 clean (1281638). Hardening complete (8d03fc4..1281638 incl. recordings follow-ups 5297b76, 3bf467b).
T10 preview 18 Nov (app 1281638): granola 578 listed; fathom rate-limited at 100 → incomplete; 147 new, 466 existing, 388 rekeys, 0 gone (not valid). Granola 578 vs 675 seeded rows → ~100 may be invisible to key. Fix dispatched: listers wait out 429 with Retry-After within deadline.
Rate-limit waits 41fc068+8a5865a approved. Minor deferred: junk Retry-After parsed as date (0 ms waits); no 1 s floor; NaN deadline; no fetch timeout. Re-running preview on app 8a5865a.
Tauseef approved full sync 18 Nov (~$2–3 screening, no gone marking). Running loop of confirmFull runs on app 8a5865a.
Full sync loop running (bg). T10 eval prep dispatched (layer-questions.json: 12 WE + 8 todo; eval.mjs --set layer, --dry). Pending: resumable gone-detection (needs migration: listed_at or similar — ask Tauseef); people.email for members (asked Tauseef); baseline eval needs pre-T8 server (do after sync).
T10 eval prep DONE 1d0e240. Note: Granola speaker labels mislabel Randy as 'Jim Kozel' on WE calls (attribution from Granola) — tell Tauseef; affects who-said answers.
Eval prep 1d0e240 approved; round 1 sent (lw-11 window, tighter must, separate columns, gitignore eval/results-*). Note: eval/results-*.json from 13–14 Nov exist untracked? check before final commit.
Eval prep round 1 c8e873f (379 tests). Small change, folded into final review (ruling as before). 5 old results files from 13–14 Nov remain tracked (baseline) — leave, mention in final summary.

## PAUSED 18 Nov (Tauseef asked to pause)
Full-sync loop stopped after run 2. DB now: 1,218 calls, 77 with screened body, 36 digested (WE), 0 personnel, 0 gone, 1,200 links, 3,394 chunks, 152 pending suggested facts.
PROBLEM found: each full-sync run re-lists Granola (578) and Fathom (to rate limit ~300–400) from the start because the cursor is only saved when all of a page's calls are applied, and runs time out screening — so only ~2–16 transcripts get screened per run. Fix next: separate listing from screening — (a) save listing progress/cursor per page as soon as rows are upserted (bodies may stay pending), (b) a "process pending" action that fetches+screens stored pending rows (Granola by id; Fathom needs recording id — store fetch_id: needs a migration or re-list) within the budget. Also resumable gone-detection (needs a listed_at-style column — migration, ask Tauseef).
Open with Tauseef: people.email empty for all 22 members (email-only linking); Granola mislabels Randy as "Jim Kozel" on some WE calls.
Remaining plan: fix sync throughput → finish full sync → index → digest last 30 days (~$25, estimate first) → fill 8 TODO eval questions → baseline (pre-T8 server) + after eval (~$3 each) → final whole-branch review → BUILD-LOG → merge.
Worktree HEAD c8e873f; app checkout detached at 8a5865a (dev server on 3100).
