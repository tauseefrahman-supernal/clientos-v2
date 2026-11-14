# Proposal — SAL for Hooray Agency (Phase 1 + Phase 2)

> **Phase:** Builder · **Role:** Output
> **Answers:** Client-facing narrative. Hero → Problem → Solution → Roadmap → Phase cards → Commercials → Next Steps.
> **This file is for:** the Deal Room Proposal render (Stage 2). Summarises and references B3, B4, B5, B6 inputs — does NOT restate them verbatim.
> **This file is NOT for:** module-level pricing details (see B6), WP specs (Work-Products.md), raw discovery notes (Phase A Inputs).
> **Upstream sources:** `Phase B/Inputs/B3-AI-Employees.md`, `Phase B/Inputs/B4-Delivery-Plan.md`, `Phase B/Inputs/B5-Phasing-Commercial.md`, `Phase B/Inputs/B6-Points-Commercial.md`, `Phase B/Inputs/Work-Products.md`.
> **Rendered artifact:** `Hooray_Agency-Proposal-v5.html` (file 212, latest version as of 2026-06-04).
> **Framework:** `Frameworks/MECE-Framework.md`

---

## Hero

SAL writes the report. The account team signs it off.

SAL is an AI Employee built on top of Hooray's existing stack — GA4, Meta Ads Manager, Google Ads, Trade Desk, Google Workspace, and Monday.com. Phase 1 takes the monthly reporting cycle that consumes most of the account team's capacity and hands them a first draft with anomalies already flagged, ready for review. Phase 2 handles inbound hotel marketing director requests end-to-end, from intake through to a completed brief in Monday.com.

---

## The Problem

Hooray's account team is strong at strategy and client relationships. The work that consumes most of their month is not strategy.

**Three friction points, each with a real cost:**

**1. Data Foundation.**
GA4, Google Ads, Meta Ads Manager, and Trade Desk each tell a slightly different story. Spend, conversions, and reporting periods don't read the same way across platforms or across hotel clients. Before any narrative can be written, someone reconciles the numbers. That work lives on the account team today.

**2. Reporting Workflow.**
Monthly reporting eats the majority of the account team's capacity. The work the team is best at — judgment, client conversations, anomaly interpretation — sits behind hours of data assembly and deck production. SAL writes the first draft; AMs spend their time on review and sign-off, not assembly.

**3. Leadership Visibility.**
David, Roger, Randy, and Steven have no live number for how much of the team's month goes into coordination overhead versus client value. The impact of reclaiming that time can't be proven without a measurement system. Pulse provides one — Equivalent Human Hours, calculated on a method Hooray signs off and tracked against a real production cycle.

---

## Our Solution — SAL

SAL is an AI Employee, not a software tool. It has a defined role, decision boundaries, and a governance model. It produces two named Work Products.

### Work Product 1 — Performance Report (Phase 1)

SAL pulls performance data from GA4, Meta Ads, Google Ads, and Trade Desk for every hotel client in Hooray's roster each month. It reconciles the numbers across platforms, generates a complete first-draft performance narrative (period overview, platform-by-platform performance, trend analysis, recommended next steps), and flags anomalies where performance deviates from baseline.

The AM opens the report in one view, reviews the narrative, and signs off or sends back with notes for regeneration. Nothing reaches a hotel client without that sign-off.

- **Human-equivalent value:** ~150 minutes per report at ~$55/hr blended AM rate → ~$137.50/report
- **Volume at steady state:** 30–50 reports/month across the hotel portfolio
- **Pulse rollup:** ~100 Equivalent Human Hours/month at steady state, visible to Hooray leadership

### Work Product 2 — Packaged Brief (Phase 2)

A hotel marketing director sends a request. SAL classifies it by campaign type, identifies missing parameters, asks the targeted clarifying questions a senior AM would ask (maximum 2 rounds), pulls context from Hooray's Google Workspace, and assembles a completed brief in Hooray's standard format — written to Monday.com as a task ready for Shelly's traffic team to assign.

AMs are removed from brief coordination. Shelly's team gets complete, consistently formatted briefs. Hotels get faster turnaround.

