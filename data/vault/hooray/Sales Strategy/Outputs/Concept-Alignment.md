---
artifact: concept-alignment
deal_room_stage: concept_alignment
client:
  name: Hooray Agency
  executive_contact: David Metze / Roger (warm champions) · Randy / Steven Seghers (approvers)
  executive_role: Operations Lead / Agency Leadership
  assigned_ae: Nick Agresti
provenance:
  source: Discovery calls Apr 30 + May 11, Competitor Requirements doc, Slack Thread, SAL Vision Deck
  version: "1.0"
  generated_at: "2026-06-04"
alignment:
  supernal_aligned: true
  client_aligned: false
sections:
  - number: "01"
    title: "The Problem"
    anchor_id: section-the-problem
    intro: "Hooray's account team is exceptionally good at hospitality marketing strategy. Most of their month isn't spent on strategy."
    bullets:
      - "Monthly performance reporting consumes the majority of the account team's capacity — pulling data from GA4, Meta Ads Manager, Google Ads, and Trade Desk, then assembling it into client-ready narratives. The work is necessary. The time it takes is not."
      - "GA4, Google Ads, Meta, and Trade Desk each tell a slightly different story. Numbers don't reconcile automatically across platforms. Before anyone can write a report, someone has to make the numbers mean the same thing."
      - "Inbound hotel marketing director requests arrive with incomplete information and inconsistent framing. AMs spend time clarifying, formatting, and packaging briefs before Shelly's traffic team can move. This isn't strategy — it's coordination."
      - "Leadership (David, Roger, Randy, Steven) have no real-time view of how much of the team's time goes into coordination overhead versus client value. There's no number on it. There's only the feeling that the team is stretched."
  - number: "02"
    title: "Proposed Approach"
    anchor_id: section-proposed-approach
    intro: "Build SAL — an AI Employee who works inside Hooray's existing toolstack and handles the coordination work so the account team doesn't have to."
    bullets:
      - "Phase 1 — Reporting Intelligence: SAL pulls data from Hooray's ad platforms each month, reconciles it across sources, generates a first-draft performance narrative per hotel client (with anomalies flagged and next steps suggested), and delivers it to the assigned Account Manager for review and sign-off. The AM's job shifts from assembly to editorial."
      - "Phase 2 — Creative Request Intelligence: SAL receives inbound requests from hotel marketing directors, classifies them by type, asks the targeted clarifying questions a senior AM would ask, pulls context from Hooray's Google Workspace, and packages a completed brief into Monday.com — ready for Shelly's team to assign. Scoped in detail after a working session with Shelly."
      - "SAL operates entirely within Hooray's existing stack — Monday.com, Google Workspace, the ad platform APIs. No new systems for the account team to learn."
      - "Pulse gives Hooray leadership a live Equivalent Human Hours number: how many hours SAL returned to the team this month, calculated using a method David and the team sign off on. The value is measured, not promised."
      - "Everything Supernal builds belongs to Hooray from day one. If the partnership ends, Hooray takes the codebase, SAL's configuration, and all data."
  - number: "03"
    title: "Outcomes We're Targeting"
    anchor_id: section-outcomes
    intro: "Three outcomes, each measurable before the end of Phase 1."
    bullets:
      - "Hours returned to the account team: 50+ hours/month recovered from reporting coordination, visible in Pulse's Leadership Dashboard by the end of Phase 1."
      - "Same team, more accounts: the account team absorbs incremental hotel clients as Hooray grows without proportional headcount additions. SAL handles the volume increase; AMs handle the relationships."
      - "A ROI story Randy and Steven can act on: Equivalent Human Hours, hires avoided, and on-time delivery rate — all in one place, backed by a real production cycle (not a projection) by Milestone 6."
  - number: "04"
    title: "How We'll Know It Worked"
    anchor_id: section-success-metrics
    intro: "Phase 1 exit criteria are binary. Either they're met or they're not."
    bullets:
      - "Reports live: ≥10 hotel clients generating monthly Performance Reports through SAL."
      - "On-time delivery: ≥95% of reports delivered to Account Managers by day 3 of the month."
      - "Hours reclaimed: ≥50 hours/month recovered across the account team, visible in Pulse."
      - "One full cycle complete end-to-end: SAL drafts, AM reviews and signs off, client-ready reports produced — without Supernal on a call."
      - "Phase 2 unlock: Phase 1 ROI demonstrated, Shelly working session complete, Phase 2 Order Form signed."
  - number: "05"
    title: "Next Steps"
    anchor_id: section-next-steps
    intro: "Three things need to happen before Milestone 1 can start."
    bullets:
      - "June 10 feedback session: David and Roger review this concept alignment and the Phase 1 Order Form. Questions answered, framing confirmed."
      - "Wider group sign-off: Randy, Steven, and Shelly review. Order Form countersigned."
      - "Kickoff checklist: named point of contact confirmed, contract-compliance roster provided, GA4 and Meta access confirmed within 2 weeks of kickoff (the Milestone 6 window depends on this date)."
---

# Concept Alignment — Hooray Agency × SAL

