# JetHQ: ClientOS context document

Compiled 14 Nov 2026. Depth: DEEP for Apr to Nov 2026, MEDIUM for May 2025 to Mar 2026 (reconstructed from one internal document). Account OS account id `01M20ZRNVPRZ4EE603ZADW95AX` (organization `01M20ZRNVMKMGZVNYEKZFJ1NRR`). Industry: business aviation, private-jet brokerage. Names used in sources: "JetHQ", "Jet HQ", "JHQ", and, in a few machine notes, "JED HQ". The planned company operating system is called "Flight Deck" or "FlightDeck" in most sources and "Flight Control" in Account OS and two internal meetings; they are the same thing. Source labels: "Slack" means #acnt-jethq-internal unless stated; "Notion weekly report" means the Weekly Account Health Reporting row for the week named; "360 doc" means Drive: 260317 JetHQ – 360° Project Intelligence Document (17 Mar 2026).

---

## 1. Snapshot

- **Who:** JetHQ, a business-aviation brokerage that buys and sells private jets, about 75 people, tracking about 80,000 aircraft across 184 markets and 170+ models and producing Fair Market Value (FMV) reports for clients (360 doc; JetHQ – Internal Bi-Weekly Sync, 24 Jun 2026). Owner and CEO Garrett; sales leader RJ Miller (Granola: JetHQ – Internal Bi-Weekly Sync, 29 May 2026).
- **What they bought:** (1) 8 May 2025: two AI employees, Marcus (market tracking) and Valerie (valuation), for $92,000 upfront plus $7,500 a month for 21 months, $249,500 in all (Drive: JetHQ SOW.pdf). (2) 9 to 10 Apr 2026: the AI Hub Addendum ("Phase 2"), six Hub modules for a further $2,500 a month, taking the total to $10,000 a month, term to 30 Jun 2027 (Drive: jethq-of-005-v1-signed.pdf).
- **What exists:** Marcus live since 12 Sep 2025; the Hub (hub.jethq.com) live since 20 Dec 2025, replacing a legacy system called Wunderbeast; Valerie live since 24 Aug 2026, with a Canva-style FMV editor shipped about 12 Nov 2026 (360 doc; Slack, 24 Aug and 12 Nov 2026).
- **Where it stands:** delivery is strong and the client is engaged; RJ is now the champion. Adoption of Valerie by sales engineers is the open question (they still build FMVs in Canva). The next sale, an intranet / Flight Deck order form, is drafted but unpriced and unsent, waiting on a scoping session with RJ before Johnny's 30 Nov deadline (Notion weekly report, wk of 2 Nov 2026; Slack, 10 Nov 2026).
- **Pod:** Account OS lists AM Stu (Stuart Childs), strategist Sven (Sven Boettger), FDE Jens (Jens Haakaas). The two closed deals list AM Johnny. The real team today: Stuart Childs (AM since Sep to Oct 2026), Johnny Borbone (co-AM, original seller), Sven Boettger (AI strategist), Mauro Raia (lead engineer, sole Mason since 1 Oct 2026). Jens left the account on 1 Oct 2026 (Account OS; Slack, 1 Oct 2026; Pulse Roll out - Strat Readiness, 21 Oct 2026).
- **Health:** 3.2 for the week of 9 to 15 Nov 2026 (previous 3.2). Tech 3, Strategic Defensibility 4, Exec Engagement 3, GM 2, Build 4. Band **Watch**, GM flagged low; renewal risk Medium, driver "Margin pressure" (Account OS). The Notion weekly report for 2 to 9 Nov says 🟢 Healthy and Sven's delivery sync on 9 Nov said healthy (Notion weekly report, wk of 2 Nov 2026; Delivery Sync, 9 Nov 2026). The two disagree; see section 14.

---

## 2. Structure of this account

Not "one AI employee". It is a three-product platform (two AI employees plus a custom aircraft-intelligence web app) bought under two order forms, with a third order form and a much larger company-OS menu in pipeline.

**Entities**

| Entity | Role | Source |
|---|---|---|
| JetHQ | The client. Signs and pays. | (Drive: JetHQ SOW.pdf) |
| Infinity Constellation Inc. (d/b/a Supernal) | Contracting party on Supernal's side; signed by Chris Chavez in 2025, Eric Kravitz in 2026. | (Drive: JetHQ SOW.pdf; jethq-of-005-v1-signed.pdf) |
| JetNet | Primary market-data provider; alerts, aircraft API, images. Its format changes have broken Marcus twice. | (360 doc) |
| VRef | Valuation-data provider (buyer-side, conservative values). API blocked from Oct 2025 to at least Mar 2026 by pricing and contract problems. | (360 doc) |
| Aircraft Blue Book (ABB) | Valuation-data provider (seller-side, higher values); data uploaded quarterly by hand. | (360 doc; Weekly Checkpoint, 22 Sep 2026) |
| Wunderbeast | Legacy Hub vendor; slow, responded only Tuesdays and Fridays; replaced by Supernal's Hub in Dec 2025. | (360 doc) |
| Salesforce, SharePoint/M365, Monday, Canva | JetHQ's existing tools that Flight Deck would absorb; Salesforce Enterprise costs about $100,000 a year for 30 seats plus a full-time admin. | (JetHQ "Flight Deck" Scoping, 1 Jul 2026; Delivery Sync, 10 Aug 2026, Fathom) |

**Contract stack**

