# ClientOS v2: build log and strategy record

How ClientOS was redesigned into the Strategy Vault, what was decided and why, and how each piece was built. Covers 11 to 14 Nov 2026. Newest state first; history after.

## Where it stands (14 Nov 2026)

- **App:** `~/Supernal/ClientOS-v2`, Next.js 14 (App Router), port 3100, `npm run dev`. Not a git repo yet; nothing committed. Data is an in-memory store built from files in this repo; edits made in the app last until the server restarts or a source file changes.
- **Projects:** 9 accounts in delivery and 32 deals in sales/scoping (from Account OS). Four scoping deals are fully researched: IEC Colleges, Waterfall, Brill Building, Owner.com.
- **Stella:** works end to end with Tauseef's key (`claude-opus-5-5`, medium effort, streaming, citations). Full chat page at `/stella`; About page at `/stella/about`. **Evaluation (14 Nov): 34 of 38 on the first run, every answer cited; 38 of 38 after fixing data gaps.** Cost about $5.60 in total.
- **Code and database:** private GitHub repo https://github.com/tauseefrahman-supernal/clientos-v2 (his account cannot create repos in the Supernal-Technology org; transfer later). The `clientos` schema (18 tables, row-level security on, service role only) is applied to the existing Supabase project "Client OS" (`chgkhaxogaipafngvjqx`, beside `presales` and `we`) on 14 Nov.
- **Data on Supabase (14 Nov):** with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set, the app reads and writes the `clientos` schema (`lib/data/db.ts`): reads from a 15-second server copy, every edit written to the database first. Vault edits, visibility, approvals and Stella chats (`/api/chats`, saved by `/api/stella` after each answer) persist and are shared. `npm run db:import` copies the repo's research docs and seed files in, keeping edits made in the app. Without the keys it falls back to the repo files.
- **Not built yet:** live connectors (Account OS sync, Granola, Drive, Linear, Slack, Notion), workflows that actually run, team access for Jaime and Sven.

## The strategy, in Tauseef's words and decisions

1. **What ClientOS is.** The context layer per client project. Linear holds tasks, the Workbench shows them, ClientOS holds the context, Stella is the agent that reads transcripts plus structured context (positioning set 11 Nov). Goal: a strategist can carry more accounts (Q4 target 3 to 4 accounts or $400K to $1M managed revenue per strategist).
2. **Build on what exists.** A standalone shell prototype was rejected as "so off from the ClientOS structure". Everything since builds on the existing workbench: sidebar, project header, file tree, Stella.
3. **The standard vault stays the core.** Four groups, each holding its core templates: Sales Strategy, Deal Strategy, Technical Strategy, Delivery Strategy. "The core templates need to exist in the files, and then everything else can be built on top of that." Categories stay high level; data, integrations and the like live inside the core templates (for example Technical Strategy). Only what fits no core file becomes a new file for that project.
4. **Plain names.** The A1 to B5 numbering was dropped: files are called by what they are (Signal-Intake, Diagnostic-Discovery, Data-Layer...).
5. **Data loaded into the files.** Research about a client is written into its core files, not kept beside them.
6. **A book per project.** The project written as chapters a new teammate can read in 10 to 20 minutes, with sources.
7. **Templates grow through approval.** A strategist can propose a project's file as a template; status goes Local → Proposed → Shared → Standard in the Template Library.
8. **Cross-project expertise.** Every project has an industry and a squad (Origin, Polaris). Stella uses delivered projects in the same industry to help scope new ones.
9. **Sales projects are different.** Deals in scoping get the core templates and a scoping work structure (intake, research, discovery, concept, prototype, proposal, deal desk, order form). Stella scopes and drafts artifacts from context.
10. **Frameworks Stella reads** were refreshed from Notion: Context-Model, Supernal-Goals, Client-Journey (new), Product-Suite (Care and Concierge removed; Supernal's suite kept distinct from the client's own AI-native product), Offering-and-Commercials, Strat-Playbook. Removed: Deal-Room-Handoff (Dealroom is no longer a platform), the 5-Layer model, the old client-journey framework, Supernal-Pillars.
11. **Clean views.** Empty templates stay out of the sidebar until added; hide, archive and delete sit next to each file; filters on the project tables; organised Stella chats.