> **Phase:** Sales · **Role:** Output
> **Answers:** WHAT we and the client are aligning on before any commitment — problem, approach, outcomes, proof, next steps.
> **This file is for:** the client-facing concept-alignment document the Deal Room renders (Stage 1). Frontmatter = structured content the Deal Room consumes; prose below mirrors it for ClientOS.
> **This file is NOT for:** module cards / pricing (those live in Prototype + Proposal), or diagnostic detail (`Phase A/Inputs/`).
> **Upstream sources:** `Sales Strategy/Inputs/*`, `Phase A/Inputs/A2-Diagnostic-Discovery.md`, `Phase A/Inputs/A3-Context-Building.md`.
> **Framework:** `Frameworks/MECE-Framework.md`

---

## 01 · The Problem

Hooray's account team is exceptionally good at hospitality marketing strategy. Most of their month isn't spent on strategy.

Monthly performance reporting consumes the majority of the account team's capacity. Pulling data from GA4, Meta Ads Manager, Google Ads, and Trade Desk, then assembling it into client-ready narratives — the work is necessary. The time it takes is not.

The data problem compounds the time problem. GA4, Google Ads, Meta, and Trade Desk each tell a slightly different story. Numbers don't reconcile automatically across platforms. Before anyone can write a report, someone has to make the numbers mean the same thing across every hotel client.

Inbound creative requests arrive in an incomplete state. Hotel marketing directors send briefs that are missing critical parameters. AMs spend time clarifying and repackaging before Shelly's traffic team can move — coordination work disguised as account work.

And leadership has no visibility into the scope of the problem. There's no live number for how much of the team's month goes into coordination overhead. There's only the feeling that the team is stretched.

---

## 02 · Proposed Approach

Build SAL — an AI Employee who works inside Hooray's existing toolstack and handles the coordination work so the account team doesn't have to.

**Phase 1 — Reporting Intelligence.** SAL pulls data from Hooray's ad platforms each month, reconciles it across GA4, Google Ads, Meta Ads Manager, and Trade Desk, generates a first-draft performance narrative per hotel client, flags anomalies, and surfaces recommended next steps. The Account Manager's job shifts from data assembly to editorial review and sign-off. Nothing goes to a hotel client without AM approval.

**Phase 2 — Creative Request Intelligence.** SAL receives inbound requests from hotel marketing directors, classifies them by campaign type, asks the targeted clarifying questions a senior AM would ask, pulls context from Hooray's Google Workspace, and packages a completed brief into Monday.com — ready for Shelly's traffic team to assign. The scope of Phase 2 is finalised in a working session with Shelly before any Phase 2 engineering begins.

SAL operates entirely within Hooray's existing stack. No new systems for the account team to learn. SAL writes to Monday.com and Google Workspace the same way an AM would. Shelly's traffic team sees standard Monday tasks.

Pulse gives Hooray leadership a live view: Equivalent Human Hours returned to the team each month, calculated using a method the team signs off on at Milestone 2. The value is measured in a real production cycle, not promised in a projection.

Everything Supernal builds belongs to Hooray from day one. If the partnership ends at month 6 or month 12, Hooray takes the codebase, SAL's configuration and workflows, and all data.

---

## 03 · Outcomes We're Targeting

**Hours returned to the account team.** 50+ hours/month recovered from reporting coordination, visible in Pulse's Leadership Dashboard by Phase 1 go-live. At steady state (full hotel client roster, both Work Products live): ~200 hours/month recovered across reporting and brief packaging.

**Same team, more accounts.** The account team absorbs incremental hotel clients as Hooray grows without proportional headcount adds. SAL handles the volume increase; AMs handle the relationships and the strategy.

**A ROI story Randy and Steven can act on.** Equivalent Human Hours, hires avoided, on-time delivery rate — all in one place in Pulse, backed by a real production cycle confirmed at Milestone 6. Not a projection. A number with a timestamp.

---

## 04 · How We'll Know It Worked

Phase 1 exit criteria are binary. Either they're met or they're not.

| Criterion | Target |
|---|---|
| Hotel clients in reporting workflow | ≥ 10 |
| Reports delivered on time (day 3 of month) | ≥ 95% |
| Account team hours reclaimed per month | ≥ 50 hrs |
| Pulse live with Equivalent Human Hours | Live at go-live |
| Hooray runs the loop without Supernal on a call | Confirmed at Milestone 6 |

Phase 2 is unlocked when Phase 1 ROI is demonstrated, the Shelly working session is complete, and the Phase 2 Order Form is signed.

---

## 05 · Next Steps

**June 10 feedback session.** David and Roger review this document and the Phase 1 Order Form. Questions answered. Framing confirmed.

**Wider group review.** Randy, Steven, and Shelly review. Objections addressed. Order Form countersigned.

**Kickoff checklist** (once signed):
- Named point of contact with milestone sign-off authority
- Contract-compliance roster at kickoff (which hotel clients are cleared for AI-assisted reporting)
- GA4 and Meta Ads Manager access confirmed within 2 weeks of kickoff — the Milestone 6 target window depends on this date
- Named Trade Desk CSV owner
- EHH calculation method sign-off at Milestone 2
