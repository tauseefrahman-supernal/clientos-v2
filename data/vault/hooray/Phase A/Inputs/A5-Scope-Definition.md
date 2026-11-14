# A5 — Scope Definition
> **Phase:** Strategy · **Role:** Input
> **Answers:** SCOPE + FEASIBILITY DECISION. In/out of scope, assumptions, risk heat map, Scoping Document Summary.
> **This file is NOT for:** context landscape (A3), product activation decisions (A4), Work Product detail specs (Phase B).
> **Sources:** A1–A4, Discovery I (files 189, 192), Discovery II (files 191, 190), Competitor Requirements (file 193), Slack Thread (file 194), SAL Vision Deck (file 196), OVG Order Form (file 203 — Supernal delivery model reference).

---

## Scope Summary

**Phase 1 — SAL: Reporting Copilot**
Deploy SAL as a performance reporting automation layer. Pull data from core ad platforms (GA4, Meta Ads, Google Ads, Trade Desk), generate first-draft monthly narrative summaries per hotel client, surface anomalies and recommended next steps, deliver to Account Managers as polished email drafts for review and sign-off before client delivery.

**Phase 2 — SAL: Client Request Intelligence (intake → package)**
Extend SAL to handle inbound hotel client requests through the full four-responsibility workflow: intake → classify → clarify → package. Deliver completed creative briefs as Monday.com tasks (loaded, assigned, notified) for Shelly's traffic team. Leverage Google Workspace knowledge base for market context and client brand intelligence.

---

## In Scope

