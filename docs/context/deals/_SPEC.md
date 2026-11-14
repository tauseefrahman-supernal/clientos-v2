# Scoping deal context document: format

One file per deal in scoping: `docs/context/deals/<deal-slug>.md` in `/Users/tauseef/Supernal/ClientOS-v2`. ClientOS loads it into the deal's vault, book and artifacts, so write it as the vault itself, not as notes about it.

## Rules

- Read-only everywhere except your one output file. Never call a tool that saves, adds, updates, records, sends, creates or removes anything in Account OS, Granola, Fathom, Linear, Notion, Slack, Drive or Gmail.
- Never read any `.env` file. Recursive greps in Bash carry `--exclude='.env*'`. Never touch `~/Documents/Second-Brain/` or `~/tauseef-os/`.
- Every fact is followed by its source in brackets: `(meeting title, 12 Nov 2026)`, `(Account OS)`, `(Drive: file title)`, `(Slack #channel, date)`, `(Notion: page)`.
- Paraphrase meetings; never quote a transcript verbatim. Mark anything inferred `(inferred)`. When sources disagree, give both.
- Meeting notes often cover several deals (weekly pipeline reviews, sales syncs). Take only this deal's parts and check a note is really about this client.
- Notes and summaries first; open transcripts only for specific gaps (numbers, pain points, who said what mattered).
- Plain words. Dates as `12 Nov 2026`. Money with units.

## Sources, in this order

1. **Account OS** (load tools with ToolSearch, `mcp__claude_ai_AccountOS__*`): `search` the deal or company, then `get_deal` with `detail='detailed'`; `get_account`/`get_contact` if they exist. The MCP is flaky: small calls, retry twice on timeout.
2. **Granola** (`mcp__claude_ai_Granola__*`): `search_meetings` by company name, people's names and product words, paging until exhausted; `get_meetings` for the scoping calls (discovery, concept alignment, prototype review, proposal walk-through). Also search the weekly pipeline review / sales pipeline meetings for this deal and take only its parts.
3. **Fathom** (`mcp__claude_ai_Fathom__*`): calls Granola lacks.
4. **Google Drive**: proposals, order forms, scoping docs, prototype links for this client (`search_files`, `excludeContentSnippets` true; open only the defining few).
5. **Slack**: deal or client channels, and mentions in sales channels; collect artifact links.
6. **Notion**: any page on this client.

## Document layout (use exactly these headings)

```
# <Deal title>

## Meta
- Company: ...
- Industry: ... (say if inferred)
- Stage: ... (Account OS)
- Sources: N meetings (Granola/Fathom), Drive files, Slack threads read

## File: <Core file name>
...content...

## File: <next core file name>
...

## Book
### 1. <chapter title>
...prose...
Sources: ...

## Artifacts
| Title | Kind | Date | Owner | Link | What it is for |

## Gaps
...
```

### The `## File:` sections

Write one section per core vault file that the material can genuinely fill, using the file name exactly as listed below. Before writing a file, read its template and keep the template's `##` headings, filling each with what the sources say (drop a heading only if nothing at all applies; write `Not discussed yet.` where scoping should still cover it). Do not include the template's `>` header lines or italic placeholder text. Skip a file entirely when there is no material for it.

| File name | Template |
|---|---|
| Sales-Context | templates/sales-strategy/Inputs/Sales-Context.md |
| Sales-Research | templates/sales-strategy/Inputs/Sales-Research.md |
| Sales-Notes | templates/sales-strategy/Inputs/Sales-Notes.md |
| Sales-One-Pager | templates/sales-strategy/Inputs/Sales-One-Pager.md |
| Concept-Alignment | templates/sales-strategy/Outputs/Concept-Alignment.md |
| Signal-Intake | templates/phase-a/A1-Signal-Intake.md |
| Diagnostic-Discovery | templates/phase-a/A2-Diagnostic-Discovery.md |
| Context-Building | templates/phase-a/A3-Context-Building.md |
| Product-Segmentation | templates/phase-a/A4-Product-Segmentation.md |
| Scope-Definition | templates/phase-a/A5-Scope-Definition.md |
| Discovery-Readout | templates/phase-a/Discovery-Readout.md |
| Proposal | templates/phase-a/Proposal.md |
| Data-Layer | templates/phase-b/B1-Data-Layer.md |
| Integrations | templates/phase-b/B2-Integrations.md |
| AI-Employees | templates/phase-b/B3-AI-Employees.md |
| Phasing-Commercial | templates/phase-b/B5-Phasing-Commercial.md |
| Prototype-Summary | templates/phase-b/Prototype-Summary.md |

(Template paths are relative to `/Users/tauseef/Supernal/ClientOS-v2`.) Sales-Notes holds the running log: one dated entry per call or pipeline-review mention, newest first, two to five lines each. Stakeholders go in Sales-Context (champion, politics) and Context-Building where the template asks for them.

Context that fits none of these files (for example a regulatory regime specific to the industry) goes in a section `## File: <Short-Name>` of your own, at most two of them, each starting with one line saying why it does not fit the core files.

### Book

The deal written as 4 to 7 chapters a strategist joining the deal could read in 10 minutes: the deal in one page; the client and their problem; why now and why us; what we are proposing and why it is shaped that way; the people and the politics; commercials and what stands between us and signature; open questions for the next call. 120 to 250 words of connected prose each, with numbers, followed by a `Sources:` line.

## Hand-back

After writing the file, reply in at most 120 words: the file path, how many meetings you used, which `## File:` sections you filled, the three most important findings, and what you could not access.
