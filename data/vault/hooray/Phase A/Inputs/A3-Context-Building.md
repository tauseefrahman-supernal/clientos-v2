# A3 — Context Building
> **Phase:** Strategy · **Role:** Input
> **Answers:** CONTEXT LANDSCAPE. Five-layer neutral description + service mapping matrix.
> **This file is NOT for:** gap analysis (A2), product fit decisions (A4), feasibility (A5).
> **Sources:** Discovery I (files 189, 192), Discovery II (files 191, 190), Competitor Requirements (file 193), Slack Thread (file 194), SAL Vision Deck (file 196), Business-Model Deep Dive (file 199), Competitive Landscape (file 200).

---

## Layer 1 — Client

**Organisation:** Hooray Agency
**Type:** Independent hospitality marketing agency
**Founded:** 1993 (as Hyperdisk); rebranded "Hooray Agency" February 2019
**HQ:** 1124 Main St., Suite A, Irvine, CA 92614
**Scale:** ~22–36 employees (PitchBook: 22; ZoomInfo: ~36); ~$7.6M reported revenue (RocketReach — treat as directional). Revenue per employee ~$210k–$345k range — above the $150k–$200k agency benchmark, implying a lean, senior-loaded team carrying significant account volume.
**Geography:** Multi-timezone (Mountain + Pacific + Eastern confirmed on calls). Field presence in New York, Phoenix, Las Vegas, Hong Kong, Kansas City.
**Stage:** Operationally mature independent agency. Has built proprietary products (Momentum AIQ private-labelled from Meridian; Catalyst pixel tool). Has a functioning in-house dev team. Not a startup — 30+ years of operation.

**Client roster (hotel-heavy, multi-property):** Salamander Collection (AOR-level; featured case study), Resorts World Las Vegas (AOR for $4.3B Strip resort), Curator Hotel & Resort Collection, Aqua Aston Hospitality (Hawaii), Carter Hospitality Group, Columbia Hospitality, OTH Hotels & Resorts, Marcus Hotels & Resorts (The Pfister, Saint Kate, The Garland), Timbers Resorts, Beyond Green, The Duniway (Hilton Portland), Balboa Bay Resort, The Guild Hotel, Mauna Kea, Alila Ventana Big Sur, Preferred Hotels & Resorts, plus historical brand work with Marriott, Hilton, Starwood, Hyatt, Montage, Pebble Beach, and Trump International. Many clients are management groups / collections with multiple properties — meaning one "account" can equal many properties, each generating its own monthly reporting cycle.

**Org structure (as understood from transcripts + public page):**
```
Executive / Ownership layer:    Steven Seghers (Co-founder & CEO), Randy Stuck (EVP)
Account team:                   Account Directors + Account Executives (managed by Katelyn Raman, SVP Accounts & Strategy)
Traffic management:             Shelly Weasel (Senior Director of Operations) + multiple traffic managers
Dev team:                       Reports to Randy Stuck; managed day-to-day by traffic managers
Operations / Champions:         David Metze, Roger Burns (VP Strategy / VP Digital Integration)
Creative:                       Eric Stein (Chief Creative Officer), Bobby Dragulescu (VP Brand & Design)
Business dev:                   Michael Mustafa (VP Business Development & Partnerships)
```

**Services:** Three pillars: (1) Creative & Content — graphic design, visual identity, in-house photo/video/post, copywriting, brand architecture, multimedia campaigns; (2) Data & Digital / Media — go-to-market media planning, KPI & competitive analysis, digital media strategy, social campaign creation, optimization consulting, plus proprietary platform "Catalyst"; (3) Solutions & Performance / Technology — AAA web/mobile dev, proprietary CMS, KPI analysis & performance measurement, "Personalized AI Brand Agents," automated schema, and AEO/GEO/SXO search visibility. Paid media across Google Ads, Meta, and programmatic/Trade Desk-type channels, plus SEO/SEM, social, email, and web.