1. **Supernal Terms & Conditions + Order Form, signed 8 May 2025** by Rebecca Johnson (JetHQ) and Chris Chavez (Infinity Constellation); created by Eric Kravitz, sent by Johnny. Two AI-driven agents: Market Tracking (Process A) and Aircraft Valuation (Process B). $92,000 upfront development fee in two $46,000 instalments; $7,500 a month invoiced 1 Aug 2025 to 1 Mar 2027 (21 payments); term to 31 Mar 2027; auto-renews 12 months at $7,500 unless notice 60 days before. California law. Filed in Drive as both "JetHQ SOW.pdf" and "jethq-of-004-v1-signed.pdf" (Drive).
2. **AI Hub Addendum (Phase 2), signed 9 Apr 2026 by RJ Miller, countersigned 10 Apr 2026 by Eric Kravitz.** Created 15 Nov 2025, sent 26 Nov and 9 Dec 2025, held by JetHQ's lawyer for over three months. Restates Phase 1 and adds six modules: Inventory Explorer, Document Import/Export & Reporting, User Management & Security, JetHQ Estimate, System Testing & QA, Migration & Go-Live. Fees: Phase 1 $7,500 a month, Phase 2 $2,500 a month. One advance annual payment of $114,000 invoiced 1 Jan 2026 (a 5% or $6,000 discount). Term 10 Apr 2026 to 30 Jun 2027; auto-renews 12 months at $10,000 a month unless notice 60 days before. Client must supply access and decisions within 5 business days. Filed as "JetHQ AI HUB Addendum + Supernal.pdf" and "jethq-of-005-v1-signed.pdf" (Drive; 360 doc).
3. **Draft "OF-001 | JetHQ: Aircraft Records & Intranet Discovery"** (Sep to Oct 2026, unsent): strategy month (current-state map, workshops by function, retirement sequence, Milestone 1 definition, phased FlightDeck proposal) then build months 2 to 3 (every document for a serial number lives on that aircraft's Hub record; active fleet migrated; brokers work from the aircraft page). $1,000 a month, 12 months, $12,000 total; renews at $1,000; 90 days' notice; $250 a month third-party costs included. Explicitly excludes decommissioning SharePoint, SOP library, Monday replacement, calendar, marketing library, vendor portal, Salesforce, sensitive HR data and a native app (Drive: Order Form OF-001 | JetHQ: Aircraft Records & Intranet Discovery). Note the numbering restarts at OF-001 although Drive files the signed forms as OF-004 and OF-005 (Drive).
4. **Flight Deck proposal menu** (Jul 2026, shown to Julie, not refreshed since): six build packages priced monthly; see section 5 (Slack, 11 Nov 2026).

**Products and workstreams**

| Product | What it is | Contract | Linear project |
|---|---|---|---|
| Marcus | AI employee for market tracking: reads JetNet alert emails, classifies them, updates the Hub, chases brokers for missing data | 8 May 2025 OF, Process A | P-JET-1 Marcus |
| Valerie | AI employee for valuation: assembles FMV reports from Hub, JetNet, VRef, Blue Book | 8 May 2025 OF, Process B | P-JET-4 Valerie |
| The Hub | hub.jethq.com, aircraft-intelligence web app, 80,000+ aircraft, market reports, JetHQ Estimate, My Desk, Value Curve | Phase 2 Addendum | P-JET-5 The Hub |
| Intranet / Flight Deck | Move SharePoint documents onto aircraft records, then a role-based company OS replacing intranet, Monday, parts of Salesforce | Draft OF-001; Account OS deal | P-JET-37 Intranet (Planned) |
| Pulse / Workbench | Supernal's own KPI and usage dashboards shown to JetHQ | Not contracted | none |

(Linear; Drive: JetHQ SOW.pdf; jethq-of-005-v1-signed.pdf)

**How it connects:** the Hub is the system of record that both AI employees write to and read from. Valerie's FMV quality depends on Hub data quality (JetNet sync, Blue Book uploads, value drivers), and Marcus keeps that data fresh. Flight Deck would wrap the Hub inside a company-wide OS; its first, smallest step (documents on aircraft records) is deliberately framed as a Hub feature so it can be sold for $1,000 a month (Drive: OF-001 draft; JetHQ AI Operating System - Further Technical Scoping, 26 Jun 2026).

**Deals**

| Title | Motion | Value | MRR | Stage | Dates | Owner | Source |
|---|---|---|---|---|---|---|---|
| JetHQ deal | New | $249,500 | $7,500 | Closed Won, Active | Closed 8 May 2025 | Johnny | (Account OS, deal `01M2RXHM6REVJ5QXC02CMMHCQA`) |
| JetHQ Expansion | Expansion | $67,500 | $2,500 | Closed Won, Active | Closed 9 Apr 2026 | Johnny | (Account OS, deal `01M2RXG2R13VFW5FQYDQENM39D`) |
| JetHQ Expansion - Flight Control OS | Expansion | $50,000 | none recorded | Prototype, Open, confidence Pipeline | Expected close 31 Dec 2026; next step "SOW + scope sign-off"; contact RJ Miller | Stu | (Account OS, deal `01M2RXM7NNF3P9BCVGPYGFZNX4`) |

The first deal's description in Account OS reads "Product strong; expansion live, ROI still being quantified" (Account OS).

---

## 3. Arc

Meeting counts are JetHQ-titled meetings found in Granola (client checkpoints, internal syncs, planning) plus JetHQ items in cross-account meetings; client meetings after 22 Sep 2026 were not recorded in Granola or Fathom except the 6 Nov FMV deep dive, so Oct and Nov counts come from Slack meeting write-ups.

**Q2 2025 (sale)**
- 25 Apr 2025: order form created by Eric Kravitz; sent by Johnny 25 Apr, 28 Apr, 6 May and 8 May; signed 8 May 2025 by Rebecca Johnson (Drive: JetHQ SOW.pdf audit trail).
- 12 May 2025: kickoff (Notion account page). Jun to Jul 2025: project at risk, waiting three weeks and more on Wunderbeast API documents (360 doc).

**Q3 2025 (Marcus)**
- Aug 2025: decision to replace Wunderbeast; 12 Aug 2025 shared Slack channel #accounts-jethq opened with Rebecca Johnson and Laurie Barringer (360 doc; Slack #accounts-jethq, 12 Aug 2025).
- 12 Sep 2025: Marcus live in production, the first AI employee (360 doc).

**Q4 2025 (Hub)**
- Oct 2025: VRef announced an API price rise; Valerie's full version blocked. 23 to 30 Oct: Phase 2 scoped at 155 hours, six modules. Nov: Hub build on Lovable. 15 Nov: addendum drafted. 20 Dec 2025: Hub live at hub.jethq.com (360 doc; Drive: jethq-of-005 audit trail).

**Q1 2026 (stabilisation)**
- Jan 2026: Julie raised accuracy concerns; 369 duplicate aircraft found (leading zeros); audit system built. Feb: JetNet ID coverage 78,000 of 81,000; 17 Feb decision to start Valerie as a "Desktop FMV" without VRef using Julie's Canva template. 11 Mar: Hanan's valuation methodology deep dive. 16 Mar: Valerie development kicked off. 17 Mar: Laurie Barringer (market research manager) left for another brokerage; Robert Belesario (QA) and Darren Gisulga (valuations) took over (360 doc; Delivery Planning Weekly, 16 Mar 2026).
- Time logged 4 Jan to 13 Mar: 215 hours, 89% maintenance, 4% new build (360 doc).
- 20 Mar 2026: internal channel #acnt-jethq-internal created (Slack).

**April 2026**
- 8 Apr: pipeline review lists a $120,000 Jet HQ expansion, choosing between finishing current scope and adding marketing and Salesforce automations; AI strategy session planned for early May with Garrett and RJ (Weekly Pipeline Review, 8 Apr 2026).
- 9 to 10 Apr: Phase 2 addendum signed (Drive: jethq-of-005).
- Late Apr: Julie texted asking Supernal to take JetHQ off its website; account rated red (JetHQ – Internal Bi-Weekly Sync, 29 May 2026; Delivery Team Sync, 4 May 2026). 28 Apr: account health review document (Drive: Account Health Review - JetHQ - 4/28/26.docx, not opened).

**May 2026 (turnaround, about 12 meetings)**
- 1 May: internal alignment. Client saw the Hub as 50% done against Supernal's 94%; about 20 feature requests pending; plan to move to a flexible build program, raise capacity from 1/8 FTE junior to 1/2 FTE senior, bring Mauro on full time and ease Jens off over May to July (JetHQ Internal Alignment, 1 May 2026; Delivery Team Sync, 4 May 2026).
- 11 May: red to yellow, 60+ build items (Delivery Planning Weekly, 11 May 2026). 12 to 13 May: "wall" demo recording landed well; JetHQ wanted its Confluence-style intranet rebuilt the same way (JetHQ Follow up, 13 May 2026).
- 15 May: JetHQ wants the Hub to become a company intranet with department modules; momentum swung from "take us off your website" to highly engaged in a week (JetHQ – Internal Bi-Weekly Sync, 15 May 2026). 19 May: roadmap special checkpoint. 29 May: Eric Kravitz leaving; Sven now in the account seat (JetHQ – Internal Bi-Weekly Sync, 29 May 2026).

**June 2026 (about 10 meetings)**
- Pulse dashboard shown to JetHQ; they wanted more KPIs, engineering timeline months out (Weekly Checkpoint, 9 and 16 Jun 2026; JetHQ – Internal Bi-Weekly Sync, 24 Jun 2026).
- 22 Jun: yellow trending green; 29 Jun: back to green (Delivery Planning Weekly, 22 and 29 Jun 2026).
- 24 to 26 Jun: Johnny met Roxy (outsourced Salesforce admin); 26 Jun Julie presented the FlightDeck vision (JetHQ AI Operating System - Further Technical Scoping, 26 Jun 2026).

**July 2026 (about 9 meetings)**
- 1 Jul: Flight Deck scoping; Phase 0 estimated under $4,000 a month (JetHQ "Flight Deck" Scoping, 1 Jul 2026). 8 Jul: pricing menu and "Jetty" chat agent idea (JetHQ, 8 Jul 2026).
- 8 Jul: Supernal supply-chain security incident (52 minutes of developer-account access); JetHQ systems not affected; disclosed to JetHQ on 28 Jul (Weekly Checkpoint, 28 Jul 2026). The Hub moved off Lovable to Railway during July (Slack, 17 Aug 2026).
- About 9 Jul: RJ's tech talk to 50+ JetHQ staff; 15 quotes collected, 12 from RJ; FMV time said to fall from 1.5 to 2 weeks to 5 minutes; account called "boldly green" (local: 2026-07-13-all-hands.md; All Hands, 14 Jul 2026).
- 22 Jul: JetHQ hired an internal "AI junkie" who pitched Garrett on building it all himself with Replit and Claude Code (JetHQ – Internal Bi-Weekly Sync, 22 Jul 2026). 27 Jul: yellow (Delivery Planning Weekly, 27 Jul 2026).

**August 2026 (about 5 meetings)**
- About 7 Aug: Julie Boake, the champion, was let go; Flight Deck deal "in limbo" (Weekly Pipeline Meeting, 12 and 19 Aug 2026). 10 Aug: Salesforce exit framed as the cost-saving case (Delivery Sync, 10 Aug 2026, Fathom).
- 17 Aug: finance flagged a GM drop (Jul 64 hours against Jun 37.5) (Slack, 17 Aug 2026). 18 Aug: product workshop; Value Rank idea from Clay (Bi-Weekly Product Workshop, 18 Aug 2026).
- 24 Aug: Valerie live (Slack, 24 Aug 2026).

**September 2026 (about 6 meetings)**
- 1 Sep: My Desk demo; Stuart joins calls (Weekly Checkpoint, 1 Sep 2026). About 11 to 12 Sep: JetHQ all-team offsite with Garrett; Supernal presented the roadmap remotely (Slack, 9 Sep 2026).
- 15 Sep: JetHQ prioritised four Valerie tasks for Q4, due 31 Oct; Marcus and intranet items moved behind them (Weekly Checkpoint, 15 Sep 2026; Linear).
- 28 Sep: green; intranet order form being priced (Delivery Sync, 28 Sep 2026).

**October 2026 (about 8 client sessions per Slack)**
- 1 Oct: Jens taken off the account; Mauro leads all calls (Slack, 1 Oct 2026). 3 Oct: old Lovable build taken down (Notion: Delivery review standing context).
- 6 Oct: Stu named AM (Slack, 6 Oct 2026). 9 Oct: OF priced at three margin options (GTM + Scoping, 9 Oct 2026).
- About 19 Oct: first Valerie FMV used by a JetHQ sales VP with a client (Slack, 20 Oct 2026). 21 Oct: Pulse judged not ready for JetHQ (Pulse Roll out - Strat Readiness, 21 Oct 2026). 22 Oct: Railway incident, keys to rotate (Slack, 22 Oct 2026).
- About 27 to 28 Oct: QBR run by Stuart and Johnny; client happy, intranet raised as the next deal (Slack, 27 to 28 Oct 2026; Delivery Sync, 2 Nov 2026).

**November 2026 (to 14 Nov, about 5 client sessions)**
- 2 Nov: OF-001 draft circulated; RJ may want the whole intranet, not just documents (Slack, 2 Nov 2026). 4 Nov: $3,000 OpenAI spend in a day traced to an old unrevoked key (Slack, 4 Nov 2026).
- 5 Nov: checkpoint; Stuart had never seen RJ so engaged; Value Rank shown, top 15 of 483 aircraft (Slack, 5 Nov 2026; Notion weekly report, wk of 2 Nov 2026).
- 6 Nov: FMV deep dive with sales engineers; RJ stayed the hour (Supernal // JetHQ FMV Deep Dive, 6 Nov 2026, Fathom).
- 10 Nov: ten FMV data fixes live; Value Curve changes live; intranet scoping still unscheduled (Slack, 10 to 12 Nov 2026). About 12 Nov: Canva-style FMV editor live ahead of Hanan's 17 Nov date (Slack, 12 Nov 2026).
- 13 Nov: Account OS health 3.2, Watch (Account OS).

---

## 4. Why they bought

**The first deal (May 2025)**
- The order form names the pain: manual market tracking from JetNet alerts and manual data collection across Bluebook, VRef, JetNet and AviaCost to produce valuations (Drive: JetHQ SOW.pdf). Notion states the limiting factor as manual market and valuation work across 80,000 aircraft records capping broker capacity (Notion account page).
- Garrett had already spent heavily on a Hub over three years (said to be over $500,000) with a vendor, Wunderbeast, that was slow and only answered twice a week (local: 2026-07-13-all-hands.md; 360 doc).
- Who championed it, what was demoed and what alternatives were weighed before signing: **not found**. One internal note says the contract was signed by Rebecca without Garrett's knowledge and he never loved the arrangement (JetHQ – Internal Bi-Weekly Sync, 22 Jul 2026). Pre-signature calls predate all sources reached.

**What unlocked Phase 2 (Apr 2026)**
1. Supernal had replaced Wunderbeast with its own Hub (live Dec 2025), which created a module roadmap to sell (360 doc).
2. The addendum had been negotiated since Nov 2025; JetHQ's lawyer held it for three months and Supernal's internal stance was to bill the new rate regardless; RJ finally signed on 9 Apr (360 doc; Drive: jethq-of-005).
3. The annual prepay with 5% off ($114,000 on 1 Jan 2026) gave JetHQ a reason to commit (Drive: jethq-of-005).

**What is driving the next deal (intranet / Flight Deck)**
1. **Tool sprawl and cost:** Salesforce Enterprise at about $100,000 a year for 30 seats plus a full-time admin, Einstein too limited, a separate engineer building a JetNet-Salesforce integration that duplicates the Hub (JetHQ "Flight Deck" Scoping, 1 Jul 2026; Delivery Sync, 10 Aug 2026, Fathom).
2. **An unmaintained intranet:** SharePoint/OneDrive split after a salesperson once deleted everything; Monday used as a basic checklist (JetHQ AI Operating System - Further Technical Scoping, 26 Jun 2026).
3. **Proof from the Hub:** RJ's own tech talk praised it as faster and smarter than anything they had (local: 2026-07-13-all-hands.md).
4. **RJ's push:** he wants everyone at JetHQ working inside the Hub instead of the intranet and raises it on every call (Slack, 2 Nov 2026; Delivery Sync, 9 Nov 2026).

**Alternatives they have:** build in-house with the internal AI hire (raised Jul 2026); keep Salesforce and the paid integration engineer (JetHQ – Internal Bi-Weekly Sync, 22 Jul 2026; 24 Jun 2026).

---

## 5. Commercials

**Pricing model:** a fixed monthly subscription per AI employee and platform scope, not points or hours on the client side. Internally the account is run on a flexible-build idea where work is added by email without new contracts, and the internal point system is never shown to JetHQ (JetHQ Internal Alignment, 1 May 2026).

**Every price found**

| When | Price | Context | Source |
|---|---|---|---|
| 8 May 2025 | $92,000 upfront ($46,000 × 2) + $7,500/mo × 21 = $249,500 | Signed order form | (Drive: JetHQ SOW.pdf) |
| 8 May 2025 | Renewal at $7,500/mo for 12 months | Auto-renew clause | (Drive: JetHQ SOW.pdf) |
| Nov 2025 to Apr 2026 | +$2,500/mo Phase 2; $10,000/mo total | AI Hub Addendum, 155 hours scope | (Drive: jethq-of-005; 360 doc) |
| 1 Jan 2026 | $114,000 annual prepay (5%, $6,000 discount) | Addendum payment clause | (Drive: jethq-of-005) |
| Term end | Renewal at $10,000/mo for 12 months | Addendum auto-renew | (Drive: jethq-of-005) |
| 8 Apr 2026 | $120,000 expansion in pipeline | Pipeline review | (Weekly Pipeline Review, 8 Apr 2026) |
| 1 May 2026 | $10,000/mo seen internally as about 20 hours a week (0.5 FTE) | Internal capacity framing | (JetHQ Internal Alignment, 1 May 2026) |
| 15 May 2026 | $1,000/mo baseline per module; $2,500 per added department module; aim $20,000/mo in 12 to 18 months | Intranet modules idea | (JetHQ – Internal Bi-Weekly Sync, 15 May 2026) |
| 1 Jul 2026 | Phase 0 (home, intranet, aircraft/hub) under $4,000/mo; native app uplift about $2,500/mo | Flight Deck scoping | (JetHQ "Flight Deck" Scoping, 1 Jul 2026) |
| Jul 2026 | Menu: Home & Mission Control $2,000; Markets & Listings $1,000; Intranet, Knowledge & Marketing $2,000; Ask Jetty $2,000; Sales Ops $2,500; Admin & Finance unpriced | Flight Deck proposal page | (Slack, 11 Nov 2026) |
| 9 Oct 2026 | $500 / $750 / $1,042 a month | Three margin options for the Aircraft Records OF, awaiting Johnny | (GTM + Scoping, 9 Oct 2026) |
| Oct 2026 | $1,000/mo, $12,000 for 12 months | OF-001 draft | (Drive: OF-001 draft) |
| Oct 2026 | $2,000 MRR | Notion opportunity "JetHQ – FlightDeck scope", target close 31 Oct | (Notion opportunity page) |
| Nov 2026 | $50,000 | Account OS "Flight Control OS" deal | (Account OS) |
| 10 Nov 2026 | "Aggressive pricing" to close by end of year | Stuart's stance | (Notion GTM update, 12 Nov 2026) |

**Hours behind the draft OF:** sized at about 100 hours with scoping (Mauro and Sven); Johnny questioned an earlier 200-hour figure on 6 Oct (Slack, 6 Oct and 2 Nov 2026).

**Terms in force:** net 30, 1% a month interest, Supernal may suspend during a 30-day cure period; liability capped at 12 months' fees; Supernal owns Task Outputs but must export agent instructions (Agent Code) on request with copyright assigned to JetHQ; California law (Drive: JetHQ SOW.pdf). The 360 doc says JetHQ owns the Hub front-end source and Supernal retains platform and orchestration (360 doc).

**Renewal:** current term ends 30 Jun 2027; notice of non-renewal due 60 days before, about 1 May 2027 (inferred); renewal price $10,000 a month (Drive: jethq-of-005; Notion account page).

**Margin:** Notion marks "Break even" (Notion account page, edited 5 Oct 2026). 360 doc margin on $7,500 revenue: Jan 33%, Feb 46%, Mar 67% projected (360 doc). Finance flagged GM erosion in July (Slack, 17 Aug 2026). Account OS GM score 2, flagged low, renewal driver "Margin pressure" (Account OS). A $3,000 one-day OpenAI charge on 4 Nov came from an older unrevoked key, not JetHQ workloads (Slack, 4 Nov 2026).

**Unresolved**
- Intranet OF price (three options, $1,000 draft, $2,000 Notion, $50,000 Account OS) and scope (documents only, or whole intranet).
- Whether the Flight Deck menu is refreshed before RJ sees it; its timelines still say Q3/Q4 2026 (Slack, 11 Nov 2026).
- Case study: JetHQ asked Supernal to remove it; an anonymised LinkedIn post is blocked until Stu checks naming (Notion account page; Notion social post page, 12 Nov 2026).

---

## 6. Product

**Marcus (AI employee, live since 12 Sep 2025)**
- What it does: polls a JetHQ Outlook inbox every minute for JetNet alert emails, extracts the aircraft, classifies each change (new listing, price change, sale, status change, company change, 100% fleet sale) with OpenAI or rules, writes to the Hub, logs to Google Sheets, contacts brokers for missing data, flags fleet sales for manual review (360 doc).
- Users: market research team (Brooks, Clay), QA by Robert Belesario reviewing about 10 updates a day (360 doc).
- State: >95% accuracy milestone achieved; migration off n8n to a Marcus service at 14% against a 31 Oct target; "researchers stop maintaining alert rules by hand" 0%, due 31 Dec (Linear).

**The Hub (live since 20 Dec 2025)**
- hub.jethq.com, about 80,000 aircraft with status, days on market, JetHQ Estimate, JetNet weekly sync, market and finalist PDF reports, CSV export, roles, audit history, help videos, notes (360 doc). Later added: sale-type classification, My Desk live market station, market snapshots since April, Market Charts, Value Curve, landings by month, engine times, SharePoint link per aircraft, Ctrl+K search (Weekly Checkpoints, 1 and 22 Sep 2026; Slack, 5 and 10 Nov 2026).
- Users: researchers, brokers, sales engineers; JetHQ-wide adoption 80% in Linear, target 31 Dec 2026 (Linear).
- Stack: Supabase Postgres, React front end first built on Lovable then moved to Railway, n8n being retired, OpenAI, react-pdf, JetNet API (360 doc; Slack, 17 Aug and 22 Oct 2026).

**Valerie (AI employee, live since 24 Aug 2026)**
- What it does: builds a full FMV report for a serial number: market snapshot, comps, historical pricing, value drivers from VRef and Blue Book, maintenance and programs, photos, appendix; reads uploaded spec and status PDFs (Weekly Checkpoints, 15 and 22 Sep 2026; Linear).
- Users: Hanan Saliba (valuation lead) and sales engineers Fernando, Vlad, Sameer; one FMV a day on average in early Nov (Slack, 4 Nov 2026).
- State: first client-facing use about 19 Oct; ten data fixes 10 Nov; Canva-style editor (zoom, drag, Excel-like tables and formulas, 3/6/9 photo grids) live about 12 Nov. Linear milestone "An FMV is built end to end inside Valerie" due 31 Oct shows 0% (Slack, 20 Oct, 10 and 12 Nov 2026; Linear).

**Value Rank / Value Curve (Hub feature, building)**: ranks aircraft in a market from best to worst buy on weighted features. Three users; not to be shown to brokers until renamed and accurate for two quarters; calibration waits on spec sheets from Brooks and a features sheet (Slack, 10 to 13 Nov 2026; Bi-Weekly Product Workshop, 18 Aug 2026).

**Intranet / Flight Deck (planned)**: role-based home screen; intranet and SOP library; people hub; marketing hub; vendor portal; calendar; CRM view over Salesforce; admin and finance; Ask Jetty copilot; Hub as the markets module. Prototype at svenboettger-supernal.github.io (JetHQ "Flight Deck" Scoping, 1 Jul 2026; Slack, 9 Sep 2026). Linear milestones: Milestone 1 sign-off (30 Sep, 0%), documents on aircraft (31 Dec, 0%), intranet switched off (30 Jun 2027, 0%) (Linear).

**Pulse / Workbench**: Supernal's KPI dashboards; JetHQ "live with core metrics" per one note but judged far from ready on 21 Oct (Check-In: World Emblem, 1 Oct 2026; Pulse Roll out - Strat Readiness, 21 Oct 2026).

### Feature rationale

1. **Build a new Hub instead of waiting on Wunderbeast.** Reason: the legacy vendor was too slow and only responded Tuesdays and Fridays, stalling the project for weeks (360 doc, Aug 2025 decision).
2. **Start Valerie as a "Desktop FMV" on existing Hub data and Julie's Canva template.** Reason: VRef's API was blocked by pricing and contract problems since Oct 2025 (360 doc, 17 Feb 2026 decision).
3. **VRef value takes precedence; Blue Book only where VRef is missing; never count an option twice.** Reason: the two sources differ by $1M to $1.5M on the same aircraft and double counting inflated estimates (Weekly Checkpoint, 28 Jul 2026; 360 doc).
4. **Price FMVs from comps, using sales in the last six months, sorted by serial.** Reason: book values are starting points; markets move fast and older sales mislead (Weekly Checkpoint, 22 Sep 2026; Supernal // JetHQ FMV Deep Dive, 6 Nov 2026).
5. **A two-layer FMV design system with an 80% baseline template and per-serial edits, then a full Canva-style editor.** Reason: fixed fields forced sales engineers to ask Supernal for changes, and editing took Hanan about 4 hours, the same as Canva (Weekly Checkpoint, 15 Sep 2026; Slack, 5 Nov 2026).
6. **Four sale types; internal sales, new deliveries and foreclosures excluded from market stats.** Reason: numbers should reflect real market transactions only (Slack, QBR deck thread, 28 Oct 2026).
7. **Daily hours and landings from JetNet's standard record, not the paid ADS-B add-on; landings estimated from monthly flights.** Reason: the sales team did not value the add-on and JetNet's landing count barely moves (Weekly Checkpoint, 21 Jul 2026; Slack, 28 Oct 2026).
8. **JetNet refresh never overwrites manual edits.** Reason: off-market aircraft carry data JetNet does not have (Weekly Checkpoint, 1 Sep 2026; Slack, 10 Nov 2026).
9. **Sales users see "Intel" instead of Notes and no History tab; researchers keep both.** Reason: brokers need the deal context, not the audit trail (Weekly Checkpoint, 5 May 2026).
10. **Sell the intranet as a bounded first step (documents on the aircraft record), not a SharePoint switch-off.** Reason: keeps the first order form near 100 hours and lets discovery define the rest (Drive: OF-001 draft; Slack, 2 Nov 2026).
11. **Flight Deck priced as a menu of modules ("layer cake").** Reason: lets JetHQ pick by priority and gives a clear path to $20,000 a month without arbitrary pricing (JetHQ, 8 Jul 2026).

---

## 7. Use cases and feedback

**By team**
- **Market research (Brooks, Clay, formerly Laurie):** daily market tracking, market reports, My Desk per assigned market, analytics for posts on X and LinkedIn, quarterly report like OGARA (Bi-Weekly Product Workshop, 18 Aug 2026; Weekly Checkpoint, 1 Sep 2026).
- **Valuations and sales engineers (Hanan, Fernando, Vlad, Sameer):** FMV reports for client pitches; tech-talk templates (Supernal // JetHQ FMV Deep Dive, 6 Nov 2026).
- **Brokers and sales leadership (RJ, Chris Hancock):** walking into client meetings with market and FMV in hand; value rank for hesitant buyers and sellers (local: 2026-07-13-all-hands.md; Bi-Weekly Product Workshop, 18 Aug 2026).
- **Leadership and ops (Garrett, RJ, Julie until Aug):** intranet replacement, Salesforce exit, project tracking (JetHQ AI Operating System - Further Technical Scoping, 26 Jun 2026).

**Adoption and usage numbers**
- Hub adoption 80% toward company-wide use (Linear).
- Usage score 4, "client uses it proactively" (Notion weekly report, wk of 2 Nov 2026).
- Valerie: about one FMV a day; Fernando had built none in two weeks per PostHog (Slack, 4 Nov 2026; Notion weekly report, wk of 2 Nov 2026).
- Value Curve: 3 users (Slack, 13 Nov 2026).
- 41 items closed in the week of 2 Nov (Notion weekly report, wk of 2 Nov 2026).
- May 2026: one sales manager used the Hub daily; 30+ attended a company meeting where it was shown (Delivery Team Sync, 4 May 2026).

**Feedback and what changed**

| Feedback | What changed | Source |
|---|---|---|
| Hub "50% done", accuracy concerns, website removal request (Apr 2026) | Mauro added; roadmap prioritisation; client-visible backlog | (JetHQ Internal Alignment, 1 May 2026; JetHQ Follow up, 13 May 2026) |
| Pulse needs more KPIs (Jun 2026) | Months-long engineering delay flagged to leadership | (JetHQ – Internal Bi-Weekly Sync, 24 Jun 2026) |
| Slow acknowledgement of support emails (Sep 2026) | Same-day acknowledgement rule; email notifications | (Slack, 3 and 17 Sep 2026) |
| Landings not updating (Sep 2026) | Landings by month from JetNet flights (Nov) | (Weekly Checkpoint, 1 Sep 2026; Slack, 5 Nov 2026) |
| FMV graphs need labelled axes; editable design (Sep 2026) | Axes; editor | (Weekly Checkpoint, 15 Sep 2026) |
| FMV data wrong, tables not editable, need Canva AI image tools (6 Nov 2026) | Ten data fixes and editor live by 12 Nov; AI image tools not yet confirmed | (Supernal // JetHQ FMV Deep Dive, 6 Nov 2026; Slack, 10 to 12 Nov 2026) |
| Value Curve: simplify, show market direction, filters should hide points | Four changes live 13 Nov | (Slack, 13 Nov 2026) |
| RJ wants daily feedback from his team, not weekly | Walkthrough sessions with sales engineers | (Slack, 5 Nov 2026) |

---

## 8. Stakeholders

**Client**

| Person | Title | Role on the account | Stance then and now | Last notable interaction | Source |
|---|---|---|---|---|---|
| Garrett | Owner and CEO | Economic power; rarely engaged | Never bought in; cost-focused; cares about selling jets, not AI. Attended Sep offsite. | JetHQ offsite, about 11 to 12 Sep 2026 | (JetHQ – Internal Bi-Weekly Sync, 29 May and 22 Jul 2026; Slack, 9 Sep 2026) |
| RJ Miller | Sales leader (title not recorded); Garrett's college roommate | Signed Phase 2; Account OS primary contact; Notion economic buyer | Start: hot and cold, possible limiter. Now: champion, 12 of 15 tech-talk quotes, raises intranet every call, "never this engaged". | FMV deep dive, 6 Nov 2026 | (Drive: jethq-of-005; Account OS; local: 2026-07-13-all-hands.md; Slack, 5 Nov 2026) |
| Rebecca Johnson | Signatory of the 2025 contract (360 doc says VP Ops) | Original buyer; handled VRef contract | Not seen in 2026 meetings | Signed 8 May 2025 | (Drive: JetHQ SOW.pdf; 360 doc) |
| Julie Boake | Fractional CMO, effectively full time | Champion; FlightDeck mockup author | Start: defensive. Mid: champion. Let go about 7 Aug 2026. | Flight Deck scoping, 26 Jun 2026 | (Johnny / Sven - JetHQ Prep, 26 Jun 2026; Weekly Pipeline Meeting, 12 Aug 2026) |
| Hanan Saliba | Valuation expert | Valerie domain owner; Blue Book owner | Engaged throughout; sets Valerie dates; leave from mid-Nov | Editor date 17 Nov | (360 doc; Slack, 10 Nov 2026) |
| Brooks Boschert | Market research lead | Gatekeeper of feature requests; bi-weekly | Supporter | Bi-weekly, 10 Nov 2026 | (Brooks Email JetHQ Jens, 2 May 2026; Slack, 13 Nov 2026) |
| Clay Marks | Market research | Value Rank originator | Supporter | Bi-weekly, 10 Nov 2026 | (Bi-Weekly Product Workshop, 18 Aug 2026) |
| Fernando | Sales engineer | FMV user; data critic | Claims missing data; low usage per PostHog | FMV deep dive, 6 Nov 2026 | (Notion weekly report, wk of 2 Nov 2026) |
| Chris Hancock | Sales | Demo requests, feedback | Neutral to supporter | Feedback thread, 30 Sep 2026 | (Slack, 30 Sep 2026) |
| Vlad Tiulchenko, Sameer | Sales engineers | FMV users | Valuations "much better" (Vlad) | 5 to 6 Nov 2026 | (Slack, 5 Nov 2026) |
| Jordan Rogers | Not recorded | Attends checkpoints | Unknown | Weekly Checkpoint, 4 Aug 2026 | (Granola attendee lists) |
| Roxy | Outsourced Salesforce admin | Salesforce owner | Building a duplicate JetNet integration | Met Johnny about 25 Jun 2026 | (Johnny / Sven - JetHQ Prep, 26 Jun 2026) |
| Laurie Barringer | Market research manager | Early QA partner | Left 17 Mar 2026 | Handoff videos | (360 doc) |
| Robert Belesario, Darren Gisulga | Marcus QA; valuations | Took over from Laurie | New in Mar 2026 | Mar 2026 | (360 doc) |
| Internal AI hire (unnamed) | In-house AI generalist | DIY threat | Pitched replacing Supernal | Jul 2026 | (JetHQ – Internal Bi-Weekly Sync, 22 Jul 2026) |

Account OS has no stakeholders on the power map (Account OS).

**Supernal team over time**
- **Sale and Phase 1 (2025):** Johnny Borbone (seller, lead), Eric Kravitz (built the order form, later signatory), Chris Chavez (Infinity signatory), Jon and Britton Ware (2025 onboarding), Jens Haakaas (builder) (Drive: JetHQ SOW.pdf; Slack #accounts-jethq, Aug 2025; 360 doc).
- **Early 2026:** Jens (lead engineer), Saad Farooq (bug fixes), Nana Williams (PM with Sven), Sven Boettger (strategist from about Apr), Eric until end of May (Delivery Team Sync, 4 May 2026; JetHQ – Internal Bi-Weekly Sync, 29 May 2026).
- **May to Sep 2026:** Mauro Raia added full time from about 4 May; Jens tapering; Thomas Bustos and Ryan Williams in internal syncs (JetHQ Internal Alignment, 1 May 2026).
- **From Sep to Oct 2026:** Stuart Childs AM (Johnny co-AM), Sven strategist, Mauro sole engineer; Jens off from 1 Oct (Slack, 1 and 6 Oct 2026; Pulse Roll out - Strat Readiness, 21 Oct 2026). Sven also carries Heritage and VHC in Squad 2 coverage (Strat Team Standup, 9 Nov 2026).

---

## 9. Success and value

**Success criteria and KPIs**

| Criterion | Baseline | Target | Current | Source |
|---|---|---|---|---|
| Marcus accuracy | n/a | >95% | Achieved (Mar 2026) | (Linear) |
| JetHQ-wide Hub adoption | Wunderbeast | All researchers and brokers work in the Hub | 80%, target 31 Dec 2026 | (Linear) |
| FMV built end to end in Valerie | Canva, about 4 hours to edit | No Bluebook, VRef or design requests | 0% in Linear, due 31 Oct; editor live 12 Nov | (Linear; Slack, 12 Nov 2026) |
| FMV turnaround | 1.5 to 2 weeks | Minutes | About 5 minutes (client claim) | (local: 2026-07-13-all-hands.md) |
| For-sale data freshness | Weekly Saturday sync | Daily | 0%, due 31 Dec | (Linear) |
| Adoption dashboard JetHQ can read | Supernal pulls data | Self-serve | 0%, due 31 Dec | (Linear) |
| Company search | None | Search by company | 100% | (Linear) |
| Value Rank buy recommendation | None | Ranked buys with movement | 0%, due 31 Mar 2027 | (Linear) |
| Support-email volume (risk indicator) | n/a | Falling | Three Hub threads 29 Sep to 3 Oct | (Notion: Delivery review standing context) |
| Revenue attribution (AI touching deals) | None | Track deals touched | Not built | (JetHQ – Internal Bi-Weekly Sync, 29 May 2026) |

Account OS holds no success-plan goals, no value entries and no cadence events (Account OS). Notion's hygiene checklist marks value and usage metrics as only partly defined and QBR cadence not agreed (Notion account page).

**Value shown to the client:** FMV time from weeks to minutes; Hub as "JetNet on steroids" in RJ's tech talk; first Valerie FMV used in a client pitch; a framing that 74 aircraft were sold during a two-week incident investigation was proposed for Garrett (local: 2026-07-13-all-hands.md; Slack, 20 Oct 2026; JetHQ – Internal Bi-Weekly Sync, 22 Jul 2026).

**What the sponsors have asked to see:** RJ: Valerie adoption by sales engineers as priority one, daily team feedback, the whole intranet in the Hub (Slack, 2 and 5 Nov 2026). Garrett: selling more jets, not AI; attribution and measurable output (JetHQ – Internal Bi-Weekly Sync, 29 May and 22 Jul 2026).

---

## 10. Delivery now

| Workstream | State | Milestone % and date | What is measured | What was learned | Blocker |
|---|---|---|---|---|---|
| Valerie (FMV) | Live, in adoption | End-to-end FMV 0% in Linear, due 31 Oct (passed); editor live about 12 Nov (Linear; Slack) | Sales engineers building FMVs in Valerie instead of Canva | Check usage data before treating a complaint as a defect (Notion weekly report, wk of 2 Nov 2026) | Hanan's leave from mid-Nov; Canva AI image tools; value-driver calibration |
| The Hub | Live | Adoption 80% (31 Dec); company search 100%; wants and inventory 0%; daily data 0%; adoption dashboard 0% (Linear) | Adoption, support-email count | Volume of support emails is the real risk signal (Notion: Delivery review standing context) | none named |
| Value Rank / Value Curve | Building | Buy recommendation 0% (31 Mar 2027) (Linear) | Users (3), accuracy | Not for brokers until accurate for two quarters (Slack, 13 Nov 2026) | Spec sheets and features sheet from Brooks and Clay |
| Marcus | Live, migrating | Runs without n8n 14% (31 Oct, passed); alert rules 0% (31 Dec) (Linear) | Alert accuracy | Sequenced behind Valerie per JetHQ (Linear) | Valerie work first |
| Intranet / Flight Deck | Not started, scoping | Milestone 1 sign-off 0% (30 Sep, passed) (Linear) | OF signed | Re-verify September scope; RJ may want the whole intranet (Slack, 2 Nov 2026) | Scoping session with RJ not scheduled; price undecided |
| Security and keys | Open | none | Key rotation | Old keys cost $3,000 in a day (Slack, 4 Nov 2026) | JetNet and VRef key rotation unconfirmed since 22 Oct |

**Decisions waiting**
- Intranet scope (documents only or whole intranet) and price ($500 to $2,000 a month or larger menu) before the OF goes to RJ by 30 Nov (Notion weekly report, wk of 2 Nov 2026; GTM + Scoping, 9 Oct 2026).
- Whether to refresh and re-show the Flight Deck six-package menu (Slack, 11 Nov 2026).
- Pulse rollout to JetHQ: hold or fix first (Pulse Roll out - Strat Readiness, 21 Oct 2026).
- Account OS pod and health: Jens still listed as FDE (Account OS).

**Slipping**
- Valerie end-to-end milestone 31 Oct and Marcus n8n exit 31 Oct are past in Linear; Sven's rule is that internal Linear dates do not on their own make the account at risk (Linear; Notion: Delivery review standing context).
- Intranet Milestone 1 sign-off (30 Sep) not started (Linear).
- Recent sales losing their sale price after a JetNet status update; fix unconfirmed (Notion weekly report, wk of 2 Nov 2026).
- Notion opportunity target close 31 Oct passed (Notion opportunity page).

**Commitments with no Linear issue (found)**
- Intranet scoping session with RJ; refresh of the Flight Deck menu; key rotation; Canva-style AI image tools (expand, eraser); fleet location US versus international; My Desk market links (Slack, 10 to 13 Nov 2026; Supernal // JetHQ FMV Deep Dive, 6 Nov 2026). Whether each has a Linear issue was not checked issue by issue.

**Dates in the next 30 days**
- 16, 23, 30 Nov and 7 Dec: JetHQ Weekly Planning (internal, Mondays) (Slack).
- 17 Nov: Hanan's latest date for the editor (met early); weekly checkpoint (Tuesdays) (Slack, 10 Nov 2026).
- Mid-Nov: Hanan's leave begins (Notion weekly report, wk of 2 Nov 2026).
- 24 Nov (inferred from bi-weekly cadence): bi-weekly with Brooks and Clay.
- 30 Nov: Johnny's deadline for intranet OF and scoping with RJ; Linear company-search milestone date (Notion weekly report, wk of 2 Nov 2026; Linear).

---

## 11. Artifacts

| Title | Kind | Date | Owner | Where | What it is for |
|---|---|---|---|---|---|
| JetHQ SOW.pdf (also jethq-of-004-v1-signed.pdf) | Order form | 8 May 2025 | Johnny | [Drive](https://drive.google.com/file/d/15sGRTIMkY9MFotrCx6DtRankM8FYnNlP/view) | Signed terms and Phase 1 order form |
| jethq-of-004-v1-signed.pdf | Order form | 8 May 2025 | Johnny | [Drive](https://drive.google.com/file/d/1iklFtyGeP3NoZdPpAKysMEDFZli1zKRO/view) | Same order form, contracts filing |
| JetHQ AI HUB Addendum + Supernal.pdf (also jethq-of-005-v1-signed.pdf) | Order form | 10 Apr 2026 | Johnny, Eric | [Drive](https://drive.google.com/file/d/1X9hZ8CuoHkZ4xESjNAqHvhPWoyAIqyT3/view) | Phase 2 addendum with terms |
| jethq-of-005-v1-signed.pdf | Order form | 10 Apr 2026 | Johnny | [Drive](https://drive.google.com/file/d/19EFO_e1eW3zXg_O0GIt6bpAiPW2K3NMz/view) | Phase 2 order form, contracts filing |
| jethq-msa-v1-signed.pdf / jethq-msa-v2-signed.pdf | Contract | filed 3 Nov 2026 | n/a | [Drive v1](https://drive.google.com/file/d/1I0epu7_jSgn1BSYEfF3uGDUMaFTK07LN/view), [Drive v2](https://drive.google.com/file/d/1nht9sHJc2JQ0eN9tlPCD58ntaG4L6yM0/view) | Governing terms (not opened) |
| jethq-bundle-v1-signed.pdf / v2 | Contract bundle | filed 3 Nov 2026 | n/a | [Drive v1](https://drive.google.com/file/d/1aL62DdEUgxd1RPF3Evul1mLjGWP6qYYu/view), [Drive v2](https://drive.google.com/file/d/1CUfX_SbuAXrzWz6ahiglR1gIWv7Xe3fA/view) | Signed bundles (not opened) |
| jethq-of-001/002/003-v1-draft.docx | Order form drafts | filed 28 Oct 2026 | n/a | [OF-001](https://drive.google.com/file/d/1HyEofehSQAPb5LB1NsjJTlDBhg0Vv5hu/view), [OF-002](https://drive.google.com/file/d/1VbQPUts4xhjRiT-wViKhX4uenhRcadNv/view), [OF-003](https://drive.google.com/file/d/167l9kOPd_pCLybkXYwuzTlVZpg3OBEEt/view) | Earlier drafts (not opened) |
| Order Form OF-001 – Aircraft Records & Intranet Discovery | Order form draft | Sep to Oct 2026 | Sven | [Google Doc](https://docs.google.com/document/d/1HFY9TD-1Kg8niRBFbBZnhfPGmv8iJajNuggrggG7gD0/edit) | Next sale, unsent |
| 260317 JetHQ – 360° Project Intelligence Document | Document | 17 Mar 2026 | Sven (inferred) | [Google Doc](https://docs.google.com/document/d/1IXn4aM9CWTIYWxGl721c69Yue-rLApBj1cTmxgxsVu8/edit) | Full history, architecture, contacts, finances |
| JetHQ Roadmap | Deck | 9 Sep to 26 Oct 2026 | Sven | [Google Slides](https://docs.google.com/presentation/d/1sCCIsIXmq0WlNGrggjCtRe77JhjB62UL9RNGWx6zZVA/edit) | Offsite and Q4 roadmap |
| JetHQ-Roadmap (JHQ Edits).pptx | Deck | 15 Sep 2026 | JetHQ | [Drive](https://drive.google.com/file/d/1nUVoD_Iv53EYdDqIA3rpDVb4F24jSIDH/view) | Client's edits to the roadmap |
| JETHQ ROADMAP PLANNING | Document | 31 Aug 2026 | Jens | [Google Doc](https://docs.google.com/document/d/1pIwioC12nDJMtkz6OWjeVyZXVjxvdobyNjoxryFtrBY/edit) | Roadmap planning notes |
| JetHQ-Hub-Talking-Points.pdf | Document | Jul to Oct 2026 | Sven (inferred) | [Drive](https://drive.google.com/file/d/1SHakWaT7l0gXvW0XkRb1JJP_Skc3bTxp/view) | Broker sales-enablement one-pager |
| JetHQ Quotes | Document | 13 Jul 2026 | Sven | [Google Doc](https://docs.google.com/document/d/1ygfoNQM6ztXWBkzZTDoLjgFskZqZ49QdCSDAG6DxzRY/edit) | Quotes from RJ's tech talk |
| JetHQ — Executive Decisions Needed | Document | 18 May 2026 | Sven (inferred) | [Google Doc](https://docs.google.com/document/d/15jdF-4swtxVufehT5DvHimsSBs4y4H0ixBcfIGmBi9o/edit) | Decisions for JetHQ execs (not opened) |
| JetHQ · Roadmap Prioritization · 2026-05 | Spreadsheet | 26 May 2026 | Sven | [Google Sheet](https://docs.google.com/spreadsheets/d/1ZKkrjEgHe3cgeFQBy2MKo_QVftPK1VqwI7xNKj_Vlww/edit) | May prioritisation |
| JetHQ x Supernal – Project Plan (and copy) | Spreadsheet | Apr to May 2026 | Sven | [Google Sheet](https://docs.google.com/spreadsheets/d/1yRMFUKJoerTSMHaePzxp5ShDEYbF6h5by1tskrbRnns/edit) | Project plan |
| JetHQ x Supernal – Support Tracker | Spreadsheet | 7 May 2026 | team | [Google Sheet](https://docs.google.com/spreadsheets/d/1oHmyCCqtG2S1UP5Dku2T4ob_7HW8E1UfjdBC9WGInV4/edit) | Support requests |
| JetHQ Internal Tasks (to be cleaned up) | Spreadsheet | 27 May 2026 | team | [Google Sheet](https://docs.google.com/spreadsheets/d/1fvvXkChPPF5PmgQKSOg09FyDAPn4S_i4y_GGJaWWrr0/edit) | Task list |
| JetHQ — AI Employee Work Products & Metrics | Spreadsheet | 23 Apr 2026 | team | [Google Sheet](https://docs.google.com/spreadsheets/d/13IbX_nCoZULaNIMdH-iA05qECtQP0g8eYdUWyYfZU1k/edit) | KPI definitions (not opened) |
| Account Health Review - JetHQ - 4/28/26.docx | Document | 28 Apr 2026 | team | [Drive](https://drive.google.com/file/d/1Ox8VJymiZngWi2MNcD4ESncUL9ONuxI2/view) | Red-period health review (not opened) |
| JetHQ External Meetings — Last 3 Weeks (Mar 3–24) | Spreadsheet | 25 Mar 2026 | team | [Google Sheet](https://docs.google.com/spreadsheets/d/1rajKj8fXwZubQmy1rk4fD_Ed6U0RsGgHH0rJ5qW4Wks/edit) | Meeting log |
| JetHQ Custom Supernal UI - Technical Project Scope & Migration Plan | Document | Oct 2025 | team | [Google Doc](https://docs.google.com/document/d/1yaZhpVgE3bAWlJayrixz33hz8h4C1Jzg5vgnWwPqR3E/edit) | Phase 2 Hub scope (not opened) |
| JetHQ: Technical Scope | Document | Feb 2026 | Tauseef | [Google Doc](https://docs.google.com/document/d/13C1gq4J9E4N70B2h4yQFAp6jXEPjiZd8C50UMHICf2Q/edit) | Technical scope (not opened) |
| JetHQ Flags | Document | 17 Mar 2026 | Aman | [Google Doc](https://docs.google.com/document/d/1CgnvGKfxgRUtTfj3km-rYSEVq15XHTZqjBab1FWN2DM/edit) | Risk flags (not opened) |
| Aviation Data Capabilities | Document | 1 May 2026 | team | [Google Doc](https://docs.google.com/document/d/169KNw42JtKLyYJl-boszj8KCzJs-RhdglCc8tpKqLTE/edit) | Data-source capabilities (not opened) |
| Weekly Checkpoint notes (Apr to Jul 2026, about 14 docs) | Document | Apr to Jul 2026 | auto | [Drive folder](https://drive.google.com/drive/folders/18OtYnRcnMmoQHYUg-2TS9BX3m9ZFWK0z) | Gemini/Fathom notes |
| JetHQ Internal Sync recording, 25 Mar 2026 | Recording | 25 Mar 2026 | auto | [Drive](https://drive.google.com/file/d/1Zx50X-p37N8kBnr0fUPoT9jTap2HqOVJ/view) | Internal sync video |
| JetHQ account folder (Client Facing, Internal Facing, Marcus, Valerie, ABB Data, Archive, Commercial Contracts) | Folder | 2025 to 2026 | team | [Drive](https://drive.google.com/drive/folders/1FxXCcugUbcjq8mSWdLKMVJRATVarjtvv) | Account root |
| JetHQ contracts folder | Folder | 28 Oct 2026 | team | [Drive](https://drive.google.com/drive/folders/1asb_rYRT5xlG0mO8UPx8z3CRD437Gytx) | Signed and draft contracts |
| Flight Deck proposal (six packages) | Proposal | Jul 2026 | Sven | https://flightdeck-proposal-jethq.links.getsupernal.ai/ | Menu of Flight Deck modules and prices |
| Q3 workshop roadmap deck | Deck | 9 Sep 2026 | Sven | https://workshop-q3-jethq.links.getsupernal.ai/ | Offsite presentation |
| Flight Deck prototype | Prototype | Sep 2026 | Sven | https://svenboettger-supernal.github.io/jethq-os-prototype/ | Company-OS prototype |
| Roadmap check artifact | Document | 9 Sep 2026 | Mauro | [claude.ai](https://claude.ai/code/artifact/b4f93884-b2a6-42d6-a45f-ba55a1edb11b) | Roadmap versus what exists |
| Roadmap update artifact | Document | 26 Oct 2026 | Mauro | [claude.ai](https://claude.ai/artifact/QhBU9d35tXYpuopvSZecar) | Updated roadmap |
| QBR deck | Deck | 27 Oct 2026 | Stuart | [claude.ai](https://claude.ai/artifact/FB4QM55wisdN1onLHRhNvS) | QBR |
| Value Rank / Best Buy artifact | Prototype | 29 Oct 2026 | Mauro | [claude.ai](https://claude.ai/artifact/Dm3cyz5eXVAcYCvNBmhru9) | Value Rank design |
| The Hub | Site (live app) | Dec 2025 onwards | Mauro | https://hub.jethq.com/ | Production platform |
| Supernal // JetHQ FMV Deep Dive recording | Recording | 6 Nov 2026 | Fathom | [Fathom](https://fathom.video/calls/892587033) | FMV workflow deep dive |
| Flight Deck scoping recording with Julie | Recording | 26 Jun 2026 | Sven | location unknown (Gmail link in notes) | FlightDeck vision |
| Interactive pricing "layer cake" HTML | Prototype | Jul 2026 | Sven | location unknown | Pricing menu prototype |
| ClientVoiceJetHQ.tsx, jethq.png | Design | 15 Oct 2026 | team | [Drive](https://drive.google.com/file/d/1DVhdYgvFG1q-Tv2GdnfU0j_pNUfS7KUp/view) | Website client-voice component |
| Notion: JetHQ account page, AIE Narrative — JetHQ, AIE Workback Roadmap, Valerie for JetHQ | Document | 2025 to 2026 | team | [Notion account](https://app.notion.com/p/3a7bd5e8f31881389a66ca98d615f18a) | Account record and product-narrative pages |

---

## 12. Suggested vault sections

1. **Aviation Data Sources** (Technical): JetNet, VRef, Blue Book, AviaCost, ADS-B; what each provides, cost, access state, quirks. Files: Data-Provider-Map, VRef-Blocker-History, JetNet-Format-Changes, Blue-Book-Upload-Process. Material: rich (360 doc, checkpoints).
2. **Valuation Methodology** (Technical): how JetHQ values an aircraft and how Valerie mirrors it. Files: FMV-Method, Comps-Rules, Value-Driver-Rules, FMV-Template-And-Editor. Material: rich (Hanan deep dive in 360 doc; 22 Sep and 6 Nov meetings).
3. **Platform Architecture** (Technical): Hub, Marcus, Valerie stack and migrations. Files: Hub-Architecture, Marcus-Pipeline, n8n-Exit-Plan, Secrets-And-Incidents. Material: rich.
4. **Expansion Menu (Flight Deck)** (Deal): Files: Flight-Deck-Vision, Package-Menu-And-Prices, Intranet-OF-Draft, Salesforce-Exit-Case. Material: medium to rich.
5. **Champion and Power Map** (Sales): Files: Champion-History (Rebecca, Julie, RJ), Garrett-Strategy, DIY-Threat-Playbook. Material: medium (internal syncs).
6. **Adoption Evidence** (Delivery): Files: Usage-Signals (PostHog, support emails), Quotes-Bank, Sales-Engineer-Canva-Gap. Material: medium.
7. **Product Experience and Design** (Technical): FMV report design, Canva parity, Value Curve UX, role views. Files: FMV-Design-System, Value-Curve-UX, Role-Views. Material: medium.

---

## 13. Book

### Chapter 1. The account in one page

JetHQ is a private-jet brokerage of about 75 people that tracks roughly 80,000 aircraft and sells valuations as part of how it wins deals. It signed with Supernal on 8 May 2025 for two AI employees: Marcus, who watches JetNet market alerts and keeps JetHQ's aircraft database current, and Valerie, who assembles Fair Market Value reports. That deal was $92,000 upfront plus $7,500 a month, $249,500 in all. Because the database JetHQ relied on was owned by a slow outside vendor, Supernal ended up building its own aircraft-intelligence web app, the Hub, launched on 20 December 2025. A second order form, signed by RJ Miller on 9 April 2026, added six Hub modules for $2,500 a month, bringing the account to $10,000 a month through 30 June 2027, with auto-renewal at the same rate.

The relationship nearly broke in late April 2026, when the client judged the Hub half done and asked to be removed from Supernal's website. A new engineer, Mauro, a roadmap the client could see and a run of fast deliveries turned it green by July. Since then the champion has changed twice: Julie, the fractional CMO, was let go in August, and RJ, once a sceptic, is now the strongest advocate. Valerie went live in August and a Canva-style editor landed in November. The open questions are whether JetHQ's sales engineers stop using Canva, and whether the next sale, an intranet and company operating system called Flight Deck, gets scoped and priced before 30 November. Account OS reads health 3.2, Watch, driven by margin.

Sources: Drive: JetHQ SOW.pdf; Drive: jethq-of-005; 360 doc; JetHQ Internal Alignment, 1 May 2026; Notion weekly report, wk of 2 Nov 2026; Account OS.

### Chapter 2. Why they bought, and why they keep buying

The first purchase was about labour. Market tracking meant reading JetNet alerts by hand and chasing brokers for missing details, and every valuation meant pulling numbers from Bluebook, VRef, JetNet and AviaCost and stitching them into a report. The order form promised to automate both, with JetHQ people checking key decision points. Behind it sat a frustration with Wunderbeast, the vendor that hosted their old Hub, which answered only twice a week; the owner, Garrett, had already spent more than half a million dollars on that Hub over three years. Who championed the 2025 deal and what alternatives were considered is not recorded; one internal note says Rebecca Johnson signed it without Garrett's full buy-in, which explains why he has stayed distant.

Phase 2 followed the Hub itself. Once Supernal had replaced Wunderbeast, there was a module roadmap to sell, and an annual prepay with 5% off gave JetHQ a reason to commit, although its lawyer sat on the paperwork from December to April.

The next sale has several causes. JetHQ pays about $100,000 a year for Salesforce plus an admin, and an outside engineer is building a JetNet integration that duplicates the Hub. Its intranet is split between SharePoint and OneDrive and barely maintained, and Monday is used as a checklist. RJ has watched the Hub change how his brokers talk to buyers and now wants the whole company working inside it. Against that sits a real alternative: an in-house AI hire who told Garrett in July that he could build it all himself.

Sources: Drive: JetHQ SOW.pdf; 360 doc; JetHQ – Internal Bi-Weekly Sync, 22 Jul 2026; JetHQ "Flight Deck" Scoping, 1 Jul 2026; Delivery Sync, 10 Aug 2026; Slack, 2 Nov 2026.

### Chapter 3. How the deal is built

There are two signed order forms and one draft. The May 2025 form covers Marcus and Valerie: $92,000 in two development instalments, then $7,500 a month invoiced from August 2025 to March 2027, under Supernal's standard terms with California law, a 12-month liability cap and a duty to export agent instructions on request. The AI Hub Addendum restates that scope as Phase 1 and adds Phase 2: inventory explorer, import and export, user management, the JetHQ Estimate, testing and migration. It charges $2,500 a month on top, asks for one $114,000 annual payment on 1 January 2026, and moves the end of term to 30 June 2027, renewing for twelve months at $10,000 a month unless either side gives 60 days' notice.

Account OS records these as two closed deals, $249,500 and $67,500, both under Johnny. The second value does not match the contract arithmetic, which gives about $37,500 for Phase 2 over its term. A third deal, "Flight Control OS", sits at Prototype for $50,000, expected 31 December, under Stu.

The draft OF-001 is deliberately small: one month of discovery across SharePoint, Microsoft 365, Salesforce and Monday, then two months putting every document for a serial number onto that aircraft's Hub page, for $1,000 a month over twelve months. It excludes switching off SharePoint and every other Flight Deck module, which are priced separately on a menu from $1,000 to $2,500 a month each. Prices discussed for the same first step range from $500 to $2,000 a month, and nobody has yet chosen.

Sources: Drive: JetHQ SOW.pdf; Drive: jethq-of-005; Drive: OF-001 draft; Account OS; GTM + Scoping, 9 Oct 2026; Slack, 11 Nov 2026.

### Chapter 4. The product and why it is built this way

Three systems work together. The Hub at hub.jethq.com holds about 80,000 aircraft, with status, days on market, the JetHQ Estimate, market reports and, more recently, a personal My Desk view, market charts and a Value Curve. Marcus reads JetNet alert emails every minute, classifies each change and writes it to the Hub; it passed 95% accuracy in March 2026 and is being moved off n8n into its own service. Valerie builds FMV reports from Hub data, VRef, Blue Book and uploaded spec sheets.

Most design choices come from the data. VRef and Blue Book can differ by over a million dollars on the same jet, so VRef wins where both exist and no option is counted twice. Comps are taken from the last six months because the market moves fast. Internal sales, factory deliveries and foreclosures carry a badge but stay out of market statistics. JetNet refreshes never overwrite a researcher's manual edits, because off-market aircraft carry information JetNet lacks. Daily hours and landings come from JetNet's standard record rather than a paid flight-tracking add-on the sales team did not value.

Other choices come from how people work. Valerie began as a "Desktop FMV" on Julie's Canva template because VRef's API was blocked. When sales engineers said editing a Valerie FMV took four hours, as long as Canva, Supernal built a full Canva-style editor with Excel-like tables and photo grids, shipped about 12 November. The Value Curve is held back from brokers until it has been accurate for two quarters.

Sources: 360 doc; Linear; Weekly Checkpoints, 28 Jul, 1 Sep, 15 Sep, 22 Sep 2026; Supernal // JetHQ FMV Deep Dive, 6 Nov 2026; Slack, 28 Oct to 13 Nov 2026.

### Chapter 5. How delivery has gone

Delivery has had three phases. The first year was slow for reasons mostly outside Supernal: weeks waiting on Wunderbeast, then VRef's pricing dispute that blocked Valerie from October 2025. Marcus still went live in September 2025 and the Hub in December. Early 2026 was a data-quality grind: 369 duplicate aircraft, JetNet format changes that broke Marcus twice, and 89% of 215 logged hours spent on maintenance rather than new features.

The second phase was the April crisis. JetHQ saw the Hub as half finished while Supernal thought it was nearly complete, the scope had drifted from a researcher's tool to a sales tool, and work had never been broken into small, visible pieces. The response, agreed on 1 May, was senior capacity in the form of Mauro, a three-month roadmap instead of a list of seventy items, a client-visible backlog, and bug fixes kept separate from new features. By July the account was green.

The third phase is Mauro's. Jens left on 1 October and Mauro now runs every call, writing a detailed note after each one in Slack. JetHQ prioritised four Valerie tasks for Q4; Supernal shipped faster than JetHQ's own dates, including the FMV editor ahead of Hanan's 17 November deadline. Linear shows two milestones past their 31 October dates, but Sven's standing rule is that internal dates do not on their own make the account at risk. Real watch items are a sales-price bug after JetNet updates, unrotated keys after the October Railway incident, and a $3,000 OpenAI charge from an old key.

Sources: 360 doc; JetHQ Internal Alignment, 1 May 2026; Slack, 1 Oct to 13 Nov 2026; Linear; Notion: Delivery review standing context; Notion weekly report, wk of 2 Nov 2026.

### Chapter 6. The people

On JetHQ's side, Garrett owns the company and has never fully bought in; internal notes describe him as caring about selling jets, not AI, and as someone reached through results rather than technology. RJ Miller, Garrett's college roommate and the sales leader, signed the Phase 2 addendum. In spring he was hot and cold and possibly limiting Supernal's visible impact; after the July tech talk, where twelve of fifteen praising quotes were his, he became the champion, and by November Stuart wrote that he had never seen him so engaged. Julie Boake, the fractional CMO, was the champion through the spring and the author of the FlightDeck mockup; she was let go in early August, and her departure briefly put the expansion in limbo. Hanan Saliba owns valuations and sets Valerie's dates; she goes on leave from mid-November. Brooks Boschert and Clay Marks run market research and the bi-weekly product session. Fernando, Vlad and Sameer are the sales engineers whose habits decide Valerie's adoption. Roxy runs Salesforce from outside. An unnamed in-house AI hire is the DIY risk.

On Supernal's side, Johnny sold the account and still co-owns it. Eric Kravitz drafted both contracts and left at the end of May. Sven Boettger is the strategist and ran the turnaround. Jens built most of the first year and left the account in October. Mauro is now the sole engineer and the client's main contact. Stuart Childs became account manager in the autumn and owns the intranet sale. Account OS still lists Jens as FDE and has nobody on the power map.

Sources: JetHQ – Internal Bi-Weekly Sync, 24 Jun, 29 May, 22 Jul 2026; local: 2026-07-13-all-hands.md; Weekly Pipeline Meeting, 12 Aug 2026; Slack, 1 Oct to 11 Nov 2026; Account OS.

### Chapter 7. What value has shown

The strongest evidence is qualitative and comes from JetHQ's own people. In July, RJ's internal tech talk to more than fifty staff produced fifteen unsolicited quotes describing the Hub as JetNet on steroids and saying an FMV that once took a week and a half now takes five minutes. In October, a sales VP used the first Valerie FMV in a real client pitch. On 5 November the sales engineers agreed that Valerie's valuations were much better; their objection had moved from the numbers to the editing.

The measured side is thinner. Marcus passed 95% accuracy. Hub adoption is put at 80% of the way to company-wide use. The weekly report scores usage 4 out of 5, proactive. But Valerie produces about one FMV a day, PostHog showed one sales engineer who complained about missing data had not built an FMV in two weeks, and the Value Curve has three users. Account OS holds no success-plan goals or value entries, and Notion's checklist says value and usage metrics are only partly defined.

The gap that matters is attribution. Garrett wants to sell more jets, and nobody can yet show which deals the Hub or Valerie touched. In May the team named revenue attribution as the missing model; in July it suggested telling Garrett that 74 aircraft were sold during a two-week incident investigation. Neither has become a tracked number. Margin is the other weak spot: Notion says break-even and Account OS scores GM 2.

Sources: local: 2026-07-13-all-hands.md; Slack, 20 Oct and 5 Nov 2026; Linear; Notion weekly report, wk of 2 Nov 2026; JetHQ – Internal Bi-Weekly Sync, 29 May and 22 Jul 2026; Account OS; Notion account page.

### Chapter 8. Where it stands and what is next

As of 14 November 2026 the account is delivering well and the client is engaged, but three things need a decision. First, Valerie's adoption: the Canva-style editor shipped about 12 November, and the next weeks show whether Hanan, Fernando, Vlad and Sameer build FMVs in Valerie while Hanan is on leave. A feedback call followed the release; the success signal is FMV counts in PostHog, not opinions.

Second, the intranet sale. RJ asks about it every week and wants the whole company working inside the Hub, but the draft order form only covers documents on aircraft pages, sized at about 100 hours. Stuart wants to rerun discovery with RJ, refresh the Flight Deck menu, whose dates still say Q3 and Q4, and close by year end with aggressive pricing. Johnny's deadline is 30 November. Prices on the table run from $500 to $2,000 a month for the first step and up to $11,500 a month across the menu.

Third, hygiene: rotate JetNet and VRef keys, fix the lost-sale-price bug, update Account OS (pod, stakeholders, success plan, value) and decide whether Pulse is shown to JetHQ.

Further out, renewal notice falls around 1 May 2027 for a term ending 30 June 2027 at $10,000 a month. Margin pressure, the DIY alternative and Garrett's distance are the renewal risks; RJ's advocacy, the Hub's daily use and a signed intranet expansion are the counterweights.

Sources: Slack, 2 to 13 Nov 2026; Notion weekly report, wk of 2 Nov 2026; Notion GTM update, 12 Nov 2026; Drive: OF-001 draft; Drive: jethq-of-005; Account OS.

---

## 14. Gaps and conflicts

**Could not find or access**
- Pre-signature history for the May 2025 deal (who championed it, demos, alternatives); sources start in Mar 2026 except the 360 doc's reconstruction.
- Client checkpoint notes after 22 Sep 2026 in Granola or Fathom (Mauro's Slack write-ups used instead); the QBR itself (about 27 to 28 Oct) was not recorded in any meeting tool reached.
- GitHub repo `client-jethq`: the GitHub connector failed to connect. Supabase project "JetHQ Staging" not inspected.
- Several Drive documents not opened: MSA v1/v2, bundles, OF drafts .docx, Executive Decisions Needed, Account Health Review 28 Apr, AI Employee Work Products & Metrics, technical scope docs, JetHQ Flags.
- Linear issues were not read one by one; only projects and milestones.
- RJ Miller's job title; Garrett's surname; Jordan Rogers' role.

**Conflicts**
- **Health:** Account OS 3.2, Watch, GM 2 (13 Nov); Notion weekly report 🟢 Healthy (wk of 2 Nov); Delivery Sync 9 Nov "healthy".
- **Pod:** Account OS lists Jens as FDE; Jens left the account on 1 Oct 2026 and Mauro is the engineer (Slack, 1 Oct 2026). The two closed deals list AM Johnny; the account lists AM Stu.
- **"RJ":** the 360 doc calls Rebecca Johnson "RJ, VP Ops"; the Phase 2 addendum and Account OS name RJ Miller (rjmiller@jethq.com), described in meetings as the sales leader and Garrett's roommate. These are two different people; the 360 doc conflates them.
- **Expansion deal value:** Account OS $67,500 at $2,500 MRR; the contract gives $2,500 a month from 10 Apr 2026 to 30 Jun 2027, about $37,500 (inferred).
- **Next-sale price:** $500 / $750 / $1,042 a month (9 Oct), $1,000 a month draft OF, $2,000 MRR in Notion, $50,000 in Account OS, menu up to $11,500 a month.
- **Next-sale name:** "Flight Control OS" (Account OS, 8 Jul meeting) versus "Flight Deck/FlightDeck" (most sources) versus "Aircraft Records & Intranet Discovery" (OF draft) versus "Intranet" (Linear).
- **Hours behind the draft OF:** about 100 hours (Mauro and Sven) versus a 200-hour figure Johnny questioned on 6 Oct.
- **Order-form numbering:** the draft is "OF-001" although Drive files the signed forms as OF-004 and OF-005, and OF-001 to OF-003 drafts exist from 28 Oct.
- **Pulse:** "JetHQ live with its own core metrics" (Check-In: World Emblem, 1 Oct 2026) versus "far from ready" (Pulse Roll out - Strat Readiness, 21 Oct 2026).
- **QBR date:** Stuart's deck was "for Tuesday" (27 Oct) and then "for tomorrow" posted late on 27 Oct; Notion records the last business review as 6 Nov (the FMV deep dive).
- **Linear milestones marked achieved with 0%** (Hub MVP, Marcus live in production, Valerie data providers connected): status text says achieved, progress field says 0%.
