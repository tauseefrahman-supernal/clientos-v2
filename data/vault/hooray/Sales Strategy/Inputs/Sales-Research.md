# Sales Research — Hooray Agency
> Jack's 11-section sales research workflow. Public signals + deal context.
> For full 11-section Phase A research: see `Phase A/Inputs/Sales-Research.md`
> This file: condensed sales-team-facing version. Updated with Compass AI research (files 199, 200).

---

## 1. Company Overview
Hooray Agency — independent luxury-hospitality marketing agency. Founded 1993 as Hyperdisk; rebranded "Hooray Agency" February 2019. HQ: 1124 Main St., Suite A, Irvine, CA 92614. ~22–36 employees; ~$7.6M reported revenue (RocketReach — directional). Revenue per employee ~$210k–$345k — lean, senior-loaded team. Has proprietary AI visibility tool (Momentum AIQ, private-label of Meridian) and a pixel deanonymisation product (Catalyst). Actively building AI capability. One PGA resort pilot noted (no integrations, no scale achieved yet). Privately held and independent.

## 2. Leadership & Org Structure
Confirmed from public Hooray team page:
- **Steven Seghers** — Co-founder & CEO (confirmed). One of two economic decision-makers.
- **Randy Stuck** — Executive Vice President (confirmed). Runs operations and process; controls dev team and budget. In-house-build skeptic. Previously led account services and SEM for over a decade.
- **Shelly Weasel** — Senior Director of Operations (confirmed). Best public match for "Shelly" — operational gatekeeper. Owns the four critical SAL inputs (request category taxonomy, Monday board structure, escalation triggers, definition of a complete brief). Must be a co-designer, not recipient. MNDA must be signed before her working session.
- **Roger Burns** — VP Strategy / VP Digital Integration (confirmed). Internal champion, warm to Supernal.
- **David Metze** — Role not confirmed on public team page; email dmetze@hooray.agency confirmed. Internal champion / likely technologist. Drives AI/tech initiatives.
- **Katelyn Raman** — SVP Accounts & Strategy (confirmed). Likely match for "Caitlyn" — account team head; originated brief quality problem.
- _Note: Compass research flags RocketReach listing of "Nicholas Singer" as CEO — erroneous. Disregard. Seghers is confirmed CEO._

## 3. Business Model & Revenue
Agency retainer + project fees from hotel clients. Many clients are multi-property collections — one "account" = multiple properties, each generating its own monthly reporting. Emerging SaaS-adjacent product revenue via Momentum AIQ. No public revenue figures (directional: ~$7.6M). Agency pricing norms: $8k–$25k/month full-service retainers; $4k–$12k mid-market. Talent: AMs ~$80k/year; ADs ~$208k/year; billable rates $150–$224/hr (Promethean Research). Fully-loaded junior analyst: ~$5,800–$7,900/month.

## 4. Market & Competitors
- **Agentic Hospitality** (Louisville, KY) — ~12 months old, Google for Startups backed, one named client (The Houstonian Hotel). Solves the *hotel's* OTA recapture problem. Not Hooray's agency problem.
- **No direct competitor** identified building AI for hospitality agency internal workflows.
- **Active unnamed competitor** already in scope (produced "Requirements from Competitor" doc) — scoping a "Reporting Copilot" on the same stack. Real threat.
- **SaaS "good enough and cheaper" risk:** AgencyAnalytics ($179/mo, Smart Reports + Ask AI), Whatagraph IQ (~$200+/mo), Databox Genie ($399+/mo) — all ship AI narrative summaries. None does Trade Desk + Monday.com fusion; none does brief intake. Generic AI voice. This is the price-anchor objection to pre-empt.
- **Enterprise agentic:** NinjaCat (~$1.5k–$3k/mo, chained AI agents, 4–12 week onboarding, one reviewer "$60k+ for no value"), Improvado (~$3k–$10k/mo, built for 50+ client enterprise scale). These are the credible buy path — still no brief intake.
- **Custom-build analog:** n8n + LLM brief-classification for 60-person marketing-ops firm = $14k project + $900/mo, 74% manual-handling reduction — validates Supernal's ~$12k + $5k/mo pricing.
- Macro: Gartner 2025 — 39% of CMOs cutting agency budgets; 22% reduced reliance on external agencies due to GenAI. Tailwind for internal-efficiency tools.

## 5. Recent News / Signals
- Momentum AIQ launched ~Q1-Q2 2026; strong early results at hospitality conferences
- Internal chatbot effort stalled (OpenAI RAG → Vertex migration abandoned). Vertex build status unassessed.
- SAL Vision Deck (Jun 4) formalises agent name ("SAL: Creative Request Intelligence"), ROI model, competitive framing, and seven-step closing sequence
- Supernal spinning out of Infinity Group as largest hold co company — longevity signal for Randy/Steven
- 250-agency 2026 survey (agentic AI): agencies with eval-first delivery = 11× ROI; bottom quartile (no eval) = 0.7× (lost money). Hooray's Vertex build stalled for exactly this reason.

