# Scoping Package — Hooray Agency
> **Phase:** Strategy · **Role:** Output (client-facing rollup)
> **Sources:** A1–A5, Sales-Research, Discovery-Readout.md
> **Consumer:** David Metze, Roger Burns (June 10 feedback pass); Supernal delivery team
> **This file is NOT for:** raw source material (belongs in Inputs), diagnostic detail (A2), technical specs (Phase B).
> _Updated: Compass AI research (business model deep dive + competitive landscape) integrated._

---

## 1. Client Snapshot

**Organisation:** Hooray Agency — ~30-year-old (founded 1993, rebranded 2019) independent luxury-hospitality marketing agency managing dozens of hotel and resort clients across the US. ~22–36 employees; ~$7.6M reported revenue. Privately held; no holding company.
**Primary contacts:** David Metze and Roger Burns (VP Strategy / VP Digital Integration — internal champions)
**Decision-makers:** Steven Seghers (Co-founder & CEO — major influencer), Randy Stuck (EVP — approver), Shelly Weasel (Senior Director of Operations — operational gatekeeper)
**AI Employee:** SAL: Creative Request Intelligence
**L-Tier:** L3 — multi-data-source integration, single AI Employee, two phased work streams, internal political complexity

---

## 2. The Problem

Hooray's account team — account executives and account directors — spends an estimated **60%+ of their time on work that shouldn't require them:**

- Deciphering vague, incomplete hotel client requests and clarifying via email back-and-forth
- Manually pulling data from GA4, Meta, Google Ads, and Trade Desk every month and writing performance narratives from scratch
- Building creative briefs without sufficient client context, generating rework through the full delivery chain (AM → traffic → creative)

The result: the same team can't carry more accounts without burning out. Growth requires headcount. Headcount requires budget. The cycle stalls.

**This is an agency problem — not a hotel problem.** The market's "agentic hospitality" solutions — including Agentic Hospitality (Louisville, backed by Google for Startups) — are aimed at hotels recapturing bookings from OTAs. Hooray brought Supernal a different brief entirely.

Industry validation: 5–10 hours per client per month on reporting (AgencyAnalytics, 7,000 agencies). 53% of agency briefs are complete but lack focus; 27% are incomplete and inconsistent (Joanne Davis Consulting / Scan International, 293 C-level respondents). This is a structural industry problem, not a Hooray-specific failure.

> See: `Phase A/Inputs/A2-Diagnostic-Discovery.md` for the four diagnostic layers and full gap analysis.

---

## 3. The Opportunity

Two phases, one AI Employee: **SAL: Creative Request Intelligence**

**Phase 1 — Reporting Copilot (entry point)**
SAL connects to Hooray's core ad platforms and automates monthly performance reporting. Account managers receive a polished email draft — surfaced anomalies, hospitality-tuned narrative (RevPAR, ADR, booking pace, OTA vs. direct), recommended next steps — and spend minutes reviewing instead of hours building.

**Phase 2 — Client Request Intelligence**
SAL handles inbound hotel marketing director requests end-to-end: intake the problem, classify the request type, clarify with targeted questions (one at a time) using GA4 data and Hooray's Google Workspace knowledge base, and package a complete brief directly into Monday.com (loaded, assigned, notified) for the traffic team.

The umbrella frame: the same team carries more accounts at a higher strategic level. Natural attrition handles the rest. Roger Burns confirmed: "As we onboard new accounts, we can integrate this without hiring additional account people, and let natural attrition handle the rest."

> See: `Phase A/Inputs/A4-Product-Segmentation.md` for activation table, Work Products, Function Transformation model (States 01–03), and Pulse configuration.

---

## 4. What SAL Does (and Doesn't Do)

