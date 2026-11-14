# Context Model

> How Stella holds an account in her head. It describes the structure of a project's vault, what each file is for, which file answers which kind of question, and how she keeps facts in one place. She reads this before answering anything about an account and before drafting any file.

## The layers

A project's context sits in five layers. Each layer has one job, so a fact is written once, in the layer where it belongs.

| Layer | What it holds | Where it lives | Changes |
|---|---|---|---|
| 1. Sources | Meetings, emails, order forms, decks, Linear issues, Account OS records | Granola, Fathom, Drive, Slack, Linear, Account OS (read, never copied whole) | Every day |
| 2. Vault files | The account's facts, structured by the core templates | ClientOS vault, one markdown file per template | Weekly to monthly |
| 3. Added files | Facts this account has that no template holds | ClientOS vault, "Added for this project" | When the account needs one |
| 4. Book | The account told as chapters, for someone new | ClientOS Book page | When the files under a chapter change |
| 5. Work | Drafts produced for a workflow: a weekly report, an agenda, a health summary | ClientOS Work page, then Notion, Account OS or a deck | Each run |

Stella answers from layers 2 to 4 and cites them. She goes back to layer 1 only to fill or correct a file, never to answer around the files.

## The four groups

Every project's vault has the same four groups, in the order a client moves through them.

| Group | The question it answers | Read it when you are asked |
|---|---|---|
| Sales Strategy | Who is this client, who decides, and how did the deal start? | about the client, the buyer, the champion, competitors, the first conversations |
| Deal Strategy | What is the client's real problem, and what did we scope? | why they bought, what is in or out of scope, the open questions, the product pieces |
| Technical Strategy | How is it built, and what does it cost? | about data, integrations, the AI employee, the plan, phasing, prices, design decisions |
| Delivery Strategy | Where does it stand now, and what is next? | about progress, people now, this week, success metrics, adoption, the roadmap |

## The core files and what each holds

### Sales Strategy

| File | Holds | Does not hold |
|---|---|---|
| Sales-One-Pager | The account in a few lines: who they are, what they bought, where it stands | Detail that has its own file |
| Sales-Research | Public facts about the client, its market and competitors | Anything we learned in meetings |
| Sales-Context | How the relationship began and moved: origin, history, turning points, politics | Current stakeholder status (Delivery: Stakeholders) |
| Sales-Notes | The dated sales log | Decisions after close |
| Concept-Alignment | Why they bought: every cause, what was shown, what unlocked each later deal | Prices (Technical: Phasing-Commercial) |

### Deal Strategy

| File | Holds | Does not hold |
|---|---|---|
| Signal-Intake | The deal brief at first signal | Later changes |
| Diagnostic-Discovery | The real limiting factor, gaps, and where sources disagree | Solutions |
| Context-Building | How the account is structured: entities, order forms, products, workstreams and how they connect | Status |
| Product-Segmentation | The product pieces, Supernal's and the client's own, and which are active | How each is built (Technical) |
| Scope-Definition | In and out of scope, risks, assumptions | Delivery dates |
| Discovery-Readout, Scoping-Package, Proposal | Outputs written for the client at scoping | New facts; they summarise the files above |

### Technical Strategy

| File | Holds | Does not hold |
|---|---|---|
| Data-Layer | Data sources, model, retention, privacy | External system access (Integrations) |
| Integrations | Each external system: what it feeds, who holds access, its state, and the KPIs read from it | The internal data model |
| AI-Employees | Each AI employee: role, tools, interaction patterns | Per-feature reasons (Feature-Rationale) |
| Delivery-Plan | Success criteria, KPIs, value promised and shown | Week-to-week status (Delivery: Project-Plan) |
| Phasing-Commercial | Order forms, pricing model, every price discussed, terms, unresolved commercial questions | Opportunities not yet sold (Delivery: AI-Strategy-Roadmap) |
| Proposal-v2, Prototype-Summary | Outputs for the client | New facts |
| Feature-Rationale (shared) | Each design decision with its reason and the meeting where it was made | What the feature is (AI-Employees, Product-Segmentation) |
| Use-Cases-and-Feedback (shared) | Use cases by team, adoption numbers, feedback and what it changed | Success criteria |
| Design-System, Security-and-Compliance (shared, proposed) | How the product looks and why; the rules the client operates under and every incident | |

### Delivery Strategy

| File | Holds | Does not hold |
|---|---|---|
| AI-Strategy-Roadmap | Open opportunities, success metrics now, what Account OS should hold | The history of how we got here |
| Project-Plan | One row per workstream: state, milestone, what was measured and learned | Tasks (Linear owns those) |
| Kickoff-Checklist | Month one, item by item, with evidence | Later months |
| Stakeholders (shared) | Each client person now: influence, disposition, last contact | How the deal started (Sales-Context) |
| Weekly (shared) | Only this week: decisions, slipping items, what is coming | Anything lasting; it moves to the file above |
| Adoption-Plan (shared) | Who goes live when and whether they use it | |
| Maintenance, Concierge | Service-mode notes for accounts in those modes | |

## How Stella decides where a fact goes

1. Find the group from the question the fact answers (the table above).
2. Within the group, put it in the core file whose "Holds" column covers it.
3. If no core file covers it, check the shared templates in the library.
4. If nothing covers it, propose a new file under "Added for this project", named for what it holds. A strategist approves it; it can later be proposed as a shared template.
5. Never copy a fact into a second file. Link to it instead.

## How Stella answers

- Search the vault first, with specific words: names, products, dates, numbers.
- Read the whole file when an excerpt is not enough.
- Cite every claim with the file or chapter it came from.
- When files disagree, say so and give both.
- When the vault does not hold the answer, say which file should hold it and which source would fill it.
- Respect state: hidden, archived and deleted files, and sensitive artifacts, are not hers to read.

## Product: two meanings

"Product" means two different things in a vault, and Stella keeps them apart.

- **Supernal's product suite:** what Supernal sells. It is defined once, in the Product Suite framework, and referenced from Product-Segmentation.
- **The client's AI-native product:** what is being built for this client. Its components and their state are in Product-Segmentation, AI-Employees, Integrations, Data-Layer and Feature-Rationale.
