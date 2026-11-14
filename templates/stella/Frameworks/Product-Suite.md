# Product Suite

> Two things that both get called "product" at Supernal, kept apart. Part 1 is Supernal's own product suite: the offerings it sells and the platform it runs every client on. Part 2 is the AI-native product Supernal builds for each client, broken into the components such a build usually has. Stella uses Part 1 when choosing an offering and pricing a deal, and Part 2 when segmenting a client's product, writing milestones, or checking a build for gaps. Refreshed 2026-11-13. Care and Concierge are removed: they appear only in Notion pages from February 2026 or earlier and in no current offering, pricing or product page.

# Part 1: Supernal's product suite

## 1.1 What Supernal sells (the offerings)

Supernal sells subscriptions, not projects, and prices on outcomes, not hours. There are two offerings, and an account can run both at once.

| Offering | What it is | Starting shape (internal only) | Clients today (per Notion, Oct 2026) |
|---|---|---|---|
| **AI Transformation Partner** (the default) | Supernal runs the client's AI transformation end to end: data layer, AI OS and AI employees, with a live roadmap. | Plan M (1 mason + ⅓ strat) is the recommended start. | Rafferty, World Emblem, JetHQ, VHC, Stanbridge, Drystone, Arcwell, Labyrinth, RxVIP, Greta Bar, Columbus, Super73, Adam Hodson, Renteria |
| **AI Native Platform Partner** (bespoke) | A new product or revenue line, or an extension of the Transformation Partner. Supernal takes a bigger piece of the client's technology: AI adoption, products to market, internal efficiency. | Around 1.5 masons + ⅓ strat (not final). | Heritage, Techpipe, Breakr, Hooray, OVG, Ethic Select |

Entry and add-on products:
- **Diagnostic.** About $5,375, 2-week sprint, one-off, no renewal, about 80% margin. Covers about 10 hours of strat work, about 5 client calls and about 5 hours of mason time. Should lead into a Transformation or Platform deal. The website draft (Nov 2026) uses "Apply for a free diagnostic" as its call to action, which conflicts with the price; treat the free version as a marketing hook still under discussion.
- **AI training and workshops.** Price to be decided.
- **More that can be brought in:** company, department or role diagnostics; an AI native score; AI advisory at Chief AI Officer level (CAIO); private LLMs and "Iron Curtain" (data sovereignty).

Three problem types every offer is framed against:
- **Defensive:** make the client more efficient (cut cost, remove friction, improve operations).
- **Growth:** make more money with what they have (remove what blocks growth).
- **Offensive:** go to market with something new built on their expertise.

Pricing, plans and margins are in Offering-and-Commercials.md.

## 1.2 The platform every client runs on

These are Supernal's own products. They are how the client's build is delivered and seen. Clients do not buy them separately in any current Notion pricing.

| Product | What it is | Who uses it |
|---|---|---|
| **Workbench** | The delivery backend. Configures each client: pods, AI employees, apps, vaults, GitHub repos, insights, and delivery projects (the PMS "Delivery" tab). Masons and strats edit work products and assumptions here. | Masons, strats |
| **Pulse** | The client-facing portal. The client sees their AI-native org in one place (apps, vault, AI employees), monitors projects, proposes ideas (ideas tab), reads insights and AI employee output. Goal was all 19 accounts live on Pulse by Sep 30, 2026. Also hosts Supernal's internal delivery and scoping dashboard. | Clients, strats in client calls, leadership |
| **AI employees** (Notion product areas "AIC" and "AIA"; inferred meaning AI coworker / AI agent) | Named agents that do client work and, under the AI Workforce PRD, record their own work as work products. Run as Hermes agents on a VM, n8n workflows, or code in GitHub repos. | Client teams |
| **Vault** | A client data source attached to the platform (Postgres, Supabase or PostHog today), queried read-only and isolated per company. | Insights, AI employees |
| **Insights** | SQL charts over a company's vault sources, pinnable to pages and AI employee profiles. | Clients, strats |
| **Hivemind** | The company knowledge model: people, teams, customers, roles, projects, objectives. Gives AI employees context. | AI employees |
| **Delphi** | Chat that reads approved platform views (for example work products). | Clients, strats |
| **AI Workforce page** (Draft PRD, Nov 2026) | A Pulse page showing what AI employees did: AI FTE, equivalent human hours, equivalent labor cost (rounded, labeled estimate) and agentic share. Replaces the old Work Products KPI badge. Never compared against Supernal's fee. | Clients, strats |

