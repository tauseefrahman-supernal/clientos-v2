# A4 — Product Segmentation
> **Phase:** Strategy · **Role:** Input
> **Answers:** OPPORTUNITY + FIT. Supernal product suite activation, per-piece requirements, Work Products per activated Employee.
> **This file is NOT for:** context landscape (A3), scope decisions (A5), detailed WP specs (Phase B).
> **Sources:** A1 (L3, stakeholders), A2 (four responsibilities, data tier list), A3 (tech stack, workflow), Slack Thread (file 194), SAL Vision Deck (file 196), Business-Model Deep Dive (file 199), Competitive Landscape (file 200).

---

## Activation Table

| Piece | Activated? | Rationale |
|---|---|---|
| **Employee** | ✅ YES — SAL | Core of the engagement. AI Employee with four responsibilities: intake, classify, clarify, package. Formally named "SAL: Creative Request Intelligence" per Vision Deck. |
| **App** | 🟡 PHASE 2 | Phase 1 reporting output surfaces via polished email draft to AM. Phase 2 requires direct Monday.com write integration (brief loaded, assigned, notified). A lightweight hotel client-facing intake interface may be required for Phase 2 depending on Shelly session. Pending confirmation. |
| **Vault** | ✅ YES | Multi-source data layer required: GA4, Meta Ads, Google Workspace, Monday.com, Google Ads, Looker Studio. Confidence varies by client (see data tier list). |
| **Pulse** | ✅ YES | Equivalent Human Hours tracking across SAL's Work Products. AM/AD time reclaimed per week is the primary ROI metric Hooray needs to justify the engagement to Randy Stuck/Steven Seghers. |
| **Care** | ✅ YES | Hotel client data sources change per client; new clients onboard regularly. Ongoing monitoring of Vault health (GA4 + Meta API access quality) is required. Retraining cadence needed as campaign types and brief formats evolve. |
| **Concierge** | ✅ YES | Always activated. L3 deal. Nick Agresti as account lead; Tauseef Rahman as AI Strategist. Medium-touch model (4–6 deals simultaneously). Monthly Pulse review with David/Roger; quarterly exec review with Randy Stuck/Steven Seghers. |

---

## Per-Piece Requirements

### Employee — SAL

**Identity:**
- Full name: **SAL: Creative Request Intelligence** (Vision Deck)
- Role: Account Intelligence Agent
- Universe: Hospitality marketing agency internal workflows
- Primary users: Account Executives, Account Directors, Hotel Marketing Directors (for intake channel)
- Output destinations: AM inbox (Phase 1 — polished email report draft), Monday.com (Phase 2 — brief task, assigned and notified)

**Four core responsibilities (confirmed Discovery II + Vision Deck):**

**01 — Intake**
SAL accepts imperfect requests from hotel clients in any form. Accepts by design: freeform text, file attachments, due dates, campaign context, requester identity. The problem isn't that clients are bad at submitting — it's that there's been nothing to catch them.

**02 — Classify**
Every request is mapped to a category. Each category has its own required fields, optional fields, common missing details, and format expectations. SAL knows what it needs before it asks.
- Categories (Vision Deck): print ad, banner ad, email campaign, sales sheet, social creative, copy update, revision round
- Each category has a schema library — required fields, optional fields, common missing details

**03 — Clarify**
SAL's core intelligence. Detects missing required information, identifies vague or non-actionable language, asks the next-best question one at a time until the request meets a completeness threshold. Objective comments accepted; subjective comments converted into specific, actionable prompts.
- One question at a time
- Stops when complete, not before
- Completeness threshold = defined set of required fields per request type (to configure with Shelly Weasel)

**04 — Package**
Once complete, SAL produces a clean, structured output.
- Phase 1 output: polished, submission-ready email draft (performance report to AM for review)
- Phase 2 output: structured creative brief → direct Monday.com integration (brief loaded, assigned, notified). No routing required. No manual entry.

**Reporting responsibility (Phase 1 primary):**
- Pulls performance data from GA4, Meta Ads, Google Ads, Trade Desk (via API or manual fallback)
- Generates first-draft narrative summaries per hotel client per month
- Surfaces anomalies, trend interpretations, and recommended next steps
- Delivers to AM for review and sign-off before client delivery
- Narrative language must be hospitality-tuned: RevPAR, ADR, booking pace, OTA vs. direct — not generic "AI voice"

**Decision boundaries:**
- SAL does NOT execute campaigns, create final copy, design ads, or produce finished creative
- SAL does NOT interact with clients without AM/AD oversight in Phase 1
- SAL escalates to human AM when: ambiguous request type, sensitive client situation, missing data source access
- Phase 2: SAL may interact directly with hotel marketing directors via a defined intake channel (pending Shelly session design)

**Escalation rules:**
- Incomplete data source access → flag to David/operations team for client onboarding
- Brief fails minimum completeness threshold after 2 clarification rounds → escalate to AM
- Anomaly detected in reporting data → flag to AM + surface in Pulse alert

