# Sunflower Wellness / ArcWell Manufacturing: ClientOS context

Compiled 13 Nov 2026. Depth: DEEP. Account OS id `01M20ZRP0HTRXKTCBF39VX8WE7`.
Meeting dates are as listed in Granola (IST) or Fathom; a late-evening US call can show one day later in Granola.

**How the two names relate.** They are two separate legal entities under the same ownership, not a rename. Sunflower Wellness Inc. (Hudson, Colorado) is the original client and the only entity with a signed contract (Drive: sunflower-wellness-inc-of-002-v1-signed.pdf). Its main product, 7-OH (a kratom derivative), was rescheduled by the DEA as Schedule I from about 1 Aug 2026, so Sunflower is liquidating stock and winding down (Supernal x Sunflower Weekly, 8 Jul 2026; Drive: ArcWell Manufacturing (Sunflower Wellness) Notes). ArcWell Manufacturing is the sister company that makes peptide sublingual strips, tablets and nasal sprays; the business, the staff and the Supernal relationship are moving to it (Sunflower x Supernal, 29 Jul 2026; Sunflower x Supernal, 5 Aug 2026). The president asked Supernal to keep ArcWell separate from Sunflower, and a new MSA is needed because one entity is closing and another opening (NEW GTM + Scoping, 26 Aug 2026; Weekly Pipeline Meeting, 2 Sep 2026). Internal notes that call it a "rebrand" are loose wording (Sync: Arcwell / Sunflower, 11 Nov 2026). Account OS and Linear still say "Sunflower Wellness"; Notion weekly reports say "Arcwell (Ex Sunflower Wellness)"; client emails use `sunflowerwellness.us`, `arcwellmanufacturing.com` and `arcwellsolutions.com` (Account OS; Linear; Notion; Supernal x Arcwell: Steps to Kicking Off, 11 Sep 2026).

---

## 1. Snapshot