Notes:
- The old "six pieces" (Employee, App, Vault, Pulse, Care, Concierge) are retired as a sales model. Employee, App and Vault survive as platform objects inside Workbench and Pulse. Pulse survives as the client portal. Care and Concierge are gone; ongoing support now sits inside the subscription ("Support and maintenance", "Training and change management") and the strat's weekly, monthly and quarterly rhythm.
- The older proposal naming in Tauseef's memory (Vault, Employee, App, HITL, Pulse) was not found in current Notion. HITL as a named product did not appear in any search. Treat it as a client-build component (Part 2), not a Supernal product.
- Work product setup changed. The old rule that a mason types human-equivalent minutes and an hourly rate before build is being replaced: AI employees create work product definitions as they work, the rate comes from public wage data (BLS) with its source, and strats edit assumptions afterwards. Customer-agreed minutes still beat any default.

# Part 2: The client's AI-native product

Every client gets a build of its own. Notion's short description: a data layer, an AI OS, and AI employees, with a live roadmap. The website draft adds: the company's knowledge becomes usable, systems work together, AI employees do real work alongside people, and new AI-native products come to life. The account research shows builds have many more parts than that. The components below are Stella's segmentation model, grounded in the account research and the Notion pages listed in Sources. The grouping is Stella's (inferred), not a Notion taxonomy.

## 2.1 Components

| # | Component | What it covers | Examples from accounts |
|---|---|---|---|
| 1 | **Data layer and integrations** | Source systems, connectors, ingestion, the cleaned reporting model, one definition per metric, APIs we expose. Includes the systems table and access per source. | Hooray Vault/Brain (GA4, Meta Ads, CM360 into a reporting model, Genome API) and Connector Hub. World Emblem integrations (HubSpot, Power BI, Outlook, Otter, Windsor, ADP; Business Central pending). Ethic Select certified product database (about 3.1M products) and its API. RxVIP Neon data path. |
| 2 | **Knowledge layer** | The client's know-how made usable: documents, SOPs, standard work, manuals, method training, the company model (Hivemind). | World Emblem standard work library and the 8-step method that trains Patch. RxVIP local knowledge base of 169 edit-flag rules. |
| 3 | **AI employees and agents** | Named agents with a role, tools, channels and an autonomy level, producing work products. | World Emblem: Chief (AI CEO, per-user Hermes agents, autonomy ladder Brief, Draft, Act with approval, Act alone), Patch (FMDS AI employee), AI COO (contracted). RxVIP: the Priority Fill AI employee. Ethic Select: three verification agents. Hooray: SAL (scoped, never built). VHC: Vera / Eadie. |
| 4 | **Workflows and automations** | Deterministic flows, scheduled jobs, triggers and rules that run without a person. | World Emblem activity triggers (3 red days, 5 of 10) and scheduled skills (Daily Brief 05:30). RxVIP scheduled weekday runs and e-script-first ordering. Ethic Select enrichment ahead of time. |
| 5 | **Apps and interfaces (the OS)** | The surfaces people use: executive layer, department layer, operator consoles, client-facing portals, mobile or desktop screens, browser extensions. Usually more than one layer. | World Emblem Leadership OS (L3) and FMDS OS (L1/L2) on one data layer. Hooray Command Center (internal) and Client View (hotel-facing). Ethic Select dashboard, Command Center and buyer extension. RxVIP operator dashboard. |
| 6 | **Human in the loop and hand-offs** | Where a person approves, reviews or takes over: approval gates, task hand-offs, escalation, things the AI must never do. | World Emblem approval gates at 8-step steps 6, 7, 8. RxVIP hand-offs as PioneerRx tasks; never solve CAPTCHA or critical comments; pharmacist keeps the patient sync step. Hooray accept-or-reject "Opportunities". |
| 7 | **Channels** | Where the client meets the product outside the app: Teams, Slack, email, voice, SMS, chat, browser. | World Emblem Teams bot (channel-scoped, no DMs). Ethic Select extension on supplier sites. Hooray Ask Genome chat. |
| 8 | **Reporting, KPIs and value** | Baseline, the 2 to 3 metrics Supernal is accountable for, dashboards, AI Workforce numbers, value reviews. | World Emblem KPI boards and cascade, EA board. Hooray four lead metrics (Revenue, Transactions, Room Nights, ADR) with same-period-last-year default. RxVIP run log and daily numbers. |
| 9 | **Governance, security and data sovereignty** | Access model, tenant isolation, private models, audit trails, data residency, ownership and exit model. | RxVIP private tenant-isolated vision model and six security changes. World Emblem per-user agents so one user cannot read another's email. Ethic Select partners never hold the full dataset; agent-derived records kept apart from certifier records. |
| 10 | **Adoption, training and change** | Onboarding, help centre, training, rollout order, usage score, champions. | World Emblem help centre (English and Spanish) and Leadership OS training. Hooray Help Center and "AMs test before hotels". RxVIP pilot at one store before four. |
| 11 | **Roadmap and delivery surface** | What the client sees of the plan: milestones, project status, ideas intake. | Pulse projects and ideas tab; Linear milestones; the AI strategy roadmap. |
| 12 | **Go-to-market layer** (Platform Partner only) | When the client is launching a product: pricing, packaging, sales and marketing support, websites, brand assets. | Heritage: platform plus Heritage AI website, Heritage Strategies website and brand videos; SaaS GTM guide. Hooray: Client View sold to hotels. |