- **Human-equivalent value:** ~75 minutes per brief at ~$55/hr → ~$68.75/brief
- **Volume at steady state:** 20–40 briefs/week (_pending Shelly working session for confirmation_)
- **Pulse rollup:** ~100 Equivalent Human Hours/month (briefs), stacking on top of Phase 1 reports

_Both Work Products pending customer alignment on human-equivalent minutes and hourly rate. Alignment conversation targeted at June 10 session with David._

---

## Roadmap

Two phases. Each has a binary exit condition — live or not live — before the next one begins.

| Phase | Work Product Activated | Duration | Exit Gate |
|---|---|---|---|
| Phase 1 — Reporting Intelligence | Performance Report | ~10–14 weeks from kickoff | ≥10 hotel clients, ≥95% on-time delivery, 1 full cycle complete, Pulse live |
| Phase 1.5 — Trade Desk Live (optional) | Performance Report (enhanced) | 2–3 weeks | Trade Desk API credentials confirmed |
| Phase 2 — Creative Request Intelligence | Packaged Brief | ~8–12 weeks from Phase 2 kickoff | ≥20 briefs/week, ≤4hr turnaround, ≥90% brief completeness |
| Phase 3 — Expansion (indicative) | TBD (Momentum AIQ, additional hotel clients) | Post-Phase 2 | Separate Order Form |

**Realistic timeline:**
- Accelerated tier: Phase 1 go-live ~Q3 2026 (Aug/Sep). Phase 2 go-live ~Q1 2027.
- Sprint tier: Phase 1 go-live ~Q3 2026 (Aug). Phase 2 go-live ~Q4 2026 (Nov/Dec).

---

## Phase 1 — Reporting Intelligence

Six milestones, each binary: live or not live. Hooray signs off before the next is marked complete.

| Milestone | Target | What's live |
|---|---|---|
| M1 · Foundation is live | Week 2 | Every hotel client assigned to an access tier (Tier 1/2/3) with a working data path. GA4, Google Ads, Meta connected for Tier 1 accounts. Monday.com wired in. |
| M2 · Data is clean | Week 5 | Numbers reconcile across all platforms and hotel clients. Performance baselines set. Trade Desk CSV pipeline. EHH calculation method signed off. |
| M3 · SAL writes first reports | Week 7 | SAL generates first-draft reports for every cleared hotel client. Four sections. Anomalies flagged. Internal only — no hotel clients yet. |
| M4 · AM review interface live | Week 8 | AMs open any client's report in one view. One-click sign-off. Send-back with notes. Google sign-in. Pulse at-a-glance view live. |
| M5 · Delivery workflow live | Week 9 | Monday.com and email notifications fire. Status writes back automatically. On-time delivery tracked vs. day-3 target. EHH live in Leadership Dashboard. |
| M6 · Phase 1 in production | Weeks 10–14 | Reports live across full portfolio. One full monthly cycle end-to-end. 95%+ on-time. Hooray runs the loop without Supernal on a call. |

_Milestone 6 target window is contingent on GA4 and Meta access confirmation within 2 weeks of kickoff. The milestone clock pauses while a sign-off is pending._

**Phase 1 deliverables by module:**

- **Vault (14 pts total, Phase 1 subset: 11 pts):** GA4 Integration (L), Meta Ads Manager Integration (M), Google Ads Integration (M), Data Normalisation Layer (M), Client Access Configuration (S)
- **App (11 pts total, Phase 1 subset: 6 pts):** AM Report Review View (L), Pulse Phase 1 WP Metrics (M)
- **AI Employee — SAL (16 pts total, Phase 1 subset: 9 pts):** Performance Data Aggregation (M), Narrative Report Generation (L), Anomaly Detection + Next-Step Engine (M), Report Delivery Workflow (S)

_See `Phase B/Inputs/B4-Delivery-Plan.md` and `Phase B/Inputs/B6-Points-Commercial.md` for full deliverable registry and point values._

---

## Phase 2 — Creative Request Intelligence

Phase 2 build starts after Phase 1 exit criteria are met and the Shelly working session is complete. Scoped under a separate Order Form.