**Governance:**
- Hotel client data: aggregated metrics only for Phase 1 (no PII) — metadata-only to LLMs (not raw confidential data), consistent with best practice confirmed by NinjaCat's zero-training-on-client-data guarantee and Improvado's metadata-only approach
- Client API access: tiered model — Hooray master accounts (full access) vs. client-delegated (per-client authorisation) vs. manual fallback
- Contract compliance: check client agreements before enabling AI-assisted reporting per client
- Audit logs + role-based access required from go-live

**Work Products:**

| Work Product | Description | Phase |
|---|---|---|
| **Performance Report** | Monthly first-draft narrative performance summary per hotel client, covering GA4, Meta Ads, Google Ads, and Trade Desk. Hospitality-tuned narrative (RevPAR, ADR, OTA vs. direct framing). Includes anomaly flags and next-step suggestions. Delivered to AM as a polished email draft for review. | Phase 1 |
| **Packaged Brief** | A completed creative brief assembled from a hotel marketing director's request — includes classified request type, clarified parameters, market context from Google Workspace, and format-compliant Monday.com task creation (assigned, notified). | Phase 2 |

_Human-equivalent minutes + hourly rate: pending customer alignment with David/Hooray._

**Working estimates (anchored to Compass research + agency benchmarks):**
- Performance Report: ~120–180 min/report (current AM manual time, per 5–10 hr/client/month industry benchmark and Discovery II confirmation). Hourly rate equivalent: ~$55/hr blended (AD ~$43/hr, AE ~$67/hr). Expected monthly volume: ~30 reports/month (Hooray serves "dozens" of hotel accounts).
- Packaged Brief: ~45–90 min/brief (current AM manual time). Rate: ~$55/hr blended. Volume: pending Shelly session.

**Best-in-class performance targets to commit to in Phase 1 (from Competitive Landscape research):**
- First-draft narrative report generated in minutes; human QA ≤ 1 hour per client (vs. ~11.2-hour manual baseline)
- Target **40–75% reduction in reporting time** (the verified, named-case-study range across NinjaCat/Whatagraph)
- Anomaly detection: flag material MoM swings (e.g., >15%) with root-cause hypotheses and recommended next steps, grounded in citable data
- Built-in evaluation harness: golden-dataset comparisons, side-by-side blind tests, mandatory human-in-the-loop sign-off, source citations on every claim
- This harness is what separates 11× ROI from 0.7× per 250-agency 2026 survey — budget 3–6 weeks for eval infrastructure

---

### Vault

**Required data sources and confidence levels:**

| Source | Category | Hooray Control | API Maturity | Confidence | Priority |
|---|---|---|---|---|---|
| Google Analytics (GA4) | Web analytics | Mixed (master + delegated) | High | Medium | 🔴 Critical |
| Meta Ads Manager | Paid social | Mixed | Moderate–High | Medium | 🔴 Critical |
| Google Workspace | Knowledge base | Hooray-managed | High | High | 🔴 Critical |
| Monday.com | Project management | Hooray-managed | High (GraphQL) | High | 🟡 High |
| Looker Studio | BI / reporting | Mixed | API via GA4 | Medium | 🟡 High |
| Google Ads | Paid search | Mixed | High | Medium | 🟡 High |
| Trade Desk | Programmatic | Mixed | Moderate | Low | 🟡 Medium |
| Revenate | Hospitality CRM | Client-owned | Unknown | Low | 🟢 Low |
| Sendine | Hospitality CRM | Client-owned | Unknown | Low | 🟢 Low |
| HubSpot | CRM | Client-owned | High | Low | 🟢 Low |
| Momentum AIQ | AI visibility | Hooray-managed | Potential API | Low | 🟢 Low |
| Catalyst | Deanonymisation | Hooray-managed | Unknown | None | ⬛ Defer |

**Open question (Vision Deck):** Where does client data currently live? Each hotel client likely has its own Revinate account and its own Google Workspace folder structure. Whether this is consolidated anywhere, or entirely siloed, determines whether there is a data layer step before SAL can function effectively.

**Blockers:**
- GA4 + Meta Ads confidence is currently Medium because client-by-client API authorisation has not been mapped. This must be resolved before build (see A2 gaps).
- Any "None" confidence critical source = build blocker (Catalyst is deferred appropriately).
- Client-by-client authorisation requires: mapping which clients use Hooray master accounts vs. client-owned accounts; confirming whether client contracts permit AI-assisted reporting and data export to external AI systems.

**Governance layer (aligned with Competitive Landscape best practice):**
- Metadata/aggregated metrics only to LLMs — no raw PII (hotel guest data, personal booking data)
- Role-based access controls: Hooray staff only (not hotel clients) for Phase 1
- Audit logs from go-live
- No external model training on client data — this is NinjaCat's hard guarantee and represents the client-trust bar for agencies
- Data-export restrictions enforced at the platform level

---

### Pulse

**Activated for:** SAL's two Work Products

**Primary KPI:** Equivalent Human Hours reclaimed per week/month
**Secondary KPI:** $ value of time returned (hours × hourly rate)
**Visual:** Per-AM breakdown + agency-level rollup for leadership (Randy Stuck/Steven Seghers exec view)

