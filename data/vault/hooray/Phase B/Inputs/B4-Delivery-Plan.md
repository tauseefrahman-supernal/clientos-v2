# B4 — Delivery Plan
> **Phase:** Builder · **Role:** Input
> **Answers:** DELIVERY PLAN. Objectives, success criteria, Employees-in-scope, Work Products catalog, cross-cutting architecture, gates, risks, assumptions.
> **This file is NOT for:** pricing or points (B5/B6), phasing roadmap (B5), per-WP detail specs (Work-Products.md).
> **Sources:** A5-Scope-Definition.md, B1, B2, B3, Work-Products.md.

---

## Engagement Objectives

1. Return 60%+ of Hooray's account team time from coordination overhead to strategic work.
2. Enable the same team to carry more hotel accounts at a higher strategic level — growth without proportional headcount adds.
3. Produce a measurable ROI story (Equivalent Human Hours, hires avoided) sufficient to sustain Randy/Steven buy-in and unlock Phase 2.

---

## Success Criteria (Phase 1 Exit)

| Criterion | Measure | Target |
|---|---|---|
| Performance Reports live | # hotel clients in reporting workflow | ≥ 10 hotel clients generating monthly reports |
| On-time delivery | % reports delivered to AM by day 3 of month | ≥ 95% |
| AM time reclaimed | Hours/month across account team | ≥ 50 hrs/month (Phase 1 baseline) |
| Pulse visible | Equivalent Human Hours visible to David/Roger | Live in Pulse by Phase 1 go-live |
| Data access | % of active hotel clients with confirmed API access | 100% (manual fallback in place for remainder) |

---

## Success Criteria (Phase 2 Exit)

| Criterion | Measure | Target |
|---|---|---|
| Packaged Briefs live | # briefs packaged per week | ≥ 20 briefs/week |
| Brief turnaround | Time from request to Monday.com task | ≤ 4 business hours |
| Brief completeness | % of fields populated by SAL | ≥ 90% |
| Rework reduction | Clarification rounds per brief (traffic ← account team) | ≤ 2 average |

---

## AI Employee In Scope

| Employee | Work Products | Phase |
|---|---|---|
| SAL — Account Intelligence Agent | Performance Report (P1), Packaged Brief (P2) | Phase 1 + Phase 2 |

_Full WP specs → `Phase B/Inputs/Work-Products.md`_

---

## Deliverables Catalog (Work-Product-Structured)

All deliverables are organised into three modules: **Vault (data layer)**, **App (operator interface)**, **AI Employee (SAL capabilities)**. Each module activates Work Product delivery.

### Module A — Vault (Data Layer)

Activates first. No SAL Work Products are live until the Vault is stable.

| Ref | Deliverable | Enables |
|---|---|---|
| V1 | GA4 Integration | Performance Report WP (data source) |
| V2 | Meta Ads Manager Integration | Performance Report WP (data source) |
| V3 | Google Ads Integration | Performance Report WP (data source) |
| V4 | Trade Desk Integration (fallback first, live API Phase 2) | Performance Report WP (supplemental) |
| V5 | Google Workspace Live Connector | Packaged Brief WP (context layer) + Performance Report (context-aware narrative) |
| V6 | Monday.com Integration (read + write) | Performance Report WP (status write), Packaged Brief WP (task creation) |
| V7 | Data Normalisation Layer | Cross-platform metric consistency in Performance Report |
| V8 | Client Access Configuration (Tier 1/2/3 setup) | Governance gate per hotel client |

### Module B — App (Operator Interface)

Builds the surface through which AMs and Hooray leadership interact with SAL's output.

| Ref | Deliverable | Enables |
|---|---|---|
| A1 | App: AM Report Review View | AM review + sign-off workflow for Performance Report WP |
| A2 | App: Brief Review View | AM review of Packaged Brief before Monday.com write (Phase 2) |
| A3 | App: Leadership Dashboard | Randy/Steven view of Equivalent Human Hours rollup |
| A4 | Pulse: Phase 1 WP Metrics | Performance Report metrics in Pulse (reports generated, on-time %, anomalies flagged) |
| A5 | Pulse: Phase 2 WP Metrics | Packaged Brief metrics in Pulse (briefs packaged, time to package, request type) |

### Module C — AI Employee (SAL Capabilities)

Deploys SAL's Work Product-producing capabilities. Each capability below maps to a named Work Product.

