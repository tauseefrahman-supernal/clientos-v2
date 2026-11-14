# Strat Playbook

> How a Supernal strategist runs an account week to week: what good and bad look like, the weekly health report and its fields, how to call health, the account hygiene checklist, the meeting cadence with the client and inside Supernal, and how capacity is counted. Stella uses this to draft the weekly report, check an account's hygiene, propose a health status with evidence, and keep the cadence on schedule. Refreshed 2026-11-13 from Notion.

## The job in one line

Scope, ship and drive adoption on the account. The strat owns what gets built and why, the client relationship and the account outcome, adoption of what ships, demos, and spotting expansion to hand to the AE/AM. The strat does not manage the mason's time, make architecture decisions, or run engineering process.

## What great looks like

- Account ownership: the client's outcome is your own.
- Discovery quality: enough context to take the bet and price it, no more.
- Opportunity identification: the best next bet on an effort / impact lens.
- Value quantification: a dollar or time number on every build.
- Build de-risking: steer the client off bad scope without them feeling steered.
- Builder fluency: use the right stack to make decisions visual and the mason's next iteration easy.
- Demo craft: visual and opinionated, with the open questions mapped so the client just decides.
- Communication range: adapt depth to who is in the room.
- PM instincts: milestones clear, feasible, ordered to deliver value fast.
- Mason partnership: clear on what and why, aligned on when and how much, never managing them.
- Dual horizon: the 3-month delivery plan (defense) and the 12-month account arc (offense) at once.
- Account hygiene: goals, health and next steps current enough that anyone can understand the account without asking.
- Playbook contribution: turn one account's lesson into something the next strat reuses.

## What failure looks like

Managing the mason. No clear milestones, just a vision and a deadline. No product opinions. Demos with no what, why or insight. Broad client questions because the problem was not thought through. No visual. No interface showing done, in progress, next. Client has no access to anything a month in. Builds ship with no usage. Health reported by vibe. Chasing a metric that does not reflect reality. Selling something not feasible. Scoping for one person instead of the department. Building without access to the end user.

## The weekly health report

Filed every week for every live account in Notion: AI Strategy Hub, "Weekly Account Health Reporting". The account page mirrors the newest report's Status, Next milestone and Exec asks. Status shows Overdue if the newest report is more than 13 days old. Reports are synced weekly into Account OS (`delivery_weekly_reports`) for the Pulse delivery dashboard.

How to file: duplicate last week's report or create a row, set Week of and Account, fill the selects first, then Honest read, Fires & Blockers and Exec asks, and set Status last.

### Fields

| Group | Field | Values / format |
|---|---|---|
| Relationship | C-suite access | Direct access, Limited, No access |
| | Weekly client meeting held | Yes, No, Bi-weekly, Cancelled till new OF closed |
| | Pod collaboration | Excellent, Good, Strained (strained means the account needs internal attention) |
| | Pod internal sync held | Yes, No |
| | Last business review | Date of the last MBR or QBR |
| Delivery | Delivery vs project plan | On track, At risk, Off track, Churn - Client Inability to Pay |
| | Delivered weekly commitments | Yes, Partially, No |
| | Next milestone | Next client-facing milestone in one sentence, with its date |
| | Last Week Progress | What shipped and moved, short bullets |
| Product and adoption | Usage score | 1 Inactive (no users), 2 Prompted (logs in when prompted), 3 Driven (core team uses it), 4 Proactive (client uses it proactively), 5 Embedded (client relies on it) |
| | Client excited | Yes, Partially, No |
| Commercial | Invoice overdue | Checkbox |
| | Tech defensible | Hardly, Partially, Very defensible. Re-assess monthly. |
| | Expansion opportunity in motion | Yes, Maybe, No |
| The read | Status | 🟢 Healthy, 🟡 At risk, 🔴 Critical (set by hand, set last) |
| | Honest read | Mandatory. What the client would say about us in private. |
| | Fires & Blockers | Up to three, each with its next step |
| | Exec asks | Named and dated, one line per ask |
| | Client quote of the week | Optional |
| | What we learned | Optional, one lesson for other pods |
| | Notes | Free text |

