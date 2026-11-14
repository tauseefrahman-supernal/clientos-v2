# Client Journey

> The path a client takes with Supernal today, from the first signal to renewal and expansion: the current stage names, who owns each stage, what moves the client forward, which documents get produced and where each one lives. Stella uses this to place any deal or account in the right stage, to name the next document and owner, and to spot a deal that is stuck or skipped a step. It replaces Client-Journey-Framework.md (Phase A / Phase B) and Deal-Room-Handoff.md; the "Deal Room" platform no longer exists. Refreshed 2026-11-13 from Notion and the Account OS vocabulary.

## The two halves

The journey has two halves, tracked as two different records:

1. **Opportunity (pre-signature).** A deal on the Account OS Pipeline board. Owned commercially by the AE, scoped by a strategist.
2. **Account (post-signature).** A client account in Account OS with a stage, weekly health, cadence and renewal date. Owned by a pod (strat, mason, AM) and often delivered inside a squad.

An existing account can carry new opportunities at the same time (expansion). A new problem area, function or entity means a new order form; a shift inside the same problem space does not.

## Roles

| Role | Owns |
|---|---|
| AE (Account Executive) | The commercial relationship, the lead, the pipeline record. Today AEs also act as AMs. |
| AM (Account Manager) | The relationship and account health. Currently the AE in practice. |
| Strategist (AI Strategist, "strat") | What gets built and why, the value case, milestones, demos, adoption, spotting expansion. Leads scoping on new deals. |
| Mason (also called FDE, forward deployed engineer) | How it gets built, technical quality, shipping on the milestone, flagging technical risk. |
| Pod | The client-facing unit: 1 strat, 1 mason, 1 AM, 1 account in its atomic form. Grows by adding masons on expansion. |
| Squad | The internal delivery unit: strats and masons who stay together across a set of accounts (minimum 2 strats and 2 masons, with a lead strat and lead mason). |
| Sign-off owners | Legal and commercial: Ryan and Johnny. Strat and technical: Seb and Thomas. Build: FDEs, Naveen and Thomas. Staffing: Seb and Naveen. |

What / why belongs to the strat, how belongs to the mason, when and how much is shared.

## Part 1: Opportunity stages

Account OS opportunity stages are: **Idea, Nurture, Concept Alignment, Prototype, Proposal, Order Form, Closed Won.** Notion's Opportunities board uses a finer list (Discovery, Concept alignment, Prototype, Proposal, OF drafted, OF sent, Client feedback, Signed, Lost, Parked). The mapping below is inferred.

| Account OS stage | Notion Opportunities stage(s) | Owner | What happens | Exit criteria (moves it on) | Documents | Where they live |
|---|---|---|---|---|---|---|
| Idea | (none; inferred: before Discovery) | AE | A signal: inbound lead, referral, or an expansion idea on an existing account. | Lead is understood well enough to ask a strat for help. | Lead notes, taxonomy (industry, business type, Mission 200 or not). | Account OS deal; Slack thread in #supernal-sow-scoping-requests. |
| Nurture | Discovery | AE, with a strat assigned | Discovery calls. Problems, needs, buying intent and tier gathered. A strat is assigned on the weekly GTM call. | Enough context to take the bet and price it. A named problem in the client's own words. | Discovery transcripts, deck, account strategy doc started. | Fathom/Granola/Drive; Notion Client Strategy database; Account OS deal. |
| Concept Alignment | Concept alignment | Strat | Align twice: internally on what we build, and with the client on the vision they are buying. Extract every problem, draw the circle around all of them, find the system that solves the set. | Agreed concept with the client. | Concept brief; account strategy doc (Client Strategy template). | Notion Client Strategy database; ClientOS (inferred: Stella drafts here). |
| Prototype | Prototype | Strat (mason supports) | Build a clickable HTML artifact, then optionally harden it into a real app behind a link. Lead with the client's #1 problem in their vocabulary, deep not wide, real not shiny. | Client sees their own problem solved and asks "could it also do X?". | Prototype artifact or app link. | links.getsupernal.ai or Railway; link stored on the Opportunity ("Prototype" field). |
| Proposal | Proposal | Strat writes, AE sells | Proposal states the problem, the metrics Supernal is accountable for, milestones (month 1 and month 3), sync rhythm, ownership model. All four gates must pass and all sign-offs complete before sending. | Client agrees to the scope and price. | Proposal (often HTML). | Drive or a hosted link; URL on the Opportunity ("Proposal" field). |
| Order Form | OF drafted, OF sent, Client feedback | Strat drafts, AE and legal close | Order form drafted from the template, reviewed against the checklist, sent, client feedback handled. | Signature. | Order form (OF-XXX), MSA if new client. | Drive; URL on the Opportunity ("Order form" field); Account OS deal. |
| Closed Won | Signed | AE hands to pod | Deal signed. Account created or updated with ARR, tier, renewal date, kickoff date, pod. | Kickoff scheduled within 2 weeks with named people. | Signed OF; account setup fields. | Account OS account; Notion Accounts page. |

