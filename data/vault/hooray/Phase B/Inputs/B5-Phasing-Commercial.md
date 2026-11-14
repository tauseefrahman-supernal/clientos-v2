# B5 — Phasing + Commercial
> **Phase:** Builder · **Role:** Input
> **Answers:** WHEN things go live. Phased roadmap indexed by Work Product go-live + phase-transition criteria + commercial summary.
> **This file is NOT for:** point values per deliverable (B6), WP specs (Work-Products.md), delivery plan detail (B4).
> **Sources:** A5-Scope-Definition.md (feasibility + timeline), B4-Delivery-Plan.md, Slack Thread (file 194).

---

## Engagement Structure

- **Model:** MSA ($5k/month retainer) + Project Order Forms (deliverable-point-based)
- **Build philosophy:** Build-on-spec / pay-over-time. No heavy upfront. Hooray exits at any point and keeps all IP.
- **Tier options:** Accelerated ($10k/month, 8 pts/month) or Sprint ($15k/month, 12 pts/month). See B6 for tier detail.
- **Timeline:** Phase 1 targeting Q3 2026 (August/September go-live). Phase 2 targeting Q4 2026 or Q1 2027, contingent on Phase 1 ROI demonstration.

---

## Phase 1 — Performance Report WP Go-Live

**Goal:** SAL produces monthly performance reports for Hooray's hotel client roster. AM reviews, signs off, delivers to client. Hooray's account team reclaims reporting hours.

**Work Product activated:** Performance Report (SAL)

**Deliverables that must go live in this phase (see B4 + B6 for sizing):**

| Deliverable | Module | Sequence |
|---|---|---|
| GA4 Integration | Vault | First — foundational |
| Meta Ads Manager Integration | Vault | First — foundational |
| Google Ads Integration | Vault | First — foundational |
| Data Normalisation Layer | Vault | After integrations |
| Client Access Configuration (Tier 1/2/3) | Vault | After normalisation |
| Performance Data Aggregation (SAL) | AI Employee | After Vault stable |
| Narrative Report Generation (SAL) | AI Employee | After aggregation |
| Anomaly Detection + Next-Step Engine (SAL) | AI Employee | After narrative |
| Report Delivery Workflow | AI Employee | Final SAL step |
| App: AM Report Review View | App | Parallel with SAL build |
| Pulse: Phase 1 WP Metrics | App | At go-live |

**Phase 1 exit criteria (gate to Phase 2 build start):**
- Performance Report WP live for ≥ 10 hotel clients
- ≥ 95% on-time delivery for 1 full monthly cycle
- Pulse showing Equivalent Human Hours to David / Roger / Randy / Steven
- ROI demonstrated: ≥ 50 hours/month reclaimed across account team

**Estimated timeline:** 10–14 weeks from engineering kickoff (assuming GA4 + Meta access confirmed within 2 weeks of kickoff).

---

## Phase 1.5 — Trade Desk Live Integration (optional gate)

**Goal:** Move Trade Desk from manual CSV fallback to live API pull.

**Work Product enhanced:** Performance Report (incremental improvement — Trade Desk data moves from "manual" to "live" in the report)

**Gate:** API access confirmed. No Phase 1 go-live dependency.

**Estimated timeline:** 2–3 weeks; can be parallelised with Phase 2 prep if Trade Desk credentials arrive early.

---

## Phase 2 — Packaged Brief WP Go-Live

**Goal:** SAL handles inbound hotel marketing director requests end-to-end — intake → classify → clarify → package → Monday.com task. Hooray's AMs are freed from brief coordination overhead.

**Work Product activated:** Packaged Brief (SAL)

**Prerequisite for Phase 2 build start:**
1. Phase 1 exit criteria met (Performance Report WP stable, ROI demonstrated)
2. Shelly working session complete (intake channel selected, Monday.com brief format confirmed)
3. Phase 2 order form signed

**Deliverables that must go live in this phase:**

| Deliverable | Module | Sequence |
|---|---|---|
| Google Workspace Live Connector | Vault | First — required for context enrichment |
| Monday.com Task Write (brief-level) | Vault | First — output surface |
| Request Intake (channel TBD) | AI Employee | After channel confirmed |
| Request Classification Engine | AI Employee | After intake |
| Clarification Flow | AI Employee | After classification |
| Brief Assembly + Monday.com Write | AI Employee | After clarification flow |
| App: Brief Review View | App | Parallel with SAL build |
| Pulse: Phase 2 WP Metrics | App | At go-live |

**Phase 2 exit criteria:**
- Packaged Brief WP live
- ≥ 20 briefs/week produced
- ≤ 4 business hours average time-to-package
- Brief completeness score ≥ 90%
- Rework rate decreasing (clarification rounds trend toward ≤ 2)

**Estimated timeline:** 8–12 weeks from Phase 2 kickoff.

---

## Phase 3 — Expansion (post-Phase 2, indicative)

_Not in current scope. Identified as likely next steps based on discovery signals._

- Trade Desk live API (if not completed in Phase 1.5)
- Momentum AIQ integration (agency's AI search visibility data surfaced in Pulse)
- Additional hotel clients onboarded to reporting as Hooray grows
- Natural attrition model: same team, larger account roster, no additional AE headcount required

---

## Commercial Summary

| Item | Amount | Notes |
|---|---|---|
| MSA Monthly Retainer | $5,000/month | Partnership baseline. Covers ongoing platform access, Concierge, and Care. |
| Phase 1 Order Form | See B6 | Vault + App + SAL Phase 1 deliverables. Point-based. |
| Phase 2 Order Form | See B6 | SAL Phase 2 deliverables. Separate order form post-Phase 1 exit. |
| Monthly Upkeep (post-Phase 1 go-live) | See B6 | Vault upkeep + App upkeep + AIE upkeep charged monthly after build complete. |

**Nick's framing for Randy/Steven:** "Working with us is $5k for a year; exit at 6 months and take everything with you. The first project will only cost $12k." This framing assumes Accelerated tier ($10k/month, 8 pts/month) and a ~4-month Phase 1 build.

---

## Payment Triggers

| Milestone | Payment event |
|---|---|
| Order Form 1 signed | Phase 1 build begins; monthly service fee starts |
| Phase 1 go-live (10+ clients, 1 full cycle) | Phase 1 final billing cycle; Phase 2 gate opens |
| Order Form 2 signed | Phase 2 build begins |
| Phase 2 go-live | Phase 2 final billing cycle; expansion discussions begin |