## 6. Tech Stack (Public Signals)
GA4 (100% of clients), Looker Studio (100%), Google Workspace (100%), Meta Ads (>50%), Google Ads (>50%), Monday.com (internal), Trade Desk (subset), Revenate/Sendine (some), HubSpot (some), Momentum AIQ (proprietary), Catalyst (proprietary), Google Vertex (partial internal build — status unknown).

## 7. Hiring Signals
Not actively hiring to solve brief/reporting problem. Attempted in-house build failed. Path = external partnership. Vision Deck ROI: $65K AE hire avoided in first growth cycle. Industry: most agency AI projects stall because eval infrastructure isn't budgeted — the resource Hooray's dev team lacks. Supernal supplies this.

## 8. Pain Points (Hypothesised)
1. **Reporting overhead:** 5–10 hrs/client/month (AgencyAnalytics, 7,000 agencies). ~30 accounts → ~150–300 hrs/month. At $150/hr opportunity value → $22k–$45k/month recoverable.
2. **Brief quality degradation:** 53% of agency briefs are complete but lack focus; 27% incomplete and inconsistent (Joanne Davis Consulting / Scan International, 293 C-level respondents, reported Ad Age). Industry-wide, structural problem.
3. **Scaling constraint:** growth = headcount without SAL (+30% accounts absorbable with SAL)
4. **Internal AI build credibility problem:** stalled chatbot; un-governed builds lose money (0.7× ROI); eval-first wins (11×)
5. **Data governance risk:** mixed client account ownership for ad platforms + unclear contract permissions for AI-assisted reporting
6. **Competitive pressure:** 39% of CMOs cutting agency budgets (Gartner 2025); agencies must prove ROI or lose clients

## 9. Supernal Angle
- Agency problem, not hotel problem — "Built for Hooray. Not for hotels." The market doesn't serve this.
- SAL: Creative Request Intelligence — an employee, not a chatbot. Live APIs, not static RAG.
- Build-on-spec + pay-over-time + Hooray keeps IP = the three keys to get over the wall
- Modular, continuously improved — directly addresses David's 60-day obsolescence concern
- **Eval-first delivery** = the named differentiator that killed Hooray's in-house build. Supernal ships with golden-dataset harness, blind QA tests, human-in-the-loop sign-off. This is what separates 11× from 0.7×.
- Pre-empt SaaS anchor: "AgencyAnalytics at $179/mo moves the data. It doesn't write the report, catch the anomaly, or recommend the next step. SAL removes the labor."
- **Four things no SaaS does:** (1) Trade Desk + Monday.com fusion; (2) hospitality-tuned narrative; (3) intake→classify→clarify→package; (4) Hooray-owned governance
- ROI summary: returns $141K/yr of account team time to strategic work; recovers $22k–$45k/month reporting capacity; +30% account capacity; $65K AE hire avoided; $5k/month < one mid-market client retainer

## 10. Talking Points for Discovery
- "Talk to your data. Release your account team from reporting." (phrase that landed June 1)
- "The market solves the hotel's problem. Hooray brought us an agency problem."
- "SAL is the vision; reporting is how we get in the door."
- "Natural attrition: new accounts onboard into SAL's workflow. Same team carries more." (Roger's own words, confirmed in Vision Deck)
- "SAL is an employee, not a conversation." — direct contrast with their stalled chatbot
- "AgencyAnalytics at $179/month doesn't remove the human hours. It just automates the data pull. We remove the hours."
- "The reason your Vertex build stalled is the same reason most agency AI projects fail — no eval harness. We build that first."
- Three paths: in-house stalled ($75k–$250k equivalent + ongoing dev opportunity cost), enterprise platform (NinjaCat/Improvado ~$36k–$120k+/year, no brief intake), custom with Supernal ($5k/mo + ~$12k project, owned, governed, accountable)

## 11. Open Questions to Validate
- How many hotel clients / reports per month? (Working estimate: ~30)
- What's current time-per-report for an AM?
- Which client contracts permit AI-assisted reporting?
- What is the actual AM/AD billing rate Hooray uses? (ROI model input — public estimate: $150–$224/hr)
- Has Steven Seghers had a formal briefing on the SAL concept (beyond pay-over-time framing)?
- Who is the competitor vendor who produced the requirements doc?
- How far along is the Google Vertex build? What was built, what was documented?
- What are the 3–4 internal developers currently working on?
- Is client data consolidated anywhere or entirely siloed per hotel Workspace/Revinate account?
- David Metze's exact title? (Not confirmed on public team page)
- Are any hotel client contracts already in place that explicitly permit or restrict AI-assisted reporting?