Lost deals go to Lost; parked ones go to Parked in Notion and "Revisit later" as an Account OS account stage.

### Proposal, client approval, order form

Notion supports this order but does not spell out a formal client-approval step between proposal and order form:
- The Opportunities board runs Proposal, then OF drafted, then OF sent, then Client feedback, then Signed.
- "How to Build a Prototype" says Stage 1 ends with "write it up as the order form or proposal, and align the client on it".
- The Proposal Review Checklist covers both documents and forbids sending a proposal without all sign-offs.

Stella should treat it as: proposal agreed by the client (inferred approval step), then order form drafted, sent, revised on feedback, signed. On smaller deals the proposal and order form can be the same conversation.

### Proposal gates (all must pass before sending)

- Revenue: margin is viable, the account can be properly staffed.
- Strat: right problem, right sequence, right timelines.
- Build: right solution, right tool for the job.
- Staffing: named people, can kick off within 2 weeks.

## Part 2: Account stages

Account OS account stages: **Scoping, Discovery, First build, Expanding, Maintenance, Churned, Revisit later.** Definitions from the AI Strategy Hub How To Guide:

| Stage | Meaning | Owner | Moves on when |
|---|---|---|---|
| Scoping | New business being scoped, not yet signed. Carries an expected close date. Excluded from health reporting. | AE + strat | Signed: becomes Discovery or First build. |
| Discovery | Discovery-first deal (for example a Diagnostic): identifying and shaping the opportunity. | Strat | The first build is agreed and papered. |
| First build | Closed and building toward the first delivered build, onboarding included. | Pod | First build delivered and in use. |
| Expanding | First build delivered and in use, new builds in motion. | Pod, with AE/AM on commercial | New OF signed or the account settles into support. |
| Maintenance | Delivered builds are supported, no active new build. | Pod (lighter load) | New build starts (back to Expanding) or the engagement ends. |
| Churned | Engagement ended. | AM | Not applicable. |
| Revisit later | Lost or parked deals worth coming back to. Excluded from health reporting. | AE | Reopened as an opportunity. |

### Kickoff and the first 90 days (First build)

From the Kickoff Checklist (Month 1) and the order form rules:
- **Before kickoff.** Understand the full vision and roadmap. Confirm milestones from the proposal (break them down if missing). Confirm the mason/FDE and pull engineering risk flags. Confirm the time-to-value moment: what we demo, to whom, by when.
- **Week 1 kickoff.** Kickoff presentation re-anchors the 12-month vision, then focuses on month 1. Set the weekly call and the channel. Turn the systems table into an access checklist and request everything on day 1. Set up the project plan with the first milestone.
- **Weeks 1 to 2.** Build the simplest viable version. Show something in week 1 or 2. The client logs in and does something by week 2 (week 3 at the latest).
- **Weeks 2 to 4.** Draft the AI strategy doc and roadmap. Start scoping the next order form with real information. Update the systems table. Confirm or adjust month 2 to 3 milestones as partnership, not scope change.
- **End of month 1.** Everything live, at least one simple use case delivering value.
- **Months 2 to 3.** Ship weekly or biweekly. Final onboarding milestone (about month 3) closes against the KPIs set in Milestone 1.
- AI strategy doc timing: 3-month pilot, drafted month 2 and presented end of month 2; 12-month transformation, shared around end of month 1.

### Run, expand, renew

- Weekly: client meeting, internal pod sync, weekly health report (see Strat-Playbook.md).
- Monthly: value review with the client (MBR; the Q4 goals call it "MOR style"). Internally, the Monthly Service Operating Review (MOR).
- Quarterly: QBR covering progress, next phase and the renewal conversation, with an exec anchor.
- Expansion: each account needs a documented expansion plan with a trigger (date or metric). The strat spots expansion and hands it to the AE/AM, which opens a new opportunity at Idea or Concept Alignment.
- Renewal: contracts are 12 months with renewal at a set rate and an opt-out at 6 months (reducible to 3). Renewal plans should be shared well before term end (example from Q4 goals: VHC plan by Dec 15 for a January end).

## Cadence kinds (Account OS)

Weekly drumbeat, MBR, QBR, Milestone launch, Renewal. Notion's checklists use Weekly, Monthly (MBR or milestone review) and Quarterly (QBR). "Milestone launch" and "Renewal" as named cadence events come from Account OS; Notion does not define them separately (inferred: a milestone launch is the client-facing demo of a completed OF milestone, and a renewal is the QBR or meeting where the next term is agreed).

## Documents by stage and where they live

