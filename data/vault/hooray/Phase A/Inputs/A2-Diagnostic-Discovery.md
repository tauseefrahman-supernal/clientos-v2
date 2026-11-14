# A2 — Diagnostic Discovery
> **Phase:** Strategy · **Role:** Input
> **Answers:** PROBLEM + GAPS. Four diagnostic layers, gap analysis, clarity checklist, severity ratings.
> **This file is NOT for:** solution design (A4), context landscape (A3), scope decisions (A5).
> **Sources:** Discovery I (files 189, 192), Discovery II (files 191, 190), Competitor Requirements (file 193), Slack Thread (file 194), SAL Vision Deck (file 196), Business-Model Deep Dive (file 199), Competitive Landscape (file 200).

---

## Layer 1 — Stated Problem (what the client said)

> "There's a lot of work currently your account team is doing that isn't the best use of their pretty elite capabilities." — David, May 11

Hooray's account managers and directors spend an estimated 60%+ of their time on:
1. Deciphering vague/incomplete client requests and brief submissions
2. Back-and-forth email chains clarifying campaign parameters
3. Manual monthly performance reporting (same structure every month, entirely manual)
4. Starting each creative brief largely from scratch (format consistent, but objectives/language new each time)

The client's stated ask: deploy an AI employee ("SAL") that handles intake → classify → clarify → package, so the account team spends their time on strategy rather than coordination.

Additionally: automate monthly performance reporting by pulling data from core ad platforms and generating first-draft narrative summaries for AMs to finalise.