**Deliverables activated:**
- Vault: Google Workspace Live Connector (S), Monday.com Integration — brief write (S), Trade Desk Integration (S)
- App: Brief Review View (M), Leadership Dashboard (M), Pulse Phase 2 WP Metrics (S)
- AI Employee — SAL: Request Intake (S), Request Classification Engine (M), Clarification Flow (M), Brief Assembly + Monday.com Write (M)

**Phase 2 exit criteria:**
- ≥20 briefs/week produced
- ≤4 business hours average time-to-package
- Brief completeness score ≥90%
- Rework rate trending toward ≤2 clarification rounds average

---

## Commercials

Two components: the MSA retainer and the Phase 1 project fee. Phase 2 and subsequent builds are scoped under separate Order Forms.

| Period | MSA Retainer | Phase 1 Build | Total / Month |
|---|---|---|---|
| Months 1–3 | $5,000 | $4,000 | $9,000 |
| Months 4–12 | $5,000 | — | $5,000 |
| **Year 1 total** | **$60,000 retainer** | **$12,000 build** | **$72,000** |

**What the $5,000/month MSA covers:**
Platform operation, support, and upkeep of everything built. Weekly syncs. Monthly scoping cycles. The AI Strategy Document.

**What the $12,000 Phase 1 build covers:**
The six milestones above — Foundation, Clean Data, SAL Drafts, AM Review, Delivery Workflow, and Production — billed at $4,000/month across the first three months.

**Monthly upkeep at steady state (post-Phase 2 go-live, on top of retainer):**

| Module | Monthly Upkeep |
|---|---|
| Vault Upkeep | $1,500/month |
| App Upkeep | $2,000/month |
| AIE Upkeep | $3,500/month |
| Total Upkeep | $7,000/month |

**Tier recommendation:** Accelerated ($10k/month, 8 pts/month) — Phase 1 at 26 pts delivers in ~4 months, matching Randy/Steven's proof-of-performance timeline without heavy upfront commitment.

**Third-party costs:** Up to $250/month included in the monthly fee. Excess flagged proactively, confirmed in writing, billed at cost.

**Exit at month 6:** Either party may exit on or after month 6 with 30 days written notice. Fees prorated. Hooray takes the codebase, SAL's configuration and workflows, and all data.

**Ownership:** Product codebase — Hooray Agency, from day one. SAL's configuration, prompt logic, and trained workflows — Hooray, available on request. Client marketing data — stays with Hooray and its clients at all times. Supernal accesses read-only and does not use client data to train external models.

_Pricing flag: Nick's "first project costs $12k" framing requires reconciliation with Nick + Thomas before the June 9 internal review. See `Phase B/Inputs/B6-Points-Commercial.md` §Pricing Flag._

---

## Why Supernal

Most of the market is trying to solve the hotel's problem. What Hooray brought us is an agency problem — and one that is largely unaddressed by existing tools.

Agentic Hospitality, the most comparable competitor, is building for the hotel, not the agency. Off-the-shelf reporting tools (Databox, Klipfolio, Improvado) aggregate data but don't generate narrative, don't flag anomalies in Hooray's voice, and don't integrate into the AM workflow with a sign-off mechanism.

What Hooray needs is different: an AI Employee who understands the agency's data stack, produces work in the format the account team already uses, and generates a provable ROI number for leadership — without requiring anyone to learn a new system.

That's what SAL is. It's not a dashboard. It's not a copilot chat interface. It's a member of the account team who does the coordination work so the rest of the team doesn't have to.

---

## Next Steps

Once this Order Form is signed, the following get Milestone 1 live by Week 2:

- **Named point of contact** with milestone sign-off authority (sign-off requests answered within 5 business days; milestone clock pauses while a sign-off is pending)
- **Contract-compliance roster** at kickoff — which hotel clients are cleared for AI-assisted reporting, per Milestone 2
- **GA4 and Meta Ads Manager access** confirmed within 2 weeks of kickoff — the Milestone 6 target window depends on this date
- **Tier 2 outreach** to hotel clients for delegated access authorizations — Supernal provides templates, Hooray owns the relationship
- **EHH calculation method sign-off** at Milestone 2
- **Named Trade Desk CSV owner** for the export schedule
- **Brand assets, design references, and platform credentials** when requested