**SAL does:**
- Pull live data from GA4, Meta Ads, Google Ads, Trade Desk monthly → generate polished narrative performance report drafts per hotel client for AM review
- Write in hospitality language — RevPAR, ADR, OTA vs. direct, booking pace — not generic AI voice
- Surface anomalies and next-step recommendations for AM sign-off before client delivery
- Accept hotel client requests in any form (freeform text, attachments, links) → classify → clarify (one question at a time) → assemble complete creative briefs
- Deliver packaged briefs directly into Monday.com (brief loaded, assigned, notified — no manual routing)
- Draw on Google Workspace (Hooray's institutional knowledge base) for client context, competitive landscape, and brand guidelines
- Provide a built-in evaluation harness from day one — every output quality-tested, source-cited, human-reviewed before delivery

**SAL does NOT:**
- Execute campaigns, buy media, or create final ad creative
- Replace account executives or account directors — it reallocates their time to strategy
- Interact with hotel clients without AM/AD oversight (Phase 1)
- Rebuild or replace Monday.com
- Output a dashboard — SAL produces finished narrative deliverables

> See: `Phase A/Inputs/A2-Diagnostic-Discovery.md` → Contradiction #3 for scope boundary detail.

---

## 5. Data Architecture (Phase 1)

| Source | Priority | Access Model | Confidence |
|---|---|---|---|
| Google Analytics (GA4) | 🔴 Critical | Mixed: Hooray master + client-delegated | Medium |
| Meta Ads Manager | 🔴 Critical | Mixed: Hooray master + client-delegated | Medium |
| Google Workspace | 🔴 Critical | Hooray-managed | High |
| Monday.com | 🟡 High | Hooray-managed | High |
| Looker Studio | 🟡 High | Mixed | Medium |
| Google Ads | 🟡 High | Mixed | Medium |
| Trade Desk | 🟡 Medium | Mixed | Low |
| Revenate / Sendine (CRM) | 🟢 Low — Phase 2+ | Client-owned | Low |

**Key data engineering requirement:** A tiered access model — Hooray master accounts (full API) → client-owned accounts (per-client authorisation) → manual export fallback for clients who won't grant API access.

**Governance:** Metadata/aggregated metrics only to LLMs (no raw PII); role-based access; audit logs from go-live; no external model training on client data. This is the bar set by the best-governed platforms in the market — and Hooray's client contracts likely require it.

> See: `Phase A/Inputs/A5-Scope-Definition.md` → Assumptions for detail.

---

## 6. Work Products + ROI Model

| Work Product | AI Employee | Phase | Human-Equiv Time (est.) | Volume | Monthly Capacity Recovered (est.) |
|---|---|---|---|---|---|
| Performance Report | SAL | Phase 1 | 120–180 min/report | ~30 reports/month | ~60–90 hrs/month → **$9k–$20k/month at $150/hr** |
| Packaged Brief | SAL | Phase 2 | 45–90 min/brief | Pending Shelly session | _Pending alignment_ |

**Three-path ROI frame for Randy Stuck + Steven Seghers:**

| Path | Cost | What you get |
|---|---|---|
| Build in-house (stalled Vertex) | $75k–$250k equivalent + ongoing dev opportunity cost | Stalled. Dev team perpetually pulled to client fires. No delivery date. |
| Buy enterprise platform (NinjaCat/Improvado) | ~$36k–$120k+/year + integration labor | Dashboard + AI summaries. No Trade Desk/Monday.com fusion. No brief intake. Generic narrative. Enterprise complexity for a 30-person shop. |
| Build with Supernal | $5k/month retainer + ~$12k first project | Custom to Hooray's exact stack. Hospitality-tuned narrative. Brief intake. You own the IP. Pay over time. |

**Recovered-capacity argument:**
~30 hotel accounts × 5–10 hrs/account/month = ~150–300 hours/month reporting burden. At $150/hr opportunity value → **$22k–$45k/month of recoverable capacity**. SAL at $5k/month is priced at 11–22% of the capacity it recovers.

**Vision Deck ROI frame (to confirm with Hooray):**

| Metric | Value |
|---|---|
| Current account team annual cost | $235K ($105K AD + $130K for 2 AEs) |
| % of time currently on coordination | 60% |
| Annual value of coordination work SAL absorbs | ~$141K/yr |
| Hours reclaimed per week per account team member | ~15 hrs |
| New accounts absorbable without adding headcount | +30% |
| Next AE hire avoided (first growth cycle) | $65K |

_Human-equivalent minutes and hourly rate require customer sign-off before Pulse configuration. Working estimate: ~$55/hr blended (AD ~$43/hr, AE ~$67/hr). At $150+/hr opportunity rate (Promethean Research agency billing benchmark), the recovered-capacity case is stronger._

> See: `Phase A/Inputs/A4-Product-Segmentation.md` → Work Products Summary for detail.

---

## 7. Why Not a $69/Month Reporting Tool?

The most dangerous stakeholder objection: Shelly Weasel or Randy Stuck anchors SAL's $5k/month against AgencyAnalytics ($179/month), Whatagraph (~$200/month), or Databox Genie ($399/month).

The answer: **those tools move data. They don't remove the hours.**

- AgencyAnalytics Smart Reports cuts ~40 minutes per client per month — the human still writes the narrative, catches the anomaly, and decides the next step
- Whatagraph IQ auto-drafts generic summaries — not RevPAR, not ADR, not Hooray's specific hospitality language
- None of them does Trade Desk + Monday.com as first-class sources
- None of them handles creative brief intake, classification, or clarification
- All of them are dashboards a human must interpret

SAL's output is the finished first-draft deliverable — the exact labor a $300/month tool does not eliminate. **The comparison set is analyst headcount ($5,800–$7,900/month fully loaded) plus a custom-build cost ($75k–$250k equivalent), not a dashboard subscription.**

Even the enterprise agentic buy path (NinjaCat, ~$1.5k–$3k/month) costs more, takes 4–12 weeks to implement, and still has no brief-intake workflow.

> See: `Phase A/Inputs/A3-Context-Building.md` → Competitive Context for the full tool-by-tool analysis.

---

## 8. Technical Approach

- **Platform:** Supernal's proprietary orchestration platform — modular, continuously improved, not locked to any single tool
- **Not a RAG chatbot:** Live API connections to GA4, Meta, Google Ads, etc. — real-time data, not static vector database. SAL is "an employee, not a conversation."
- **Hospitality-tuned narrative:** SAL writes in the language hotel clients actually use (RevPAR, ADR, OTA vs. direct, booking pace) — not generic AI summaries
- **Eval-first delivery:** Built-in evaluation harness from Phase 1 — golden-dataset comparisons, side-by-side blind tests vs. manual baseline, mandatory human-in-the-loop sign-off, source citations on every claim. This is what separates 11× ROI deployments from 0.7× ones (250-agency 2026 survey). Hooray's Vertex build stalled for exactly this reason.
- **Google Workspace as knowledge layer:** SAL accesses Hooray's full institutional client knowledge base via a live connector
- **Monday.com as output surface:** No new interface for Shelly Weasel's team — Phase 1 outputs polished email drafts; Phase 2 writes brief directly into Monday.com (loaded, assigned, notified)
- **Upgrade path:** The modular architecture means Phase 2 (intake→package) layers on top of Phase 1 (reporting) without rebuilding

> See: `Phase A/Inputs/A5-Scope-Definition.md` → Technical Feasibility for per-integration assessment.

---

## 9. Engagement Model

- **Structure:** MSA with $5k/month retainer + project order forms
- **Build-on-spec / pay-over-time:** No heavy upfront fee. First project (Phase 1 build, ~4 months) estimated at ~$7k order form → total Phase 1 cost ~$12k under MSA.
- **IP ownership:** Hooray retains all process IP. If the partnership ends, the code transfers to Hooray.
- **Longevity signal:** Supernal is spinning out of Infinity Group as the largest company in the hold co — signal of financial health and independence.

---

## 10. Stakeholder + Buy-In Map

| Stakeholder | Role | Current stance | Required action |
|---|---|---|---|
| David Metze | Champion | Strong — driving process | Review proposal June 10; advise on Randy/Steven sequencing |
| Roger Burns | Champion | Supportive | Co-drive internal influencer strategy |
| Steven Seghers | Co-founder & CEO — key influencer | Warm — pay-over-time framing landed | Influencer buy-in → cascades approval. Client reference call recommended. |
| Randy Stuck | EVP approver | Skeptic — in-house bias | Proof-of-performance: direct client reference call. Frame as freeing dev team for client work. Three-path cost comparison (build vs. buy vs. Supernal). |
| Shelly Weasel | Operational gatekeeper | Neutral-to-resistant | MNDA signed first, then working session with Nick — she co-designs the intake→package workflow. Must feel like a partner, not a recipient. |
| Katelyn Raman | Latent champion | Positive — originated the brief problem | Could be activated as a sponsor for Phase 2 |

> See: `Phase A/Inputs/A2-Diagnostic-Discovery.md` → Layer 4 for full political analysis.

---

## 11. Open Items + Next Steps

**Seven-step closing sequence (Vision Deck):**

| Step | Action | Owner | Urgency |
|---|---|---|---|
| 01 | Answer outstanding questions — data infrastructure, Vertex build, internal dev capacity | Nick + David | 🔴 Before Phase B scope |
| 02 | Sign MNDA | Nick / legal | 🔴 Before Shelly session |
| 03 | Shelly Weasel working session — four-responsibility process map + Monday.com brief format | David to arrange; Nick to run | 🔴 Critical — blocks Phase 2 scope |
| 04 | Supernal delivers proposal — cost, timeline, phased delivery | Nick + Tauseef | After steps 01–03 |
| 05 | Connect Randy Stuck + Steven Seghers with a client reference | Nick to arrange | 🟡 High — closing trust move |
| 06 | Sign agreement | Nick + Hooray | After proposal approval |
| 07 | Kickoff — AI Strategist + forward deployed engineers introduced | Tauseef + team | After signing |

**Additional pre-engineering open items:**

| Item | Owner | Urgency |
|---|---|---|
| Client API access audit — master vs. delegated vs. manual fallback mapping | David + Nick | 🔴 Critical — blocks Phase 1 build |
| Human-equivalent minutes + hourly rate sign-off | David / Hooray | 🟡 High — required for Pulse |
| Monthly report volume (# hotel clients, reports/month) | David | 🟡 High — sizes the reporting WP |
| Contract compliance check per hotel client | David | 🟡 High — PII/governance |
| Evaluation harness design — scope 3–6 week investment into Phase 1 plan | Nick + Tauseef | 🟡 High — must be Phase 1 scope, not Phase 2 add-on |

**Immediate timeline:**
- June 9: Supernal internal review of proposal draft
- June 10: Feedback pass with David + Roger
- June 10+: Wider group review (Randy, Steven, Shelly) via internal influencer approach
- June 26: Expected close date