| Ref | Deliverable | Work Product |
|---|---|---|
| S1 | Performance Data Aggregation | Performance Report |
| S2 | Narrative Report Generation | Performance Report |
| S3 | Anomaly Detection + Next-Step Engine | Performance Report |
| S4 | Report Delivery Workflow (AM notification, Monday status write) | Performance Report |
| S5 | Request Intake (channel TBD — Phase 2) | Packaged Brief |
| S6 | Request Classification Engine | Packaged Brief |
| S7 | Clarification Flow (targeted questions per request type) | Packaged Brief |
| S8 | Brief Assembly + Monday.com Task Write | Packaged Brief |

---

## Cross-Cutting Architecture

- **Supernal's proprietary orchestration platform** — all SAL workflows run here. Not a standalone chatbot, not a RAG system. Live API connections throughout.
- **Entity resolution:** Hotel client as the canonical entity across all data sources. Every metric, report, and brief is scoped to a hotel_client_id.
- **No new interface for Shelly's traffic team** — SAL writes TO Monday.com. Shelly's team sees standard Monday tasks. No retraining required.
- **Pulse as the ROI surface** — Equivalent Human Hours visible to Hooray leadership at all times. This is the primary mechanism for sustaining Randy/Steven buy-in post-go-live.
- **Modular upgrade path** — Phase 1 Vault and App are the foundation. Phase 2 layers on top without rebuilding. This is the key differentiator from the stalled in-house Vertex build.

---

## Phase Gates

| Gate | Trigger | Required before proceeding |
|---|---|---|
| Phase 1 Build Start | Phase B engineering scope approved | Client API access audit complete; GA4 + Meta confirmed for initial cohort |
| Phase 1 Go-Live | Performance Report WP validated on 5+ hotel clients | AM review workflow confirmed; Pulse live |
| Phase 2 Build Start | Phase 1 ROI demonstrated (≥1 full cycle) + Shelly working session complete | Intake channel selected; Monday.com brief format confirmed |
| Phase 2 Go-Live | Packaged Brief WP validated on sample brief cohort | Brief completeness score ≥ 90% on test cohort |

---

## Risks (Phase B view)

| Risk | Severity | Mitigation |
|---|---|---|
| API access audit not complete before build start | 🔴 High | Nick + David to complete before engineering kickoff |
| Shelly working session delays Phase 2 start | 🟡 Medium | Phase 1 can proceed in parallel; Phase 2 not blocked until Phase 1 is complete |
| Brief format/Monday.com structure changes post-build | 🟡 Medium | Shelly session must happen before Phase 2 engineering, not after |
| Human-equivalent minutes not aligned before Pulse config | 🟡 Medium | Flag as "pending" in Pulse until David confirms; don't block build |
| Trade Desk API access insufficient | 🟢 Low | Manual export fallback; not on Phase 1 critical path |

---

## Key Assumptions (Phase B)

1. GA4 + Meta Ads API access is confirmable for at least 5–10 hotel clients before Phase 1 build start.
2. Shelly working session occurs before Phase 2 engineering begins.
3. Monday.com write access (Supernal service account) can be provisioned by Hooray IT without escalation.
4. Google Workspace folder structure per hotel client is consistent enough for automated querying (validation step required during Phase 1 onboarding).
5. Human-equivalent minutes and hourly rate are aligned with David before Pulse goes live (not a blocker for build, but required before metrics are published to Randy/Steven).

---

## Open Questions

| Question | Owner | Urgency |
|---|---|---|
| Total hotel client count (for reporting volume estimate) | David Metze | 🔴 Phase 1 build sizing |
| API access tier per hotel client (Tier 1 / 2 / 3 mapping) | David Metze | 🔴 Before Phase 1 start |
| Intake channel selection (email / portal / Slack) | David + Shelly | 🔴 Before Phase 2 start |
| Monday.com board structure for Packaged Brief tasks | Shelly | 🔴 Before Phase 2 start |
| Human-equivalent minutes sign-off (~150 min/report, ~75 min/brief) | David / Hooray | 🟡 Before Pulse config |
| Contract compliance confirmation per hotel client | David | 🟡 Before Phase 1 go-live |

---

## Out of Scope

- Campaign execution, media buying, ad creative production
- Replacing or rebuilding Monday.com
- Hotel-facing agentic solutions (SAL is an agency-internal tool)
- Catalyst / Revenate CRM integrations (Phase 2 or later)
- Momentum AIQ API integration (optional Phase 2 addition)
- Any standalone client portal in Phase 1 — SAL operates within existing Hooray toolstack
