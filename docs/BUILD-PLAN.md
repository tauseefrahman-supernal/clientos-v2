# ClientOS: plan for the production build

Draft for Tauseef, 13 Nov 2026. Builds the approved HTML prototype (https://claude.ai/artifact/Jk5rKmVXEUmRSWKmKiJkJ6) into a working app, so Stella can be tested on real account context and the database structure can be evaluated.

## 1. Recommendation: a new repo, porting the parts that work

**Start a new repository and port selected code from `~/Supernal/ClientOS`. Do not keep building in the current repo.**

Three reasons:

1. **Security policy.** After the July supply-chain incident, Naveen's rule is to clean code and start a new repo from it. ClientOS was cleaned in place, so the malicious payload is still in its git history (commits `8534213` to `96f74db`). It is the only repo left in that state.
2. **The core data model changes.** Today everything hangs off a pre-sale deal (`presales.deals.id`). The new product hangs off an account, with categories, templates, file states, sources, a book and workflows. Most tables and routes would be rewritten anyway.
3. **The stack stays the same,** so porting is cheap: Next.js, Supabase, the Supernal Source design system, the shadcn kit, the Anthropic SDK.

**Port these:**

| From the current repo | Why |
|---|---|
| `app/globals.css`, `components/ui/*`, `tailwind.config`, `.eslintrc.json` | The design system and its lint rules, unchanged |
| `api-server/src/lib/accountos/*` (uncommitted on `feat/accountos-deal-sync`) | Account OS client and deal sync, already tested against staging |
| `api-server/src/lib/stella/agent.ts`, the md-file tools in `tools.ts` | The agent loop and file tools, adapted to the new tables |
| `templates/` (Phase A and B), `templates/stella/Frameworks/` | The core templates become the library's standard categories |
| `components/proposal/*`, `routes/proposal.ts` | The proposal builder becomes the Proposal workflow |
| Supabase auth and `profiles` | Same sign-in and user list |

**Leave behind:** the deal-keyed vault (`deal_md_files`), the A1–B5 step and gate tables, the separate Express server and its two-process supervisor (Stella moves into Next.js route handlers), and the executive view until it is redesigned.

**One structural change to the stack:** one Next.js app instead of Next plus Express. Stella's streaming works in route handlers, and one service is simpler to deploy on Railway.

## 2. Data model

Account OS stays the system of record for accounts, deals, health and stakeholders. ClientOS keeps the context, structure and work, and links to Account OS by id. New tables live in their own schema, `clientos`.

### Accounts and deals
- `accounts`: `accountos_id`, name, pod, strategist, last synced. Read from Account OS.
- `deals`: `accountos_id`, `account_id`, title, value, MRR, stage, dates. Read from Account OS. Several deals per account; World Emblem has five.

### The library
- `template_groups`: the four fixed groups (Sales, Deal, Technical, Delivery Strategy).
- `template_categories`: group, name, description, status (`local`, `proposed`, `shared`, `standard`), created by, origin account.
- `templates`: category, name, body (markdown), status, created by, origin account, version.
- `approvals`: what is proposed (a category or a template), by whom, reviewer, decision, comment.

### The vault
- `vault_files`: account, category, template (null for a custom file), path, content, source (`template`, `human`, `stella`), state (`active`, `hidden`, `archived`, `deleted`), `in_book`, updated by and at.
- `vault_file_versions`: every saved version, for history and undo.

### Sources
- `transcripts`: provider (Granola, Fathom), external id, account, date, title, participants, summary, text.
- `artifacts`: account, kind, title, url, provider (Drive, Slack, Notion, claude.ai, web), date, owner, `sensitive`, `excluded_reason`.
- `source_links`: which file, chapter or workflow output cites which transcript or artifact.

### Stella's memory
- `chunks`: piece of text, its owner (file, transcript, artifact text, chapter), account, embedding (pgvector), and the owner's state. Retrieval filters out hidden, archived, deleted and sensitive items in the query itself, not in the prompt.

### The book
- `book_chapters`: account, order, title, lenses, body, source links, generated at, `stale` (set when a cited file changes).

### Work
- `workflows`: account (null means standard for every account), name, kind (`external`, `internal`), cadence, audience, inputs (file paths), output type, and the instructions Stella follows.
- `workflow_runs`: workflow, started by, status, draft output, approved by, where it was sent (Account OS, Notion, Drive).

**What the database evaluation tests** (section 5): whether this model holds all nine accounts without one-off columns; whether the four groups plus categories are enough or a second category level is needed (Heritage has 17 sections); and how much the chunks table costs to keep current.

## 3. Stella

- **Model.** Current Claude models via the Anthropic SDK. The model and settings are checked against the `claude-api` skill when building, not chosen from memory.
- **Tools:**
  - `search_context`: hybrid search over chunks, filtered by account and state.
  - `read_file`, `list_files`, `read_transcript`, `list_artifacts`, `read_chapter`.
  - `propose_file_change`: writes a draft that a person approves.
  - `run_workflow`: produces a workflow's draft output.
  - The read-only Account OS tools, already built.
- **Rules held in code:**
  - She never reads hidden, archived or sensitive items.
  - She cites every claim with a file, meeting or artifact.
  - She never writes to Account OS, Notion or Slack without a person approving the draft.
- **Context width.** Answers start from the account's book and file summaries, then search deeper. This is the "go quite deep across wide sections" behaviour.

## 4. Getting the data in

**Seed first, connect second.** The nine context documents and data files from the prototype (`~/ric-os/drafts/clientos-context/`) load straight into the new tables. That gives a testable app in week one without any connector.

Then connectors, one at a time, each behind its own credentials that you add to the env file:

| Source | What it brings | Needs |
|---|---|---|
| Account OS | Accounts, deals, health, stakeholders | The existing agent token; it is staging-only today, so a production token |
| Granola | Meeting notes and transcripts | A workspace API key. Your personal key only returns notes you captured, which misses squad meetings |
| Fathom | Older recordings | An API key |
| Google Drive | Artifacts per client folder | A service account or OAuth app with read access to the shared drive |
| Linear | Milestones per client team | An API key |
| Slack | Artifact links shared in account channels | A bot token with read access to those channels |
| Notion | Weekly account reports | An integration token |

**Sensitivity rules ship with the Drive connector,** not after it. Heritage's Drive holds about 230 files of client families' tax, trust and estate documents. A folder can be marked sensitive per account, and anything in it is listed by count only and never chunked.

## 5. Evaluating Stella and the structure

An evaluation set is built from the context documents, where the answers are already known:

- **About 40 questions across World Emblem, Heritage and Hooray.** Examples: why they bought, why a feature is built a certain way, what is slipping, what was promised at close against what was built.
- **Scoring for each answer:** is it correct, is every claim cited, and is the cited source the right one.
- **Retrieval set-ups compared:**
  - files only;
  - files plus transcripts;
  - files plus transcripts plus the book;
  - two chunk sizes.
- **Runs on every change** to prompts, tools or schema, so improvements are measured, not guessed.

The same set tests the structure: if a question needs a fact the schema has no home for, that is a gap to fix.

## 6. Phases

| Phase | Delivers | Rough size |
|---|---|---|
| 0. Set-up | New repo under the org, CI with a lint and security scan, Supabase schema, port of the design system and auth | 2–3 days |
| 1. Read-only app | Projects, Overview, Book, Artifacts, Vault, Work and Library pages on seeded data for the nine accounts, sidebar and Stella drawer, search palette | 1 week |
| 2. Stella v1 and evaluation | Chunking and embeddings, Stella chat with citations over seeded data, the evaluation set and its runner | 1 week |
| 3. Editing | File editing with versions, hide, archive and delete, the library's categories and templates, approvals | 1 week |
| 4. Live data | Account OS sync per account, then Granola, Drive with sensitivity rules, Linear; chunks kept current | 1–2 weeks, depends on credentials |
| 5. Work | Workflows that run: weekly health draft, client review agenda, weekly report in the Notion fields, proposal; approve-then-send | 1 week |
| 6. Team release | Access rules for reading other projects, audit log, Railway deploy, onboarding two or three strats | 3–5 days |

Phases 1 and 2 are what you asked for first: a working app and Stella to test.

## 7. Decisions for you

1. **New repo or existing.** I recommend new, for the security policy and the data model. Who creates it in the Supernal-Technology org: you or Naveen?
2. **Supabase.** A new `clientos` schema in the same Supabase project, or a new project? Same project keeps the shared `transcripts` and `clients` tables reachable; a new one is cleaner.
3. **Owner and reviewers.** Does Thomas or Naveen need to approve before work starts? This was an open question in the PRD.
4. **Credentials.** Which of the connector keys above you can get, and when. Phase 4 waits on them; phases 0–3 do not.
5. **First testers.** Which strats test it in phase 2, and on which accounts.