**Internal tooling in use:** Monday.com (project/task management + some shared client boards), Google Workspace (all client knowledge — brand, competitors, customer profiles), Looker Studio, GA4, Meta Ads, Google Ads, Trade Desk, Revenate (CRM), Sendine (CRM), Momentum AIQ, Catalyst (pixel/deanonymisation tool), HubSpot (some clients).

**Internal build context:** The internal dev team started building on OpenAI (RAG-based agent builder) and subsequently migrated to Google Vertex. The migration is incomplete and the current Vertex build status is unassessed — one of the three outstanding questions the Vision Deck identifies before full scope can be locked. The team understands APIs and MCPs but cannot architect agentic systems per David's characterisation.

---

## Layer 2 — Objectives

**Primary objective:** Return 60%+ of account team time to strategic work by removing coordination overhead (brief clarification, back-and-forth, manual reporting).

**Secondary objective:** Scale account capacity without adding headcount. New hotel accounts onboard into SAL's workflow; same team carries more accounts at higher strategic level. Vision Deck quantifies: +30% accounts absorbable without new headcount; $65K AE hire avoided in the first growth cycle.

**Tertiary objective:** Produce a measurable ROI story (hours reclaimed/week, hires avoided) strong enough to win over skeptical internal stakeholders (Randy, Steven). Vision Deck frames: $141K/yr of account team time returned to strategic work, out of $235K total team cost.

**Implicit objective:** Validate the viability of an ongoing external AI partnership model. If this engagement succeeds, David indicated Hooray would prefer to outsource all development work rather than maintain an internal dev team. This deal is a proof point for a larger strategic shift.

**Business goal alignment:** Hooray competes on account team quality and hospitality domain expertise. Freeing AMs and ADs from coordination work directly amplifies their competitive differentiation. AI-search / AEO visibility (Momentum AIQ) is already a competitive advantage they hold over other agencies — SAL extends that posture internally.

**Account team time distribution (Vision Deck):**
- Current state: 60% coordination / 40% strategy
- With SAL: 15% coordination / 85% strategy, relationships, growth

**Macro context (from Compass research):** Gartner's 2025 CMO Spend Survey reports 39% of CMOs plan to cut back on agency budgets, and 22% said GenAI has reduced their reliance on external agencies. This pressures agencies like Hooray to prove ROI and run leaner — a tailwind for an internal-efficiency tool that protects margin and frees the team to defend/grow accounts. Hooray already markets AI fluency (AI Brand Agents, AEO/GEO), so cultural buy-in for an AI employee exists; the friction is execution capacity.

---

## Layer 3 — Design