## Timeline

### 11 Nov: problem and first prototype
- PRD drafted in Claude Docs (https://claude.ai/artifact/Hy5nox6Gi6NFSA5fyzSywC, now stale): four surfaces (My week, Account page, Weekly loop, Scoping) over one account model.
- v1 prototype "ClientOS Weekly Workspace" (https://claude.ai/artifact/Y8jX2uxSEE6BZFaRwAqaCT, `~/ric-os/drafts/clientos-weekly-workspace.html`): World Emblem, then Hooray. Rejected direction (standalone shell) corrected to build on the workbench.
- Hooray read as a test case (Retainer + Order Form 1): 23 scoping files, about half restatement and contradicting each other on price, phase names and scope; 14 of 18 topics had moved since close. Vault exported with `~/Supernal/ClientOS/api-server/scripts/export-vault.ts`.

### 12 to 13 Nov: Strategy Vault prototypes
- v2 "ClientOS Strategy Vault" (https://claude.ai/artifact/4Hx9ihyPPeNC9PaoLLiV9A): adaptive vault per project, book, artifacts, template suggestions and approvals, cross-project reading; Hooray, World Emblem, Heritage.
- v3 "ClientOS App Prototype" (https://claude.ai/artifact/Jk5rKmVXEUmRSWKmKiJkJ6, built by `~/ric-os/drafts/clientos-app-src/build.py`): nine accounts, Overview / Book / Artifacts / Vault / Work pages, one-page Template Library, ⌘K search, collapsible sidebar and Stella. Approved: "Looks perfect for the better build."
- **Account research.** One context document per account (`docs/context/<slug>.md`, 14 sections per `docs/context/_SPEC.md`) built by research agents reading Account OS, Granola, Fathom, Linear, Drive, Slack and Notion, read-only. Accounts: World Emblem, Heritage, Hooray, Rafferty (deep), Breakr, Sunflower Wellness/ArcWell, RxVIP, Ethic Select, Super 73. Heritage was completed on 13 Nov with four late slices (2025 Fathom history, Drive order forms, the Linear points ledger, Slack/Notion), added as "(added 13 Nov)" subsections.

### 13 Nov: the real app (this repo)
Decisions: new repo (upload later), new `clientos` schema in the same Supabase project, no sign-off needed while prototyping, every connector credential will be provided, first testers Tauseef, Jaime, Sven. Plan in `docs/BUILD-PLAN.md`.

How it was built:
- **New repo for safety.** The old ClientOS repo carries the July 2026 supply-chain payload in its git history, so configs were written fresh and `scripts/scan-configs.mjs` scans config files for the payload's patterns before every `dev` and `build`.
- **Design system.** Supernal Source tokens in `app/globals.css`, shadcn kit in `components/ui`, fonts Inter / Lora / JetBrains Mono.
- **Data layer** (`lib/data/`): `seed.ts` builds the store from `data/seed/*.json` (structured data per account), `docs/context/*.md` (research), `data/vault/hooray/` (the real exported vault) and `data/pipeline.json` (Account OS deals). `library-seed.ts` holds the core templates (from `templates/`), shared templates, and the maps that send research sections into core files (`RESEARCH_TO_FILE`, `SECTION_TO_FILE`). `index.ts` is the read/write API used by pages and server actions (`app/actions.ts`).
- **Vault restructure.** Every core template is a file on every project. Research sections are appended into the core file they belong to; Hooray keeps its real exported files plus "Since close" sections; project sections merge into a core file when they fit, otherwise they become files "added here".
- **Pages.** Projects (delivery and sales tables), project Overview (delivery: deals, this week, workstreams, feed; sales: stage track, deal, scoping files, same-industry expertise), Book, Artifacts, Vault, Work (workflows), Template Library (four category cards, core / shared / local), Stella.
- **Stella** (`lib/stella/agent.ts`, `corpus.ts`, `app/api/stella/route.ts`): Anthropic SDK 1.3.0, `claude-opus-5-5`, effort medium, server-side fallbacks, streaming manual tool loop (max 8 turns), cached system prompt (rules + Context-Model + Product-Suite frameworks + project header). Tools: `search_context`, `read_source`, `list_sources`, `search_expertise` (same-industry projects weighted 1.5×). Retrieval is keyword scoring with light stemming over active vault files, book chapters and account data; sensitive artifacts and files kept from Stella are excluded. Streams NDJSON events (text, tool, reset, done, error); `reset` clears pre-tool text so interim notes never show. Tested: facts and citations correct on World Emblem and Heritage questions; about $0.13 per simple question, $0.38 for a scoping question.
- **Pipeline.** 41 open Account OS deals pulled into `data/pipeline.json` (industry inferred where missing); expansions of delivery accounts are skipped, leaving 32 sales projects (`/projects/deal-<title>`) with core templates, Sales-Intake filled from Account OS, and the scoping workflows.
- **Squads.** Origin: Jaime, Diana, Vitor, Harvy (Hooray, Ethic Select, Super 73, Labyrinth). Polaris: Tauseef, Dominik, Aman, Doren, Ricardo, Swami (World Emblem, Breakr, RxVIP, Sunflower). Heritage and Rafferty: no squad found. A sales deal takes its pod strategist's squad.

### 13 to 14 Nov: chat, scoping deals, cleaner views
- **Stella chat page** (`/stella`, `components/stella/`): chats listed on the left by day, searchable, all projects or one; clean thread; composer pinned at the bottom (Enter sends, Shift+Enter new line); starter questions per project; the header drawer shares the same chats. Chats are kept in the browser (`localStorage`) until the database exists. Asked for because the chat box was hidden in a drawer.
- **Scoping deals researched.** Spec `docs/context/deals/_SPEC.md`: each deal doc is written as the vault itself (`## File: <CoreName>` sections in the template's own headings, a 4 to 7 chapter `## Book`, an `## Artifacts` table, `## Gaps`). `_pipeline-reviews.md` holds per-deal notes from 10 weekly pipeline reviews and is appended to every deal's Sales-Notes. Chosen deals: IEC Colleges (named by Tauseef), then the three new-client deals with the most call material (Waterfall, Brill, Owner.com; RxVIP OF#2 and World Emblem OF#004 had more but are expansions).
- **Template Library scroll jump** fixed: nested components were remounting the list on every click.
- **Vault sidebar** (`components/project/VaultView.tsx`): empty templates start hidden; hover a file for hide / archive / delete; each category has an eye toggle (hidden and archived count) and a **+** picker that searches every template, this category first, then other categories and other projects' files.
- **Edits now persist.** Server actions and pages were reading two copies of the store; it now lives on `globalThis` and rebuilds only when a source file changes.
- **Project filters.** Delivery table by squad, strategist, industry; sales table by owner, industry, stage, expected close (past due, next 30 days, 31 to 90 days, later, not set). Remembered per browser.

### 14 Nov: Stella evaluation
- Ran `node scripts/eval.mjs`: 38 questions (World Emblem 14, Heritage 12, Hooray 10, 2 negative). First run 34 of 38 passed, 38 of 38 cited a source. Tokens: 900K input, 1.35M cache read, 54K output (about $4.94).
- All four failures were data gaps, not reasoning errors: the facts sat in the early HTML prototype but had never reached the app's research docs, and Stella correctly said they were not recorded. Each fact was checked against Granola before adding: World Emblem's ledger reads Randy's Obsidian file and write-back was scoped out (Weekly Planning 2 Nov, Check-In 5 Nov; the prototype's "Randy refused" was not confirmed); Heritage's identifier masking (1 Oct, 14 Oct) and the client's virus-upload question exposing unscanned uploads (23 and 28 Oct); Hooray's David slow on async and Looker Studio access withheld (18 and 22 Sep).
- Heritage's Security-and-Compliance file gained an Incident-Log and Identifier-Masking entry (`data/seed/heritage.json`), because Stella looks for incidents there. Re-runs passed (about $0.68).
- Lesson: when Stella says something is not in the vault, check the data before the prompt; the eval mostly measures coverage of the research docs.

### 14 Nov: GitHub and Supabase
- Repo pushed to https://github.com/tauseefrahman-supernal/clientos-v2 (private); the Supernal-Technology org needs an admin to create or transfer it.
- `clientos` schema applied to the Client OS project (`chgkhaxogaipafngvjqx`): 18 tables, row-level security on, service role only; a second migration added round-trip columns (template and category names on files, origins, chapter sources, workflow standard flag, artifact keys) and per-project template uniqueness.
- Data layer switched: the data API is async; Supabase is the source of truth when configured; first import loaded 41 projects, 32 deals, 2 squads, 4 categories, 71 templates, 1,153 vault files, 102 chapters, 492 artifacts, 384 workflows. Re-import refreshes without duplicating. Checked: a hidden file stays hidden after reload; a Stella exchange saves both messages; 3 evaluation questions pass on the database.
- Bugs met: a pasted project URL with a path broke requests (the client now uses the URL's origin); batch inserts send null for omitted columns (every row now sets every column).
- The security advisor flagged existing issues outside `clientos` (anonymous-callable SECURITY DEFINER functions in `presales` and `we`, mutable search paths, vector in public, leaked-password protection off). Not changed; for their owners.

## Findings worth keeping (deal research, 13 Nov)

- **IEC Colleges** ($175K, Order Form, Zack / Diana, Origin): order form $178K, $9K a month for two months then $16K, billed quarterly, exit at day 90. Champion Esther Duong (VP Marketing) pushes on cost and billing; wants enrolment gains in about 60 days. World Emblem is the reference (Randy call, Eric Freeman walkthrough). Who signs is unclear.
- **Waterfall** ($165K, Proposal, Zack / Dominik, Polaris): replacing viaPeople (about $105K a year); prototype approved 12 Nov; ceiling quoted $200K a year; Alyssa needs a business case; CFO Brian and co-founder Jack not yet met; first cycle April 2027.
- **Brill Building** ($50K in Account OS, Proposal, Zack / Belu): order form $15K a month ($180K a year); Zack quoted $185K; client pushed back; Account OS cut to $50K the same day. "2+12" = 12-month term with a month-2 exit if the song score is not live. NDA likely signed (Account OS stale).
- **Owner.com** ($90K, Prototype, Cart): Supernal's largest human-led BPO client (from $30.5K to about $81K a month); its in-house AI threatens about $20K a month; draft proposal offers three AI coworkers (Menu QA, Launch, Support) with pricing blank.
- **Heritage** (delivery): Linear ledger 93 items, 168 points, 52 signed off; no pilot firm live; 10 Nov "Concerns with platform" email and accuracy programme HER-1307; 95% accuracy milestone due 30 Nov at 81%.

## Open items

- Heritage and Rafferty squads; Belu's squad.
- Account OS corrections spotted (not made; read-only): Brill NDA status and value reason; Waterfall incumbent spelled "Via Pages"; ARS Wealth close date 25 Dec 2025.
- Seven scoping deals have no call material (Mission Coast, Insurance CRM, Palm, Infusion, SRR, Tax/Accounting, HMS).
- MECE-Framework still mentions the old A1 to B5 numbering.
- Next phases: sign-in (Supabase auth, Supernal emails) and per-user access so Jaime and Sven can use it; deploy; connectors (Account OS sync first); workflows that run; Stella retrieval on the `chunks` table with embeddings.

## How to run and check

- `npm run dev` (port 3100). The page header says edits last until restart.
- `curl 'localhost:3100/api/stella/search?slug=<slug>&q=<words>'` shows what Stella would retrieve.
- `node scripts/eval.mjs [ids]` runs the evaluation (costs money).
- Adding a scoping deal: write `docs/context/deals/<deal-slug>.md` per `_SPEC.md`; the app picks it up on the next request.