**Vision Deck quantification (Supernal's framing, to validate with Hooray):**
- Account time spent on coordination vs. strategy: 60%+
- Hotel clients sending imperfect requests every week: dozens
- Existing PGA resort pilot: 1 (no integrations, no tools, no scale)
- New account hires needed to absorb the next wave of growth under current model: 0 (SAL's value proposition)

**Industry validation (Compass research — public benchmarks):**
- AgencyAnalytics 2024 State of Agency Report (7,000 agencies): manual reporting takes 5–10 hours per client per month — exactly the workflow SAL targets
- For ~30 hotel/property accounts: ~150–300 hours/month total reporting burden
- Joanne Davis Consulting / Scan International survey (293 responses): 53% of briefs are complete but lack focus; 27% incomplete and inconsistent; 20% complete most of the time; zero respondents found them complete and focused all of the time — confirming the brief quality problem as structurally industry-wide, not a Hooray-specific failure

---

## Layer 2 — Goal Problem (what they actually need to achieve)

The real outcome Hooray needs: **scale account capacity without adding headcount.**

Roger's framing (confirmed by David): as new hotel accounts onboard, the same team of AEs and ADs handles them because SAL absorbs the coordination and reporting overhead. Natural attrition handles the rest. The same team carries 2–3x more accounts at a higher strategic level.

Secondary outcome: **unlock Caitlyn's account team from the brief quality problem** (incomplete client submissions create rework across the full delivery chain — from AM through traffic to creative).

Tertiary outcome: **produce a compelling internal ROI story** — hours reclaimed per week, new accounts absorbed without new hires, AE/AD satisfaction. Roger + David explicitly need this visualisation to win over Randy and Steven.

**Vision Deck ROI frame (Supernal-authored — to confirm with Hooray):**
- Current account team annual cost: $235K ($105K AD + $130K for 2 AEs)
- Of that, ~$141K/yr is spent on work SAL can absorb (60% coordination × $235K)
- Target post-SAL time distribution: 15% coordination / 85% strategy
- Hours reclaimed per week per account team member: ~15 hrs
- New accounts absorbable without adding headcount: +30%
- Next AE hire avoided (first growth cycle): $65K saved

**Industry benchmarks for the ROI argument (Compass research — use as supporting color, not precise promises):**
- AgencyAnalytics 2022 Client Reporting Benchmarks (7,000 agencies): agencies save an average of 137 billable hours/month after automating reporting, equating to $20k–$30k/month in recovered capacity (at $150–$224/hr agency billing rates)
- Best-in-class case studies (NinjaCat, Whatagraph, Improvado): 40–75% reporting-time reduction is the credible, repeatable range; per-report time drops from ~4 hrs to ~1–1.5 hrs; one AM can manage ~25 accounts
- The $5k/month retainer is priced below: (a) one mid-market client retainer ($8k–$25k/month); (b) a junior analyst's fully-loaded monthly cost ($5,800–$7,900/month); (c) true competing enterprise platforms (NinjaCat/Improvado ~$36k–$120k+/year)

---

## Layer 3 — Operational Problem (how the gap plays out day-to-day)

### Current state workflows with friction points

**Monthly reporting workflow:**
- Account managers pull data manually from GA4, Google Ads, Meta, Trade Desk, Looker Studio
- Write narrative summaries for each hotel client — same structure each month
- No automation; pure manual effort; high volume (dozens of hotel clients, many multi-property accounts)
- Competitor requirements document frames this as the fastest ROI opportunity: "Reporting Copilot" — aggregate → draft → surface anomalies → suggest next steps
- Industry norm: ~11.2 hours per client per month (cited from AgencyAnalytics 2025 survey — use as directional; directly-verified AgencyAnalytics figure is 52% of their users spend under 30 minutes per client report after automation)

**Client brief / creative request workflow:**
- Hotel marketing director submits a request (often vague: "I need to fill a July gap")
- AM/AD deciphers → emails follow-up questions → waits → iterates
- Once brief is complete, manually creates a Monday.com task ("pulse") for Shelly's traffic team to assign
- Creative team often gets the brief late or with insufficient context
- Caitlyn identified this as the root problem: "we get bad information from clients and can't build good quality creative briefs"
- Industry confirmation: 53% of agency briefs are complete but lack focus; 27% incomplete and inconsistent (Joanne Davis Consulting / Scan International, 293 C-level respondents, reported Ad Age)

**Existing internal tool (stalled):**
- Built: OpenAI agent builder + RAG database with documents
- Capability: basic campaign brainstorming only; no live API connections to GA4/Meta
- Status: stalled — team migrating to Google Vertex but got sidetracked by client-facing work
- David confirmed: "This would replace what the efforts we're making right now."
- Vision Deck characterises it precisely: "The existing chatbot has no tools, no integrations, and no ability to take action. It's a conversation, not an employee."
- Industry context: un-governed, un-evaluated builds are where money is lost — 2026 250-agency survey found bottom-quartile AI deployments returned 0.7× ROI (lost money); builds that "built eval first" returned 11× ROI

### Data access complexity
Every hotel client has a different combination of tools and a different level of willingness to grant API access. The challenge is not unknown APIs — it's client-side authorisation. Some clients use agency master accounts (Hooray-controlled); others use client-owned accounts with delegated access.

---

## Layer 4 — Organisational Problem (what's really going on politically)

This is the most complex layer. Four distinct tensions:

### Tension 1 — The internal-build bias
Randy Stuck (EVP) manages the internal dev team and believes they can build solutions in-house. Hiring an external firm is framed internally as "a failure." The dev team's stalled efforts reinforce that they tried and got pulled away — but Randy may read it as "we just need more time."

### Tension 2 — Shelly's veto risk
Shelly Weasel (Senior Director of Operations, confirmed) oversees all Monday.com task routing and the traffic management function. She is not a champion for things that create more work. If she feels SAL is dropped on her rather than designed with her, she can effectively block adoption even post-approval. Nick identified this as the critical emotional/technical buyer.

Vision Deck is explicit: Shelly owns the four things SAL needs most — the request category taxonomy, the Monday board structure, the escalation triggers, and the definition of a complete brief. And: "She will know immediately if something doesn't fit, and will live those repercussions. We build with people like this, not on top of."

### Tension 3 — The SaaS-price anchor risk
A cost-focused stakeholder (most likely Shelly or Randy) may anchor SAL's $5k/month against a $69–$300/month SaaS dashboard (Swydo/AgencyAnalytics/Databox). This is the single most commercially dangerous objection — must be pre-empted in the proposal. The answer: those tools are dashboards and data plumbing — they still require a human to interpret, write the narrative, catch anomalies, and recommend next steps. SAL's four jobs (intake, classify, clarify, package) and the Phase 1 reporting copilot produce the **finished first-draft deliverable** — the exact labor those tools do not remove. The comparison set is analyst headcount + custom-build cost, not a dashboard subscription.

### Tension 4 — Proof-of-performance skeptics
Randy and Steven have not been in the discovery process. They will demand proof of performance (not pedigree). Their key questions: Are Supernal going to be around in 2–3 years? What have they actually built? The closing move is a direct client reference call, not a proposal slide.

### Enabling conditions (what's working in Supernal's favour)
- David and Roger are genuine champions with skin in the game
- Steven Seghers already had one call with Nick where the pay-over-time framing landed — he is "the major influencer" per Roger
- Caitlyn (Katelyn Raman, SVP Accounts & Strategy — likely match) is a latent champion — the brief problem was her idea
- Build-on-spec / pay-over-time / Hooray keeps process IP — these three terms are the keys to the "wall"
- Supernal's modular, continuously-improved approach directly addresses David's 60-day obsolescence concern
- Hooray already markets AI fluency (AI Brand Agents, AEO/GEO, Momentum AIQ) — cultural buy-in exists; the friction is execution capacity

---

## Gap Analysis

| Gap | Severity | Owner | What's needed to close |
|---|---|---|---|
| Shelly Weasel has never been in a discovery session | 🔴 Critical | David / Roger | A working session with Nick + Shelly before proposal finalises. She must feel like a co-designer. MNDA must be signed first. |
| SAL's process map not validated end-to-end | 🔴 Critical | Nick + Shelly | Shelly working session to map all four responsibilities step-by-step and surface outstanding questions |
| Data access / authorisation model unresolved | 🔴 Critical | Nick + David | Determine which clients use agency master accounts vs. client-owned accounts; establish read-only service account feasibility per platform |
| SaaS-price objection not yet pre-empted in proposal materials | 🔴 Critical | Nick + Tauseef | Proposal needs an explicit "Why not a $69–$300/month tool?" section. Counter: those tools don't write the report or remove the human hours. Comparison set = analyst headcount + custom build, not a dashboard. |
| Randy Stuck + Steven Seghers have not engaged | 🟡 Warning | David / Roger | Internal influencer strategy must execute before wider group meeting on June 10; client reference call must be arranged for Randy/Steven |
| Google Vertex build not assessed | 🟡 Warning | Nick + David / dev team | Vision Deck identifies this as an open question: assess what's been built, how it's architected, what dev team documented — before deciding whether to build on top or start fresh |
| Internal dev team capacity and workload unknown | 🟡 Warning | Nick + David | Vision Deck flags: understand what 3–4 internal developers are currently working on. Determines whether dev team is a resource to build alongside or Supernal takes full lead. |
| Human-equivalent minutes + hourly rate for Work Products not agreed | 🟡 Warning | Nick + Hooray | Required for Pulse / ROI model; pending customer alignment |
| Monthly reporting volume (number of hotel clients, reports/month) not quantified | 🟡 Warning | Nick | Needed to size the reporting WP and build the ROI model. Working assumption: ~30 hotel/property accounts. |
| Trade Desk workflow integration scope unclear | 🟡 Warning | Nick + Roger | Banner ad classification may feed into SAL's classify responsibility — need confirmation |
| MNDA not yet signed | 🟡 Warning | Nick / legal | Vision Deck step 02: MNDA must be signed before Shelly's working session. Shelly must be comfortable sharing how things actually work. |
| Evaluation harness design not yet scoped | 🟡 Warning | Nick + Tauseef | The #1 differentiator per 250-agency 2026 survey. Must be designed before Phase 1 build — not retrofitted. A 3–6 week investment in eval infrastructure separates 11× ROI from 0.7×. |
| Hotel client contract compliance for AI-assisted reporting not mapped | 🟡 Warning | Nick + David | Which hotel client contracts permit exporting marketing data to external AI systems? Must verify before Phase 1 go-live. |
| Competitor requirements doc is a signal, not a build spec | 🟢 Note | Nick | Document represents a competing vendor's scope. Used to confirm reporting direction. Do not treat as Hooray's confirmed requirements. |
| Momentum AIQ API connector feasibility unconfirmed | 🟢 Note | Nick | David noted "potential for an API connector" — needs technical validation |
| Catalyst data flow (deanonymisation → CRM) low priority | 🟢 Note | Nick | Circular data flow (Catalyst → CRM). Low priority for Phase 1. |

---

## Clarity Checklist (for working session with Shelly)

These questions must be answered before engineering scope is finalised:

**Intake responsibility:**
- [ ] What channels do client requests arrive on? (Email, phone, portal, Slack?)
- [ ] What is the average number of new requests per week per AM?
- [ ] What triggers a "new request" vs. a revision to an existing brief?

**Classify responsibility:**
- [ ] What are the request categories Hooray handles? Vision Deck enumerates: print ad, banner ad, email campaign, sales sheet, social creative, copy update, revision round. Is this the complete taxonomy?
- [ ] Is there a written taxonomy today, or is classification informal?
- [ ] What percentage of requests fall into each category (rough estimate)?

**Clarify responsibility:**
- [ ] What is the minimum information required for a complete brief for each request type?
- [ ] What are the most common clarification questions AMs ask clients? (Repeated patterns?)
- [ ] Who is allowed to ask the client follow-up questions — AMs only, or can SAL interact directly with hotel contacts?
- [ ] Is there a specific tone/voice required when communicating with hotel clients?
- [ ] What constitutes "objective" vs. "subjective" client feedback in the clarify step? (Vision Deck: SAL converts subjective comments into specific prompts)

**Package responsibility:**
- [ ] What is the exact format of a complete creative brief in Monday.com?
- [ ] What fields are required vs. optional in a Monday.com task/pulse?
- [ ] Who reviews the brief before it enters the traffic queue — AD only, or can it go straight to Shelly?
- [ ] What happens when Shelly receives a brief that is still incomplete — current escalation path?
- [ ] What does "assigned and notified" look like in the Monday.com workflow? (Vision Deck: SAL loads brief, assigns, notifies — to whom?)

**Reporting workflow (Phase 1):**
- [ ] How many hotel clients does Hooray currently serve?
- [ ] How many performance reports are produced per month total?
- [ ] What is the current time-per-report for an AM? (Hours spent pulling data + writing narrative)
- [ ] Which clients use Hooray master ad accounts vs. client-owned with delegated access?
- [ ] Are there client contracts that restrict exporting marketing data to external AI systems?
- [ ] What does a "good" monthly report narrative look like? (Can Hooray provide two examples? — needed for eval harness golden dataset)

**Existing Vertex build (outstanding question from Vision Deck):**
- [ ] How far along is the Google Vertex build?
- [ ] What has been built, how is it architected, and what has the dev team documented?
- [ ] Build on top of existing Vertex work vs. start fresh on Supernal's orchestration platform — what is the decision criteria?

**Governance / compliance:**
- [ ] Do any hotel client contracts explicitly restrict AI-assisted reporting or data export to external AI systems?
- [ ] Is Hooray comfortable with metadata-only (not raw PII) being sent to LLMs for narrative generation?
- [ ] What is the expectation for audit logs and data retention?

---

## Contradictions / Flags

1. **Scope creep risk between phases:** The competitor requirements doc proposes a "Reporting Copilot" as Phase 1 MVP. Nick's Slack brief confirms this as the entry point. However, Discovery II focused heavily on the intake-to-package workflow (Phase 2). The proposal must clearly sequence these or the client will conflate them.

2. **Creative brief "from scratch" assumption corrected:** Nick initially listed "creative work always from scratch" as a problem. David pushed back: format is consistent, but objectives/language are new each time. The real problem is incomplete/vague input — not template absence. SAL should improve the input quality, not replace the brief format.

3. **SAL scope boundary:** Nick confirmed clearly that SAL does NOT create any product output (no executing campaigns, no generating final copy). SAL's output is: requirements gathered + clarified + market research suggestions + brief packaged into Monday.com. The creative execution remains human. This boundary must be explicit in the proposal.

4. **Dev team relationship:** Replacing the in-house build is politically sensitive. The proposal must frame this as freeing the dev team to do client-facing work (their actual priority), not as Supernal displacing them.

5. **Vertex build assessment is a gating question:** The Vision Deck explicitly names this as an open question. If the Vertex build is architecturally sound, there may be a case for building on top. If it's a dead end, starting fresh on Supernal's platform is the right call. This decision should precede or run parallel to the Shelly working session, not follow it.

6. **"David" identity not publicly confirmed:** Compass research notes "David" is not confirmed on Hooray's public team page. The developer/technologist inference is based on the existence of an in-house dev function. Verify the specific title directly. Email dmetze@hooray.agency confirmed.