| Document | Stage | Owner | Lives in |
|---|---|---|---|
| Lead taxonomy, deck, transcripts | Idea, Nurture | AE | Slack scoping-request thread; Drive; Fathom/Granola |
| Account strategy doc (Client Strategy template) | Concept Alignment onward, kept current | Strat | Notion Strats / Client Strategy database; linked from the Notion account page |
| Prototype | Prototype | Strat | links.getsupernal.ai or Railway; link on the Opportunity |
| Proposal | Proposal | Strat | Drive or hosted HTML; link on the Opportunity |
| Order form (OF-XXX) and MSA | Order Form | Strat drafts, AE/legal sign | Drive; link on the Opportunity; template and checklist in Notion GTM & Scoping |
| Kickoff deck | First build, week 1 | Strat | Drive (Google Slides) |
| Project plan and milestones | First build onward | Strat writes milestones, mason ships | Linear (projects and milestones); Workbench "Delivery" (PMS) shown to the client in Pulse; ProjectOS link on the account |
| AI strategy doc / roadmap | Month 1 to 2 | Strat | Notion (AI Strategy Roadmap template); client access via Pulse or shared link |
| Weekly health report | Every week, live accounts | Strat | Notion AI Strategy Hub, Weekly Account Health Reporting; synced to Account OS delivery tables for Pulse |
| Weekly client update | Weekly | Strat | Client channel or email (Notion does not fix a format) |
| MBR / MOR value review | Monthly | Strat | Drive deck or Pulse walkthrough |
| QBR | Quarterly | Strat, with AE and an exec anchor | Drive deck |
| Expansion plan | By Oct 31 for every account, then kept current | Strat | Client Strategy doc section 10 (Relationship and expansion strategy) |
| Case study | When secured | Strat | Linked on the Notion account page |

Where each system fits:
- **Account OS:** the system of record for accounts, deals (Pipeline board), health, stakeholders, cadence, value and renewal plans. Also hosts scoping and delivery data for the Pulse dashboard.
- **Linear:** the GTM board for deals in scoping, and project milestones for delivery.
- **Notion:** playbooks, templates, the AI Strategy Hub (accounts, weekly health reports, opportunities, capacity), and client strategy docs.
- **Workbench and Pulse:** Workbench is the delivery backend (pods, AI employees, apps, vaults, repos, insights, delivery projects). Pulse is what the client sees.
- **ClientOS:** where Stella works. Inferred: Stella reads the account context, drafts strategy docs, proposals, order forms and reports, and writes them back to the systems above. Notion does not describe ClientOS's place in the journey.

## What changed from the old framework

- Phase A (A1 to A5) and Phase B (B1 to B5) are no longer the structure. The journey now follows Account OS opportunity and account stages.
- The Deal Room platform no longer exists. Deals live on the Account OS Pipeline board; the Notion Opportunities board and Linear GTM board are the working views.
- Gates now sit on the proposal (Revenue, Strat, Build, Staffing) and on the order form checklist, not on Clarity, Segmentation and Prerequisite.
- A prototype is a standard stage before the proposal.
- The daily Tue to Fri GTM/Scoping calls were replaced by one weekly Tuesday call (45 minutes) on Oct 27, 2026.

## Sources

- Notion: "Q4 2026: Supernal Goals", last edited 2026-11-13.
- Notion: "Strat Playbook (Product Manager)", last edited 2026-10-07.
- Notion: "Pod Playbook", last edited 2026-09-09.
- Notion: "Squad Thesis", last edited 2026-09-09.
- Notion: "How To Guide" (AI Strategy Hub), last edited 2026-09-28.
- Notion: "🎯 Opportunities" database schema (AI Strategy Hub / GTM & Scoping), read 2026-11-13.
- Notion: "How to Build a Prototype" (GTM & Scoping), last edited 2026-09-02.
- Notion: "Order Forms Playbook", last edited 2026-08-26; "How to Create an Order Form", last edited 2026-08-26.
- Notion: "Order Form / Proposal Review Checklist", last edited 2026-06-11.
- Notion: "Kickoff Checklist - Month 1", last edited 2026-06-12.
- Notion: "GTM/Scoping Process (Weekly, Tue)", last edited 2026-10-29; "GTM Weekly - Agenda (Tuesdays, 45 min)", last edited 2026-10-29.
- Notion: "AE ↔ Strat Playbook", last edited 2026-09-09.
- Notion: "Pricing & Offering: What we sell and how we price", last edited 2026-10-27.
- Notion: "Pulse for all clients", last edited 2026-09-09.
- Notion: "Delivery and Scoping Reporting in Account OS (Pulse)", last edited 2026-10-20.
- Account OS vocabulary (opportunity stages, account stages, health bands, cadence kinds) as supplied in the task brief.