**Phase 1:**
- SAL AI Employee build — reporting function
- Data integrations: GA4, Meta Ads Manager, Google Ads, Trade Desk (tiered: live API preferred, manual fallback for clients who won't grant API access)
- Monthly performance report generation per hotel client (narrative + anomaly detection + next-step suggestions)
- AM review workflow (SAL drafts polished email → AM reviews → AM delivers to client)
- Pulse configuration for Performance Report Work Product (Equivalent Human Hours, reports delivered, anomalies flagged)
- Data access mapping: determine which clients use Hooray master accounts vs. client-owned delegated access vs. manual export fallback
- Governance layer: PII minimisation (aggregated metrics only), contract compliance check per client before enabling AI-assisted reporting
- Care setup: Pulse alert thresholds, retraining cadence, data source monitoring
- Assessment of existing Google Vertex build (before architecture decision: build on top vs. fresh start on Supernal platform)

**Phase 2 (pending Phase 1 ROI confirmation and Shelly working session):**
- SAL intake channel configuration (email/portal/Slack — TBD from Shelly session)
- Classify module: request taxonomy build + classification logic per Vision Deck categories (print ad, banner ad, email campaign, sales sheet, social creative, copy update, revision round)
- Clarify module: guided question flow per request type, one question at a time, Google Workspace context connector
- Package module: brief assembly in Hooray's format → direct Monday.com task creation (loaded, assigned, notified — no manual routing)
- Pulse configuration for Packaged Brief Work Product
- Care: brief quality monitoring, classification taxonomy updates
- App surface (if required for hotel client intake channel) — pending Shelly session

**Infrastructure (both phases):**
- Supernal proprietary orchestration platform
- Google Workspace connector (live, not static RAG)
- Monday.com integration (write access for task/pulse creation)
- Data normalisation layer across ad platforms

---

## Out of Scope

| Item | Rationale |
|---|---|
| Campaign execution or ad buying | SAL gathers requirements; humans execute |
| Final creative output (copy, design, video) | Human creative team responsibility |
| Trade Desk direct integration | Noted but not confirmed for Phase 1; flag for Phase 2 scoping |
| Revenate / Sendine CRM integration | Low priority for Phase 1 (email contacts only, no transactional data); defer |
| Catalyst deanonymisation workflow | Circular data flow; defer to Phase 2 or later |
| Momentum AIQ API integration | Low priority; potential Phase 2 addition |
| Rebuilding or replacing Monday.com | SAL writes TO Monday.com; no platform replacement |
| Building a new client-facing portal | Phase 1 operates inside existing toolstack; Phase 2 TBD |
| Replacing Hooray's internal dev team | Dev team freed for client-facing work; not displaced |
| Hotel-facing agentic solutions | Hooray's problem is agency-internal; not hotel-side automation |

---

## Key Assumptions

1. **Google Workspace is the active institutional knowledge base** — client brand files, competitor analysis, and customer profiles are maintained there and accessible via a live connector (confirmed by David, Discovery II 00:35:28)
2. **Monday.com write access is available** — Hooray can provide SAL with appropriate write credentials to create tasks/pulses in their Monday.com workspace
3. **GA4 and Meta Ads are the non-negotiable data sources** — confirmed as "90% of what makes SAL worth it" (David, Discovery II). Phase 1 build is blocked without these.
4. **API access for some hotel clients will require per-client authorisation** — not all clients use Hooray master accounts. A tiered access model is required. Manual export fallback must be designed for clients who won't grant API access.
5. **Shelly working session will occur before engineering finalises Phase 2 scope** — the four-responsibility process map has outstanding questions that only Shelly can answer. MNDA must be signed first (Vision Deck step 02). Engineering scope (and therefore final pricing) for Phase 2 depends on this session.
6. **MNDA is signed before the Shelly working session** — Vision Deck step 02 makes this explicit. Shelly must feel completely comfortable sharing how things actually work without reservation.
7. **Build-on-spec / pay-over-time is the commercial structure** — no heavy upfront fee. MSA with $5k/month retainer + project order forms.
8. **Hooray retains process IP** — code transfers to Hooray if partnership ends. _(Confirmed by Supernal's standard commercial model — OVG Order Form Section 5: "Owned by OVG from day one. Repository access available at any time on request.")_
9. **Phase 2 proceeds only after Phase 1 ROI is demonstrated** — this is not assumed in current scope; it is a phase-gate decision.
10. **Human-equivalent minutes and hourly rate** are working estimates (~120–180 min/report, ~45–90 min/brief, ~$55/hr blended) — must be confirmed with Hooray before Pulse configuration.
11. **PII minimisation:** Phase 1 uses aggregated metrics only (campaign performance, spend, conversions, trends) — no personally identifiable data from hotel guests.
12. **Vertex build assessment precedes architecture decision** — Vision Deck identifies this as an open question. Decision: build on existing Vertex work or start fresh on Supernal's orchestration platform must be made before engineering scope is locked.
13. **Third-party infrastructure costs:** Up to $250/month in third-party costs (hosting, APIs, email delivery) is expected to be included in the monthly fee per Supernal's standard model (OVG Order Form Section 8). Where usage is likely to exceed this threshold Supernal flags proactively and bills excess at cost. This should be made explicit in the Hooray order form.
14. **V1 milestones use binary acceptance gates** — per Supernal's standard delivery model (OVG Order Form Section 3): each milestone is "live or not live"; client sign-off required before the next milestone is marked complete. The Hooray order form should adopt this structure for Phase 1 deliverables.

---

## Feasibility Assessment

### Technical Feasibility

| Dimension | Assessment | Notes |
|---|---|---|
| GA4 integration | ✅ High | Well-documented reporting API; widely used |
| Meta Ads Manager integration | ✅ High | Good API coverage; business verification may create friction for some clients |
| Google Ads integration | ✅ High | Mature API ecosystem with granular metrics |
| Trade Desk integration | 🟡 Medium | Depends on account structure and reporting endpoints; needs validation |
| Monday.com integration | ✅ High | Straightforward GraphQL API; write access confirmed in scope |
| Google Workspace connector | ✅ High | Standard OAuth integration; all clients use it |
| Multi-client data normalisation | 🟡 Medium | Cross-platform metric inconsistencies expected; normalisation layer required |
| Client-by-client API authorisation | 🟡 Medium | Operationally complex; tiered model required; will slow initial onboarding |
| SAL four-responsibility build | ✅ High | Standard Supernal orchestration platform; intake/classify/clarify/package is well-understood pattern |
| Narrative generation quality | 🟡 Medium | Requires well-structured prompt engineering + sufficient GA4/Meta data context |
| Internal chatbot replacement | ✅ High | Live API > static RAG database; clear technical superiority. Vision Deck: "It's a conversation, not an employee." |
| Vertex build assessment | 🟡 Medium | Unknown until assessed. Could accelerate or complicate the architecture decision. |

**Overall technical feasibility: HIGH** — no novel or unproven technical components. Primary complexity is data access governance, not technical architecture.

### Resource Feasibility

- Supernal proprietary orchestration platform: available
- Required integrations are well-known (Google API ecosystem, Monday.com GraphQL, Meta API)
- Engineering scope requires Shelly working session to finalise Phase 2 — cannot commit to hours until that session completes
- Vision Deck confirms: forward deployed engineers introduced at kickoff
- Timeline: Phase 1 build estimated 8–12 weeks from engineering scope sign-off. Phase 2 follows after Phase 1 go-live.

### Timeline Feasibility

- Proposal feedback with David + Roger: June 10, 2026
- Wider group review (Randy, Steven, Shelly): post June 10
- Expected close: June 26, 2026
- MNDA signed: before Shelly working session (before June 26)
- Phase 1 go-live: targeting Q3 2026 (August/September) — assumes scope sign-off by early July
- Phase 2 go-live: Q4 2026 or later, pending Phase 1 ROI confirmation

**Timeline feasibility: MEDIUM** — dependent on internal buy-in velocity (Randy/Steven approval, MNDA signing, Shelly working session). Build timeline is achievable; political timeline is the variable.

### Budget Feasibility

- Deal value in Pipedrive: $60,000
- Nick's proposed structure: $5k/month MSA retainer + project order forms
- At $5k/month retainer over 12 months = $60k — aligns with Pipedrive value
- Phase 1 order form (estimated 4 months of build at Accelerated tier): ~$40k in build fees + retainer → total commitment aligns with deal value
- **Comparable reference:** OVG/CVR One engagement is $4,000/month × 12 = $48,000 for a comparable platform build (milestone-based V1, post-V1 rolling monthly cycles). Hooray is similar in structure but broader in scope (two Work Products, two phases, richer data integration layer).
- Build-on-spec / pay-over-time required — no large upfront
- **Budget feasibility: HIGH given pay-over-time structure** — the concern is internal political approval, not Hooray's ability to pay

---

## Risk Heat Map

| Risk | Probability | Impact | Severity |
|---|---|---|---|
| Randy blocks on in-house-build grounds | High | High | 🔴 Critical |
| Shelly session doesn't happen before June 10 | Medium | High | 🔴 Critical |
| MNDA not signed before Shelly session | Medium | High | 🔴 Critical |
| Client API access authorisation delays Phase 1 onboarding | High | Medium | 🟡 High |
| Competitor wins the deal (reporting copilot approach) | Medium | High | 🟡 High |
| Vertex build assessment reveals sunk-cost trap (team wants to preserve their work) | Medium | Medium | 🟡 Medium |
| Phase 2 scope creep into Phase 1 build | Medium | Medium | 🟡 Medium |
| Human-equivalent minutes/rate not aligned before Pulse config | Medium | Medium | 🟡 Medium |
| Data governance compliance gaps (client contracts) | Low | High | 🟡 Medium |
| Supernal longevity concern blocks Randy/Steven sign-off | Low | High | 🟡 Medium |
| Narrative generation quality below AM expectations | Low | Medium | 🟢 Low |
| Trade Desk API access insufficient for Phase 1 | Low | Low | 🟢 Low |

---

## Scoping Document Summary

**Client:** Hooray Agency — hospitality marketing agency with dozens of hotel clients
**AI Employee:** SAL: Creative Request Intelligence
**L-Tier:** L3
**Engagement model:** MSA retainer ($5k/month) + project order forms. Build-on-spec / pay-over-time. Hooray retains process IP (codebase owned from day one — consistent with Supernal's standard model). Infrastructure managed by Supernal for the engagement term; migration sprint available if Hooray elects to self-host.

### Phase 1 — Reporting Copilot (entry point)

SAL automates monthly performance reporting for Hooray's hotel client portfolio. Core capability: pull data from GA4, Meta Ads, Google Ads, and Trade Desk → generate first-draft narrative summaries → surface anomalies and next-step recommendations → deliver to Account Manager as a polished email draft for review and sign-off. Output: AM receives a near-complete report they review in minutes rather than hours.

**Work Product: Performance Report**
- Human-equivalent time: ~120–180 min/report (pending customer confirmation)
- Expected volume: dozens of reports/month (one per hotel client per month)
- ROI frame: hours reclaimed per AM per month → hires avoided as account base grows

**Why Phase 1 first:** Fastest ROI, lowest integration complexity, cleanest proof-of-performance story for Randy and Steven. The competitor requirements document confirms the same direction. Reporting is the wedge.

### Phase 2 — Client Request Intelligence (intake → package)

SAL extends to handle inbound hotel marketing director requests end-to-end: intake the problem, classify the request type, clarify missing parameters using GA4 data + Google Workspace knowledge (one question at a time), and package a complete brief directly into Monday.com for Shelly's traffic team (loaded, assigned, notified — no manual routing). Account Director remains the human oversight element throughout.

**Work Product: Packaged Brief**
- Human-equivalent time: ~45–90 min/brief (pending customer confirmation)
- Expected volume: multiple briefs per week per AM (volume TBD from Shelly session)
- ROI frame: brief quality → less rework in traffic and creative; AM time freed for strategy

### Technical approach

- Supernal's proprietary orchestration platform (modular, continuously improved — not a 60-day build)
- Live API connections (not static RAG database — direct upgrade over stalled internal chatbot: "It's a conversation, not an employee")
- Google Workspace as institutional knowledge layer
- Monday.com as the output surface (no new interface required for Phase 1; Phase 2 writes directly into Monday.com)
- Tiered data access model: Hooray master accounts (full API) → client-delegated (per-client authorisation) → manual fallback
- **V1 milestone delivery model:** Phase 1 deliverables structured as binary acceptance gates (live or not live) per Supernal's standard model. Client sign-off required before next milestone proceeds (reference: OVG Order Form Section 3).

### Activation summary

| Piece | Activated | Phase |
|---|---|---|
| Employee (SAL) | ✅ | Phase 1 + Phase 2 |
| App | 🟡 Phase 2 TBD | Phase 2 — pending Shelly session |
| Vault | ✅ | Phase 1 |
| Pulse | ✅ | Phase 1 |
| Care | ✅ | Phase 1 |
| Concierge | ✅ | Ongoing |

### Seven-step closing sequence (Vision Deck)

1. Answer outstanding questions (data infrastructure, Vertex build, internal dev capacity)
2. Sign MNDA — before Shelly session; ensures she can share freely
3. Working session with Shelly — map four responsibilities, Monday board, escalation triggers, definition of a complete brief
4. Supernal delivers proposal — cost, timeline, phased delivery
5. Connect Randy with a client reference — proof of performance, not pedigree
6. Sign agreement
7. Kickoff — AI Strategist + forward deployed engineers introduced

### Open items before engineering scope can be finalised

1. **MNDA signed** — prerequisite for Shelly working session
2. **Shelly working session** — four-responsibility process map, Monday.com brief format, intake channel, escalation rules
3. **Vertex build assessment** — assess what exists; decide architecture before build
4. **Client API access audit** — map which clients use Hooray master accounts vs. delegated; confirm authorisation feasibility for top-priority clients
5. **Human-equivalent minutes + hourly rate** — customer sign-off required for Pulse configuration
6. **Contract compliance check** — which hotel client contracts permit AI-assisted reporting?
7. **Monthly report volume** — total count of hotel clients and reports/month
8. **Client reference call** — connect Randy + Steven with a Supernal client before sign-off
9. **Third-party cost cap clarification** — confirm the $250/month included threshold (per Supernal standard model) in the Hooray order form before signing

### Feasibility gate status
**Feasibility Gate is UNLOCKED** (per deal context: gate unlocked at 2026-06-04). Phase B can proceed with human alignment.

### Recommended next step
Sign MNDA → schedule Shelly working session → deliver proposal based on completed discovery and Shelly's inputs. Phase 1 reporting scope can proceed to engineering in parallel with MNDA/Shelly sequencing.
