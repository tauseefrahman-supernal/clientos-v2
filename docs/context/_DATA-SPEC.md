# ClientOS app data file: format

One JSON file per account: `/Users/tauseef/ric-os/drafts/clientos-context/data/<slug>.json`. A prototype app loads it directly, so it must be valid JSON that matches this shape exactly.

## Rules

- Source: the account's context document `/Users/tauseef/ric-os/drafts/clientos-context/<slug>.md` only (plus `heritage-drive-inventory.md` for Heritage). Do not do new research. Do not invent anything; if the document does not say, use `""`, `null` or an empty array.
- Plain text only in every string: no HTML, no Markdown, no line breaks except `\n\n` between paragraphs in `book[].text`. Use straight double quotes only as JSON delimiters; inside strings use typographic quotes (“ ”) or none.
- Short strings: a headline is one sentence; a note is at most two.
- Dates as `12 Nov` (add the year only if not 2026). Money as `$120K` or `$8,900`.
- `tone` is one of `"ok"`, `"warn"`, `"err"`, `"info"`, `""`.
- Do not start sub-agents. Work alone. Do not read `.env` files. Write only your one output file. After writing, validate it by running `python3 -c "import json;json.load(open('<path>'))"` and fix any error.
- Never include credentials, passwords or secret links. Mark any artifact that contains a client's own customers' personal, financial or legal documents as `"sensitive": true`.

## Shape

```json
{
  "key": "breakr",
  "title": "Breakr",
  "strat": "Name of the working strategist",
  "pod": "Name (AM), Name (strategist), Name (FDE)",
  "mrr": "$21,000",
  "closedValue": "$198,000",
  "closedCount": 1,
  "health": { "score": "4.2", "band": "Watch", "tone": "warn" },
  "fresh": ["Current as of <meeting>, <date>", "<n> meetings since <month>", "<one scale fact>"],
  "transcripts": 0,
  "deals": [ { "name": "", "value": "", "stage": "Closed Won 26 Oct", "phase": 3, "note": "" } ],
  "lost": "",
  "sold": [ { "form": "", "promised": "", "met": "", "tone": "" } ],
  "arc": [ { "period": "Jun", "meetings": null, "points": ["", ""] } ],
  "disagreements": ["A fact where sources disagree, with both values."],
  "streams": [ { "name": "", "state": "Live", "tone": "ok", "pct": null, "due": "", "measured": "", "learned": "", "attention": false } ],
  "tiles": [ { "file": "roadmap", "section": "Roadmap › 7", "title": "Success metrics", "headline": "", "tone": "", "state": "" } ],
  "decisions": [ { "title": "", "detail": "", "action": "Draft reply" } ],
  "slipping": [ { "kind": "Past target", "tone": "err", "item": "", "detail": "" } ],
  "dates": [ { "when": "16 Nov", "what": "" } ],
  "feed": [ { "meeting": "", "date": "", "changes": ["Project plan: what changed"] } ],
  "people": [ { "name": "", "title": "", "note": "At the start: … Now: …", "influence": "High", "disposition": "Champion" } ],
  "metrics": [ { "criterion": "", "now": "", "state": "Behind", "tone": "err" } ],
  "accountos": [ { "record": "Weekly health", "now": "", "proposes": "" } ],
  "rationale": [ { "decision": "", "why": "", "source": "Meeting, date" } ],
  "sections": [ { "category": "Design System", "group": 2, "desc": "", "files": [ { "name": "Design-Tokens", "summary": "" } ] } ],
  "artifacts": [ { "kind": "Deck", "title": "", "date": "", "what": "", "url": "", "where": "Drive", "sensitive": false } ],
  "book": [ { "title": "", "minutes": 2, "lenses": ["all"], "text": "", "sources": ["", ""] } ],
  "answers": [ { "q": "", "a": "" } ],
  "workflows": [ { "name": "", "kind": "external", "cadence": "Weekly, Thursday", "with": "", "output": "", "lastRun": "", "note": "" } ]
}
```

## Field notes

- `deals[].phase`: 0 for Idea, Nurture or Concept Alignment; 1 for Prototype; 2 for Proposal or Order Form; 3 for Closed Won. Every deal on the account, won first then open. `lost`: one sentence on lost deals, or `""`.
- `sold`: one row per signed or pending order form: what it promised and whether it has been met.
- `arc`: by month (by quarter before the last six months), 1 to 3 points each.
- `streams`: one per workstream, product piece or AI employee from the document's "Delivery now" section. `state` is a short label (`Live`, `Building`, `Blocked`, `Late`, `Waiting on client`, `Not started`, `Paused`). `attention` is true when it is blocked, late, at risk or unused.
- `tiles`: 4 to 6 one-line summaries of where the account stands. `file` is `"roadmap"`, `"plan"` or `"stakeholders"`. Typical titles: Success metrics, Commercial model, Dependencies, Opportunity map, Power map, Rhythm, Health. `state` is a two- or three-word label.
- `decisions`: what waits on the strategist this week (3 to 6). `action` is a short button label.
- `slipping`: `kind` is one of `Past target`, `Blocked on client`, `Promised, no task`, `Open risk`, `Not started`, `Expectation gap`.
- `dates`: the next 30 days, in order.
- `feed`: the latest 3 to 5 meetings and what each changed, newest first.
- `people`: client people first (5 to 9), using the Account OS bands for influence (`High`, `Medium`, `Low`) and disposition (`Champion`, `Supporter`, `Neutral`, `Skeptic`, `At risk`) as your reading of the document.
- `metrics`: each success criterion or KPI with its current value.
- `accountos`: exactly seven rows, in this order: Weekly health, Stakeholders, Success plan, Cadence, Value, Whitespace, Renewal. `now` is what the Account OS record holds today; `proposes` is what could be drafted for it from the document.
- `rationale`: the design decisions from the document's "Feature rationale", each with its reason and source meeting (5 to 10).
- `sections`: from the document's "Suggested vault sections": the categories of context this account needs beyond the standard templates. `group` is 0 Sales Strategy, 1 Deal Strategy, 2 Technical Strategy, 3 Delivery Strategy. 3 to 8 categories, each with 2 to 5 files. Name files `Like-This` (no extension). Where the document shows notable design, brand, website or product-experience work, include a category for it.
- `artifacts`: every row of the document's artifact table (up to 60; keep the most important if there are more). `kind` is one of Deck, Proposal, Order form, Prototype, Demo, Video, Document, Spreadsheet, Dashboard, Site, Design, Recording, Folder. `url` is the full link if the document gives one, else `""`. `where` is Drive, Slack, Notion, Linear, claude.ai, Web or unknown.
- `book`: every chapter of the document's Book section, text copied in full (do not shorten), paragraphs joined with `\n\n`. `minutes` is words divided by 200, rounded up. `lenses` lists who should read it: always include `"all"` for the first and last chapters; otherwise choose from `strategy`, `product`, `engineering`, `delivery`, `account`. `sources` is the chapter's source list as short strings.
- `answers`: 3 questions a strategist would ask about this account, each with a two-to-four sentence answer from the document.
- `workflows`: the recurring work on the account from the document's cadence material: client meetings, internal syncs, reports, decks, reviews. `kind` is `external` (with the client) or `internal`. `output` is the artifact it produces, or `""`.

## Hand-back

Reply with at most 60 words: the file path, the counts of book chapters, artifacts and sections, and anything you could not fill.