- **Who:** Sunflower Wellness Inc., a Colorado supplement maker (kratom / 7-OH tablets and liquids), now winding down; work is moving to sister company ArcWell Manufacturing (peptide strips, about 25 to 30 SKUs) (Sunflower x Supernal, 5 Aug 2026; Notion account page lists industry as Pharmaceutical and Medicine Manufacturing).
- **What they bought:** Oliver, an "Order Management AI Employee": $30,000 implementation plus $2,000 per month, signed 2 Oct 2025, year-one total $48,000 (Drive: sunflower-wellness-inc-of-002-v1-signed.pdf).
- **Where it stands:** Oliver ran well from June to July 2026 (about 90% of orders, near-zero errors), then usage fell to about zero when Sunflower's product became illegal. Supernal still bills $2,000 per month. A $96,000-minimum ArcWell order form has been unsigned since 11 Sep 2026 (Delivery Planning Weekly, 29 Jun 2026; Weekly Pipeline Meeting, 30 Sep 2026; Notion weekly report, 5 Oct 2026).
- **Why it is cold:** the sponsor who bought (Alex Seleznov) left in late July 2026; the new decision maker (Suzan Damron, Chief Integration Officer) is focused on a NetSuite migration and doubts Supernal adds value beyond NetSuite; the client has not replied to four outreach attempts in a row (Delivery Planning Weekly, 3 Aug 2026; Product Standup, 23 Sep 2026; Notion weekly report, 2 Nov 2026).
- **Pod:** AM Nick, Strategist Devan, FDE Fran (Account OS). In practice Fran has left Supernal, Swami is the engineer, and Tauseef was asked on 6 Nov 2026 to take over as strategist (Delivery Sync, 9 Nov 2026; Slack #acnt-sunflower-wellness-internal, 6 Nov 2026).
- **Health:** 2.6 of 5, band Watch, unchanged for five weekly reads from 9 Oct to 6 Nov 2026. Dimensions: Tech 2 (low), Strategic Defensibility 2 (low), Exec Engagement 1 (critical), GM 4, Build 4. Renewal risk High; driver "Exec sponsorship weak · Easily displaced". This week's read (W46) is due and not yet recorded (Account OS).

**Why health is 2.6 and renewal risk is High** (all causes found):

1. Exec Engagement 1: the buyer was fired and there is no rapport with the new decision maker. The deal note reads that the exec sponsor was fired and needs re-establishing (Account OS; Slack #acnt-sunflower-wellness-internal, 6 Nov 2026).
2. Strategic Defensibility 2: Suzan prefers NetSuite plus a familiar integration partner and worries about paying Supernal for what NetSuite already does; Supernal is described internally as a nice-to-have (Weekly Pipeline Meeting, 23 Sep 2026; Weekly Pipeline Meeting, 30 Sep 2026; Slack #acnt-sunflower-wellness-internal, 6 Nov 2026).
3. Tech 2: Oliver is wired to Sunflower's Zoho and cannot work for ArcWell until it connects to NetSuite; there is no NetSuite sandbox; a July credential rotation after a malware incident has no closed ticket; urgent security issues sit in the backlog assigned to an engineer who has left (Sync: Arcwell / Sunflower, 11 Nov 2026; Notion weekly report, 2 Nov 2026; Linear).
4. No value in use: nobody is on the platform (usage score 1, inactive) while $2,000 per month is still charged; Sunflower finance has queried the charge and asked for one back (Notion weekly reports, 5 Oct, 26 Oct and 2 Nov 2026).
5. Client non-response: Suzan on the order form, Sheri twice, then the 2 Nov 2026 group email (Notion weekly report, 2 Nov 2026).
6. The client business itself is unstable: main product illegal, facility relocating, entity changing (Notion account page; Notion weekly report, 2 Nov 2026).
7. Context is fragmented by handoffs on the Supernal side (Sync: Arcwell / Sunflower, 11 Nov 2026).
8. GM 4 and Build 4 hold the score up: little delivery cost is being spent and what was built worked (Account OS scores; reasons inferred).

---

## 2. Structure of this account

### Entities

| Entity | What it is | Systems | Contract with Supernal |
|---|---|---|---|
| Sunflower Wellness Inc. | Original client. 7-OH / kratom tablets and liquids, largely made by a contract manufacturer. Winding down after the DEA rescheduling (Supernal x Sunflower Weekly, 8 Jul 2026) | Zoho CRM, Zoho Books, Zoho Sign, Figaro (inventory and production, read-only API), Slack, Twilio; Zoho org #830 (Sunflower x Supernal, 29 Jul 2026) | Signed order form 2 Oct 2025; signed MSA on file (Drive: sunflower-wellness-inc-msa-v1-signed.pdf, not opened) |
| ArcWell Manufacturing | Sister company, in-house manufacturing of peptide strips, tablets, nasal sprays. Now the main business (Sunflower x Supernal, 29 Jul 2026) | Separate Zoho org #572, Google Sheets (6+ sheets, master inventory 15,000+ lines), App Scripts; not on Figaro; migrating to NetSuite (Sunflower x Supernal, 29 Jul, 12 Aug and 27 Aug 2026) | None. Order Form #001 drafted and sent, unsigned. New MSA required (Weekly Pipeline Meeting, 2 Sep 2026) |
| "ArcWell Solutions" | Appears only as an email domain (`arcwellsolutions.com`) for Rob Miller, Ehron Sidel, Suzan Damron and Oren Dlin (Supernal x Arcwell: Steps to Kicking Off, 11 Sep 2026) | Unknown | Relationship to ArcWell Manufacturing not found |

Internally the team first treated ArcWell as an expansion, then on 19 Aug 2026 decided to book Sunflower as a churn and ArcWell as a new logo (Weekly Pipeline Meeting, 19 Aug 2026). Account OS still holds one account and one deal (Account OS).

### Order forms and proposals

File naming is inconsistent: the signed 2025 order form is filed as "of-002", the unsigned ArcWell form as "Order Form #001" / "of-001-v1-draft", and the unsigned July 2026 Oliver Generalist proposal is also "OF-002" (Drive).

| # | Document | Client entity | Status | Scope | Fees |
|---|---|---|---|---|---|
| 1 | "Sunflower Wellness (Order Management AIE)" | Sunflower Wellness | Signed 2 Oct 2025 by Alex Seleznov and Eric Kravitz | Process 1 sales order capture and validation; Process 2 purchase order drafting; Process 3 invoice generation and distribution | $30,000 implementation in three $10,000 invoices (2 Oct, 1 Nov, 1 Dec 2025); $2,000 per month from 1 Jan 2026; year one $48,000 (Drive: sunflower-wellness-inc-of-002-v1-signed.pdf) |
| 2 | "OF-002 Oliver: Sales Generalist" | Addressed to ArcWell Manufacturing, extends the Sunflower deployment | Draft, presented 29 Jul 2026, never signed, overtaken by #3 | Milestone A (+90 days): lifecycle backend, support-agent MVP, Slack shipping signal, open-orders board and lapse alerts, SMS. Milestone B (+45 days): invoice generation, post-approval change requests | Strategy $1,000 + build $4,000 − renewal credit $1,000 = $4,000 per month, 12 months, $48,000 (Drive: Sunflower Wellness: OF-002 Oliver Generalist.docx). Presented as $5,000 per month on the call (Sunflower x Supernal, 29 Jul 2026) |
| 3 | "ArcWell Manufacturing – Order Form #001" | ArcWell Manufacturing | Reviewed with users 19 Aug 2026; sent to Suzan for signature about 11 Sep 2026; unsigned | Strategy and product management; Milestone A Procurement OS; Milestone B Production OS; Milestone C Sales Generalist (Oliver) | $2,000 + $6,000 + $6,000 + $4,000 per month; minimum commitment $96,000; each new milestone resets a 12-month term (Drive: ArcWell Manufacturing - Order Form #001.docx) |
| 4 | Condensed "Oliver-first" deal | ArcWell Manufacturing | Idea only, raised 30 Sep 2026; no document found | Transfer Oliver and expand it, re-engage on larger work after NetSuite is live | About $96,000 (Weekly Pipeline Meeting, 30 Sep 2026) |

### Deals

| Title | Value | MRR | Stage | Dates | Source |
|---|---|---|---|---|---|
| Sunflower Wellness deal | $48,000 | $2,000 | Closed Won, status Active, motion New, owner Nick | Closed 2 Oct 2025; record created 18 Sep 2026 from a sheet import | (Account OS) |
| Arcwell Manufacturing – Expansion (opportunity, not in Account OS) | Not set | Not set | Parked | Target close and revisit date 15 Nov 2026 | (Notion) |

Account OS has no stakeholders, success plan goals, cadence events, value entries, whitespace ideas or renewal plan recorded for this account (Account OS).

### Products, workstreams and phases

- **Phase 1, Oliver 1.0 (Sunflower, built).** Process 1 is live. Processes 2 and 3 were partly handed to the Figaro vendor, stalled, and drifted back to Supernal (Slack #acnt-sunflower-wellness-internal, 8 Jul 2026).
- **Oliver Generalist (scoped, a little built).** Milestones POG.1 to POG.5 plus invoice generation and change requests. This became Milestone C of the ArcWell form (Linear; Drive: ArcWell Manufacturing - Order Form #001.docx).
- **Phase 2, ArcWell expansion (prototyped, unsigned).** Procurement OS, then Production OS, then Oliver, with a strategy layer over all three. Each milestone is triggered by the client, not by a date (Sunflower Sync, 14 Aug 2026).
- **Future scope named by the client, not priced:** R&D chemistry research tool, vendor onboarding and compliance, quality data, custom packaging flags (Sunflower x Supernal, 19 Aug and 27 Aug 2026; Notion weekly report, 5 Oct 2026).

### How the pieces connect

The intended value chain runs backwards from where Supernal started. Supernal began at sales (Oliver takes orders). In August 2026 the client said sales tools were premature while production could not meet demand, so the order changed to procurement first, then production, then sales (Sunflower x Supernal, 12 Aug 2026). Oliver's move to ArcWell depends on NetSuite going live; the ArcWell order form depends on Suzan; the Sunflower contract keeps paying in the meantime (Tauseef / Nick: WE Vid Clip, 12 Nov 2026).

---

## 3. Arc

Client-meeting counts are recorded calls found in Fathom, Granola, Drive transcripts or Slack recaps. Blank means not found, not zero.

**Q4 2025 (sold and built).** Signed 2 Oct 2025. On 10 Oct 2025 Alex called Nick: he had not realised the document he signed was the actual contract, still wanted to proceed, but his head of sales (Brooke) was not yet bought in and needed something to try (Slack #accounts-sunflower, 10 Oct 2025). Kickoff 14 Oct 2025: MVP defined as voice and text order capture and validation; the two tests were that sales must like using it and it must collect 90% correct information (Slack #accounts-sunflower, 15 Oct 2025). Weekly calls ran from then (week 2 on 22 Oct, week 3 on 29 Oct). Pre-demo 5 Nov 2025; a meeting on 12 Nov 2025 brought many new client attendees; Nick spoke with the founder of Figaro on 11 Nov 2025; Zoho integration finished 19 Nov 2025 (Slack #accounts-sunflower, Oct to Nov 2025; Linear SUN-68). Supernal held the demo until the first $10,000 was paid; it was unpaid on 4 Nov 2025 (Slack #accounts-sunflower, 15 Oct and 4 Nov 2025). At least 5 client calls.

**Q1 2026 (thin record).** Subscription billing started 1 Jan 2026 (Drive: signed order form). On 4 Feb 2026 Naveen formed a two-week pod to rebuild Oliver on Supernal's Cortex platform and show KPIs in Studio, with the n8n build as fallback (Slack #pod-oliver-for-sunflower-wellness, 4 Feb 2026). In late March the original engineer (Amiri) went offline and Fran was pulled in as cover, joining at about 60% build (Slack #acnt-sunflower-wellness-internal, 27 Mar 2026; Arcwell Manufacturing (Sunflower Wellness) Sync, 22 Aug 2026). Raw-material orders were not supported; only Tablets and Liquid were (Slack #acnt-sunflower-wellness-internal, 31 Mar 2026). Client-call count not found.

**Apr 2026 (instability, then QBR).** Client issues raised on 3 Apr went unanswered for days (Slack #acnt-sunflower-wellness-internal, 9 Apr 2026). A red "build instability" thread ran 21 to 23 Apr (Slack #acnt-sunflower-wellness-internal, 21 Apr 2026). QBR on 29 Apr 2026: error rate about 20% the week before, 11.6% that week, targeted to halve twice; the client still said the product delivered value and set under 3% errors as the bar to turn off manual entry (Drive: 2026-04-29 Sunflower Wellness -- Supernal- QBR). 1 recorded client call.

**May 2026 (yellow only because of n8n).** Status yellow despite a happy client; evals passed 14 of 15; decision to move Oliver's brain off n8n into code (Delivery Planning Weekly, 4 May and 18 May 2026). 3 recorded client calls (6, 13, 27 May) (Drive: Transcripts folder).

**Jun 2026 (peak).** Oliver left n8n on 9 Jun and went live on the new backend with zero errors; Pulse went live 10 Jun (Slack #acnt-sunflower-wellness-internal, 9 and 10 Jun 2026). 18 of 20 orders through Oliver on 17 Jun; 34 of 37 on 24 Jun (vault: 2026-06-17-supernal-x-sunflower-weekly › RIC's notes; vault: 2026-06-24-supernal-x-sunflower-weekly › RIC's notes). Status green on 22 Jun (Delivery Planning Weekly, 22 Jun 2026). The 24 Jun call opened the inventory and cost-per-kilogram opportunity; Devan called it gold (Slack #acnt-sunflower-wellness-internal, 25 Jun 2026). 4 client calls.

**Jul 2026 (pivot begins).** 1 Jul: Alex re-engaged, praised stability, wanted to stay on sales operations and discussed switching off manual order entry (vault: 2026-07-01-supernal-x-sunflower-weekly › RIC's notes). 8 Jul: client announced the DEA rescheduling and named ArcWell as the new priority; order-status pop-out demoed (Supernal x Sunflower Weekly, 8 Jul 2026). 13 Jul: a malware incident froze deployments across Supernal; the Sunflower repo was in the remediation run of 15 Jul (Delivery Planning Weekly, 13 Jul 2026; Notion: client-sunflower-wellness (2026-07-15 run)). 15 Jul: priority moved from purchase orders to invoice generation (Supernal x Sunflower Weekly, 15 Jul 2026). 29 Jul: Oliver Generalist proposal presented; Oren said renewal was likely. Alex left at the end of July (Sunflower x Supernal, 29 Jul 2026; Slack #acnt-sunflower-wellness-internal, 30 Jul 2026). 5 client calls.

**Aug 2026 (re-scoped to manufacturing).** 5 Aug: first call with ArcWell production (Phil Burrow); project paused pending budget from Sheri and Rob (Sunflower x Supernal, 5 Aug 2026). 12 Aug: order reversed to procurement first (Sunflower x Supernal, 12 Aug 2026). 14 Aug: internal order-form design (Sunflower Sync, 14 Aug 2026). 17 Aug: verbal renewal reported (Delivery Sync, 17 Aug 2026). 19 Aug: users approved Order Form #001 on the call (Sunflower x Supernal, 19 Aug 2026). 20 Aug: Fran shared a first prototype (Slack #acnt-sunflower-wellness-internal, 20 Aug 2026). 27 Aug: production planning dashboard demo to Phil, Kaleb, Oren, Sheri, Molly and Mailee (Sunflower x Supernal, 27 Aug 2026). 31 Aug: stalled on Rob's signature (Delivery Sync, 31 Aug 2026). 4 client calls.

**Sep 2026 (stall).** 2 Sep: 25% chance of closing in September (Weekly Pipeline Meeting, 2 Sep 2026). 11 Sep: "Steps to Kicking Off" call with Suzan, Ehron, Oren, Rob, Phil and Kaleb; Suzan confirmed as signer; NetSuite go-live targeted 1 Oct (Supernal x Arcwell: Steps to Kicking Off, 11 Sep 2026). 15 Sep: Oliver had been down for 2 to 3 days and users noticed (Squad Portfolio Sync, 15 Sep 2026). 21 to 23 Sep: holding pattern; Suzan anchoring on NetSuite (Delivery Sync, 21 Sep 2026; Weekly Pipeline Meeting, 23 Sep 2026). 30 Sep: plan to go for a smaller deal of about $96,000 (Weekly Pipeline Meeting, 30 Sep 2026). 1 client call.

**Oct 2026 (silence).** 5 Oct: Oren listed five gaps NetSuite will not cover, Oliver and sales support first, and said the hold was not specifically about NetSuite. Sheri asked for the $2,000 Sunflower charge to be refunded and billed to ArcWell (Notion weekly report, 5 Oct 2026). 9 Oct: on hold until mid-November (GTM + Scoping, 9 Oct 2026). 20 Oct: an internal client meeting meant to bring clarity; 27 Oct: Sheri replied nothing yet (Notion weekly report, 26 Oct 2026). 23 to 28 Oct: handover from Fran to Swami (Slack #acnt-sunflower-wellness-internal, 24 and 28 Oct 2026). 0 client calls found.

**Nov 2026 (go proactive).** 2 Nov: Nick emailed the whole ArcWell group; $2,000 invoiced with no heads-up; no reply (Notion weekly report, 2 Nov 2026). 6 Nov: new plan, tell ArcWell what Supernal is working on and ask for NetSuite access; Tauseef asked to take the strategist seat (Slack #acnt-sunflower-wellness-internal, 6 Nov 2026). 9 Nov: status critical in Delivery Sync (Delivery Sync, 9 Nov 2026). 11 Nov: Diana briefed Tauseef and Swami (Sync: Arcwell / Sunflower, 11 Nov 2026). 12 Nov: Nick planned to send the re-engagement email introducing Tauseef and Swami (Tauseef / Nick: WE Vid Clip, 12 Nov 2026). 0 client calls.

---

## 4. Why they bought

**The original Oliver deal (Oct 2025).** The pre-sale calls were not found, so this is reconstructed from the contract and the first weeks.

- The stated problems were manual order entry, inconsistent order formats and missing information (Slack #accounts-sunflower, 15 Oct 2025).
- Compliance mattered more than speed: every order should pass a check of what can legally ship to which state. The client's head of legal (Rob) was reported as very happy with the compliance built into Oliver (Delivery Planning Weekly, 20 Apr 2026; Drive: 2026-04-29 QBR).
- The buyer was the finance lead (Alex), who wanted clean data reaching accounting; the head of sales (Brooke) was the sceptic to win, and Alex said a fast MVP for the sales pain point would win her (Slack #accounts-sunflower, 10 Oct 2025).
- Internal politics shaped the brief: Alex and Oren wanted to be on Supernal's side but were wary of sales (Slack #accounts-sunflower, 15 Oct 2025).
- Sales reps wanted only two input methods, typing and voice-to-text (Slack #accounts-sunflower, 15 Oct 2025).
- Alternatives considered at purchase: not found. The fallback during delivery was manual entry into Zoho (Drive: 2026-04-29 QBR).

**What unlocked the expansion conversation (Jun to Aug 2026).**

- Proof of reliability: about 90% of orders through Oliver with zero workflow failures (vault: 2026-06-17-supernal-x-sunflower-weekly › RIC's notes).
- Figaro read-only API access arrived on 17 Jun 2026, which made cross-system order tracking and inventory work possible (vault: 2026-06-17-supernal-x-sunflower-weekly › RIC's notes).
- Leadership kept asking for live inventory value and cost per kilogram and could not get it (vault: 2026-06-24-supernal-x-sunflower-weekly › RIC's notes).
- Alex's own ask on 1 Jul 2026 was an Oliver that answers where an order is, whether it shipped, and what is owed (Slack #acnt-sunflower-wellness-internal, 8 Jul 2026).

**Why ArcWell users wanted the manufacturing scope (Aug to Sep 2026).**

- A six-week lead time that deters sales; the aim was to halve it (Sunflower x Supernal, 5 Aug 2026).
- A revenue goal of moving from about $25,000 per day to $120,000 per day, and volume from 50,000 to 4.5 million strips per month (Sunflower x Supernal, 5 Aug and 12 Aug 2026).
- Production had stopped before for want of one material (foil) (Sunflower x Supernal, 5 Aug 2026).
- Manual errors force full rework, for example a wrong date on a Manufacturing Master Record (Sunflower x Supernal, 5 Aug 2026).
- The slider demo made the idea real for the production lead (Sunflower x Supernal, 27 Aug 2026).
- Ownership: a previous R&D AI vendor was rejected because it had access to proprietary formulas; everything Supernal builds is owned by ArcWell (Sunflower x Supernal, 27 Aug 2026).
- Five or six people around the president were advocating for Supernal (Weekly Pipeline Meeting, 2 Sep 2026).

**Why it has not closed.**

- The enthusiastic users are not the signer (GTM + Scoping, 15 Sep 2026).
- The president is hard to reach and never scheduled the proposal meeting (Sunflower x Supernal, 27 Aug 2026; Weekly Pipeline Meeting, 2 Sep 2026).
- Suzan is weighing total spend on NetSuite, its integrator and Supernal, and the client was revisiting the NetSuite statement of work (Product Standup, 23 Sep 2026).
- The company is tightening spending during the transition (Sunflower x Supernal, 5 Aug 2026).
- The alternative on the table is NetSuite with its native AI plus an integration partner (Sync: Arcwell / Sunflower, 11 Nov 2026; Delivery Sync, 5 Oct 2026).

---

## 5. Commercials

**In force (Sunflower Wellness).** $30,000 implementation, then $2,000 per month from 1 Jan 2026. Term 2 Oct 2025 to 30 Sep 2026. Auto-renews for 12 months at $2,000 per month unless either side gives 60 days' written notice. Client must supply access and decisions within 5 business days of a written request (Drive: sunflower-wellness-inc-of-002-v1-signed.pdf). No notice of non-renewal was found, so the contract appears to have renewed to 30 Sep 2027 (inferred). Billing continues by Nick's decision of 27 Aug 2026 to keep billing Sunflower until ArcWell signs (Slack #acnt-sunflower-wellness-internal, 27 Aug 2026). Invoices were raised 2 Nov 2026 and are not overdue (Notion weekly report, 2 Nov 2026).

**Renewal date, as sources give it:** 30 Sep 2026 term end (Drive: signed order form); 2 Aug 2026 (Slack #acnt-sunflower-wellness-internal, 21 Jul 2026); auto-renewal on 4 Aug 2026 (Sunflower x Supernal, 29 Jul 2026); 15 Aug 2026 (Notion account page). The August dates are consistent with the 60-day notice deadline, not the term end (inferred).

**Every price discussed.**

| Date | Price | Context | Source |
|---|---|---|---|
| 2 Oct 2025 | $30,000 + $2,000/mo | Signed | (Drive: signed order form) |
| 21 Jul 2026 | About $3,000/mo | Nick's target for renewal with upsell, a 50% increase | (Slack #acnt-sunflower-wellness-internal, 21 Jul 2026) |
| 29 Jul 2026 | $5,000/mo ($1,000 strategy + $4,000 engineering) | Oliver Generalist, presented as matching last year's $48,000 | (Sunflower x Supernal, 29 Jul 2026) |
| Jul 2026 draft | $4,000/mo net, $48,000 per year | Same proposal on paper, after a $1,000 renewal credit; $250/mo third-party costs included | (Drive: OF-002 Oliver Generalist.docx) |
| 12 Aug 2026 | $15,000 to $20,000 one-time transition fee, waivable | Moving Oliver to ArcWell | (Weekly Pipeline Meeting, 12 Aug 2026) |
| 13 to 14 Aug 2026 | $6,000 / $8,000 / $10,000 per month, growing to $12,000 to $16,000; target about $10,000 | New pod model; references Labyrinth $15,000 and Bluewater $15,000 | (NEW GTM + Scoping, 13 Aug 2026; Sunflower Sync, 14 Aug 2026) |
| 19 to 25 Aug 2026 | $2,000 strategy + $6,000 Procurement + $6,000 Production + $4,000 Oliver; minimum $96,000; $500/mo third-party costs included | Order Form #001 | (Drive: ArcWell Manufacturing - Order Form #001.docx) |
| 15 Sep 2026 | $18,000 to $22,000 per month | All workstreams started together, as users asked | (GTM + Scoping, 15 Sep 2026; Squad Portfolio Sync, 15 Sep 2026) |
| 23 Sep 2026 | About $8,000 credit | Forgive the last two months of Sunflower fees as a lever | (Weekly Pipeline Meeting, 23 Sep 2026) |
| 30 Sep 2026 | About $96,000 | Smaller Oliver transfer and expansion deal | (Weekly Pipeline Meeting, 30 Sep 2026) |
| 5 Oct 2026 | Same hours at the Sunflower rate on whatever ArcWell prioritises | "Flexible scope" offer, not sent | (Notion weekly report, 5 Oct 2026) |

**Terms in Order Form #001.** Monthly in advance, net 30, 1% per month on overdue. Each milestone fee blends build and upkeep and does not fall after delivery. Activating a milestone resets the term to 12 months from that month. Auto-renews yearly with 30 days' notice. Client owns the roadmap, code and data; Supernal runs the infrastructure; a migration sprint at the monthly rate if the client self-hosts (Drive: ArcWell Manufacturing - Order Form #001.docx).

**Margin.** "Break even" (Notion account page). GM dimension scored 4 of 5 (Account OS).

**Forecast history.** 12 Aug 2026: 95% stay at $2,000 plus transition fee, 50% double to $4,000, 5 to 10% production work (Weekly Pipeline Meeting, 12 Aug 2026). 2 Sep 2026: 25% close in September (Weekly Pipeline Meeting, 2 Sep 2026).

**Unresolved.**

- Whether to keep billing Sunflower, give a heads-up, or credit it toward future work (Notion weekly report, 26 Oct 2026).
- Sheri's request to refund a $2,000 charge and bill ArcWell (Notion weekly report, 5 Oct 2026).
- What transferring the contract to ArcWell would commit Supernal to deliver, given Oliver is not connected to ArcWell systems (Notion weekly report, 5 Oct 2026).
- IP assignment on the entity change before Sunflower closes (Notion weekly report, 5 Oct 2026).
- The client holds the full-scope form, not the condensed Oliver-first deal Nick is aiming for (Notion weekly report, 26 Oct 2026).
- The Stripe receipt still copies Alex, who has left (Notion weekly report, 2 Nov 2026).
- ARR is recorded as $24,000 in Notion and the deal as $48,000 in Account OS (Notion account page; Account OS).

---

## 6. Product

### Oliver (AI employee, order management): built, idle

- **What it does.** Sales reps describe an order in plain language by SMS or in a web chat. Oliver structures it, checks it against compliance rules (which molecules may ship to which state), flags missing or inconsistent details, shows a draft, waits for the rep's confirmation, then writes the sales order into Zoho CRM. It can clone an earlier order, amend drafts, identify the rep by phone number, and share chat threads across the team (Drive: ArcWell Manufacturing (Sunflower Wellness) Notes).
- **Who used it.** The sales support team (Molly Xiong, Mailee Xiong, "Sunshine") through chat, and some field reps by SMS (vault: 2026-07-01-supernal-x-sunflower-weekly › RIC's notes).
- **Stack.** Started on n8n with Retell and Twilio; rebuilt as a NestJS / Node backend with a web UI on Railway and Supabase; live at `oliver-ui-production-8433.up.railway.app` (Linear SUN-12; Slack #acnt-sunflower-wellness-internal, 25 Sep 2026).
- **State.** Linear project "Sunflower - Oliver" is Paused. Milestones: Oliver MVP (Process 1) 35%, Process 2 purchase order drafting 25%, Process 3 invoice generation 0%, POG.1 lifecycle backend 0%, POG.2 sales-support agent 8%, POG.3 to POG.5 0%, Process 4 change requests 0% (Linear). The 35% reflects a large hardening backlog, not a missing feature: Process 1 is described as done and live (Slack #acnt-sunflower-wellness-internal, 8 Jul 2026).
- **Now.** Swami is decoupling Oliver from Zoho so NetSuite becomes an adapter, about two weeks of work plus re-running evals (Slack #acnt-sunflower-wellness-internal, 6 Nov 2026).

### Oliver Generalist (sales support): scoped, small part built

Answers where an order is, whether a purchase order was sent, shipping and tracking, invoice amount, payments, retainers and credits, by linking one order across Zoho CRM, Figaro and Zoho Books. The clickable order-status pop-out shipped in July 2026 and the client was happy with it (Supernal x Sunflower Weekly, 8 Jul 2026; Delivery Planning Weekly, 13 Jul 2026). The rest is unbuilt (Linear).

### Pulse (reporting dashboard): live

Tracks order volume, channel (chat or SMS), rejections and errors for Oliver. Live since 10 Jun 2026 (Slack #acnt-sunflower-wellness-internal, 10 Jun 2026). A per-rep activity dashboard was completed 21 Aug 2026 (Linear SUN-2).

### Procurement OS (ArcWell): prototype only

One live record per material, inventory read in days of production, reorder countdowns against supplier lead time, guided receive / move / return, and a Procurement Command Center (Drive: ArcWell Manufacturing - Order Form #001.docx). Prototypes: Procurement Runway and an earlier production planning UI built on ArcWell's own sheet data (Slack #acnt-sunflower-wellness-internal, 20 Aug and 2 Sep 2026).

### Production OS (ArcWell): prototype only

Demand aggregation from Zoho, bill of materials and buildability check, MMR and job packet generation, tracking through 15 production steps, two-way exchange with Procurement OS (Drive: ArcWell Manufacturing - Order Form #001.docx). Prototype: Ship-Date Planner (Slack #acnt-sunflower-wellness-internal, 2 Sep 2026).

### Sunflower Inventory Intelligence: paused

A Linear project of Fran's with 115 scope points mapped; meant to be the flagship after Oliver (Arcwell Manufacturing (Sunflower Wellness) Sync, 22 Aug 2026; Notion weekly report, 2 Nov 2026). Not found under the Sunflower Wellness team in Linear.

### Feature rationale

1. **Human confirmation before any write to Zoho.** Oliver drafts and the rep approves, because compliance came before speed (Drive: ArcWell Manufacturing (Sunflower Wellness) Notes; Delivery Planning Weekly, 20 Apr 2026).
2. **Text and voice-to-text only as inputs.** The client said these two would satisfy about 95% of reps (Slack #accounts-sunflower, 15 Oct 2025).
3. **Move off n8n to a coded backend.** n8n node and JSON issues were the source of errors; the move was expected to cut errors by about half at once. Decided over May 2026, with one more week given to n8n first (Delivery Planning Weekly, 4 May and 18 May 2026; vault: 2026-06-03-supernal-x-sunflower-weekly › RIC's notes).
4. **Missing-data prompts at order time, as soft suggestions.** Batch lists of customers with missing details do not get worked (vault: 2026-06-03-supernal-x-sunflower-weekly › RIC's notes).
5. **Stop requiring payment terms.** Sunflower does not track that field (vault: 2026-06-10-supernal-x-sunflower-weekly › RIC's notes).
6. **Relabel correct refusals as "rejections", not "errors".** Oliver blocking an incomplete order is the product working (vault: 2026-06-17-supernal-x-sunflower-weekly › RIC's notes).
7. **Stay mobile-first; do not widen the layout for desktop.** Most field users reach Oliver by SMS (vault: 2026-06-17-supernal-x-sunflower-weekly › RIC's notes).
8. **Compliance rules live in the app, not a shared sheet.** Easier to manage and toggle (vault: 2026-06-17-supernal-x-sunflower-weekly › RIC's notes).
9. **Connect to source systems, not Oren's spreadsheet.** The spreadsheet is only 80 to 85% reliable by his own estimate (vault: 2026-06-24-supernal-x-sunflower-weekly › RIC's notes).
10. **Invoices are generated in Zoho Books; purchase orders stay in Figaro.** Figaro's API is read-only and Alex wanted inventory control kept there (Supernal x Sunflower Weekly, 8 Jul 2026).
11. **Use the Zoho Record ID as the join key across systems.** The Figaro order number does not exist until the order is pushed (vault: 2026-07-01-supernal-x-sunflower-weekly › RIC's notes).
12. **Read inventory in days of production, not kilos.** Removes unit-conversion errors and moves with run rate (Sunflower x Supernal, 12 Aug 2026).
13. **Client-pulled milestone triggers with target dates, not deadlines.** To pre-empt fear of paying for strategy before scope is known (Sunflower Sync, 14 Aug 2026).
14. **Build on Sheets now, switch to NetSuite at go-live.** Supernal owns the agent and operating layer; ArcWell owns the data layer (Supernal x Arcwell: Steps to Kicking Off, 11 Sep 2026).
15. **Integrate data all at once, deliver screens in phases.** Building procurement, production and sales separately would move the bottleneck and cause rework (Sunflower x Supernal, 27 Aug 2026).

---

## 7. Use cases and feedback

**By team.**

| Team | Use case | State |
|---|---|---|
| Sales support (Molly, Mailee) | Enter and amend orders through Oliver chat | Used daily until mid-2026 |
| Field sales reps | Order by SMS | Light use; one rep kept entering manually (vault: 2026-06-17-supernal-x-sunflower-weekly › RIC's notes) |
| Sales and accounting | Ask where an order is and what is owed | Pop-out shipped; agent unbuilt |
| Accounting | Draft purchase orders and invoices | Still manual, line by line (Drive: ArcWell Manufacturing (Sunflower Wellness) Notes) |
| Head of sales (Brooke) | Open-orders board; raw-material allocation | Idea |
| Procurement (Kaleb) | Know days of production left and what to reorder | Prototype |
| Production (Phil) | Plan builds, generate MMRs, quote ship dates | Prototype |
| R&D (Phil, Kaleb) | Check peptide vendors and specs | Idea |
| Compliance (Alicia) | Vendor onboarding checks; governance of electronic MMRs | Idea |

**Adoption and usage numbers.**

| Date | Number | Source |
|---|---|---|
| Week before 29 Apr 2026 | About 20% error rate | (Drive: 2026-04-29 QBR) |
| 29 Apr 2026 | 11.6% error rate | (Drive: 2026-04-29 QBR) |
| 4 May 2026 | 14 of 15 eval scenarios passed | (Delivery Planning Weekly, 4 May 2026) |
| 9 Jun 2026 | 9 orders in a day, 8 by chat, 0 by SMS | (vault: 2026-06-10-supernal-x-sunflower-weekly › RIC's notes) |
| 17 Jun 2026 | 18 of 20 orders through Oliver, zero workflow failures | (vault: 2026-06-17-supernal-x-sunflower-weekly › RIC's notes) |
| 22 Jun 2026 | 95% success shown in Pulse, three errors | (Slack #acnt-sunflower-wellness-internal, 22 Jun 2026) |
| 24 Jun 2026 | 34 of 37 orders, zero errors | (vault: 2026-06-24-supernal-x-sunflower-weekly › RIC's notes) |
| 1 Jul 2026 | 95 orders in the quarter; 88% tablets; 89% by chat, 10% direct from reps | (vault: 2026-07-01-supernal-x-sunflower-weekly › RIC's notes) |
| Mid-2026 | 32 orders in a row over 15 days with no errors | (Drive: ArcWell Manufacturing (Sunflower Wellness) Notes) |
| 30 Sep 2026 | Near-zero usage | (Weekly Pipeline Meeting, 30 Sep 2026) |
| 5 Oct 2026 | Usage score 3, core team uses it | (Notion weekly report, 5 Oct 2026) |
| 26 Oct and 2 Nov 2026 | Usage score 1, no users | (Notion weekly reports) |

**Feedback and what changed.**

- Oliver was slow and reps thought it had failed; one order took nearly an hour. Fix: new backend and visible error messages (vault: 2026-06-03-supernal-x-sunflower-weekly › RIC's notes; Delivery Planning Weekly, 27 Apr 2026).
- Screen too dense; answers hidden below a long template. Fix: layout redesign, side panel, wider chat, done 24 Jun 2026 (Linear SUN-7, SUN-8, SUN-9).
- Prices need four decimals, weight and potency three. Still open (Linear SUN-73).
- Reps wanted a link to the created order. Done 25 Jun 2026 (Linear SUN-6).
- Reps asked for onboarding functions before they were planned (Drive: ArcWell Manufacturing (Sunflower Wellness) Notes).
- Oren said it had been a long time since a rep reported a problem (Drive: ArcWell Manufacturing (Sunflower Wellness) Notes).
- Kaleb asked for a threshold slider, a strips-to-boxes toggle and a days-of-production view. Fran reworked the prototype (Sunflower x Supernal, 27 Aug 2026; Slack #acnt-sunflower-wellness-internal, 2 Sep 2026).
- Former Sunflower salespeople at ArcWell miss Oliver (Weekly Pipeline Meeting, 30 Sep 2026).
- The CFO would not use Pulse until it showed money or time saved (vault: 2026-06-10-supernal-x-sunflower-weekly › RIC's notes).

---

## 8. Stakeholders

### Client

| Name | Title | Role on the account | Stance at start → now | Last notable interaction |
|---|---|---|---|---|
| Alex Seleznov | CFO; signed as contact; also called President | Buyer and sponsor | Champion → gone (left end of July 2026; described as fired) | 1 Jul 2026 weekly (Slack #accounts-sunflower, 7 Oct 2025; Weekly Pipeline Meeting, 12 Aug 2026) |
| Oren Dlin | AI Automation Strategist / Systems Analyst | Day-to-day contact, subject expert, built the workflow map | Supportive throughout; no budget authority | 5 Oct 2026 gap list (Notion weekly report, 5 Oct 2026) |
| Rob (Robert) Miller | President and Chief Legal Officer; owner's legal adviser | Economic buyer | Liked Oliver's compliance → verbally supportive, never signed, hard to reach | Named Suzan as signer, 11 Sep 2026 (Notion account page; Drive: 2026-04-29 QBR) |
| Suzan Damron | Chief Integration Officer, joined about Sep 2026 | Decision maker and signer | Sceptical; NetSuite first | 11 Sep 2026 call; silent since (Supernal x Arcwell: Steps to Kicking Off, 11 Sep 2026) |
| Sheri DeCoste | Finance; interim CFO; Zoho admin | Budget and billing | Cost-cutting risk → the only executive route since Alex; queried charges | 27 Oct 2026 reply (Sunflower x Supernal, 5 Aug 2026; Notion weekly report, 26 Oct 2026) |
| Ehron Sidel | Accounting and inventory; leads NetSuite onboarding | Needed for NetSuite access | Neutral | 11 Sep 2026 (Supernal x Arcwell: Steps to Kicking Off, 11 Sep 2026) |
| Phil Burrow | Production manager | Production OS owner | Convinced by the slider demo; offered to push Rob | 27 Aug 2026 (Sunflower x Supernal, 27 Aug 2026) |
| Kaleb Renyer | Procurement and inventory | Procurement OS owner | Engaged, gave detailed requests | 11 Sep 2026 |
| Molly Xiong, Mailee Xiong | Sales support | Daily Oliver users | Positive | 27 Aug 2026 |
| Brooke | Head of sales | Had to be won at the start | Sceptic → not heard from directly | Referenced 1 Jul 2026 |
| Alicia | Head of Compliance | Must shape any production automation | Not yet met | Named 19 Aug 2026 |
| John Messiter | Informed / consulted at kickoff | — | Unknown | Oct 2025 (Slack #accounts-sunflower, 7 Oct 2025) |
| Jerry (Gerry) | Founder of Figaro, the inventory vendor | Third party; owns manufacturer approval flow | Unresponsive on automation | 11 Nov 2025 (Slack #accounts-sunflower, 12 Nov 2025) |
| Lauren | Unknown | Called the internal champion | Supportive | (Sync: Arcwell / Sunflower, 11 Nov 2026) |

### Supernal team over time

- **Sales / AM:** Nick Agresti throughout. Eric Kravitz signed in 2025. Ryan Williams and Johnny Borbone joined the QBR (Drive: signed order form; Drive: 2026-04-29 QBR).
- **Strategy / delivery lead:** Nana Williams (delivery manager, Oct 2025 to mid-2026); Devan Leibowitz as strategist of record; Diana Pedroza for ArcWell scoping only, Aug to Sep 2026; Jaime Garcia reviewed the order form; Tauseef Rahman asked to take over on 6 Nov 2026 (Slack #acnt-sunflower-wellness-internal, 3 Sep and 6 Nov 2026).
- **Engineering:** Amiri (Oct 2025 to Mar 2026, went offline); July and Damilola in the Feb 2026 pod; Fran Abenza (27 Mar 2026 to Oct 2026, has left Supernal); Ricardo Morel for a code review in May to June 2026; Swami Costa from 24 Oct 2026 (Slack #pod-oliver-for-sunflower-wellness, 4 Feb 2026; Slack #acnt-sunflower-wellness-internal; Delivery Sync, 9 Nov 2026).
- **Squad:** Naveen is adding Sunflower and ArcWell to Squad 2 (Tauseef / Thomas, 6 Nov 2026).

---

## 9. Success and value

| Criterion | Baseline | Target | Current | Source |
|---|---|---|---|---|
| Share of orders through Oliver | Manual entry | Oliver as the only way to submit orders | About 91% at peak (24 Jun 2026); about zero now | (Drive: 2026-04-29 QBR; vault: 2026-06-24 notes; Notion weekly report, 2 Nov 2026) |
| Oliver error rate | About 20% (Apr 2026) | Under 3%, aspiration under 1.5% | Near zero from June 2026 | (Drive: 2026-04-29 QBR; Delivery Planning Weekly, 1 Jun 2026) |
| Correct information collected | — | 90% | Not measured as such | (Slack #accounts-sunflower, 15 Oct 2025) |
| Sales like using it | Head of sales sceptical | Yes | Positive feedback, feature requests | (Slack #accounts-sunflower, 15 Oct 2025; Drive: ArcWell Manufacturing (Sunflower Wellness) Notes) |
| Order-to-invoice turnaround | Not measured | To be defined | Never built | (Linear SUN-33) |
| ArcWell lead time | 6 weeks | About 3 weeks | Not started | (Sunflower x Supernal, 5 Aug 2026) |
| ArcWell revenue per day | $25,000 | $120,000 | Not started | (Sunflower x Supernal, 5 Aug 2026) |
| Inventory buffer | Reactive reorders | 3 weeks of cover | Not started | (Sunflower x Supernal, 12 Aug 2026) |
| Roadmap metrics in Order Form #001 | To be baselined | Lead time, inventory coverage, order cycle time | Unsigned | (Drive: ArcWell Manufacturing - Order Form #001.docx) |

**Value shown to the client with numbers.** Error-rate trend at the QBR; usage and channel mix in Pulse; an order-ID match rate of about 92% between CRM and Figaro found during discovery; a roughly 50% error drop from the backend migration (Drive: 2026-04-29 QBR; vault: 2026-06-24 and 2026-06-03 notes). No dollar value was ever shown; Account OS holds no value entries (Account OS).

**What the sponsor asked to see.** Alex wanted ROI in dollars or time, starting with real order-to-invoice lead time, and deal terms for his project accounting (vault: 2026-06-10 notes; Drive: 2026-04-29 QBR). Suzan needs to see what Supernal adds on top of NetSuite; a document on this was supplied in September and Nick planned to bring ROI data from Naveen and Manish (Weekly Pipeline Meeting, 23 Sep and 30 Sep 2026). Whether the ROI data was sent was not found.

---

## 10. Delivery now

| Workstream | State | Milestone % and date | Measured | Learned | Blocker |
|---|---|---|---|---|---|
| Oliver on Sunflower | Live, idle, project Paused | Oliver MVP 35%; project target 15 Sep 2026 passed | Nothing currently | Reliability won the users but not the buyer | No orders to take; Sunflower winding down |
| Oliver decoupling for NetSuite | Started week of 9 Nov 2026 by Swami | About 2 weeks plus evals, then 1 to 2 weeks once access lands | Eval pass rate | The agent is fine; the Zoho-shaped tools and prompt are the work | No NetSuite sandbox; no client reply; no Linear issue |
| Oliver Generalist | Paused | POG.1 0%, POG.2 8% | — | Figaro read-only limits writes | Unsigned; Figaro not used at ArcWell |
| Procurement OS and Production OS | Prototypes only | None | — | Users want all three together | Order form unsigned since 11 Sep 2026 |
| Security clean-up | Open | SUN-53, SUN-50, SUN-84 urgent, in backlog | — | Cleaning the latest commit is not remediation; scan history and config files | Assigned to Fran, who has left; rotation unconfirmed |
| Commercial re-engagement | In motion | Email planned 12 Nov 2026 | Reply or not | Momentum dies between decision and action | No rapport with Suzan |

(Linear; Slack #acnt-sunflower-wellness-internal, 6 Nov 2026; Notion weekly report, 2 Nov 2026; Tauseef / Nick: WE Vid Clip, 12 Nov 2026)

**Decisions waiting.**

- Keep billing Sunflower, credit it, or pause (Notion weekly report, 26 Oct 2026).
- Start the decoupling now (Nick) or wait for ArcWell to confirm scope around 15 Nov 2026 (Swami's 2 Nov update) (Notion weekly report, 2 Nov 2026).
- Lead with the full order form or the Oliver-first deal (Notion weekly report, 26 Oct 2026).
- Who owns R&D concept alignment, or park it (Notion weekly report, 2 Nov 2026).
- Who the strategist of record is: Account OS and Notion still show Devan (Account OS; Slack #acnt-sunflower-wellness-internal, 6 Nov 2026).

**Slipping.**

- NetSuite go-live: 1 Oct 2026, then late Oct or early Nov, now unknown (Supernal x Arcwell: Steps to Kicking Off, 11 Sep 2026; Notion opportunity page).
- Order form signature: targeted 30 Aug 2026, then September, then mid-November (Weekly Pipeline Meeting, 19 Aug 2026; GTM + Scoping, 9 Oct 2026).
- The re-engagement note: drafted 6 Nov 2026, still unsent on 9 Nov; a fuller draft was posted in Slack on about 12 Nov; sending not confirmed (Notion weekly report, 2 Nov 2026; Slack #acnt-sunflower-wellness-internal, 6 Nov 2026 thread).
- Weekly client meeting: cancelled until a new order form closes; no pod internal sync held (Notion weekly report, 2 Nov 2026).

**Commitments with no Linear issue.** Oliver decoupling and readiness document (Swami); NetSuite sandbox request (Swami); July credential rotation check (Swami); scoping notes and handoff recording to Tauseef (Diana); forward Oren's emails to Tauseef (Nick); reassign Fran's backlog (Notion weekly report, 2 Nov 2026; Sync: Arcwell / Sunflower, 11 Nov 2026; Tauseef / Nick: WE Vid Clip, 12 Nov 2026). The Sunflower team's only post-September issue says tasks will be added once the order form is signed (Linear SUN-1).

**Dates in the next 30 days.**

- 15 Nov 2026: revisit and target-close date on the parked opportunity (Notion opportunity page).
- About 23 Nov 2026: decoupling build due if the two-week estimate holds (inferred from Slack, 6 Nov 2026).
- About 2 Dec 2026: next $2,000 Sunflower invoice (inferred from the 2 Nov invoice).
- This week: health read for W46 is due (Account OS).

---

## 11. Artifacts

| Title | Kind | Date | Owner | Where | Purpose |
|---|---|---|---|---|---|
| sunflower-wellness-inc-of-002-v1-signed.pdf | Order form (signed) | 2 Oct 2025 | Nick / Eric | https://drive.google.com/file/d/1zaIFdG9lb6vgx0-E91_XW-VjA0u6_PAT/view | The contract in force |
| sunflower-wellness-inc-msa-v1-signed.pdf | MSA | Filed 3 Nov 2026 | — | https://drive.google.com/file/d/1MdwRqSXR82L1AOfGqAqz5MrvHcLeZuy_/view | Governing agreement (not opened) |
| sunflower-wellness-inc-bundle-v1-signed.pdf; Sunflower Wellness + Supernal.pdf | Contract bundle | Filed 30 Apr and 3 Nov 2026 | — | https://drive.google.com/file/d/1b0oCDWWKNedOvIpz-OwvuG9SYTRWNKO3/view ; https://drive.google.com/file/d/18lyWIO3_bC3o6Dqcx6bLf8oxLsF33Kn4/view | Same file size; MSA plus order form (inferred, not opened) |
| ArcWell Manufacturing - Order Form #001.docx | Order form (unsigned) | 16 to 25 Aug 2026 | Nick, Diana, Jaime | https://drive.google.com/file/d/1ctEug7HmASHgJW3GN5Sn5Sj6V6aYI_f7/view | ArcWell expansion proposal |
| sunflower-wellness-inc-of-001-v1-draft.docx | Order form copy | Filed 28 Oct 2026 | — | https://drive.google.com/file/d/1uqA6uVclP7-zkzcUrB-ZgKD1t_qhKEcl/view | Same size as Order Form #001 (copy, inferred) |
| Sunflower Wellness: OF-002 Oliver Generalist.docx | Order form (draft) | Jul 2026 | Nick, Devan, Fran | https://drive.google.com/file/d/1rkixjOGbAYVA_vnL170Ge79-KsOTUsXj/view | Superseded generalist proposal |
| ArcWell Manufacturing (Sunflower Wellness) Notes | Doc | 13 to 24 Aug 2026 | Diana | https://docs.google.com/document/d/1iz9RHmf_hP3mK6SKXeHvCfTtn5giJJJ_YLSues7m4JE/edit | Oliver 1.0 overview, tools and data map |
| order-fulfillment-overview_2.html | Site (workflow map) | 27 Aug 2026 | Oren / Phil (client) | https://drive.google.com/file/d/1aCF4j9FYWV2HgWmeNo5Q2dzuijgOTC9s/view | ArcWell's six-step order-to-ship flow across Zoho Books and Sheets |
| Transcripts folder (12 docs, 29 Apr to 15 Jul 2026, incl. QBR) | Docs | Apr to Jul 2026 | Auto-filed | https://drive.google.com/drive/folders/1VgXBUoBOEjlCsRxeP9LJbK3aoaQRBPf- | Call transcripts |
| Drive folders: Sunflower Wellness Inc.; Arcwell Manufacturing Expansion; a second Sunflower Wellness Inc. (contracts); two empty "Arcwell" folders | Folders | Jun to Oct 2026 | — | https://drive.google.com/drive/folders/1kmGhEiK5II8H382JfrVOCiO2C3K0sVAP ; https://drive.google.com/drive/folders/1KRFHyT-DwiRkGr_yC20yzgyjUTJ2rNuB ; https://drive.google.com/drive/folders/1aySieiH9iZJf05BeDFXK-bkuV9WdgVGt | Account files. Client Facing, Internal Facing (one shortcut) and monorepo are empty |
| Oliver UI | Prototype / live app | Live 9 Jun 2026 | Fran → Swami | https://oliver-ui-production-8433.up.railway.app/ | The product |
| Pulse reporting for Oliver | Dashboard | Live 10 Jun 2026 | Fran | https://pulse.getsupernal.ai/employees/01KQFYVDN5N1XCFNCSJ1Y2TKGQ | Usage and error reporting |
| Production planning prototype | Prototype | 20 Aug 2026 | Fran | https://claude.ai/code/artifact/a235cd74-9c64-4dd4-9446-87422482ee72 | Visualise the algorithm the AI would use |
| Procurement Runway | Prototype | 2 Sep 2026 | Fran | https://claude.ai/code/artifact/e80c7d13-d0b9-44f7-8dec-a7f4ca008a5d | Reworked after the 26 Aug feedback |
| Ship-Date Planner | Prototype | 2 Sep 2026 | Fran | https://claude.ai/code/artifact/e77ca849-d6b0-4345-8c85-3b9241d9a931 | When the next order can clear |
| Loom for Alex on scope options | Video | Jul 2026 | Fran | https://www.loom.com/share/6e5f264794a044c3a1a57a73cc1f918b | Explain what is in scope and what is new |
| Revised Scope (Process 4, change requests) | Doc | Jul 2026 | Devan / Fran | https://docs.google.com/document/d/1-A_E8PP_kokFZhmvy2Rvr7zaZLMpDgK-5cXgzd86R6o/edit | Scope revision |
| Order form working draft | Doc | Jul 2026 | Devan | https://docs.google.com/document/d/1NQwPnUEfZKa41RuoRkYqFGU9o_F39UfV/edit | Draft with pricing questions |
| 24 Jun 2026 call recording | Video | 24 Jun 2026 | — | https://fathom.video/share/EsfGBzrHgrrwyJyJCwqEsVsCe4JPs-8b | The inventory opportunity call |
| QBR recording | Video | 29 Apr 2026 | — | https://fathom.video/calls/653784165 | QBR |
| Linear project Sunflower - Oliver | Project | 2 Oct 2025 on | Fran | https://linear.app/supernal-clients/project/sunflower-oliver-eaf8536b167d | Delivery record |
| Notion account page; weekly reports (16); opportunity page | Docs | Sep to Nov 2026 | Strategy team | https://app.notion.com/p/3a7bd5e8f31881928560ec7313260e2d ; https://app.notion.com/p/413bd5e8f318808bb03ad7e679c97e6a ; https://app.notion.com/p/3e4bd5e8f31881df9997eec4b99416ca | Health reporting |
| "Sunflower Wellness Oliver in Cortex" | Doc | Jan 2026 | Engineering | https://app.notion.com/p/2f1bd5e8f31880159e24c479010ddde3 | Oliver as a Cortex-native employee (not opened) |
| Re-engagement email draft "Getting Oliver live on NetSuite" | Doc (email) | About 12 Nov 2026 | Tauseef for Nick | Slack #acnt-sunflower-wellness-internal thread of 6 Nov 2026 | Ask for sandbox and introduce the new team |
| Oliver order-flow diagram V8 | Diagram | Jul 2026 | Oren (client) | location unknown | Reference for lifecycle logic |
| Oren's mock sales-question script (10 benchmark scenarios) | Doc | Jul 2026 | Oren (client) | location unknown | Benchmark for the generalist |
| "Supernal on top of NetSuite" explainer | Doc | Sep 2026 | Nick / Fran | location unknown | Answer Suzan's objection |
| Handover document Fran → Swami | Doc | Oct 2026 | Fran / Swami | location unknown | Engineering handover |
| Oren's Phase 1 review and gap list | Email | 5 Oct 2026 | Oren (client) | location unknown (email) | Five gaps NetSuite will not cover |
| Visual roadmap paired with the order form | Deck | Aug 2026 | Nick | location unknown | Planned; existence not confirmed |
| MVP scope doc; technical scope and migration plan | Docs | Oct 2025 | Nana / Amiri | location unknown | Original build plan |
| Oliver demo video for prospects | Video | Nov 2025 | Amiri | location unknown | Requested by Nick; delivery not confirmed |

---

## 12. Suggested vault sections

Context this account holds that a standard scoping and delivery template set would not.

1. **Entity transition** (a lot of material). Files: entity map (Sunflower, ArcWell Manufacturing, the ArcWell Solutions domain, Zoho org numbers); contract transfer and IP assignment questions; billing-in-limbo log (who is charged, who queried it); naming and document-numbering key.
2. **Regulatory and compliance context** (moderate). Files: the 7-OH rescheduling timeline and its effect on the client; Oliver's state-by-state compliance rules and who maintains them; FDA limits on electronic MMRs and the print-and-sign fallback; batch traceability need.
3. **Sponsor loss and re-entry plan** (a lot). Files: stakeholder turnover timeline (Alex out, Sheri interim, Rob, Suzan in); non-response log; the proactive plan of 6 Nov 2026 and the email draft; routes to an executive (Sheri, Phil, Oren).
4. **Competing platform: NetSuite** (moderate). Files: migration timeline and slips; the "what Supernal adds on top of NetSuite" argument; Oren's five-gap list; sandbox and API access asks; ERP-neutral design notes for Oliver.
5. **Client operations model** (a lot). Files: order-to-ship flow (the HTML map); production steps and physical bottlenecks (drying tunnel, strip inspection); spreadsheet inventory (master sheet, demand planning, App Scripts); SO, PO and invoice numbering and the Record ID join key; Figaro constraints.
6. **Trigger-based order form design** (moderate). Files: the milestone-trigger and term-reset mechanics; pricing history across four proposals; internal approval path (Jaime, Thomas, Naveen); objection handling notes.
7. **Security incident record** (moderate). Files: the two malware waves and what was learned; credential rotation checklist and its status; Railway key rotation entries; open urgent hardening issues.
8. **Pod and handover history** (moderate). Files: who held the account when (Amiri, Fran, Swami; Nana, Devan, Diana, Tauseef); what each handover lost; where the handover documents and recordings live.
9. **Prototype library** (small but valuable). Files: the three claude.ai prototypes with the feedback that shaped each; the Loom; what was demoed to whom and the reaction.
10. **Future scope parked** (small). Files: R&D chemistry research tool; vendor onboarding; custom packaging flags; quality data; raw-material allocation for sales.

---

## 13. Book

### Chapter 1. The account in one page

Sunflower Wellness is a Colorado supplement company that bought one AI employee from Supernal in October 2025. Oliver takes sales orders by text or chat, checks them against compliance rules, and writes them into Zoho. The price was $30,000 to build and $2,000 a month after. By June 2026 about nine in ten orders went through Oliver with almost no errors, and the client was talking about switching off manual entry.

Then the ground moved. The DEA made Sunflower's main product illegal from about August 2026. The owners shifted the business to a sister company, ArcWell Manufacturing, which makes peptide strips. The finance lead who bought Oliver left. ArcWell's production and procurement staff loved a new proposal to build procurement and production systems, worth at least $96,000 a year, but the president never signed and a new Chief Integration Officer put a NetSuite migration first.

Today Oliver has no users, Supernal still bills $2,000 a month, the order form has sat unsigned since 11 September, and the client has gone quiet. Health is 2.6 of 5 with executive engagement at 1. The current plan is to make Oliver ready for NetSuite and use that as the way back in.

Sources: Drive signed order form; Delivery Planning Weekly, 29 Jun 2026; Supernal x Sunflower Weekly, 8 Jul 2026; Drive Order Form #001; Account OS; Notion weekly report, 2 Nov 2026.

### Chapter 2. Why they bought

The record of the sale itself is missing, but the first weeks show the reasons. Orders reached accounting by hand, in different formats, with details missing. The company sells regulated products, so each order also had to be checked against what could legally ship to each state. The finance lead, Alex Seleznov, wanted clean, compliant orders. His head of legal later said he was very happy with the compliance built in.

There was a second, quieter reason. Alex and his automation lead, Oren Dlin, wanted to modernise but were wary of the sales team, whose head had influence with the owner. Alex told Nick that the head of sales needed to touch something before she would back it. So the brief became: build the order-capture step first, make reps like it, and collect 90% correct information. Reps wanted only typing and voice-to-text.

Supernal refused to build a free demo and treated the first step as the start of the paid build. It also held the first showing until the first $10,000 invoice was paid. That early caution reflected a real worry: Alex had said he did not realise the paper he signed was the contract itself.

Sources: Slack #accounts-sunflower, 10 and 15 Oct 2025; Drive 2026-04-29 QBR; Delivery Planning Weekly, 20 Apr 2026.

### Chapter 3. How the deal is built

There is one signed contract and three unsigned ones. The signed one is with Sunflower Wellness: three $10,000 build payments, then $2,000 a month, a term to 30 September 2026, and automatic renewal for a year unless notice is given 60 days before. Nobody gave notice, so it appears to have renewed.

In July 2026 Supernal drafted an "Oliver Generalist" form at $4,000 to $5,000 a month. It was overtaken within weeks. The form that matters is ArcWell Manufacturing Order Form #001. It has four lines: strategy at $2,000 a month, a Procurement OS at $6,000, a Production OS at $6,000, and Oliver as a sales generalist at $4,000. Only the first two start at signature, which makes the minimum $96,000. The client pulls the trigger on each later milestone, and each trigger restarts a 12-month term. The fee for a milestone does not drop once it is built, because it covers upkeep too.

The design was deliberate. The client was shrinking and could not commit $10,000 a month to an unknown scope, so the form let them control cash and order. The cost was weaker up-front risk analysis. A fourth idea, a smaller Oliver-first deal, exists only in conversation.

Sources: Drive signed order form; Drive OF-002 Oliver Generalist; Drive Order Form #001; Sunflower Sync, 14 Aug 2026; NEW GTM + Scoping, 13 Aug 2026; Weekly Pipeline Meeting, 30 Sep 2026.

### Chapter 4. The product and why it is built this way

Oliver is a careful clerk, not a free agent. A rep describes an order; Oliver fills a template, checks state rules, asks for what is missing, shows a draft, and only writes to Zoho when the rep confirms. That gate exists because the client cared more about compliance than speed.

It began on n8n with a voice layer. That version was fragile: about one order in five failed in April 2026. Fran rebuilt it as a coded backend with its own web screen, which roughly halved errors at once and reached near zero by June. Several small choices came from watching real orders: stop demanding payment terms the client does not track; prompt for missing customer data at order time, because batch clean-up lists are ignored; call a correct refusal a "rejection", not an "error"; keep the screen mobile-first.

Two outside limits shaped everything after. Figaro, the inventory system, gave read-only access, so Oliver can report on purchase orders but not create them, and invoices are generated in Zoho Books. And at ArcWell the data lives in spreadsheets on the way to NetSuite, so the manufacturing design reads inventory in days of production and is meant to start on Sheets and switch source later.

Sources: Drive ArcWell Manufacturing (Sunflower Wellness) Notes; Drive 2026-04-29 QBR; vault notes of 3, 10 and 17 Jun 2026; Supernal x Sunflower Weekly, 8 Jul 2026; Supernal x Arcwell: Steps to Kicking Off, 11 Sep 2026.

### Chapter 5. How delivery has gone

Delivery has had three engineers and two clear phases. The first engineer built the n8n version through late 2025, then went offline in March 2026. An SMS channel that was in scope had not been delivered, and secrets and release practice were weak. Fran arrived as temporary cover at about 60% build and stayed.

April was the low point: unanswered client emails, a red instability thread, and a QBR where Supernal had to show an 11.6% error rate. The client stayed patient because the main contact was consistently positive and because Supernal showed a believable downward trend. Internally the lesson was about testing: release gates and evals came after the damage.

From June the build was stable and the weekly calls turned into discovery for more work. Then two things outside the product hit: a company-wide malware incident in July that touched this repository twice, and the client's pivot. Since September nothing has shipped to a user. The Linear project is paused, urgent security items sit unassigned in practice, and the last weekly client meeting was cancelled until an order form closes. Fran has left; Swami now owns the code.

Sources: Catchup: Fran & Tauseef, 16 Apr 2026; Slack #acnt-sunflower-wellness-internal, Apr to Jun 2026; Tauseef / Devan, 30 Apr 2026; Notion weekly reports, Oct to Nov 2026; Linear.

### Chapter 6. The people

On the client side the account has lost its buyer. Alex Seleznov signed, sponsored and attended; he was gone by the end of July 2026. Oren Dlin has been the constant: helpful, technically able, the author of the workflow maps and gap lists, but without budget. Rob Miller, president and chief legal officer, is the economic buyer; he liked Oliver's compliance and said he wanted to proceed, yet never scheduled the signing meeting. Suzan Damron arrived as Chief Integration Officer, was named signer on 11 September, and has not engaged since. Sheri DeCoste in finance is the only executive who still replies, mostly about charges. Phil Burrow and Kaleb Renyer in production and procurement are convinced users.

On Supernal's side Nick Agresti has owned the relationship throughout. Around him the team has changed often: a delivery manager, a strategist of record stretched across accounts, a second strategist borrowed only to write the order form, three engineers in turn. Diana named this as a risk in itself: the story lives in pieces across people who have moved on.

Sources: Slack #accounts-sunflower, 7 Oct 2025; Delivery Planning Weekly, 3 Aug 2026; Supernal x Arcwell: Steps to Kicking Off, 11 Sep 2026; Sync: Arcwell / Sunflower, 11 Nov 2026.

### Chapter 7. What value has shown

The value shown was operational, never financial. At its best Oliver took 34 of 37 orders in a week with no errors, 95 orders in a quarter, and the sales support team stopped reporting problems. Reps asked for features before they were planned. The legal head liked that every order passed a compliance check.

What was never produced is a number a finance lead could use. Alex said he would not open the reporting dashboard until it showed dollars or time saved, and suggested order-to-invoice lead time as the first hard measure. Figaro access to build it arrived in mid-June; the pivot arrived three weeks later; the metric was never built. Account OS holds no value entries.

That gap matters now. The new decision maker has no history with Oliver and is asking a fair question: what does this add on top of NetSuite? The honest assets are user affection, a list from Oren of five things NetSuite will not cover, and three prototypes that made production staff lean in.

Sources: vault notes of 10, 17 and 24 Jun and 1 Jul 2026; Drive 2026-04-29 QBR; Linear SUN-33; Notion weekly report, 5 Oct 2026; Account OS.

### Chapter 8. The security thread

This account carries a security history a newcomer must know. In June 2026 a compromised npm package led Fran to rotate keys. In July a malware infection spread through Supernal's GitHub; this client's repository was cleaned at its latest commit, then found infected again three weeks later because history and other executable config files were not re-checked. The second payload fired on the linter, so opening the code in an editor was enough to run it. In October a Railway breach led to another round of key rotation with several Sunflower entries.

The strategy team's weekly report ranks this above the commercial problem: a documented rotation list (Supabase, Zoho, n8n, Fathom, Railway) has no closed ticket, the engineer who knew the detail has left, and three urgent hardening issues remain in the backlog. Swami was told to delete the archived project because some branches may be compromised, and needed access to the current one.

Sources: Delivery Planning Weekly, 1 Jun and 13 Jul 2026; Notion weekly reports, 26 Oct and 2 Nov 2026; Notion INC-13 and INC-17 entries; Linear SUN-50, SUN-53, SUN-84; Delivery Sync, 9 Nov 2026.

### Chapter 9. Where it stands and what is next

The plan agreed on 6 November 2026 is to stop waiting. Swami is separating Oliver from Zoho so that NetSuite becomes a connector, not a rebuild. Nick will tell ArcWell what Supernal is doing and ask for the two things that gate progress: confirmation that NetSuite is the system of record for sales orders, and a sandbox with API access. Devan's advice shaped it: announce the work, so a "don't bother" is learned cheaply. Tauseef drafted the email and is introduced in it with Swami as the day-to-day team.

Three things could undo it. The client may simply not answer a fifth time. The $2,000 monthly charge against an unused system may draw a refund demand or a cancellation before value returns. And the unconfirmed credential rotation is a risk that does not depend on the client at all.

If ArcWell engages, the path is Oliver live on NetSuite within about a month of access, then the Oliver-first deal, then procurement and production once NetSuite settles. Internally this account ranks below World Emblem and RxVIP for Tauseef's time.

Sources: Slack #acnt-sunflower-wellness-internal, 6 Nov 2026; Tauseef / Nick: WE Vid Clip, 12 Nov 2026; Notion weekly report, 2 Nov 2026; Weekly Pipeline Meeting, 30 Sep 2026.

---

## 14. Gaps and conflicts

**Not found or not accessible.**

- The local folder `~/Documents/Supernal 2/Clients/Sunflower-Wellness` does not exist.
- No pre-sale calls (before 2 Oct 2025) in Fathom or Granola; no proposal or deck from the original sale.
- No client-call recordings found for Dec 2025 to Mar 2026.
- No Slack channel with "arcwell" in the name. `#stg-acnt-sunflower-wellness-internal` was not read (staging duplicate, inferred).
- Client emails (Oren's gap list, Sheri's replies, Rob's email, Nick's 2 Nov note) were not read; Gmail was outside the listed sources.
- The MSA, the contract bundle, the QBR transcript beyond its header and keyword lines, and most Drive call transcripts were not opened.
- Only 3 of 16 Notion weekly reports were opened (5 Oct, 26 Oct, 2 Nov 2026).
- The "Sunflower Inventory Intelligence" Linear project and the SUP-23xx issues were not located.
- Whether the re-engagement email was sent on 12 Nov 2026, whether Swami now has repository access, and whether the July credential rotation happened.
- What "ArcWell Solutions" is, who Lauren is, and who now holds the CFO role.
- No dollar value or ROI figure for Oliver anywhere.
- The claude.ai prototypes and the Loom were listed, not opened.

**Sources disagree.**

- **Rename or separate entity.** One internal note says Sunflower was rebranded to ArcWell because of Colorado rules (Sync: Arcwell / Sunflower, 11 Nov 2026). Client calls and the contract picture show a separate sister entity and a federal DEA rescheduling (Supernal x Sunflower Weekly, 8 Jul 2026; Weekly Pipeline Meeting, 2 Sep 2026).
- **Order form numbering.** "OF-002" names both the signed 2025 form and the unsigned July 2026 generalist draft; "OF-001" names the unsigned ArcWell form (Drive).
- **Milestone C price.** $4,000 per month in the document (Drive: Order Form #001); $6,000 in the call summary (Sunflower x Supernal, 19 Aug 2026).
- **Size of the ArcWell deal.** Minimum $96,000 and $18,000 per month if all active (Drive: Order Form #001); $18,000 to $22,000 per month (GTM + Scoping, 15 Sep 2026); "full $120k scope" (Notion weekly report, 26 Oct 2026).
- **Generalist price.** $5,000 per month on the call; $4,000 net in the draft (Sunflower x Supernal, 29 Jul 2026; Drive: OF-002 Oliver Generalist).
- **Renewal date.** 30 Sep 2026, 2 Aug, 4 Aug and 15 Aug 2026 (see section 5).
- **Contract value.** $48,000 with $2,000 MRR (Account OS); ARR $24,000 (Notion account page). Notion also shows "contract signed 20 Sep 2026", which matches no signature found.
- **Why the deal is on hold.** Waiting for NetSuite (GTM + Scoping, 9 Oct 2026; Account OS health notes); Oren said the hold is not specifically about NetSuite (Notion weekly report, 5 Oct 2026).
- **Usage in early October.** Near zero (Weekly Pipeline Meeting, 30 Sep 2026) versus score 3, core team uses it (Notion weekly report, 5 Oct 2026).
- **Health label.** Watch at 2.6 (Account OS); Critical (Notion weekly reports; Delivery Sync, 9 Nov 2026).
- **Pod.** Nick / Devan / Fran (Account OS) versus Fran gone, Swami engineering, Tauseef asked to take strategy (Slack, 6 Nov 2026). Notion weekly reports say no Account Executive is set while the account page has one filled.
- **Alex's title and exit.** CFO, President, or both; "left" versus "fired" (Slack #accounts-sunflower, 7 Oct 2025; Drive notes doc; Weekly Pipeline Meeting, 12 Aug 2026).
- **Figaro at ArcWell.** Notes say Figaro was scoped out of Phase 1; Oliver in fact reads Figaro for Sunflower. ArcWell does not use Figaro (Drive notes doc; Supernal x Sunflower Weekly, 8 Jul 2026).
- **Who met on 20 Oct 2026.** "Jerry (Sunflower finance)" in one note; Sheri in the Notion report. Jerry is Figaro's founder elsewhere (New note, 26 Oct 2026; Notion weekly report, 26 Oct 2026; Slack #accounts-sunflower, 12 Nov 2025).
- **Name spellings in notes.** Suzan / Susan / Suzanne; Oren / Orin; Ehron / Aaron; Kaleb / Caleb; Sheri / Sherry; Figaro / Figgro / Figuro; "708" for 7-OH; "Arkwell", "Arquel" and "Power Wellness" for ArcWell.
- **ArcWell's business.** Peptide strips and tablets (client calls); "compounding pharmacy" in one internal note (Weekly Pipeline Meeting, 23 Sep 2026).