## 2.2 How Stella segments a client's product

For each account, Stella builds one table with a row per component that applies:

| Field | What to write |
|---|---|
| Component | One of the 12 above. Skip the ones that do not apply and say so. |
| Pieces | Named modules, agents or screens, using the client's names. |
| State | Live, Built (not rolled out), Prototype, Proposed (in an OF or draft OF), Discussed (not in any OF), Dropped. |
| Users | Named people or roles, and how often they use it. |
| Problem type | Defensive, Growth or Offensive. |
| Layer | Executive, department, operator or floor; internal or the client's customers. |
| Milestone / OF | Which order form and milestone it belongs to. |
| Metric | The metric it moves and its baseline, if any. |
| Source | Where the fact came from (meeting and date, Linear, Drive, Slack). |

Rules Stella applies while segmenting:
1. **Start from the data layer.** Notion's pushback guide says the data layer is step one of every delivery. If component 1 is weak or unknown, every metric in component 8 is suspect. Ask what was actually found in the systems table, not what the proposal assumed.
2. **One system generating value is enough early.** Milestones 1 to 2 should show one working piece, not a full dashboard.
3. **Each AI employee needs its work defined.** What counts as one unit of work, who it is for, and the human job it replaces. Record the default minutes source; client numbers beat estimates.
4. **Name the human-in-the-loop rules.** Every AI employee row should list what it must never do and where it hands off. Accounts that skipped this (RxVIP CAPTCHA suspension) paid for it.
5. **Separate layers.** Executive and floor systems can share a data layer but should be separate surfaces (World Emblem decision).
6. **Usage before features.** Component 10 is scored weekly through the usage score (1 Inactive to 5 Embedded). A live component with no users is not value.
7. **Mark the expansion edges.** The segmentation should make the next build visible: components in Discussed or Proposed state are the expansion backlog, and the trigger for each goes into the expansion plan.
8. **Keep Supernal's platform out of the client's product table** unless the client uses it directly (for example Pulse as their portal). Workbench, Insights and Hivemind are how we deliver, not what they bought.
9. **Defensibility.** Note whether the build is deep in the client's systems, data and strategy. "Tech defensible" is a weekly health field, re-assessed monthly.

## Sources

- Notion: "Pricing & Offering: What we sell and how we price" (Strats / Document Hub), last edited 2026-10-27.
- Notion: "Pulse for all clients" (Strats / Document Hub), last edited 2026-09-09.
- Notion: "AI Workforce: what your AI employees are worth" (Product / Product Requirement Docs, Draft), last edited 2026-11-04.
- Notion: "Supernal website · Alignment, decisions & launch checklist" (Strats / Document Hub), last edited 2026-11-11.
- Notion: "How to Build a Prototype" (GTM & Scoping), last edited 2026-09-02.
- Notion: "Order Form / Proposal Review Checklist", last edited 2026-06-11 (ownership models).
- Notion: "How To Guide" (AI Strategy Hub), last edited 2026-09-28 (usage score, tech defensible).
- Notion search for "Care Concierge": only pages from 2025 and February 2026 (for example "Consulting: 2/20/25", an untitled page dated 2026-02-23 asking "do customers pay for it?").
- Account research, section "6. Product": `/Users/tauseef/Supernal/ClientOS-v2/docs/context/world-emblem.md`, `ethic-select.md`, `hooray.md`, `rxvip.md` (as of 2026-11-13).