Writing rules from the delivery review standing context (Oct 2026): first names only, never surnames; every text field except Exec asks and the quote is short bullets starting with "• ".

## Health scoring

There is no numeric score. The 0 to 100 Account Health Score was retired on Sep 28, 2026. The strat makes the call; the select fields are the evidence.

Account OS health bands are Healthy, Watch (or At risk), Critical. They map one to one onto Notion's 🟢 Healthy, 🟡 At risk, 🔴 Critical.

- **Healthy:** delivery on plan, client engaged, nothing threatens the relationship or revenue. This is the default.
- **At risk / Watch:** a real threat with a path to recovery, for example a slipping milestone, weak adoption, lost access to the decision-maker, an overdue invoice.
- **Critical:** the account could be lost, or a client-facing commitment visibly broke. This is the exec team's call to action.

Rules of thumb:
- An overdue invoice alone is At risk, never Critical.
- No business review in over 100 days is At risk at best.
- No C-suite access, delivery Off track, or usage falling two weeks running is At risk at best.
- Any change from last week's status is explained in Honest read or Fires & Blockers.

Calibration rules (delivery review standing context, Oct 2026):
- Status follows client sentiment and delivery against the client's timeline, read from transcripts, email and Slack.
- Internal Linear dates and a few overdue internal tasks never move an account off green on their own.
- Rework on items the client is testing is normal motion: a watch item with owner and re-test date, not a slip.
- Internal or staging QA findings are not data exposure fires unless real client data reached a third party.
- Move off green only when the client is visibly unhappy, a client-facing date was missed, or the account could be lost.

## Account hygiene checklist

Every account page carries this checklist from the account template. Review monthly.

- [ ] Weekly client meeting scheduled and running
- [ ] Weekly internal pod sync scheduled and running
- [ ] Long-term AI-native strategy doc reviewed and approved
- [ ] Client has access to their AI-native roadmap
- [ ] Value creation metrics defined and tracked
- [ ] Usage and adoption metrics defined and tracked
- [ ] Project plan linked and current in ProjectOS
- [ ] QBR / MBR cadence agreed with the client
- [ ] Case study secured

Account setup fields (set at kickoff, review quarterly): contract signed and kickoff dates (first 90 days tagged 🌱), AI Strategist, Mason, Account Executive, ARR, Tier, Renewal date, Industry, AI Employees run for the client, Economic buyer, Vision, Limiting factor and how we solve it, links to Strategy doc, Project plan and Case study, Margin status (monthly).

Q4 2026 additions (from the goals page): a baseline and client-specific metrics, a monthly value presentation, a documented expansion plan with a trigger, and margin visible in the shared system. See Supernal-Goals.md.

## Cadence

### With the client

| Cadence (Account OS kind) | What | Owner |
|---|---|---|
| Weekly drumbeat | Weekly client meeting (working session or async update): milestones, demos, decisions. Project status shown through Pulse. | Strat |
| MBR | Monthly value review or milestone review (the Q4 goals call it "MOR style"). | Strat |
| QBR | Quarterly: progress, value delivered, next phase, renewal conversation, with an exec anchor. | Strat with AE |
| Milestone launch | Client-facing demo when an OF milestone lands (inferred from Account OS; Notion does not define it separately). | Strat and mason |
| Renewal | The term-end conversation, prepared well ahead (example: plan shared about 6 weeks before term end). | AE/AM with strat |

### Inside Supernal