**Client's design preferences:**
- Proposal format: Rafferty Ventures style (per Slack Thread, Nick's specific request)
- Engagement model: MSA with retainer + order forms — not a one-off project, not a simple dev shop relationship
- Build philosophy: modular, continuously improved — not "build once, throw away" (David's 60-day obsolescence concern was addressed by Nick's counter-philosophy and resonated)
- Ownership: Hooray retains process IP. If partnership ends, they receive the code.
- Payment: build-on-spec / pay-over-time — no heavy upfront. This was specifically what landed with Steven Seghers.

**Interface / surface design:**
- SAL Phase 1 output: polished, submission-ready email draft (performance report delivered to AM)
- SAL Phase 2 output: direct Monday.com task creation (brief loaded, assigned, notified — no manual routing)
- SAL Phase 1 interaction model: communicates with AMs, not directly with hotel clients
- SAL Phase 2 interaction model: hotel marketing directors interact with SAL directly (pending channel confirmation from Shelly session); SAL accepts freeform text, attachments, links, verbal descriptions "by design"
- SAL's tone/communication: must reflect Hooray's polished, brand-aware, premium hospitality standard when interacting with hotel marketing directors
- No new standalone customer-facing product in Phase 1 — operates inside existing Hooray toolstack

**Existing chatbot context:** The current internal OpenAI chatbot has no tools, no integrations, and no ability to take action — per Vision Deck: "it's a conversation, not an employee." SAL replaces this.

---

## Layer 4 — Risks

| Risk | Type | Severity | Mitigation |
|---|---|---|---|
| Randy Stuck (EVP) blocks the deal on in-house-build grounds | Political | 🔴 High | Supernal must connect Randy + Steven with a live client reference before contract. Build-on-spec / pay-over-time framing removes the financial risk objection. Frame SAL as freeing the dev team for client-facing work, not replacing them. |
| Shelly Weasel vetoes adoption post-approval | Operational | 🔴 High | Shelly working session before proposal finalises. She must co-design the intake→package process, not receive it. MNDA must be signed before her session (Vision Deck step 02). |
| SaaS price anchor (Shelly or Randy anchors against $69–$300/month dashboard) | Commercial | 🔴 High | Pre-empt explicitly in proposal: those tools move data but don't write the report, catch the anomaly, or recommend the next step — the human hours remain. Comparison set is analyst headcount + custom-build cost, not a dashboard subscription. |
| Client data access authorisation variance | Technical | 🟡 Medium | Not all hotel clients use the same tools or will grant API access. Must design a tiered access model (master accounts vs. delegated vs. manual fallback) before build. |
| Internal dev team relationship / overlap | Political | 🟡 Medium | Proposal must frame SAL as freeing the dev team for client-facing work, not replacing them. Randy manages the dev team — this framing matters to him. |
| Stalled internal chatbot = "why is yours different?" | Technical | 🟡 Medium | Supernal's proprietary orchestration platform vs. RAG chatbot on agent builder is a clear technical differentiation. Live API connections (not static vector DB) are the key proof point. |
| Scope creep between Phase 1 (reporting) and Phase 2 (intake→package) | Scope | 🟡 Medium | Proposal must clearly sequence phases with distinct deliverables. Phase 1 reporting ROI unlocks Phase 2. |
| Proof-of-performance wall (Randy/Steven haven't engaged) | Sales | 🟡 Medium | Client reference call is the closing trust move. Must be arranged before wider group meeting June 10. |
| Supernal longevity concern ("will they be around in 2–3 years?") | Commercial | 🟡 Medium | Nick addressed: Supernal is spinning out of Infinity Group as the largest company in the hold co — signal of financial health. Prepare more concrete proof points for Randy. |
| PII + data governance for hotel client data | Compliance | 🟡 Medium | Competitor doc flagged: which client contracts permit AI-assisted reporting? Are there restrictions on exporting data to external AI? MVP should use aggregated metrics, not PII. Contract language should explicitly permit AI-assisted reporting. |
| Existing Google Vertex build creates sunk-cost bias | Technical / Political | 🟡 Medium | Vision Deck identifies assessing the Vertex build as an open question before deciding whether to build on top of it or start fresh. Must be answered before engineering scope. |
| NinjaCat AI Agents ($1.5k–$3k/mo) as "credible buy alternative" | Competitive | 🟡 Medium | Heavy implementation, enterprise complexity for a 30-person shop, no hospitality tuning, no brief-intake; SAL is lighter-touch, owned, and broader in scope. |
| Trade Desk integration scope ambiguous | Technical | 🟢 Low | Noted as possible connection to banner ad classification. Confirm whether it falls within Phase 1 or Phase 2 scope. |
| Catalyst / Revenate deanonymisation loop | Technical | 🟢 Low | Circular data flow (Catalyst → CRM). Low priority for Phase 1. |

---

## Layer 5 — Operating Context

**Daily workflow rhythm:**
- Account team receives hotel marketing requests (multiple channels — email primary)
- AMs clarify, build briefs, submit to Monday.com for traffic assignment
- Traffic (Shelly's team) reviews and assigns creative work
- Monthly: AMs pull data from all ad platforms, write performance narrative, deliver to hotel clients
- Dev team: operates under Randy Stuck, managed by traffic managers, perpetually pulled to client-facing fires

**Reporting volume economics (Compass research benchmarks):** Hotel marketing requires recurring monthly (often weekly) owner/asset-manager reporting, frequently across multiple properties and multiple brand portals. Industry benchmark: 5–10 hours per client per month (AgencyAnalytics 2024 State of Agency Report, 7,000 agencies). For ~30 hotel/property accounts: ~150–300 hours/month total reporting burden. At blended internal cost of ~$60–$75/hr: $7k–$22k/month of cost; at billable/opportunity value of $150–$224/hr: ~$18k–$67k/month of recoverable capacity. The $5k/month retainer is a fraction of this.

**Agency talent costs (public benchmarks for ROI model):**
- Account managers: ~$80k/year (~$39/hr base)
- Account directors: ~$208k/year (~$100/hr base)
- Paid-media analysts: ~$64k–$80k/year
- Junior analysts: ~$52k–$72k/year (LA market)
- Billable rates are 2–3x cost: typical agency billing $125–$200+/hr (Promethean Research: $150–$224/hr)
- Fully-loaded junior analyst: ~$70k–$95k/year = ~$5,800–$7,900/month

**Technology environment:**
- Monday.com: central task/project management hub. Already used by account team and traffic. Some hotel clients have shared boards.
- Google Workspace: institutional knowledge repository — every client's brand, competitor landscape, customer profiles. Used as a knowledge connector by the proposed SAL.
- Ad platform mix: GA4 + Looker Studio (100% of clients), Meta Ads (>50%), Google Ads (>50%), Trade Desk (subset), HubSpot (some clients).
- CRMs: Revenate + Sendine (low priority for Phase 1 — email contact data only, no transactional data).
- Momentum AIQ: Hooray's own AI visibility monitoring product (private-label of Meridian). Has potential API connector.
- Catalyst: Pixel-based deanonymisation tool — feeds into CRM. Low priority for SAL Phase 1.
- Google Vertex: Partially built internal agent. Assessment of this build is an open question (Vision Deck section 05).

**Decision-making culture:**
- Influencer-driven: Steven Seghers is the critical unlock. Once he approves, it cascades.
- EVP Randy Stuck controls internal dev resources and holds budget veto. Proof-of-performance is his language.
- Shelly Weasel is an operational gatekeeper — pragmatic, risk-aware, resistant to extra work.
- David + Roger are the internal sponsors driving the process and bridging to Supernal.

**Competitive context:**

**Category 1 — SaaS dashboards (most likely "good enough and cheaper" objection):**
- AgencyAnalytics ($179/mo Agency tier): auto-drafted narrative summaries ("Smart Reports"), "Ask AI" (OpenAI-powered), anomaly detection. Documented gaps: no Trade Desk or Monday.com integration; no creative-brief intake; per-client surcharge of $20/month climbs steeply; generic AI voice (reviewers note). Cuts report prep ~40 min/client/month.
- Whatagraph IQ (~$200+/mo): builds reports from prompts, writes summaries, IQ Chat, MCP to Claude/ChatGPT. Linked templates propagate edits. No intake workflow.
- Databox Genie ($399+/mo): conversational AI analyst, AI Performance Summaries, anomaly detection. Credit-based with quotas. No intake workflow.

**Category 2 — Enterprise agentic (closest to SAL but overbuilt and expensive):**
- NinjaCat AI Agents (~$1.5k–$3k/mo): the most credible "buy" alternative. Chained agents — anomaly detection, root-cause, recommend, draft client comms. 90% reduction claims. Enterprise complexity (4–12-week onboarding); a TrustRadius reviewer reported "$60k+ and 250 hours for a product that adds no value." No brief intake; not hospitality-specific. The bar SAL must beat in capability, not price.
- Improvado (~$3k–$10k/mo mid-market): AI Agent answers NLQ questions, drafts summaries, claims 99.5% routine analytics automation. Built for 50+ client enterprise scale; overkill for Hooray; no intake workflow.

**Category 3 — Custom-build / AI automation agencies (validates Supernal's price):**
- Market price: $2k–$15k project + $2k–$8k/month retainer. Documented analog: 60-person marketing-ops firm built an n8n + LLM brief-classification workflow for $14k project + $900/mo retainer — 74% manual-handling reduction, 4.9-month payback. Directly brackets Supernal's ~$12k first-project + $5k/mo.

**Category 4 — Agentic hospitality (different problem, not a direct competitor):**
- **Agentic Hospitality** (Louisville, KY) — ~12 months old, Google for Startups backed, one named client: The Houstonian Hotel. Solves the hotel's OTA recapture problem, not the agency's internal workflow problem.
- No direct competitor identified building AI for hospitality agency internal workflows.
- An unnamed competitor has produced the "Requirements from Competitor" document — actively scoping against Supernal on the same reporting stack. Real threat.

**Supernal's four strongest differentiators (from Competitive Landscape research):**
1. Trade Desk + Monday.com fusion — no SaaS tool natively handles both as first-class reporting sources
2. Hospitality-tuned narrative — SAL speaks RevPAR, ADR, booking pace, OTA vs. direct; generic tools produce generic "AI voice"
3. Hooray-owned governance — client controls the system, data, and model boundaries; no vendor lock-in
4. Eval-first delivery — the #1 ROI differentiator per 250-agency 2026 survey (agencies that "build eval first are the ones reporting 11× ROI"; the bottom quartile saw 0.7× and lost money)

---

## Service-Line Mapping Matrix

| Requirement | Primary Service Line | Notes |
|---|---|---|
| AI Employee SAL — intake, classify, clarify, package | **Technology** | Core agent build on Supernal's orchestration platform |
| Data integration — GA4, Meta, Google Ads, Trade Desk, Monday.com, Google Workspace | **Technology / Data** | API connections, auth, normalisation |
| Monthly performance reporting automation | **Data / Technology** | Aggregation, narrative generation, anomaly detection |
| Creative brief packaging → Monday.com | **Technology** | Output automation into existing tool |
| Client knowledge base (Google Workspace connector) | **Data** | Live connector not static DB |
| ROI visualisation / Pulse dashboard | **Technology / Data** | Pulse (Work Product tracking) + Equivalent Human Hours |
| Governance + PII model for client data | **Data / Technology** | Metadata-only to LLMs; role-based access; audit logs; no external model training on client data (NinjaCat's hard guarantee is the bar) |
| Evaluation harness + QA workflow | **Technology / Data** | Golden-dataset comparisons, side-by-side blind tests, mandatory human-in-the-loop sign-off — this is the 11× ROI differentiator |
| Stakeholder management / change management | **Strategy** | Champion strategy, Shelly co-design session |
| Vertex build assessment | **Technology** | Open question: assess existing build before deciding architecture |
| Proposal + SOW | **Strategy** | Supernal scoping deliverable |

**Cross-service dependencies:**
- Technology and Data are tightly coupled — the data layer quality directly determines SAL's usefulness (David confirmed: "SAL is not worth very much without Google Analytics and Meta Ads")
- Strategy (stakeholder management) is a prerequisite for Technology build approval — Shelly working session must precede engineering scope

**Out of scope (confirmed):**
- SAL does not execute campaigns, create final copy, design ads, or produce finished creative
- SAL does not directly replace human account executives or directors — it reallocates their time
- Trade Desk direct integration: not confirmed for Phase 1; flag for Phase 2 scoping
- Catalyst / Revenate deanonymisation workflow: low priority, Phase 2 or later
- Rebuilding or replacing Monday.com: SAL writes TO Monday.com, does not replace it
- Hotel-facing agentic solutions: Hooray's problem is agency-internal; not hotel-side automation
