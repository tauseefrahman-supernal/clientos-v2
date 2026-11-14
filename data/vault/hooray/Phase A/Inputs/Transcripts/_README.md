# Transcripts — Hooray Agency

> Raw call notes only. No synthesis. Synthesis lives in A2/A3.
> Two discovery calls on record: Apr 30 and May 11, 2026.

---

# Transcript — Discovery I (Apr 30, 2026)

> **Source files:** file_id 189 (main call, 11:58 EDT), file_id 192 (pre-call/reschedule, 10:59 EDT)
> **Participants:** David Metze (dmetze@hooray.agency), Nick Agresti (Supernal), Roger Burns (roger@hooray.agency)

## Pre-Call (10:59 EDT) — File 192

Short ~10-minute call. Meeting rescheduled because David did not see the original early start. Topics:
- Momentum AIQ: Hooray launched ~2 months prior via outsourcing. Strong early success. AI/AEO search visibility is the top topic at hospitality conferences.
- AI hallucinations: Roger flagged as ongoing concern requiring careful implementation.
- Creative AI: Hooray's creative director used AI to enhance website photos.
- Nick noted Supernal had used AI headshots on their own earlier site.
- Nick had previously worked on OpenAI hallucination training (A/B testing model outputs) at a prior company.
- Call ended by rescheduling to 9:00am Pacific / noon Eastern (45 minutes away).

## Main Call (11:58 EDT) — File 189

**Gemini summary:** AI partnership models; automating hospitality tasks; replacing client-facing roles with AI agents for scheduling; Supernal's proprietary orchestration platform; pod-based pricing; analysing job descriptions for technical feasibility.

### Key exchanges

**Identifying applications:**
David + Nick explored what Supernal could offer. Nick clarified: clients purchase an AI partner. Value comes from engineers building quickly from client's vision. Three engagement types: (1) advisory (unsure where to start), (2) ground-up for AI-native businesses, (3) collaboration to scope AI value in established companies.

**Replacing client-facing AMs with AI agents:**
David: Goal is replacing client-facing service people (account managers) with AI agents for scheduling, comms, campaign ideation. Envisioned agent that creates creative briefs + loads them into Monday.com, connecting to internal systems + client CRM (Revenate/Sendine) + Google Analytics + Meta.
Nick: "Very doable." Framed as reallocating human talent to uniquely valuable work.
Nick requested AM + Director job descriptions to build AI employee JD and assess feasibility.

**Platform and architecture:**
David: Previously attempted OpenAI's agent builder; considering Google Vertex.
Nick: Supernal uses **proprietary orchestration platform** — foundational, stable, modular, not locked to one tool. Contrasted with prototype builders (Vercel, Replit) lacking production stability.
David: Philosophy — build and deploy within 60 days; assume obsolete within a year.
Nick: Counter-philosophy — modular, continuous improvement; refine as tech advances rather than throw away.

**Requirements for success:**
Nick: (1) Internal technical partner like David. (2) Managing client expectations on cost and capabilities.

**Pricing / engagement model:**
Supernal is not a dev shop. Long-term AI partner model.
Pricing: scalable "pod structure" — ~$10k/month for a team of four + separate monthly maintenance per completed module ($500–$10,000).
David: Payback = replacing three employees.
Nick: Reframed as reimagining org structure + reallocating talent.
Roger: Cleaner approach = integrating tech with new accounts + natural attrition.

**Hospitality experience:**
Two hospitality clients: small boutique hotel (custom front desk agent) + restaurant group.
Custom solutions not replicable for resale — Supernal is long-term partner, not transactional vendor.

**Proof of performance concerns:**
Key stakeholders (Stephen, Randy, Shelly) will scrutinise for tangible evidence.
Nick proposed: 30-minute YouTube video (two client testimonials) + direct client reference phone call.

### Next Steps
- Roger sends AM + Director job descriptions
- Nick reviews JDs; prepares formal proposal with pricing
- Nick shares 30-minute YouTube video
- Nick studies agenticosity.com for agentic hospitality context

---

# Transcript — Discovery II (May 11, 2026)

> **Source files:** file_id 191 (full transcript + notes, 59,313 chars), file_id 190 (summary notes)
> **Participants:** David Metze, Nick Agresti, Roger Burns
> **Duration:** ~55 minutes