**Work Product metrics to configure (pending customer alignment):**

*Performance Report WP:*
- Reports generated (Integer)
- Reports sent to AM on time (Boolean — target: 100%)
- Anomalies flagged (Integer)
- Client (Enum — each hotel client)
- Report status: Draft / AM Review / Delivered (Enum)
- Time to first draft — minutes from data pull trigger to draft delivery (Float)

*Packaged Brief WP:*
- Briefs packaged (Integer)
- Time from request to package delivery (Float — minutes)
- Clarification rounds required (Integer — target: ≤2)
- Request type (Enum: print ad, banner ad, email campaign, sales sheet, social creative, copy update, revision round)
- Brief completeness score (Float — % of required fields populated)

**Pulse cadence for Hooray:**
- Weekly: Concierge scans Pulse for anomalies, flags for Care
- Monthly: Pulse review with David/Roger (account ops)
- Quarterly: Executive review with Randy Stuck/Steven Seghers — total value delivered, proposed WP expansion

---

### Care

**SLA expectations per Work Product:**
- Performance Report: delivered to AM by day 3 of each month (to allow review before client deadline)
- Packaged Brief: delivered within 4 business hours of client request (target SLA — pending confirmation)

**Pulse metric alert thresholds (to configure):**
- Report delivery rate < 95% → page Care team
- Brief delivery time > 8 hours → flag for review
- Clarification rounds > 3 on any brief → flag brief quality issue, check intake prompt

**Retraining triggers:**
- New campaign type introduced by a hotel client (not in existing classification taxonomy)
- Brief format change by Hooray (Caitlyn/account team updates)
- Data source added or removed for a client
- Narrative quality score drops below agreed threshold (eval harness output)

**Knowledge update process:**
- Google Workspace is the primary knowledge base — Hooray manages this. Care monitors for staleness.
- Monthly check-in: any new hotel client onboarded? New data source authorisation required?
- Quarterly: review SAL's clarification question performance; update taxonomy

---

### Concierge

**Engagement model:** Medium-touch (L3). Nick Agresti (account lead) + AI Strategist (Tauseef Rahman).
**Vision Deck confirms on kickoff:** "Your AI Strategist and forward deployed engineers are introduced, the build plan is confirmed, and SAL starts taking shape."
**Cadence:**
- Weekly: Concierge scans Pulse; flags for Care if threshold breached
- Monthly: 30-min Pulse review with David + Roger
- Quarterly: Exec Pulse review with Randy Stuck + Steven Seghers (ROI story — total hours reclaimed, accounts absorbed, hires avoided)
- Opportunistic: Pulse patterns → expansion proposals (e.g., Trade Desk integration, Phase 2 intake→package when Phase 1 is stable)

---

## Work Products Summary (Phase A view)

| Work Product | AI Employee | Phase | Human-Equiv Minutes | Hourly Rate | Estimated Monthly Volume | Annual Value (est.) | Status |
|---|---|---|---|---|---|---|---|
| Performance Report | SAL | Phase 1 | ~120–180 min (est.) | ~$55/hr (est.) | ~30 reports/month | ~$66k–$99k/yr reclaimed | Pending customer alignment |
| Packaged Brief | SAL | Phase 2 | ~45–90 min (est.) | ~$55/hr (est.) | Pending Shelly session | Pending alignment | Pending customer alignment |

_Estimates anchored to: Discovery II AM time estimates + AgencyAnalytics 5–10 hr/client/month benchmark + blended agency AM/AD hourly rate ($55/hr = $90k–$140k salary range ÷ ~1,800 billable hours). AD at ~$100k base = ~$48/hr; AE at ~$130k for two = ~$62/hr; blended ~$55/hr._
_Billing/opportunity rate (for recovered-capacity argument): $150–$224/hr (Promethean Research, cited in Compass research). At $150/hr, 137 hrs/month recovered = $20,550/month — 4× SAL's $5k/month retainer._

**Recovered capacity framing (primary proposal argument):**
~30 hotel accounts × 5–10 hrs/account/month = ~150–300 hours/month total reporting burden → at $150/hr opportunity value → **$22k–$45k/month of recoverable capacity**. SAL at $5k/month is priced at 11–22% of the capacity it recovers.

---

## Function Transformation Model (Vision Deck)

The Vision Deck articulates a three-state model for how the account function evolves:

**State 01 — Current:** Every request (intake, clarification, brief-writing, reporting, admin) lands on the human team. Bandwidth caps growth. Hotel clients → Account Team (AE for intake/briefs/reporting/admin → AD for strategy/approvals/senior relationships).

**State 02 — Transition (SAL on the team):** SAL absorbs intake and coordination. The team handles what only humans can. New accounts onboard without new headcount. Hotel clients → SAL (intake/classify/clarify/package) → Account Team for escalations + strategy only.

**State 03 — Future (natural attrition):** SAL is primary interface, handles 80%+ of all interactions. Escalations only to the strategic layer. Account Executives carry more accounts at higher-value work. Account Directors handle portfolio strategy and senior relationships. Team is leaner, more strategic, managing more clients without burnout.
