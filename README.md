# ClientOS v2

The strategy vault for Supernal's client accounts: one place per project for its overview, book, artifacts, vault and work, with Stella answering questions from that context. Built from the approved HTML prototype; see `docs/BUILD-PLAN.md`.

This is a new repository on purpose. The previous ClientOS repo carries the July 2026 supply-chain payload in its git history, and the remediation rule is to start clean. Code was ported file by file after scanning; config files were written fresh.

## Run it

```bash
npm install
npm run dev          # http://localhost:3100 (runs the payload scan first)
```

Stella needs a Claude API credential in the app's local environment file (`ANTHROPIC_API_KEY`). Everything else works without it.

## What is real and what is seeded

| Part | State |
|---|---|
| Projects, Overview, Book, Artifacts, Vault, Work, Template Library | Working, on seed data |
| Vault file tools (edit, hide, archive, delete, propose as template) and approvals | Working; changes last until the server restarts |
| ⌘K search across projects, files, chapters, artifacts, people, templates | Working |
| Stella | Working once the API key is set: streams answers, searches and reads the account's sources, cites each claim |
| Database | Schema written (`supabase/migrations/`), not applied; the app reads `data/seed/*.json` |
| Connectors (Account OS, Granola, Drive, Linear, Slack, Notion) | Not started |

## Layout

```
app/                     pages and API routes (Next.js App Router)
  projects/[slug]/       overview, book, artifacts, vault, work
  library/               template library
  api/stella/            Stella's streaming endpoint; /search shows raw retrieval
  actions.ts             server actions for the vault and approvals
components/              shell (sidebar, search, Stella drawer), project views, library, ui kit
lib/data/                the data API the pages call; seed.ts builds it from data/seed
lib/stella/              Stella's agent loop and her searchable corpus
data/seed/               one JSON file per account, from the 13 Nov research
docs/context/            the research document behind each account (Stella reads these too)
templates/               the core markdown templates (Sales, Deal, Technical, Delivery)
supabase/migrations/     the clientos schema
eval/                    Stella's evaluation questions and results
scripts/                 payload scan, evaluation runner
```

## Stella

- **Model:** `claude-opus-5-5` at medium effort, streamed, with server-side refusal fallback (`fallbacks: "default"`).
- **Tools:** `search_context`, `read_source`, `list_sources` over one account's vault files, book chapters, research sections and account summaries.
- **Exclusions:** hidden, archived and deleted files and sensitive artifacts never enter her corpus.
- **Caching:** the rules and the account header are cached as the system prompt prefix.

## Evaluating Stella

```bash
node scripts/eval.mjs              # 40 questions across World Emblem, Heritage and Hooray
node scripts/eval.mjs we-01 he-04  # a few
```

Each answer is scored on whether it contains the required facts and cites a source of the right kind. Two questions test refusing to guess. Every run calls Claude: roughly $0.10–0.30 per question.

## Environment variables

Set in the app's local environment file, never committed:

| Variable | For | Needed now |
|---|---|---|
| `ANTHROPIC_API_KEY` | Stella | Yes |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | The `clientos` schema | When the Supabase backend lands |
| `ACCOUNTOS_MCP_URL`, `ACCOUNTOS_MCP_TOKEN` | Account OS sync | Connector phase |
| `GRANOLA_API_KEY`, `FATHOM_API_KEY`, `LINEAR_API_KEY`, `SLACK_BOT_TOKEN`, `NOTION_TOKEN`, Google service account | Connectors | Connector phase |
