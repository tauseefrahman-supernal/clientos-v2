# ClientOS context document: format

One file per client account: `/Users/tauseef/ric-os/drafts/clientos-context/<slug>.md`. It is the side document that captures everything learned about the account, so a prototype app (and later the production ClientOS) can be populated from it without re-reading the sources.

## Rules

- Read-only everywhere except your one output file. Never call a tool that saves, adds, updates, records, sends or removes anything in Account OS, Linear, Notion, Slack, Drive, Granola or Gmail.
- Never read any `.env` file. Never touch `~/Documents/Second-Brain/` or `~/tauseef-os/`.
- Every fact is followed by its source in brackets: `(meeting title, date)`, `(Account OS)`, `(Linear)`, `(Notion)`, `(Drive: file title)`, `(Slack #channel, date)`, `(vault: file › heading)`.
- Paraphrase meetings; never quote a transcript verbatim.
- Mark anything inferred as `(inferred)`. When sources disagree, give both and say so. Say plainly what you could not find or access.
- Meeting notes often cover several accounts; take only this account's parts. Check that a note titled for this client is really about it.
- Use notes and summaries first; open transcripts only for specific gaps. Do not read every meeting in full.
- Plain words. Dates as `12 Nov 2026`. Money with units.

## Sources, in this order

1. **Account OS** (`mcp__claude_ai_AccountOS__*`, load via ToolSearch): `get_account` (health, stakeholders, success_plan, cadence, value, whitespace, renewal) and `list_deals(account=...)`.
2. **Granola** (`mcp__claude_ai_Granola__*`): `search_meetings` by client name and product names, paging until exhausted; `get_meetings` ten at a time for the turning points (first calls, kickoff, order-form or pricing discussions, demos, feedback sessions, reviews, on-site visits, the latest three weeks).
3. **Fathom** (`mcp__claude_ai_Fathom__*`): for older history and client calls Granola lacks.
4. **Linear** (`mcp__claude_ai_Linear__*`): the client's team, its projects and milestones with status, progress and dates.
5. **Google Drive** (`mcp__claude_ai_Google_Drive__*`): list the client's folder(s) recursively with `search_files` using `parentId = '<id>'` (set `excludeContentSnippets` true). Record files; open only the few that define the engagement (order form, proposal, strategy doc, QBR deck).
6. **Slack** (`mcp__claude_ai_Slack__*`): find the account's channels (`slack_search_channels`), read recent history, and collect links to artifacts shared there (decks, docs, Loom, claude.ai artifacts, demos). If a channel cannot be read, say so.
7. **Notion** (`mcp__claude_ai_Notion__*`): the account page and weekly account health reports.
8. **Local**: `/Users/tauseef/ric-os/meetings/` (file names start with the date) and `/Users/tauseef/ric-os/brains/` where relevant.

## Sections of the document (use these headings, in this order)

1. **Snapshot**: who the client is, what they bought, where it stands now, in six lines. Pod. Health score, band and dimensions.
2. **Structure of this account**: the entities, order forms, products, workstreams or phases, and how they connect. This is what makes the account different from others; be precise. Include a small table of every deal (title, value, MRR, stage, dates).
3. **Arc**: by month (by quarter before the last six months). Turning points, what shipped, what was sold or lost, how the relationship moved. Give the meeting count per month if you can.
4. **Why they bought**: all the causes, not one. What was analysed or shown, what the client said mattered, what alternatives they had, what unlocked each later deal.
5. **Commercials**: pricing model, every price discussed, terms, renewal date, margin if stated, anything unresolved.
6. **Product**: each product, system or AI employee by name, what it does, who uses it, its state. Then **Feature rationale**: 5 to 10 design decisions, each with the reason given and the meeting where it was decided.
7. **Use cases and feedback**: use cases by team; adoption and usage numbers; feedback received and what changed because of it.
8. **Stakeholders**: each client person (name, title, role on the account, stance at the start and now, last notable interaction). Supernal team over time.
9. **Success and value**: every success criterion or KPI with baseline, target and current value; value shown to the client with numbers; what the sponsor has asked to see.
10. **Delivery now**: one row per workstream (state, milestone % and date, what is measured, what was learned, blocker). Decisions waiting, items slipping, commitments with no Linear issue, dates in the next 30 days.
11. **Artifacts**: a table of every artifact made for or about the account: title, kind (deck, proposal, order form, prototype, demo, video, doc, spreadsheet, dashboard, site), date, owner, where it lives (link), what it is for. Drive files first, then Slack-shared links, then ones only mentioned in meetings (marked `location unknown`).
12. **Suggested vault sections**: categories of context this account has that a standard scoping and delivery template set would not hold. For each: a name, the 2 to 5 files it would contain, and how much material exists.
13. **Book**: the account written as chapters a new team member could read in 20 minutes. 6 to 9 chapters, each 150 to 300 words of connected prose with the numbers and several causes where there are several, followed by a `Sources:` line. Chapters to consider: the account in one page; why they bought; how the deal is built; the product and why it is built this way; how delivery has gone; the people; what value has shown; where it stands and what is next. Add chapters this account needs.
14. **Gaps and conflicts**: what could not be found, and where sources disagree.

## Hand-back

After writing the file, reply with at most 150 words: the file path, the five most important findings, and what you could not access. Do not repeat the document.