| Ritual | When | Purpose and output |
|---|---|---|
| Pod internal sync | Weekly (daily on some tiers) | Blockers, milestones, context, questions. Logged as "Pod internal sync held". |
| Monday strat call | 30 min | Capacity and staffing changes, announcements, tactical demos. Everyone knows their week and who has capacity. |
| Thursday strat call | 30 min | Team building, client spotlight, demos, discussion board, product requests. Reusable learnings. |
| GTM Weekly | Tuesdays, 45 min, optional, Sales + Strats | Blockers (sales first), one AE's last 2 months of lead conversations, learnings, decisions and owners. Replaced the daily Tue to Fri GTM/Scoping call on Oct 27, 2026. |
| All-hands | Weekly, 1 h | At least one strat presents a client story that can become a case study. |
| Squad sync and monthly squad report | Weekly / monthly (squad accounts) | One sync and one report across all the squad's accounts; monthly leadership deep dive with the lead strat and lead mason. |
| Weekly and Monthly Service Operating Review (MOR) | Weekly / monthly | Scoping pipeline, delivery, portfolio health, capacity and hiring. |
| Board update | Quarterly | Learnings, offering, pipeline, delivery, portfolio health, capacity, service-market-fit metrics. |

Weekly cross-pod rule: every person joins at least one client-facing meeting and one internal meeting not tied to their own accounts or pod.

## Capacity and load

Staffing lives on the Notion "🔋 Capacity Steering" page (synced to Account OS `delivery_capacity_assignments`): one row per person per account, edited in place.

| Role | Load | Points |
|---|---|---|
| Mason | Full | 1.0 |
| Mason | Partial | 0.5 |
| Strat | Heavy | 0.5 |
| Strat | Medium | 0.25 |
| Strat | Light | 0.1 |

Around 1.0 per person is fully loaded; above is overloaded. When staffing changes, update the account's people fields and the Capacity row together.

Load targets: about 1 account per mason and about 3 per strat (Oct 2026: 7 strats, 19 masons). Q4 target: 3 to 4 accounts or $400K to $1M managed revenue per strat. Leverage (revenue managed / comp) is the pod and squad measure.

## Toolkit

| Use | Tool |
|---|---|
| Deals and milestones | Linear, Project OS (and Workbench "Delivery" shown in Pulse) |
| Templates, blueprints, process docs | Notion |
| Visual alignment and UX | Figma, Excalidraw |
| Working docs | Google Docs, Sheets |
| Building POCs and prototypes | Claude Code, Codex, Lovable, v0 |
| Slides | Gamma for speed; Claude Code + Google Slides for precision |
| Files, contracts, transcripts | Google Drive |
| Code collaboration with the mason | GitHub |
| System of record for accounts and deals | Account OS |

## How Stella helps each week (inferred)

1. Draft the weekly report from the week's transcripts, Slack and Linear, with every select backed by a cited fact, and propose a Status using the rules above.
2. Flag hygiene gaps from the checklist and the Q4 additions.
3. Check cadence: days since the last MBR/QBR, whether the weekly meeting and pod sync happened.
4. Surface expansion signals and draft the trigger for the expansion plan.
5. Check the strat's load against capacity points and the Q4 load target.

## Sources

- Notion: "Strat Playbook (Product Manager)" (Strats / Document Hub), last edited 2026-10-07.
- Notion: "How To Guide" (Strats / AI Strategy Hub), last edited 2026-09-28.
- Notion: "📈 Weekly Account Health Reporting" database schema (AI Strategy Hub), read 2026-11-13; parent page "Account Health Reporting", last edited 2026-11-02.
- Notion: "Delivery review: standing context" (AI Strategy Hub / Account Health Reporting), last edited 2026-10-09.
- Notion: "Veterans Home Care" account page (hygiene checklist as carried by the template), last edited 2026-09-03.
- Notion: "Pod Playbook", last edited 2026-09-09.
- Notion: "Squad Thesis", last edited 2026-09-09.
- Notion: "GTM/Scoping Process (Weekly, Tue)", last edited 2026-10-29; "GTM Weekly - Agenda (Tuesdays, 45 min)", last edited 2026-10-29.
- Notion: "Order Form / Proposal Review Checklist", last edited 2026-06-11 (sync rhythm).
- Notion: "Delivery and Scoping Reporting in Account OS (Pulse)" (Engineering / Document Hub), last edited 2026-10-20.
- Notion: "Q4 2026: Supernal Goals", last edited 2026-11-13.
- Account OS vocabulary (health bands, cadence kinds) as supplied in the task brief.
