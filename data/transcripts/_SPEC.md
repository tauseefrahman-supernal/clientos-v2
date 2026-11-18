# Recordings list: format

One file per project: `data/transcripts/<slug>.json` in `/Users/tauseef/Supernal/ClientOS-v2`. ClientOS shows it as the project's Recordings list and Stella can see what meetings exist. It lists meetings; it never holds transcript text.

## Rules

- Read-only on every service. Never call a tool that saves, adds, updates, sends, creates or removes anything.
- Never read `.env` files; recursive greps need `--exclude='.env*'`.
- Paraphrase; never copy transcript text. The summary is one sentence of your own words, at most 200 characters, about what the meeting covered for this project.
- Include a meeting only if it is about this project: client calls, internal syncs about it, scoping or deal-desk sessions about it. For meetings that cover many accounts (weekly pipeline reviews, all-hands, squad standups), include them only if this project was a substantial topic, and set `kind` to `"multi"`.
- A meeting recorded in both Granola and Fathom appears once; prefer Granola and put the other link in `alt_url`.
- Never include meetings about a client's own customers' private matters beyond the title (for example a family's estate details); if a title itself names a private individual who is not a client contact or Supernal staff, replace that part with "client family".

## Sources

1. **Granola** (`mcp__claude_ai_Granola__search_meetings`, paging with `next_cursor` until exhausted; `get_meetings` only if you need participants or a summary). Search by the client name, its spelling variants, product names, and the main client contacts. Granola link: `https://notes.granola.ai/d/<meeting_id>`.
2. **Fathom** (`mcp__claude_ai_Fathom__search_meetings` / `list_meetings` / `find_relevant_meetings`, recorded by anyone). Use the recording URL the tool returns.
3. Load tools with ToolSearch, e.g. `select:mcp__claude_ai_Granola__search_meetings,mcp__claude_ai_Granola__get_meetings`.

## Shape

```json
{
  "slug": "world-emblem",
  "pulled": "2026-11-15",
  "searched": ["World Emblem", "WE", "Randy", "FMDS"],
  "meetings": [
    {
      "provider": "granola",
      "id": "070d601c-...",
      "title": "World Emblem Sync: Weekly Planning",
      "date": "2026-11-02T18:00:00Z",
      "participants": ["Tauseef Rahman", "Ricardo Morel"],
      "kind": "client | internal | multi",
      "summary": "Planned the week: commitment ledger fixes, Obsidian connector, QBR follow-ups.",
      "url": "https://notes.granola.ai/d/070d601c-...",
      "alt_url": null
    }
  ]
}
```

Newest first. Validate with `python3 -c "import json;json.load(open('<path>'))"`.