## Summary (Gemini)

Evaluated deploying AI employee "S" (SAL) to optimise agency workflows. Defined scope as agency-internal problem (not hotel-facing). Confirmed four responsibilities. Established data tier list. Agreed to build-on-spec / Hooray retains IP. Focus shifted to internal influencer buy-in strategy.

## Key exchanges

**Competitive landscape:**
> "Agentic hospitality in most of the market is tuned for solving a hotel's problem… the market more broadly is aimed at directly serving the hotel rather than agentic tech built for an agency problem." — Nick (00:01:07)

**The agency problem:**
> "60% more time on strategy — it changes the business frankly." — Nick (00:05:43)
Workflow problems: vague/incomplete client requests; AM time wasted on email back-and-forth; manual reporting; siloed chatbot.

**Four responsibilities confirmed:**
1. Intake — receive client request
2. Classify — categorise request type
3. Clarify — ask outstanding questions to complete the brief
4. Package — assemble brief → deliver to Monday.com for Shelly / traffic team

> "That's accurate." — David confirming the four responsibilities (00:10:57)

**Data tier list (David's explicit ranking):**
| Tier | Sources |
|---|---|
| Critical (~90%) | Google Analytics (GA4), Meta Ads |
| High priority | Google Workspace (all client knowledge — every client), Monday.com (internal + some shared client boards) |
| Medium | Looker Studio (every client), Google Ads (>50% clients) |
| Low | Revenate (CRM — email contacts only), Sendine (CRM) |
| Secondary | Momentum AIQ (AI visibility, private-label Meridian — potential API), Catalyst (pixel deanonymisation → feeds CRM) |
| Platform noted | Trade Desk (ad launch — may connect to banner classification workflow), HubSpot (some clients) |

> "SAL is not worth very much to us without Google Analytics and Meta Ads." — David (00:24:04)
> "Every single client uses Google Analytics and Looker Studio." — David (00:24:04)

**Full workflow walkthrough (David's example):**
1. Hotel marketing director: "I lost 3 pieces of group business for July, need to fill leisure gap."
2. SAL intakes → pulls GA4 (traffic/conversion history) → suggests campaign options (email, banner, social).
3. Director selects email → SAL checks Revenate for contact count (3,500 contacts).
4. Director asks about competitors → SAL searches web + Google Workspace → suggests golf/spa package.
5. Director approves → SAL drafts creative brief in Hooray's format with clarifying questions.
6. Once answered → SAL creates task in Monday.com for Shelly/traffic to assign.
7. Account director receives info as human oversight element.

> "S would not create any product. He would be requirements gathering + suggestions." — Nick (00:32:49)
> "S should be a matchmaker — connecting the client with a human freed up to provide high-level creative service." — Nick (00:36:32)

**Internal dev team overlap confirmed:**
Hooray has an internal dev team (reports to Randy Sto) that built an OpenAI/RAG chatbot, then stalled on a Vertex migration. Dev team perpetually pulled to client-facing fires.
> "This would replace what the efforts we're making right now." — David (00:41:19)

**Internal resistance + IP / build-on-spec:**
> "It would be considered a failure on our part to hire you. Randy and other team members are going to say, 'We can do this in house.'" — David (00:42:27)
> "Hooray retains IP of their processes. If the partnership dissolved, Hooray would receive the code." — Nick (00:44:25)
Build-on-spec / pay-over-time: confirmed as critical to getting over "the wall."

**Buy-in map:**
> "The way we're going to get through this is through internal influencers, not individual sessions. Layer in Steven Sagers — once he has buy-off, it'll trickle down." — Roger (00:51:38)
> "Shelly is not a champion for anything that's going to create more work for her." — David (00:49:25)
> "This was born from Caitlyn, who oversees the account team — 'we're getting bad information from clients.'" — David (00:49:25)

**Supernal longevity (addresses Randy's concern):**
> "We're currently the largest company in a hold co called Infinity Group and we're about to spin out and be completely independent." — Nick (00:47:26)

## Next Steps
- Nick: Connect Randy Sto with a Supernal client reference
- David + Roger: Internal strategy debate on stakeholder sequencing
- David: Speak with EVP Randy Sto
- David: Follow up with Nick next day on path forward
