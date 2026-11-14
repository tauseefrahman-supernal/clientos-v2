# World Emblem: ClientOS context document

Written 13 Nov 2026. Depth: DEEP. Account OS account id `01M20ZRNWXHKB4Y57ZZ7JK9GE4`. Linear team WE (projects Leadership OS `P-WE-12`, FMDS OS `P-WE-11`).

How to read the sources: `(meeting title, date)` is a meeting note in `/Users/tauseef/ric-os/meetings/` or its Granola summary; `(vault: ...)` is a local RIC OS file; `(local: ...)` is another file on disk. Nothing here is a verbatim quote.

---

## 1. Snapshot

- **Who.** World Emblem International, a Toyota-style lean manufacturer of emblems, patches and badges: about $100M revenue, about 1,600 to 1,700 people in the US, Mexico, Dominican Republic and Canada, founder-CEO Randy Carr (Drive: Executive Readout: World Emblem International; Drive: 20261021_qbr).
- **What they bought.** A $10K advisory (May 2026), then two platform subscriptions: Leadership OS at $10K/month (AI employee "Chief", the AI CEO) and FMDS OS at $15K/month (AI employee "Patch"). Together $25K/month, $300K a year (Account OS; Drive: world-emblem-of-002-v1-signed.pdf; Drive: World_Emblem_-_Supernal_MSA.pdf).
- **Where it stands.** FMDS OS is live in Sales, Service, Marketing, IT and (since 12 Nov 2026) Customer Service and Order Entry; HR/ODG is built but short of ADP endpoints; Operations and Finance wait on a Business Central API (Check-In: World Emblem, 12 Nov 2026; Drive: World Emblem - Weekly review, 5 Nov). T3, the CEO's weekly KPI review, has run on Leadership OS since 21 Oct 2026 (Drive: World Emblem - Weekly review, 5 Nov).
- **Open deals.** OF #004 strategy retainer (up to $120K, verbally agreed by Carlos Mitchell on 11 Nov 2026, order form not yet signed) and SRR ($120K, concept alignment with Eric Freeman) (Account OS; AI-Native World Emblem: Scoping Next Phase, 11 Nov 2026).
- **The risk.** Adoption trails the build: 8-step completion is at its 19% baseline against a 60% target, activities are under-used, and two access gates (Business Central, ADP) sit on the client side (Drive: 20261021_qbr; Linear).
- **Pod.** Account manager Nick, strategist Tauseef, forward-deployed engineer Ricardo (Account OS). Dominik is the strategist on OF #004 (Account OS).
- **Health.** 4.0 of 5, band Healthy, for the week of 2 to 8 Nov 2026: Tech 3, Strategic Defensibility 4, Exec Engagement 5, GM 4, Build 4. The week of 9 Nov was not yet recorded. Renewal risk: Low, "Healthy partnership" (Account OS).

---

## 2. Structure of this account

### The chain, in one paragraph

A client-services scoping thread with the COO (April 2026) led to an introduction to the CEO. The CEO bought a 60-day **advisory** ("AI CEO"). Two weeks into the advisory a prototype built from his own files led to the first platform order form, **Leadership OS**, for the executive layer. While building Leadership OS on the client's spreadsheets, the team mapped the KPI cascade underneath, found errors in it, and that analysis led to the second platform order form, **FMDS OS**, for the department layer. The two platforms share one data foundation ("the Vault"): FMDS OS produces the numbers at levels L1 and L2; Leadership OS reads them at L3 and adds the CEO's agent. Marketing was scoped as a third line and lost when the new Director of AI redirected strategy. What replaced it is a **strategy retainer** with the Director of AI (OF #004), and a people-development extension, **SRR**, with the head of organisational development.

### Entities

| Entity | What it is | Source |
|---|---|---|
| World Emblem International, Inc. | The contracting client. Brands also named in contracts: Custom Genie, Hero's Pride | (Drive: world-emblem-of-004-v2-draft.docx) |
| Infinity Constellation Inc. d/b/a Supernal | The contracting supplier | (Drive: world-emblem-of-002-v1-signed.pdf) |
| MSA 1 | Effective 5 May 2026, signed by Randy Carr (4 May) and Eric Kravitz (5 May). New York law | (Drive: World Emblem International, Inc. + Supernal document.pdf) |
| MSA 2 | Dated 22 Jul 2026, signed by Scott Downes and Phil Jarvis (CIO). Requires $5M cyber and $2M general liability cover. OF #004 cites this one | (Drive: World_Emblem_-_Supernal_MSA.pdf) |
| Amendment No. 1 | Signed 3 Sep 2026, retroactive to 22 Jul 2026. Adds a month-6 exit and a Milestone 6 termination right to the FMDS form | (Drive: Amendment_No1_World_Emblem_FINAL.pdf) |

### Order forms

**Numbering conflict, read this first.** The signed papers number the advisory as Order Form #1, Leadership OS as OF-002 and FMDS OS as OF-003 (Drive: the three signed PDFs). The brief for this document, and a Linear milestone ("OF-001 §3 pod model"), call Leadership OS OF-001 (Linear). The Executive Readout also calls the 28 May form "Order Form #1" (Drive: Executive Readout). The 2 Jul 2026 FMDS draft was labelled "OF-002" and July notes call FMDS "OF2" (local: world-emblem-artifact-audit.html). This document uses the signed numbering and says "Leadership OS form" or "FMDS form" where it matters.

| # (signed) | Name | Product | AI employee | Buyer / signer | Scope in one line |
|---|---|---|---|---|---|
| OF #1 | AI Consultation, 60-day advisory | none (no build) | none | Randy Carr | 6 to 8 discovery sessions, a Build Roadmap and an Executive Readout |
| OF-002 | Leadership OS | Leadership OS | Chief (AI CEO); AI COO planned | Randy Carr | AI-native operating environment for the CEO and COO functions; 29 deliverables in four tracks |
| OF-003 | FMDS OS | FMDS OS | Patch (first called Mark) | Phil Jarvis | KPI cascade, boards per department, 8-step, standard work, Hoshin; Phase 1 of 12 weeks then Phase 2 |
| OF #004 | AI-Native Organizational Strategy Retainer | none (no build) | none | Carlos Mitchell | Workflow mapping across all departments, AI-native roadmap, infrastructure assessment, weekly session |
| (not yet numbered) | SRR | extension of both platforms | to be defined | Eric Freeman | Self Reliance Ratio: coaching, leader standard work, year-end reviews |

(Drive: signed PDFs and OF-004 drafts; World Emblem | Strat Sync, 6 Oct 2026; Weekly AI Dept Meeting, 9 Nov 2026)

### How the two products connect

- **Levels.** L1 is the individual (rep, operator), L2 the team or department board, L3 the executive board. The client has about 10 people at L3, about 50 at L2 and the rest at L1 (Notion: World Emblem Strategy).
- **FMDS OS** owns L1 and L2: boards, targets, reasons and activities on red KPIs, 8-step problem solving, standard work. Hoshin plans are executed here (Hoshin Plan in FMDS, 4 Nov 2026).
- **Leadership OS** owns L3: the T3 review in presentation mode, commitments, leader standard work, org chart, and the CEO's agent. Hoshin plans are created here (Hoshin planning system setup, 27 Oct 2026).
- **One data layer.** Both read the Vault (Supabase, row-level security); one login opens both apps (Linear; Slack #acnt-world-emblem-internal, 23 Oct 2026).
- **The decision to keep them separate but joined** was made on 4 Jun 2026 (World Emblem <> Supernal: Advisory, 4 Jun 2026).

### The nine departments

Sources say "9" and "6+ of 8" in different places. The working list from Linear and the QBR deck: Sales, Service, Marketing, Operations, HR, ODG, IT, Logistics, Finance. Quality and Customer Service / Order Entry appear as extra boards (Linear; Drive: 20261021_qbr; CS/OE Review, 10 Nov 2026). (list inferred from those sources)

### Every deal

| Title | Value | MRR | Stage / status | Dates |
|---|---|---|---|---|
| WE: AI CEO Project (Advisory) | $10,000 | $0 (one-time) | Closed Won | Closed 5 May 2026 |
| World Emblem: Leadership OS (Post-Advisory) | $120,000 | $10,000 | Closed Won, active | Closed 28 May 2026 |
| World Emblem: FMDS OS (Expansion) | $180,000 | $15,000 | Closed Won, active | Closed 22 Jul 2026 |
| OF4 AI Marketing Strategy | $36,000 | none | Nurture, Lost (no decision) | Lost 14 Oct 2026 |
| OF5 AI-Native Marketing | $180,000 | none | Nurture, Lost (no decision) | Lost 14 Oct 2026 |
| OF #004 AI-Native Organizational Strategy Retainer | $120,000 (max; min $75,000) | not set | Order Form, open | Expected close 16 Nov 2026 |
| SRR | $120,000 | not set | Concept Alignment, open | Expected close 18 Dec 2026 |

(Account OS). Loss reason on both marketing deals: the Director of AI redirected company strategy away from AI-native marketing to general projects across the business (Account OS).

---

## 3. Arc

Meeting counts are approximate, by title match with Fathom duplicates removed. The local index holds 227 WE meetings in total (vault: brains/context/world-emblem.md); the per-month counts below sum higher because they include internal syncs.

### Q2 2026 (before the last six months, summarised)

**April 2026 (2 meetings, Drive notes only).** Nick Agresti met Jim Kozel, the COO, on 6 Apr. Jim had taken over client services on 1 Mar and called it archaic. Scope was client services only (Drive: Supernal x World Emblem: Discovery I). A 9 Apr discovery is referenced but no record was found.

### May 2026 (about 15 meetings)

- 1 May: Nick showed Jim an analysis of client-services inquiry data (Drive: Discovery III).
- 5 May: MSA effective; 60-day "AI CEO" advisory closed at $10K (Account OS; Weekly Pipeline Review, 6 May 2026).
- 13 to 14 May: AI Client Services order form drafted and presented to Jim Kozel, Phil Jarvis and Will Schwartz (WE: AI Client Services Proposal Review I, 13 May 2026; Drive: Proposal notes).
- 14 May: AI CEO Discovery with Randy Carr and Gabriella Diorico (World Emblem: AI CEO Discovery, 14 May 2026).
- 21 May: first Leadership OS prototype shown; Randy said he was doubling the budget (World Emblem <> Supernal: Advisory, 21 May 2026).
- 22 to 27 May: internal pricing; $15K/month cut to $10K/month (Order Form Review, 26 May 2026; Randy AI CEO platform pricing, 27 May 2026).
- 28 May: Leadership OS form signed, $10K/month for 12 months (Drive: world-emblem-of-002-v1-signed.pdf).

### June 2026 (about 31 meetings)

- 2, 3, 9 Jun: FMDS walkthroughs with Eric Freeman's team; Eric agreed the order FMDS, then SRR, then HR (AI through FMDS, 2 Jun 2026; Drive: FMDS, SRR, HR w/ Eric F; AI through FMDS follow-up, 9 Jun 2026).
- 4 Jun: Leadership OS kickoff; client-services AI deferred by the client (Advisory, 4 Jun 2026; Next Steps AI CS, 4 Jun 2026).
- 11 Jun: first live demo on real data; Randy named Carlos Mitchell Head of AI (Advisory, 11 Jun 2026).
- 18 Jun: Executive Readout; Atlanta plant visit 18 to 19 Jun (Advisory, 18 Jun 2026).
- 23 to 25 Jun: SharePoint map; HR/ODG and marketing deep dives; formula errors found (Advisory, 23 Jun 2026; AI through FMDS follow-up, 24 Jun 2026).

### July 2026 (about 28 meetings)

- 2 Jul: the missing-revenue finding shown to Randy; he said the spreadsheets must go (Advisory, 2 Jul 2026).
- 9 Jul: FMDS OS prototype shown; Randy approved $180K on the call (Advisory, 9 Jul 2026).
- 13 Jul: Leadership OS logins sent to Randy and Carlos (WE Sync Weekly Planning, 13 Jul 2026).
- 22 Jul: FMDS form signed by Phil Jarvis; team had started about 14 Jul (Drive: World_Emblem_-_Supernal_MSA.pdf; local: world-emblem-artifact-audit.html).
- 23 Jul: Randy's agentic-marketing memo read internally as a de facto RFP worth $200K+ (Randy's Marketing Memo and What It Tells Us, 23 Jul 2026).
- 30 Jul: 57 KPIs live end to end; Randy set 1 Jan 2027 as the hard date for the full Hoshin system (Supernal Weekly Update, 30 Jul 2026).

### August 2026 (about 39 meetings, 19 client-facing)

- 4 Aug: soft launch with Tony Morando and JC Carr; follow-ups on 10 and 13 Aug were slow (FMDS Onboarding Sales/Service, 4 Aug 2026; FMDS Onboarding Part 2, 10 Aug 2026).
- 6 to 18 Aug: revenue source argued three ways; posted and incoming revenue found to be two correct stages (Supernal Weekly Update, 6 Aug 2026; BC Revenue Mapping, 18 Aug 2026).
- 11 to 12 Aug: Eric trained the team on 8-step and standard work (FMDS 8-Step & Standard Work, 12 Aug 2026).
- 14 Aug: Randy put FMDS first and let the AI CEO slip to November (Supernal Weekly Update, 14 Aug 2026).
- 27 Aug: 8-step and Patch live in production (Supernal Weekly Update, 27 Aug 2026).
- 28 Aug: 24 sales and service staff onboarded (FMDS Onboarding Supernal, 28 Aug 2026).
- 28 and 31 Aug: marketing scoping; $3K/month strategy retainer pitched (AI-Native Marketing Scoping II, 31 Aug 2026).
- Relationship high: Nick called it his most confident delivery (WE Sync: Weekly Planning, 17 Aug 2026).

### September 2026 (about 59 meetings, 28 client-facing)

- 3 Sep: Amendment No. 1 signed (Drive: Amendment_No1_World_Emblem_FINAL.pdf).
- 9 to 10 Sep: Leadership OS shown in a T3; Randy flagged the revenue number, then used the redesign himself and committed to 30 minutes a day (Check-In, 9 Sep 2026; Supernal Weekly Update, 10 Sep 2026).
- 14 to 16 Sep: Carlos cooled on marketing and questioned code quality; internal decision to stop pitching (WE Internal Bi-Weekly Sync, 16 Sep 2026).
- 18 Sep: revenue discrepancy traced to a client-side roll-up formula and fixed live (Supernal Dashboard Troubleshooting, 18 Sep 2026).
- 23 Sep: Carlos's team took on a Business Central REST API; the same day's T3 showed WE about $500K short for September and reforecasting Q4 down (Business Central & FMDS OS Integration, 23 Sep 2026; T3, 23 Sep 2026).
- 24 Sep: feedback session with Eric and Alison (World Emblem / Supernal: Discussion & Feedback, 24 Sep 2026).
- 28 Sep: success criteria and Q4 structure agreed internally (WE Sync: Weekly Planning, 28 Sep 2026).
- Health dropped to At risk for the weeks of 28 Sep and 5 Oct (Notion: Weekly Account Health Reporting).

### October 2026 (about 59 meetings)

- 5 Oct: offsite debrief; Carlos's AI plan approved; project yellow; an email privacy flaw found in the AI CEO (WE strategy update | WE offsite, 5 Oct 2026; WE Sync: Weekly Planning, 5 Oct 2026).
- 8 Oct: Carlos named Supernal sole AI partner for 2027, phased (Supernal Weekly Touchpoint, 8 Oct 2026).
- 9 to 15 Oct: department discovery sessions (IT, Operations, Finance, Marketing).
- 14 Oct: both marketing deals marked lost (Account OS).
- 21 Oct: first T3 run on Leadership OS; IT and Marketing boards live that week (WE Sync: Weekly Planning, 26 Oct 2026).
- 22 Oct: Randy tied reviews and bonuses to system use (Supernal Weekly Update, 22 Oct 2026).
- 26 Oct: Saad's last day announced as 20 Nov 2026 (WE Sync: Weekly Planning, 26 Oct 2026).
- 29 Oct: QBR (Quarterly Business Review, 29 Oct 2026).

### November 2026 to 13 Nov (about 34 meetings)

- 2 to 3 Nov: ADP connected with about 65 HR/ODG KPIs from source; Marketing board live (Drive: World Emblem - Weekly review, 5 Nov).
- 5 Nov: help centre live in English and Spanish; activity approval queue removed (Supernal Weekly Update, 5 Nov 2026).
- 10 Nov: Toyota benchmark session with David Heslop (Toyota FMDS Review, 10 Nov 2026).
- 11 Nov: Carlos verbally agreed the strategy retainer; squad "Polaris" formed (AI-Native World Emblem: Scoping Next Phase, 11 Nov 2026; Squad 2 Kickoff, 11 Nov 2026).
- 12 Nov: Customer Service and Order Entry boards in production (Check-In, 12 Nov 2026).
- 13 Nov: Power BI incoming-revenue outage (WE-288) affecting boards (Slack #acnt-world-emblem-internal, 13 Nov 2026).

---

## 4. Why they bought

The short version in earlier notes ("a prototype built in one day") is true for one step and wrong as the whole story. There were three purchases, each with several causes, and the analysis done during the advisory is what made the third one possible.

### 4.1 The advisory ($10K, 5 May 2026)

- **A door already open.** Nick had been scoping AI client services with the COO since 6 Apr, and an MSA was in hand, so order forms could attach fast (Drive: Discovery I; Delivery Planning Weekly, 18 May 2026).
- **The pitch that travelled.** Nick's framing was to rebuild functions as if AI had always existed. Randy applied it to client services and about a week later asked for an "AI CEO" (World Emblem Context, 27 May 2026).
- **A buyer who spends on technology.** Randy puts about 10% of revenue into tech and had paid about $1M the prior year to another vendor, Very Big Things (Weekly Pipeline Review, 6 May 2026).
- **Low risk to start.** Fixed $10K, 60 days, with a conversion credit ($5K at $100K of build, $10K at $200K) (Drive: MSA 1 + Order Form #1).

### 4.2 Leadership OS ($120K, 28 May 2026)

What happened, in order:

1. **Reading his variables (14 May).** In discovery Randy described his meeting cadence (daily huddles, weekly T3, monthly reviews), an Excel KPI system cascading through four levels, a hand-kept commitments list, and his own Claude Cowork practice. He wanted 80 to 85% of his time back and not to have to ask twice. He did not want the spreadsheet replaced; he wanted it made AI-native. He also asked for an early standalone order form instead of one proposal at day 60 (World Emblem: AI CEO Discovery, 14 May 2026).
2. **Pulling his material (15 to 20 May).** Gabriella sent the org chart, two T3 transcripts, one-year and three-year objectives, the meeting-system template and two recordings (Advisory, 21 May 2026).
3. **Showing his system back to him (21 May).** Tauseef demoed a directional Leadership OS prototype built in about a day from those files. Randy said he was doubling the budget and could see it replacing his whole FMDS system. He reframed the ask as platform first, role labels second, and offered the introduction to Eric Freeman (Advisory, 21 May 2026).
4. **Pricing it plainly (22 to 28 May).** Internal view moved from $15K/month to $10K/month; the form listed deliverables plainly and promised value within 30 days, felt by 90 (Order Form Review, 26 May 2026; local: 28 May notes).
5. **Sign (28 May).** Nick clicked through the prototype against the order form. Randy said to treat it as signed and not slow down (local: 28 May notes).

The causes, as the team and the client stated them:

- His pain was specific and daily: about 15% of his time on KPI work, chasing reds, a 300-line commitments sheet about three-quarters not done (AI CEO Discovery, 14 May 2026; Drive: Executive Readout).
- The prototype used his own terms and data within 24 hours of receiving files (Advisory, 21 May 2026).
- Tauseef's own read at the time: Randy was excited because Supernal reconciled what he said with what his data showed (Sync: Consulting Process, 29 May 2026).
- It was a prototype, not a proposal (Tauseef/Seb, 29 May 2026).
- Randy's own return: freeing about three people from spreadsheet work (local: 28 May notes).

**Honest limit.** No written "pattern" deck shown to Randy before 28 May was found. The pre-sale evidence for Leadership OS is the prototype and the verbal read-back. The heavy analysis came next, and it won the second deal.

### 4.3 FMDS OS ($180K, 22 Jul 2026): the analysis period

This is the part the thin summary misses. Between 1 Jun and 9 Jul the team worked through the client's operating system sheet by sheet.

**What was analysed**

- The FMDS library: CEO DASHBOARD 26, department FMDS workbooks (Sales 32 sheets, Service 40 sheets), Hoshin Objectives, the 8-step tracker, bowlers (local: WE_MASTER_REPORT.md).
- OneDrive material after the second call: CEO dashboard, KPI sheets, Executive Ocean Activities, leader standard work (Sync WE, 1 Jun 2026).
- Scale: 17 main executive KPIs, about 27 in ODG, about 90 in Operations, three levels (Sync WE, 17 Jun 2026; local: WE_KPI_Cascade_Map.md).
- SharePoint: 52 sites, 15,000 folders, 76,000 files, about 140GB (Advisory, 23 Jun 2026).
- The people who run it: walkthroughs with Eric Freeman, Javier Lopez, Veronica Moreno, JC Carr, Tony Morando, Jim Kozel and Carlos Mitchell (AI through FMDS series, 2 Jun to 2 Jul 2026).

**The pattern presented**

- The operating model is strong and the data layer under it is not. Board adoption runs about 93 to 95% while 8-step use is about 19% (local: WE_AI_OPPORTUNITY_ASSESSMENT_AND_ROADMAP.md; Advisory, 18 Jun 2026).
- Executive boards are split by location; L2 and below by factor. Departments use three different roll-up mechanisms. Parent-child links exist only as scattered formulas (AI through FMDS follow-up, 9 Jun 2026; local: WE_KPI_Cascade_Map.md; Sync WE, 16 Jun 2026).
- Two people at about $100K a year do nothing but maintain the linked sheets; HubSpot deals are re-keyed by hand (Advisory, 23 Jun 2026; AI through FMDS, 2 Jun 2026).
- Rep tracking data in sales was flawed enough to flip top and bottom performers (AI through FMDS follow-up, 18 Jun 2026).
- Department readiness was ranked: HR/ODG and IT high, Operations medium, Sales/Service low (Advisory, 18 Jun 2026).

**The errors found in the CEO's own numbers**

- DART was averaging TRIR columns; Canada TRIR was double-counted; time-to-fill direct and indirect were inverted (AI through FMDS follow-up, 24 Jun 2026).
- One team's revenue had dropped out of the roll-up, so the board read about $624K against $1.8M to $2M a week (AI through FMDS follow-up, 2 Jul 2026).
- Mexico on-time performance read 87% and 91% for the same week in two places (Operations KPI mapping, 6 Jul 2026).

**What was shown, and what was said**

| Date | Shown | Reaction |
|---|---|---|
| 4 Jun 2026 | Shared-data architecture; early KPI dashboard from real sheets | Randy: build towards making him redundant, do not "fix sales"; coordinate with Phil on WE's own data lake (Advisory, 4 Jun 2026) |
| 11 Jun 2026 | Hoshin/KPI flowchart, KPI Cascade Monitor, Hoshin Tracker, AI CEO chat on real data | Randy confirmed the model, admitted the data was not fit for current scale, named Carlos Head of AI, floated selling the system to others (Advisory, 11 Jun 2026) |
| 18 Jun 2026 | Executive Readout: SWOT, readiness, parent-child mapping, demo | Randy warned the team would be crushed on data; decision to hire a full-time data architect (Advisory, 18 Jun 2026) |
| 23 Jun 2026 | Claude-built SharePoint map | Impressed Randy and Carlos; advisory discovery folded into FMDS scope; department heads to approve their own maps (Advisory, 23 Jun 2026) |
| 2 Jul 2026 | The missing-revenue finding, then the Hermes AI CEO with memory | Randy: the spreadsheets must go; endorsed Hermes over custom code; called the AI CEO his succession plan (Advisory, 2 Jul 2026) |
| 9 Jul 2026 | Voice AI CEO; FMDS OS prototype with 8-step, boards, accountability loop, six-month plan | Randy confirmed $180K and approved on the call, asking for more speed (Advisory, 9 Jul 2026) |

**The causes of the FMDS purchase**

1. Randy asked for it himself on 21 May, before anything was scoped (Advisory, 21 May 2026).
2. Eric Freeman became a champion after the June sessions; the diagrams of his business were what he fixed on (Sync Johnny/Tauseef, 2 Jul 2026).
3. The team planned to earn FMDS by showing Leadership OS value on the existing sheets (Leadership OS and FMDS architecture pre-call, 4 Jun 2026).
4. The analysis found errors on the CEO's own dashboard and put a cost on the manual work; the 2 Jul meeting was sequenced findings first (Sync WE Strategy, 30 Jun 2026; Advisory, 2 Jul 2026).
5. The 9 Jul prototype showed the 8-step workflow and the accountability loop, not only dashboards (Advisory, 9 Jul 2026).
6. The order form carried milestones and a six-month exit, answering Phil Jarvis's criticism of the first form (Advisory, 9 Jul 2026; Sync WE Strategy, 30 Jun 2026).

### 4.4 Alternatives the client had

- Randy's own Claude Cowork and Obsidian practice (AI CEO Discovery, 14 May 2026).
- Excel plus Power BI, the status quo (AI through FMDS, 2 Jun 2026).
- Rhythm, a tracking vendor that could not embed 8-step or people development, turned away a second time (Impromptu Teams meeting, 16 Jul 2026).
- Very Big Things, the incumbent vendor; painful on HR by Eric's account (Drive: FMDS, SRR, HR w/ Eric F).
- HubSpot's native AI chat, for client services (Proposal Review I, 13 May 2026).
- Internal builds: a developer's Claude tool for standard-work conflicts, Carlos's own Hermes marketing agent, WE's data lake (Advisory, 18 Jun 2026; Marketing Deep Dive, 25 Jun 2026).
- Two other AI vendors still engaged, managed by Carlos; Randy runs three parallel AI-vendor workstreams (Sync Johnny/Tauseef, 2 Jul 2026; Slack #acnt-world-emblem-internal, 10 Sep 2026).

### 4.5 Objections raised

- Randy felt he signed the first form too fast; Phil called it one-sided and vague and asked for milestones and dates (Sync WE Strategy, 30 Jun 2026).
- Carlos privately doubted FMDS was the best use of resources and asked whether making FMDS the source of truth bakes in manual error (Sync WE Strategy, 30 Jun 2026; Advisory, 2 Jul 2026).
- Phil was wary of adding vendors mid-transition (Order Form Review, 26 May 2026).
- Token cost (Advisory, 2 Jul 2026).
- Randy found the accountability loop sensitive and referred it to Eric (Advisory, 9 Jul 2026).

### 4.6 What unlocked each later deal

- **Marketing (lost).** Randy's 21 Jul memo decided to build marketing with 10 people plus agent fleets, and kept Supernal "held to its current contract" (Drive: Marketing Leadership Memo; Drive: Agentic Marketing Org - Decision Log). Supernal pitched a $3K/month strategy form on 31 Aug. Carlos pushed back in mid-September and wants to own the build internally (Slack #acnt-world-emblem-internal, 16 to 17 Sep 2026).
- **OF #004 (open).** The same form was widened from marketing to the whole organisation. What unlocked it: the QBR, where Randy told Carlos that Supernal's job was to help him meet his department goals (Account OS health note, week of 26 Oct 2026); Carlos asking Supernal into operations and finance (Catchup: Dominik and Tauseef, 26 Oct 2026); and Carlos approaching Nick after his marketing head was let go (Deal Desk, 10 Nov 2026).
- **SRR (open).** In the plan since 3 Jun 2026 (FMDS, then SRR, then HR). Randy raised it himself on 4 Nov 2026 and wants staff to see standing, ranking and bonus status in real time (Slack #acnt-world-emblem-internal, 5 Nov 2026; Quarterly Business Review, 29 Oct 2026).

---

## 5. Commercials

### Pricing model

Flat monthly subscription per platform, pod staffed at Supernal's discretion, 12-month terms, invoiced monthly in advance, net 30 (Drive: signed order forms). An earlier points model was dropped on 27 May 2026 (Randy AI CEO platform pricing, 27 May 2026).

### Signed terms

| Form | Fee | Term | Exit | Ownership | Other |
|---|---|---|---|---|---|
| OF #1 advisory | $10,000 fixed, due on execution | 60 days | No convenience termination | n/a | Conversion credit: $10K at $200K of build fees, $5K at $100K, within 12 months |
| OF-002 Leadership OS | $10,000/month, $120,000 | 12 months from 28 May 2026 | Material breach only; renewal by written agreement | No IP clause of its own | 29 deliverables are "a target, not a commitment"; 1% monthly interest |
| OF-003 FMDS OS | $15,000/month, $180,000 | 12 months from 22 Jul 2026 | After Amendment 1: either party may exit at end of month 6 on 30 days' notice; WE may exit if Milestone 6 fails two redelivery cycles | Client owns codebase, data and pipelines; Supernal keeps background IP, licensed perpetually | Six Phase 1 milestones; free migration sprint on termination; 0.5% monthly interest |

(Drive: World Emblem International, Inc. + Supernal document.pdf; world-emblem-of-002-v1-signed.pdf; World_Emblem_-_Supernal_MSA.pdf; Amendment_No1_World_Emblem_FINAL.pdf)

### Renewal dates (derived from the signed terms; inferred)

- Leadership OS term ends about 27 May 2027.
- FMDS OS term ends about 21 Jul 2027; the month-6 exit window falls about 22 Jan 2027, with WE's notice due at the later of end of month 5 (about 22 Dec 2026) or 30 days after it accepts Milestone 6.
- Account OS has no renewal plan recorded; renewal risk is Low (Account OS).

### Every price discussed

| Date | Item | Price | Source |
|---|---|---|---|
| 13 to 14 May 2026 | AI Client Services | About $100K draft; tiers $5K, $10K, $15K/month; presented as $10K/month pod with $5K upkeep | (Proposal Review I, 13 May 2026; Drive: Proposal notes) |
| 22 May 2026 | Leadership OS, Nick's view | $15K/month, about $180K, possibly a $200K headline | (Nick and Tauseef: WE, 22 May 2026) |
| 26 to 27 May 2026 | Leadership OS, internal | Hold at $15K vs lean to $10K; about $120K for about $50K of build with a $5K/month cushion | (Order Form Review, 26 May 2026; Randy AI CEO platform pricing, 27 May 2026) |
| 4 Jun 2026 | FMDS, internal assumption | About $20K/month | (Leadership OS and FMDS architecture pre-call, 4 Jun 2026) |
| 2 Jul 2026 | FMDS draft | $15K/month, $180K, exit at month 6, client owns code | (local: World Emblem_ OrderForms docx) |
| 9 to 10 Jul 2026 | FMDS | Randy approved $180K, offered more for speed; $20K/month for a 4-month timeline discussed internally | (Advisory, 9 Jul 2026; Check-in, 10 Jul 2026) |
| 10 Aug 2026 | Data-layer expansion | $5K/month if Business Central work was needed | (WE Sync: Weekly Planning, 10 Aug 2026) |
| 28 to 31 Aug 2026 | Marketing strategy (OF 4) | $3K/month for 12 months, $36K; then build chunks OF 5, 6, 7 | (Slack #acnt-world-emblem-internal, 28 Aug 2026; AI-Native Marketing Scoping II, 31 Aug 2026) |
| 31 Aug 2026 | Marketing build sizing | Segments of about $10K, $15 to 20K and $5 to 10K/month | (Marketing scope and KPI prioritization with Carlos, 31 Aug 2026) |
| 29 Sep 2026 | Per-department model | $25K per department onboarding with the AI employee bundled | (WE Strat Sync, 29 Sep 2026) |
| 11 Nov 2026 | OF #004 | $10K/month for months 1 to 3, option to step to $5K from month 4 | (AI-Native World Emblem: Scoping Next Phase, 11 Nov 2026) |
| 11 Nov 2026 | Data vendor quoted to Carlos | About $40K for 12 weeks (vendor name unclear in transcripts) | (AI-Native World Emblem: Scoping Next Phase, 11 Nov 2026) |

### OF #004 in detail

- v1 (28 Oct 2026 file): "AI-Native Marketing - Strategy", $3K/month, $36K, marketing only, leads Nick and Tauseef (Drive: world-emblem-of-004-v1-draft.docx).
- v2 (11 Nov 2026 file): "AI-Native Organization - Strategy", all departments plus core infrastructure. Full Strategy $10K/month for months 1 to 3; from month 4 the client picks Full ($10K) or Steady-State ($5K) month by month. Up to $120K; $75K if Steady-State from month 4. Leads Nick and Dominik Springer. Signatories Carlos Mitchell and Scott Downes. 12-month commitment, no convenience termination, build work excluded, client owns deliverables and captured knowledge (Drive: world-emblem-of-004-v2-draft.docx).
- The live Google Doc was edited 12 Nov 2026 (Drive: World Emblem Order Form #004 - AI-Native Organizational Strategy (NEW)).
- Start 16 Nov 2026 if signed; Carlos signs after a check with Randy; target send 14 Nov (Scoping Next Phase, 11 Nov 2026; Weekly Pipeline Meeting, 11 Nov 2026).

### Costs and margin

- Notion marks the account "Profitable", ARR $300,000, tier "Mission 200" (Notion: World Emblem account page). No margin figure was found.
- Token budget $500/month; a T3 brief costs about $8 per run; the dev environment cost $285 in 30 days (Supernal Weekly Update, 6 Aug 2026; Check-In, 30 Sep 2026; WE: Update 2, 22 Sep 2026).
- Margin pressure is pushing Supernal deals toward $10K minimums (Pricing strategy with Johnny, 4 Nov 2026).

### Unresolved

- OF #004 is unsigned in every version (Drive).
- The v2 fee table prints the months 4 to 12 range as "$90,000 - $45,000", which is correct for those nine months but was misread in one note as a $90K minimum (Drive: world-emblem-of-004-v2-draft.docx; Scoping Next Phase, 11 Nov 2026).
- A renewal conversation planned for 25 Aug 2026 has no later record (WE Sync: Weekly Planning, 23 Jul 2026).
- Whether the conversion credit from the advisory was applied is not recorded.
- The Quality Framework required by Amendment 1 within 15 days exists only as a draft (Slack #acnt-world-emblem-internal, Sep 2026).

---

## 6. Product

### Leadership OS (executive layer)

- **What.** KPI review in presentation and detail modes, T3 meeting prep, commitment ledger, leader standard work, org chart and job descriptions, Hoshin creation (Leadership OS Usage Training, 20 Oct 2026).
- **Who.** Randy Carr daily; the executive team in T3; Gabriella drives the review; Javier and Veronica onboarded 15 Sep 2026 (vault: world-emblem.yaml › we-leados-live).
- **State.** In production since 10 Sep 2026; T3 run on it since 21 Oct 2026; Microsoft 365 sign-in live (vault: world-emblem.yaml › we-leados-live; Drive: World Emblem - Weekly review, 5 Nov; Supernal Weekly Update, 12 Nov 2026).
- **URL.** https://leadershipos-world-emblem.links.getsupernal.ai/ (Slack #acnt-world-emblem-internal, 23 Oct 2026).

### Chief, the AI CEO

- **What.** A Hermes agent with persistent memory, per user. 52 tools; four scheduled skills including a Daily Brief at 05:30, Weekly Coaching and a Wednesday T3 Marketing Report. Follows up in Teams; adds commitments by command (Check-In, 11 and 12 Nov 2026; WE Sync: Weekly Planning, 9 Nov 2026).
- **Who.** Randy and Martin Gonzalez have agents (Check-In, 12 Nov 2026).
- **State.** Autonomy ladder: Brief is live; Draft and Act-with-approval are being built; Act alone is next (Drive: World Emblem - Weekly review, 5 Nov). Randy must add Chief to each Teams channel (Supernal Weekly Update, 12 Nov 2026).
- **Naming.** "AI CEO" in decks, "Chief" in Slack; AICO/AICU in transcripts (Slack #acnt-world-emblem-internal, 9 Nov 2026).

### AI COO

Contracted in the Leadership OS form (4 deliverables); Linear milestone due 30 Nov 2026 at 0% (Drive: world-emblem-of-002-v1-signed.pdf; Linear).

### Commitment ledger

Pulls commitments from Otter, Claude, Outlook, Obsidian and the AI CEO; over 1,000 captured (WE Sync: Weekly Planning, 2 Nov 2026; World Emblem QBR Walkthrough, 28 Oct 2026). Randy wants to drop his Claude ledger and use only this (Slack #acnt-world-emblem-internal, 21 Oct 2026).

### FMDS OS (department layer)

- **What.** KPI boards with the L3 to L2 to L1 cascade, Target Planner, KPI templates, reasons and activities on red KPIs, 8-step problem solving, standard work library, Hoshin execution, help centre (Linear; Supernal Weekly Update, 30 Jul 2026).
- **Who.** Sales and Service since 28 Aug 2026 (24 users); Marketing, IT, CS/OE since; 35 users on 5 Nov 2026 (Linear; Strat², 5 Nov 2026).
- **URL.** https://fmdsos-world-emblem.links.getsupernal.ai/ (Slack #acnt-world-emblem-internal, 23 Oct 2026).

### Patch, the FMDS AI employee

Trained on the 8-step method, standard work, the user manual and transcripts. Drafts 8-step steps, creates and edits standard work, builds KPIs, sets targets from uploaded sheets, works in Spanish. Live 27 Aug 2026. First called "Mark", renamed 6 Aug 2026 (Supernal Weekly Update, 27 Aug 2026; Supernal Weekly Update, 6 Aug 2026).

### Modules and their state

| Module | State | Source |
|---|---|---|
| Boards (per department) | See section 10 | (Linear) |
| Target Planner | Live since 30 Jul 2026 | (Supernal Weekly Update, 30 Jul 2026) |
| 8-step engine | Live since 27 Aug 2026; rarely completed | (Linear; Supernal Weekly Update, 12 Nov 2026) |
| Activities / reasons thread | Live; 22 waiting; most reps not using | (Check-In, 12 Nov 2026) |
| Standard work library | Live; three types plus a pending check sheet | (Linear) |
| Hoshin | 2027 plans loaded from signed PDFs; subtask-to-KPI link done 9 Nov 2026 | (Hoshin planning system setup, 27 Oct 2026; WE Sync: Weekly Planning, 9 Nov 2026) |
| Org chart and job descriptions | Live with approval flow | (Org Chart & Job Description in FMDS, 3 Nov 2026) |
| Teams bot | Approved by IT, channel-scoped, no DMs | (Leadership OS Microsoft Teams Bot, 15 Oct 2026) |
| Help centre | Live, English and Spanish | (Supernal Weekly Update, 5 Nov 2026) |
| EA board for Gabriella | About 20 KPIs, 12 automatic | (WE Sync: Weekly Planning, 9 Nov 2026) |
| Quality credits/remakes board | Prototype pending | (Quality Report on FMDS, 4 Nov 2026) |

### Integrations

HubSpot, Power BI, Outlook mail and calendar, Otter, Windsor (Meta, Google, GA4, BigCommerce), ADP (partial), PostHog; NetSuite being retired; Business Central pending (Supernal Weekly Update, 14 Aug 2026; Linear). Code: one repository, `world-emblem-railway`, hosted on Railway (Slack #acnt-world-emblem-internal).

### Feature rationale

| # | Decision | Reason given | Where decided |
|---|---|---|---|
| 1 | Platform first, role labels (AI CEO, AI COO) second | Randy's reframe: he wanted a system, not a persona | (Advisory, 21 May 2026) |
| 2 | Leadership OS at L3, FMDS OS at L1/L2, one data layer | Keeps the executive view and the floor system separate but consistent | (Advisory, 4 Jun 2026) |
| 3 | Start on the spreadsheets with data-quality flags, then replace by integrations department by department | Value early without waiting for clean data; Naveen's call | (World Emblem Eng Questions, 23 Jun 2026) |
| 4 | Hermes agent with persistent memory, not custom code | Endorsed by Randy when shown | (Advisory, 2 Jul 2026) |
| 5 | Show both posted and incoming revenue | Commissions pay on posted; incoming gives pipeline view; both are correct | (BC Revenue Mapping, 18 Aug 2026) |
| 6 | 8-step triggers on repeated or process-wide red, not every miss; approval gates at steps 6, 7, 8 | Eric's method: one-off misses are coaching, not problem solving | (FMDS 8-Step & Standard Work, 12 Aug 2026; Supernal Weekly Update, 21 Aug 2026) |
| 7 | Standard work stored as text in the FMDS database, SharePoint sync dropped | Lets the agent search and cite it | (World Emblem, 5 Aug 2026) |
| 8 | No line-level transaction drill-down | Randy: it is a management system, not a data lake | (Supernal Weekly Update, 3 Sep 2026) |
| 9 | Per-user agents for the AI CEO | A non-Randy user could read Randy's email through the shared agent | (WE Sync: Weekly Planning, 5 Oct 2026) |
| 10 | Floor boards stay physical; automate from plant manager upward | The physical interaction develops people | (Operations FMDS, 13 Oct 2026) |
| 11 | Activity triggers: 3 consecutive red days or 5 of 10; 3 green days closes; 3 failed activities opens an 8-step | Set with Tony to stop flooding | (Accountability & 8 Step, 26 Oct 2026) |
| 12 | Activity approval queue removed | Randy and Eric: coaching happens in huddles | (Supernal Weekly Update, 5 Nov 2026) |

---

### Commitment ledger and Randy's Obsidian file (checked 14 Nov against meetings)

- Leadership OS writes commitments to its own commitment ledger, not back into Randy's own Obsidian commitments file. The team said this was by design: Randy's Obsidian vault and his own workflows (Otter, email) stay his, and the ledger reads from them (World Emblem Sync: Weekly Planning, 2 Nov 2026).
- Randy connects with his Obsidian credentials and the ledger reads from his file (World Emblem Sync: Weekly Planning, 26 Oct 2026). Write-back to Obsidian was discussed again and dropped; the brief goes to Teams instead (Check-In: World Emblem, 5 Nov 2026).
- Why there is no write-back: his file is his personal system, and the ledger is the shared record; writing into his file was scoped out (inferred from the two meetings above). Earlier notes saying Randy "refused" write-back are not confirmed by the meetings.

## 7. Use cases and feedback

### Use cases by team

| Team | Use | Source |
|---|---|---|
| CEO and executives | T3 weekly KPI review in presentation mode; commitments; daily brief | (Drive: World Emblem - Weekly review, 5 Nov) |
| Sales and Service | Daily revenue huddle (Tony) and weekly account-management review (JC) run on the board | (FMDS Account Management, 1 Sep 2026; Supernal Weekly Update, 24 Sep 2026) |
| Marketing | Daily huddles on the board with no manual updates | (Supernal Weekly Update, 12 Nov 2026) |
| IT | Board live; Phil asks for per-person breakdowns | (Check-In, 11 Nov 2026) |
| HR/ODG | About 65 KPIs from ADP; org chart and job description approval | (Drive: World Emblem - Weekly review, 5 Nov; Org Chart & JD, 3 Nov 2026) |
| Customer Service / Order Entry | Two boards under a Client Services parent, live 12 Nov 2026 | (CS/OE Review, 10 Nov 2026; Check-In, 12 Nov 2026) |
| Executive assistant | Board tracking CEO time on plan | (WE Sync: Weekly Planning, 9 Nov 2026) |

### Adoption numbers

| Date | Number | Source |
|---|---|---|
| 17 Aug 2026 | 4 active users | (Notion: Weekly Account Health Reporting) |
| 28 Aug 2026 | 24 sales and service staff onboarded | (Linear) |
| 15 Sep 2026 | 25 daily active users of about 50 expected; 13 issues shipped a week | (World Emblem Q&A, 15 Sep 2026; WE Internal Bi-Weekly Sync, 16 Sep 2026) |
| 5 Oct 2026 | Patch and 8-step at zero team usage; ledger at 751 commitments | (Notion: Weekly Account Health Reporting) |
| 8 Oct 2026 | Tony heaviest user at 362 minutes in a week; about 120 reasons pending | (Supernal Weekly Touchpoint, 8 Oct 2026) |
| 12 Oct 2026 | Randy on Leadership OS 7 of 7 days | (Notion: Weekly Account Health Reporting) |
| 29 Oct 2026 | Tony created 3 KPIs and JC 2 with Patch that morning | (Quarterly Business Review, 29 Oct 2026) |
| 5 Nov 2026 | 35 users, 4 of 9 departments live | (Strat², 5 Nov 2026) |
| 9 Nov 2026 | About 132 KPIs updated over a weekend with little friction, per Carlos | (Weekly AI Dept Meeting, 9 Nov 2026) |
| 12 Nov 2026 | 22 activities waiting; 8-step rarely completed | (Check-In, 12 Nov 2026) |

Client bug reports: 9 genuine reports in about 10 weeks, 5 of them numbers not matching HubSpot (Slack #acnt-world-emblem-bugs, 24 Aug to 11 Nov 2026).

### Feedback and what changed

| Feedback | From | What changed | Source |
|---|---|---|---|
| Everything must tie to the general ledger | Randy, 23 Jul 2026 | Business Central became the revenue source of record; weekly manual GL reconciliation until the API lands | (Supernal Weekly Update, 23 Jul 2026; Prep for WE data discrepancy, 18 Sep 2026) |
| Target entry is slow; wrong departments | Tony and JC, Aug 2026 | KPI templates and bulk role assignment | (FMDS Onboarding Part 2, 10 Aug 2026; AI FMDS Setup, 13 Aug 2026) |
| Link 8-steps to standard work at step 4, not KPI to SOP | Eric, 21 Aug 2026 | SOP linkage reworked | (Linear) |
| Board shows $1.54M against about $2M | Randy, 9 Sep 2026 | Traced to a roll-up formula on the client side that omitted two reps; fixed live at $456,397 for the day; finance admin login added | (Supernal Dashboard Troubleshooting, 18 Sep 2026) |
| L2 users reverted to sheets because they could not see across sub-departments | A rep; ruling by Randy, 10 Sep 2026 | L2 users see up to their level | (Supernal Weekly Update, 10 Sep 2026) |
| A reason needs two fields: why, and what I am doing about it; three strikes escalates | Eric and Alison, 24 Sep 2026 | Reason plus countermeasure with manager approve/reject, demoed 28 Sep 2026 | (Discussion & Feedback, 24 Sep 2026; WE Sync: Weekly Planning, 28 Sep 2026) |
| What you are doing to get green matters more than why red | Randy, 24 Sep 2026 | Activities became the centre of the red-KPI loop | (Supernal Weekly Update, 24 Sep 2026) |
| 70 of 202 open commitments missing | Randy's "five fixes" email, about 2 Nov 2026 | Cause found: Teams and Plaud not connected; all-time filter requested | (WE Sync: Weekly Planning, 2 Nov 2026) |
| Weeks should run Sunday to Saturday | Carlos, 20 Oct 2026 | Logged | (Slack #acnt-world-emblem-bugs, 20 Oct 2026) |
| Soft savings are not real unless people leave payroll | Randy at the QBR | Value to be reframed as activity leading to KPI back to green, tied to the annual plan | (Quarterly Business Review, 29 Oct 2026) |

---

## 8. Stakeholders

Account OS holds no stakeholders on the power map for this account (Account OS). The table is from meetings.

### Client

| Name | Title | Role on the account | Stance at start | Stance now | Last notable interaction |
|---|---|---|---|---|---|
| Randy Carr | Founder-CEO, acting CMO | Sponsor; signed the advisory and Leadership OS | Excited; doubled budget on 21 May 2026 | Sponsor forcing adoption; wants KPI-to-dollar proof and Excel gone by 1 Jan 2027 | Weekly update, 12 Nov 2026 |
| Carlos Mitchell | Digital marketing lead, then Director of AI (from June 2026) | Buyer of OF #004; owns Business Central access and the AI budget | Sceptical of FMDS; warmth rated 6 against Randy's 9 to 10 (9 Jul 2026) | Brake turned buyer; data-first; signed his own 2027 AI Hoshin | Scoping call, 11 Nov 2026 |
| Eric Freeman | Director of ODG, ex-Toyota, FMDS architect | Method authority; buyer for SRR | Champion from June 2026 | Champion | Weekly update, 12 Nov 2026 |
| Phil Jarvis | CIO | Signed the FMDS form and Amendment 1; billing contact | Cautious gatekeeper; criticised the first form | Active IT board user; retiring end of December 2026 | IT board corrections, 11 Nov 2026 |
| Gabriella (Gabby) Diorico | Executive assistant to the CEO | Conduit for files; drives the T3 review; publishes the org chart | Helpful | Helpful; has her own board | 9 Nov 2026 |
| Tony Morando | Head of sales and service (CSO/CRO) | First L3 user | Supportive, slow on configuration | Heaviest user, but activities under-used | Bug report, 10 Nov 2026 |
| JC Carr | Service team lead, Randy's son | Pilot user | Engaged | Engaged; prefers table view | 2 Nov 2026 |
| Jim Kozel | COO | Opened the account (client services); operations | Driver | Cutting operations standard work from 818 to under 75 | 30 Oct 2026 |
| Will Schwartz | CFO | Finance board | In the 14 May proposal meeting | Wants only T3 metrics from closed data | 14 Oct 2026 |
| Alison Diaco | ODG, L2 under Eric | Internal adoption lead named by Randy | n/a | Driving finance standard-work cleanup | 6 Nov 2026 |
| Clarissa Lopez | HR lead | Controls ADP access | Declined API access on confidentiality grounds | Cautious; ADP call pending | 5 Nov 2026 |
| Sabrina Barrios | Talent | Owns job descriptions | n/a | Engaged | 3 Nov 2026 |
| Martin Gonzalez | IT, taking over from Phil | Second person with an agent | n/a | Engaged | 12 Nov 2026 |
| Javier Lopez, Veronica Moreno | ODG analysts | Maintain the sheets; Leadership OS users | Guides in June | Users | 15 Sep 2026 |
| Faisal Sayed; Olaf (Naviona); Nick Chapman | Contract AI engineer; BC partner; IT | Business Central API | n/a | The gate | 5 Nov 2026 |
| Corey Frons, Pierre Colorado | Marketing | Marketing board | n/a | Pierre's KPIs pending | 12 Nov 2026 |
| Arturo Nunez, Rocio Reyes | Customer service, order entry | New boards | n/a | Live 12 Nov 2026 | 12 Nov 2026 |

(World Emblem: AI CEO Discovery, 14 May 2026; engagement structure debrief, 9 Jul 2026; Drive: signed PDFs; WE strategy update | WE offsite, 5 Oct 2026; Linear; Check-In, 12 Nov 2026; vault: world-emblem.yaml › 97655207)

### Supernal team over time

| When | Who | Role |
|---|---|---|
| From April 2026 | Nick Agresti | Account lead; opened the account; now stepping back from tactical calls |
| From May 2026 | Tauseef Rahman | Strategist, prototype builder, then delivery lead; holds a worldemblem.com address |
| May to July 2026 | Seb Van Kuyk, Thomas Bustos, Eric Kravitz, Naveen | Product, review, contracts, engineering sign-off |
| From 4 Jun 2026 | Ricardo Morel, Saad Ali | Engineers; near-daily check-ins |
| From 3 Sep 2026 | Dominik Springer | Strategy; QBR deck; strategist on OF #004 |
| From Sep 2026 | Jonathan Hayes, Scott Downes | Special projects; contract signatory |
| 4 Nov 2026 | Doren Gore | Engineer; operations mapping |
| 11 Nov 2026 | Swamy, Aman | Added; squad "Polaris" covers WE and Breakr |
| 20 Nov 2026 | Saad Ali | Last day |

(vault: brains/world-emblem.md; Check-In, 3 Sep 2026; Slack #acnt-world-emblem-internal, 4 and 11 Nov 2026; Squad 2 Kickoff, 11 Nov 2026; WE Sync: Weekly Planning, 26 Oct 2026)

---

## 9. Success and value

Account OS holds no success-plan goals and no value entries for this account (Account OS). Everything below is from contracts, decks and meetings.

### Success criteria and KPIs

| Criterion | Baseline | Target | Current | Source |
|---|---|---|---|---|
| Departments live on source data | 2 of 9 (28 Sep 2026) | 6+ by 31 Dec 2026 (internal, 28 Sep); all nine boards by 31 Dec 2026 (Randy's mandate, QBR) | 4 of 9 on 5 Nov, plus CS/OE on 12 Nov | (WE Sync: Weekly Planning, 28 Sep 2026; Drive: 20261021_qbr; Strat², 5 Nov 2026) |
| Usage | Unclear | 60%+ over consecutive weeks | 35 users; no percentage found | (WE Sync: Weekly Planning, 28 Sep 2026) |
| 8-step completion | About 19%, stalling at steps 6 to 8 | 60% | Still at baseline; rarely completed | (Drive: World_Emblem_-_Supernal_MSA.pdf; Drive: 20261021_qbr; Check-In, 12 Nov 2026) |
| Executives using Leadership OS | Randy only | 2+ | Randy and Martin have agents; T3 runs on it | (WE Sync: Weekly Planning, 28 Sep 2026; Check-In, 12 Nov 2026) |
| Hoshin objectives on track | 27% (July 2026) | not stated | not updated | (Drive: 20261021_qbr) |
| Commitments on time | About 25% | 80% | not updated | (Drive: 20261021_qbr) |
| Priority-1 processes with a standard | not stated | 100% by 31 Dec 2026 | not stated | (Drive: 20261021_qbr) |
| Time for a red to reach L3 | Up to a month | Same day | Same day, where boards are live | (Drive: World_Emblem_-_Supernal_MSA.pdf; Quarterly Business Review, 29 Oct 2026) |
| CEO time on plan | 52.9% | 85% | 52.9% | (WE Sync: Weekly Planning, 9 Nov 2026) |
| Revenue per person | About $59K | +50% by Dec 2027 (QBR); +10% in 2027 (Randy's goal) | not updated | (Drive: 20261021_qbr; Slack #acnt-world-emblem-internal, 30 Oct 2026) |

Contracted success measure in the FMDS form: operational time recovered and reporting latency removed (Drive: World_Emblem_-_Supernal_MSA.pdf). The contracted monthly KPI baseline report (WE-142) still lacks an hours baseline (Linear).

### Value shown at the QBR, 29 Oct 2026

| Value | Number | Source |
|---|---|---|
| KPIs mapped, the client's first source map | 646: 99 with no source, 92 never filled, 66 pointing to sources that do not exist | (Quarterly Business Review, 29 Oct 2026) |
| Source systems | 11: four connected, four pending, three by hand | (Drive: 20261021_qbr) |
| Executive L3 sheets broken | 6 of 8, across 87+ linked workbooks | (Quarterly Business Review, 29 Oct 2026) |
| Service revenue found missing | About $500K, traced to one hidden column | (Quarterly Business Review, 29 Oct 2026) |
| Safety formula targets restored and corrected | $8.55M (one note says $8.5M); DART and TRIR corrected | (Quarterly Business Review, 29 Oct 2026) |
| Duplicate standard work | 255 of 695 documents | (Quarterly Business Review, 29 Oct 2026) |
| Staff freed from compiling data | Two people, about $100K a year | (Quarterly Business Review, 29 Oct 2026) |
| Commitments captured | 1,000+ | (World Emblem QBR Walkthrough, 28 Oct 2026) |
| Finance KPIs | Cut from about 85 to about 30 | (Drive: 20261021_qbr) |

Earlier value points: a $2.5M May revenue miss traced to unlogged HubSpot calls; one retraction, a $100K to $300K weekly variance against Power BI that was definitional, not a defect (Notion: World Emblem — Account Snapshot).

### What the sponsor has asked to see

- Activity leading to a KPI going back to green, with the dollar figure tied to the annual plan; not soft savings (Quarterly Business Review, 29 Oct 2026).
- A mutual KPI visualisation to open the next QBR, also for his bank; owner Dominik (Quarterly Business Review, 29 Oct 2026).
- What the two freed staff now do (Quarterly Business Review, 29 Oct 2026).
- The recap video, to share company-wide (Quarterly Business Review, 29 Oct 2026).
- An acquirer deck for "sell the system" (Quarterly Business Review, 29 Oct 2026).
- The FMDS plus AI CEO story ready by 31 Dec 2026 for his Abundance 360 talk in March 2027 (Supernal Weekly Update, 24 Sep 2026; year inferred).
- Randy's 2027 goals: revenue per employee up 10%; 12 AI workflows live at 2x ROI (stretch 20); decisions reaching Randy down 50%; bid desk agent live by 30 Jun 2027 (Slack #acnt-world-emblem-internal, 30 Oct 2026).
- Carlos is graded on about 3x value ($1.8M) against about $600K of team cost (WE strategy update | WE offsite, 5 Oct 2026).

---

## 10. Delivery now

### FMDS OS (Linear project status: Kickoff; target 23 Jul 2027)

| Workstream | State | Milestone % and date | What is measured | What was learned | Blocker |
|---|---|---|---|---|---|
| Discovery and Data Vault | Complete, one item carried | 87.5%, 15 Aug 2026 | KPI map sign-off per department | Parent-child map is location-based at L3, factor-based below | L1 incoming revenue against BC ledgers (WE-171) on hold |
| Sales/Service board and Patch | Delivered 28 Aug 2026, 24 users | 84.9%, 15 Aug 2026 | Logins, activities | Usage is the constraint, not capability | Spreadsheet retirement gated on refresh reliability and a named finance confirmer |
| 8-step engine | Met 15 Sep 2026 | 99.9%, 15 Sep 2026 | 8-step completion rate | Trigger is repetition, cadence differs by department | Per-department thresholds (WE-127); adoption |
| Marketing | Board live 3 Nov 2026 | 22.1%, 30 Sep 2026 (passed) | KPIs live from source | Targets rest on flawed history; let 2026 fail, set a realistic 2027 baseline | Field map and connectors with Carlos; Pierre's KPIs |
| Operations and ERP | Mapping in progress; Doren mapped 79 COO-board KPIs | 5.4%, 30 Nov 2026 | On-time performance by location | Most layers are still physical boards | Business Central API; WPS read access; Varmus has no attendance API |
| ODG and HR | Board built; about 65 KPIs from ADP | 19.1%, 31 Oct 2026 (passed) | KPIs from source | About 75% of HR KPIs are manual; some manual steps are deliberate | Missing ADP endpoints; paid ADP expert call |
| IT and Quality | IT live; Quality prototype pending | 17.9%, 30 Nov 2026 | Board accuracy | Most KPIs need formulas on top of source data | Uptime formula, expired CheckMK token; Quality redefinition in HubSpot |
| Finance | Mapped | 0%, 30 Nov 2026 | T3 metrics from closed data | Mexico finance sits in an on-premise system, Compact | Business Central API; Compact not scoped |
| CS / Order Entry | Live 12 Nov 2026 | not a Linear milestone | 13 KPIs pending connection | Split into two boards | BC, ADP, a HubSpot seat |

(Linear; Drive: World Emblem - Weekly review, 5 Nov; Check-In, 11 and 12 Nov 2026; Slack #acnt-world-emblem-internal, 10 Nov 2026)

### Leadership OS (Linear project status: In Progress; target 31 May 2027)

| Workstream | State | Milestone % and date | Blocker |
|---|---|---|---|
| Engineering and data foundation | Done | 100%, 30 Jun 2026 | none |
| Hoshin-KPI dashboard and diagnosis | Done | 99.9%, 31 Jul 2026 | none |
| AI CEO designed and built | Done | 100%, 31 Aug 2026 | none |
| AI CEO operational across Sales and Service | Work shipped but not recorded | 0%, 30 Sep 2026 (passed) | Backfill of Linear; KPI-to-Hoshin mapping from Randy |
| AI CEO across CEO workflows with leader standard work | Early | 8.3%, 31 Oct 2026 (passed) | Randy's per-item leader standard work descriptions |
| AI COO | Not started | 0%, 30 Nov 2026 | not stated |
| Testing and hypercare (executive onboarding) | In progress | 65%, 31 Dec 2026 | Data trust: BC incoming-revenue reconciliation first |

(Linear)

### Decisions waiting

- OF #004 signature by Carlos, after his check with Randy (Scoping Next Phase, 11 Nov 2026).
- How AI gets built at WE: internal, partner or hybrid, due 30 Nov 2026 (Drive: 20261021_qbr).
- Whether sales reps live in FMDS or HubSpot (Account Management Team, 26 Oct 2026).
- Randy on the 8 unresolved KPIs on Gabriella's board (WE Sync: Weekly Planning, 9 Nov 2026).
- Varmus API or a Windsor export for Mexico attendance (Varmus attendance system, 15 Oct 2026).
- Who owns QBRs at Supernal, growth or delivery (WE Strategy Alignment, 13 Oct 2026).

### Items slipping

- Business Central API: promised from 8 Oct 2026, still pending 12 Nov; WE-279 blocked on Carlos's credentials (Slack #acnt-world-emblem-internal, 11 Nov 2026).
- Three milestone dates already passed with low progress: Marketing (30 Sep), ODG/HR (31 Oct), AI CEO across CEO workflows (31 Oct) (Linear).
- The AI CEO date has moved four times (local: world-emblem-artifact-audit.html).
- A value/PMF dashboard asked for by Seb and Thomas is not built (vault: world-emblem.yaml › 9647d842).
- A 60-day ROI read for Carlos (vault: world-emblem.yaml › e00fd847).
- A Supabase security alert from 10 Nov 2026 has no ticket (Slack #acnt-world-emblem-internal, 11 Nov 2026).

### Commitments with no Linear issue found

(Checked against the task file, not against a full Linear issue search; treat as inferred.)

- Mutual KPI visualisation for the next QBR.
- Finding out what the two freed staff now do.
- All-time filter on commitments.
- Carlos's UX feedback write-up.
- Engineer onboarding checklist (for Doren, before Saad leaves).
- Hoshin training for division managers.
- Varmus specification.
- Peso-to-USD check (vault: world-emblem.yaml › c8925006).
- Recurrence-prevention form from the Toyota session.
- Abundance 360 narrative.

### Dates in the next 30 days (to 13 Dec 2026)

| Date | Event | Source |
|---|---|---|
| 14 Nov 2026 | OF #004 order form to Carlos | (Weekly Pipeline Meeting, 11 Nov 2026) |
| 16 Nov 2026 | OF #004 expected close; Dominik's start | (Account OS; Scoping Next Phase, 11 Nov 2026) |
| 18 Nov 2026 | Tauseef at Fort Lauderdale HQ; one source says a session with Randy, another says Randy and Carlos will be away | (Drive: World Emblem - Weekly review, 5 Nov; Tauseef / Nick WE vid clip, 11 Nov 2026) |
| 19 Nov 2026 | Onboarding visual into the SRR call | (Supernal Weekly Update, 12 Nov 2026) |
| 20 Nov 2026 | Saad's last day | (WE Sync: Weekly Planning, 26 Oct 2026) |
| 30 Nov 2026 | Operations, Finance, IT/Quality and AI COO milestones; WE's architecture decision | (Linear; Drive: 20261021_qbr) |
| Just outside | 18 Dec 2026 SRR expected close; about 22 Dec 2026 earliest FMDS exit notice (inferred); 31 Dec 2026 all boards live, Phil retires | (Account OS; Drive: Amendment No. 1; Drive: 20261021_qbr) |

---

## 11. Artifacts

Link patterns: Drive files `https://drive.google.com/file/d/<ID>/view`; Google Docs and Slides `https://docs.google.com/document/d/<ID>/edit` or `/presentation/d/<ID>/edit`; folders `https://drive.google.com/drive/folders/<ID>`.

### Drive folders

| Folder | ID | Holds |
|---|---|---|
| Account root | `1Xutz2aOrxGKq1EkMz_aaQdM-nvy8QrYE` | Client Facing, Internal Facing, Transcripts, Commercial Contracts, and the Hoshin Master PDF |
| Client Facing (weekly review decks) | `1VkVF2vF2x8soA7q87RyqVTMuhxGPHbai` | Weekly reviews, QBR, strategy drafts, onboarding decks, Help Centre Videos |
| Order form drafts | `1smDmS10BAlASOjO_2ogZ4hKdvOvTu2Qc` | OF-002 signed, OF-004 v1 and v2 |
| Context videos | `1D86_BzwuViYCQBhyIbw70A_A30J36QoC` | Two "Additional Context" videos |
| Call notes and marketing memo | `14DSNo7z4stAhNd-oNLiC-Fe4gjvr8BHJ` | Gemini notes Apr to Jun, marketing memo and decision log |
| Commercial Contracts | `1dxFYOfleSRDe4f5IMoczJF1oAZZCKa2M` | MSAs, order forms, amendment |
| Internal Facing | `1xNIod3hIjGWV77Zfp63vGc6hoD65kSJK` | Project plans, recap video cuts, client source libraries |
| Transcripts | `19EsXwDJb_3wffkcs8_DSnH3_XDw4ZgAU` | 16 files, 14 May to 2 Jul 2026 |

### Drive files

| Title | Kind | Date | Owner | Where (ID) | What it is for |
|---|---|---|---|---|---|
| World Emblem International, Inc. + Supernal document.pdf | Order form | 5 May 2026 | Supernal contracts | `1iHxVCVhZ4Zef-hmRvkYL362Rhu55Thvs` | MSA 1 and Order Form #1 (advisory) |
| world-emblem-of-002-v1-signed.pdf | Order form | 28 May 2026 | Supernal contracts | `1yWtdj4QUuYQgCeayIn1YvDrXZx37BL0T` | Leadership OS, signed |
| World Emblem Order Form #2 + Supernal document.pdf | Order form | 24 Jun 2026 | Supernal contracts | `1AKsy5Bsx6_wEOQgPZsK0CRz--5_HJICB` | Not opened; by title the same Leadership OS form (inferred) |
| World_Emblem_-_Supernal_MSA.pdf | Order form | 22 Jul 2026 | Supernal contracts | `1HP1viqEFc2tyBmLswmNajAldoCQV3TBo` | MSA 2 and OF-003 (FMDS OS) |
| Amendment_No1_World_Emblem_FINAL.pdf | Order form | 3 Sep 2026 | Supernal contracts | `120sxOTzWcC3gJ48g1O1yDIeFY3QGRPFD` | Month-6 exit, Milestone 6 right, NDA exhibit |
| World Emblem - Supernal MSA + Amendment No 1.pdf | Order form | 4 Sep 2026 | Supernal contracts | `1PJLVqtlvjrJbjwImiKG8XGgN-pGg-adi` | Combined copy, not opened |
| world-emblem-of-004-v1-draft.docx | Order form | 28 Oct 2026 | Nick | `1eqt6qTy9zUmwhzeT8W2c2akXJTMZCUTn` | Marketing strategy form, $3K/month |
| world-emblem-of-004-v2-draft.docx | Order form | 11 Nov 2026 | Nick | `1Hxia2mLF0_8esLUmJ02wQyeIpnrwEn72` | Organisation strategy retainer |
| World Emblem Order Form #004 (NEW) | Order form | edited 12 Nov 2026 | Nick | `16k1lfk9BMXyAw-AIO8kfmBneB6c9AdqmlCuLLTrisAw` | Live working draft |
| World_Emblem-Proposal-Leadership OS.html | Proposal | 3 Jun 2026 | Tauseef | `1qrLOqodxqo1uR8830O3t4rzDOC-qoGjs` | Mislabelled: content is the AI Client Services proposal |
| Executive Readout: World Emblem International | Deck | 18 Jun 2026 | Tauseef | `1NBj4E-_O_HU27ggt7HeUkr-qQJodQt35X0kmn4xgk10` | The advisory deliverable |
| sharepoint-map.html | Site | 19 Jun 2026 | Tauseef | `1oipjfTi6Uo8V5EIHnCL5CYQ5u4ADwcny` | Map of 52 SharePoint sites |
| World Emblem: Weekly Review decks (2, 9, 17, 23, 30 Jul; 6, 14, 27 Aug; 17, 24 Sep; 7, 22 Oct; 5 Nov) | Decks | Jul to Nov 2026 | Tauseef | In Client Facing; 5 Nov is `1X6jTgxddIy2znF16ygmOM1zXYKw1-92QTo3lYfYvTVE` | The weekly client review |
| FMDS Onboarding: JC & Tony | Deck | 4 Aug 2026 | Tauseef | `1LVrDiP_nkI6FLfq5zO9uiX7vhZjFR1FXYP9t9950MJQ` | First onboarding |
| FMDS Onboarding: Sales/Service | Deck | 28 Aug 2026 | Tauseef | `19FFVtpQSYOsCICJV1RnMkyHLLNrqRcT3WScyTCy1W_w` | Full team onboarding |
| 20260919_World-Emblem-Agent-Map-Charts | Deck | 10 Sep 2026 | Dominik | `1VuFQenLjb9TslWYvGhvAfrXKeIGxjN-e` | Carlos's 159-agent map charted |
| World Emblem — Marketing, Measurably.pptx | Deck | 21 Sep 2026 | not stated | `1wtVeGUP4lzgUhjGrtvTYUFzYnAiwjxjk` | Marketing pitch |
| 20260922_strategy_draft.pptx | Deck | 22 Sep 2026 | Dominik | `1Dg8nIggngvn-KD6NlVTn12wFUPq3g-z5` | Marketing-centred strategy |
| 20261016_strategy_draft.pptx | Deck | 16 Oct 2026 | Dominik | `1WIOFgjEl8_sCWNiKEeaaXVLDMz5XOa3u` | Precursor of the QBR strategy |
| 20261021_qbr (and 20261021_qbr_shared, backup) | Deck | 29 Oct 2026 | Dominik | `19RIEPmglUbS7A7zQs7dp_fy9DU70hyspr7IWCTha-z8`; shared `17xZ1m82S5wUbYV1sVihZjyESPPlX7ghM` | The QBR |
| World Emblem: Q3 Product Recap.mp4 | Video | 29 Oct 2026 | Tauseef | `1m4zEcLVkJJI-VQZdwZ9ml97BPzWYJZL3` | Recap shown at the QBR |
| we-product-recap-4k.mp4, v3 | Video | 27 to 28 Oct 2026 | Tauseef | `1t_Jul8avensR81ZgSaV2dhNHGN88kl2N`, `1AOvyReLNFk0-xWF4rDP-Pwldlp8l0TFU` | Earlier cuts |
| Help Centre: Job Descriptions and Org Chart tutorials | Video | 29 Oct 2026 | Tauseef / Ricardo | `1Jk_Mxn4PBGOrfp-7uTMwYe_H8lmFgOAO`, `1XL4iL0zTT3gpkkqzYwVlFDHqTUj8o8m2` | Help centre |
| Additional Context_World Emblem_v1.mp4; Additional Context Podcast v1.mp4 | Video | 27 Jul 2026 | not stated | `1G4BMaKMnShfH0x0ErqBN0NEcoVMv2aQU`, `1UuTYxG6dG-zypHIuYX6LGpv8lJiNSCyJ` | Context for the team |
| WE-Hoshin-Master 2027-AI - Better Format.pdf (and signed PDF, xlsx) | Doc | Oct 2026 | Carlos Mitchell | `1Br7MrUI7ntayOV4rVefftHpHFBIXNqhJ` | Carlos's signed 2027 AI Department Hoshin |
| 2026-07-21 - Marketing Leadership Memo.docx | Doc | 21 Jul 2026 | Randy Carr | `1HpR6TU7EnvHtTYI38i1V2x1aGYBauEby` | Agentic marketing decision |
| 2026-07-21 - Agentic Marketing Org - Decision Log | Doc | 21 Jul 2026 | Randy Carr | `1o8EnWI0_o4M_T2xhYcDYH2BpdMpRXr6UkJ67nmyeKrc` | Decisions and vendor lanes |
| FMDS OS: Project Plan; LeadershipOS: Project Plan | Spreadsheet | 27 Jul 2026 | Tauseef | `1WeZr35eGGz9OS7Qvei4PTSYVPJhcwRqMUYCm-da_gic`, `18L5K0msxrhFW0h7U9tXvLBXLeD71UB5mz2IAAVl57bI` | Milestone plans |
| 20260911_Marketing KPI Status - for Carlos.xlsx | Spreadsheet | 11 Sep 2026 | Tauseef | `1XzzmvdIMUtvO0vW5LRDJfUBOpNyHU4iS` | Marketing KPI mapping status |
| 20260916_biweekly.pptx; nextsteps.pptx; WE_alignment_intro_slides.pptx | Decks | 16 Sep 2026 | internal | In Internal Facing / meetings | Internal bi-weekly |
| Gemini call notes (Discovery I 6 Apr; Discovery III 1 May; Proposal 14 May; Phil calls 21 May; Capabilities 1 Jun; FMDS, SRR, HR w/ Eric F 3 Jun; Next Steps AI CS 4 Jun; Ancillary IT Needs 10 Jun) | Docs | Apr to Jun 2026 | Nick | In `14DSNo7z4stAhNd-oNLiC-Fe4gjvr8BHJ` | Early call record |
| WE FMDS folder (about 57 files) | Spreadsheets | uploaded 24 Jun 2026 | client | `175pIO57oIUnEZareIyZnlo2xRnYEPtdn` | Client source workbooks: CEO dashboard, department FMDS, bowlers, 8-step tracker |
| Hoshin & FMDS folder (about 50 files) | Docs | uploaded 9 Jul 2026 | client | `18O9UqQUt-HbrEHGIczf8ewIIQNDbN2L7` | Toyota and Hoshin reference library |

### Shared in Slack

| Title | Kind | Date | Owner | Link | What it is for |
|---|---|---|---|---|---|
| FMDS OS production | Site | 23 Oct 2026 | Ricardo | https://fmdsos-world-emblem.links.getsupernal.ai/ | Live app |
| Leadership OS production | Site | 23 Oct 2026 | Ricardo | https://leadershipos-world-emblem.links.getsupernal.ai/ | Live app |
| Leadership OS staging and dev | Site | Sep to Oct 2026 | Ricardo | https://leadershiposstaging.up.railway.app/ , https://devleadershipos.up.railway.app/ | Test environments |
| First dev and staging | Site | 12 Jun 2026 | Saad | https://dev-world-emblem.up.railway.app/ , https://staging-world-emblem.up.railway.app/ | Original environments |
| Leadership OS tutorial for Randy | Video (Loom) | 16 Oct 2026 | Ricardo | https://www.loom.com/share/be69134a873b4323a5336d46a56728f4 | Walkthrough |
| Field Notes & Moonshots | Prototype (claude.ai artifact) | 28 Oct 2026 | Seb | https://claude.ai/artifact/DRu9S9exRS3QSvxgYhE6tc | QBR vision section |
| T3 Operating Prototype | Prototype (claude.ai artifact) | 25 Sep 2026 | Tauseef | https://claude.ai/artifact/RYzJEyeMHJHNNZXT32DZgP | T3 design |
| Accountability Flow | Prototype (claude.ai artifact) | 25 Sep 2026 | Tauseef | https://claude.ai/artifact/XTzhpzJ5DG3XqwsJHbaBih | Red-KPI loop design |
| Leadership OS new UI | Prototype (claude.ai artifact) | 27 Aug 2026 | Tauseef | https://claude.ai/code/artifact/88e3efd8-ac11-4a22-a4a8-c3251c8586fa | Department and T3 review views |
| Business Central revenue requirements | Doc (claude.ai artifact) | 2 Sep 2026 | Ricardo | https://claude.ai/code/artifact/a44f7788-80fe-4297-bd99-315220365e85 | Scope for revenue direct from BC |
| Milestone acceptance / quality framework draft | Doc | Sep 2026 | Tauseef | https://docs.google.com/document/d/1MUPT0ZMSh7v2_n2BV2JNbyC0KmuF9WlRX-QP6tkcwow/edit | Required by Amendment 1 |
| Standard Work Instructions video | Video | 29 Oct 2026 | Tauseef / Ricardo | https://drive.google.com/file/d/157xBanhEJKJMvlbeXBcWcT9TUYMb3EVg/view | Training; Eric wants it in the ADP LMS |
| Help-centre video | Video | 5 Nov 2026 | Tauseef | https://drive.google.com/file/d/1FbgqHifsXxGNFASC7xJ-ivFg1LVhnPvm/view | Help centre |
| KPI parent/child tree, 9 departments | Diagram | 17 Jun 2026 | Tauseef | https://link.excalidraw.com/l/4dHYmVoE9py/A8lgIwm6qjy | Main-to-sub KPI map |
| FMDS to Leadership OS flow chart | Diagram | 11 Jun 2026 | Tauseef | https://link.excalidraw.com/l/4dHYmVoE9py/8zb8dDxLfJI | System breakdown |
| WE Marketing deep dive | Video (Fathom) | 1 Sep 2026 | Tauseef | https://fathom.video/calls/723754085 | Call recording |
| Code repository | Site | ongoing | Ricardo | https://github.com/Supernal-Technology/world-emblem-railway | Monorepo for both apps |
| World Emblem Products | Doc (Notion) | 4 Sep 2026 | Tauseef | https://app.notion.com/p/World-Emblem-Products-388bd5e8f318803cb89bfb74e296ed5b | Product strategy pages |
| Case study draft | Doc | Sep 2026 | Zack / Nick | https://docs.google.com/document/d/1lfGeyRqgCwL_rKsk-u61f0CJEZ6gK_PRccBbnIqlvpQ/edit | Needs Randy's written permission |
| Hoshin Plan 2027.pptx | Deck | 20 Oct 2026 | Eric Freeman | Client SharePoint | 2027 Hoshins to load |

(Slack #acnt-world-emblem-internal; Notion: World Emblem: Testimonial & Expansion)

### On disk or only mentioned in meetings

| Title | Kind | Date | Owner | Where | What it is for |
|---|---|---|---|---|---|
| Leadership OS prototype (first) | Prototype | 21 May 2026 | Tauseef | location unknown | The demo that led to the first platform form |
| WE_MASTER_REPORT.md; WE_LEADERSHIP_OS_BLUEPRINT.md | Doc | 13 and 16 Jun 2026 | Tauseef | `/Users/tauseef/Supernal/World-Emblem AI Strategy/` | Analysis record |
| WE_KPI_Cascade_Map (md, pdf, html); Parent_Child_Map csv | Doc | 17 Jun 2026 | Tauseef | same folder | The cascade analysis |
| Hoshin KPI Cascade Explorer V1 to V3 | Prototype | 23 to 24 Jun 2026 | Tauseef | same folder | Shown to the client |
| System Architecture html | Doc | 25 Jun and 2 Jul 2026 | Tauseef | same folder | Architecture |
| WE_FMDS_OrderForm_UserStories.md | Doc | 24 Jun 2026 | Tauseef | same folder | Scope for the FMDS form |
| WE_AI_OPPORTUNITY_ASSESSMENT_AND_ROADMAP.md | Doc | 2 Jul 2026 | Tauseef | same folder | The advisory roadmap |
| fmds-os-prototype | Prototype | to 11 Jul 2026 | Tauseef | same folder | The 9 Jul demo |
| world-emblem-case-study.md | Doc | 17 Jul 2026 | Tauseef | `/Users/tauseef/ric-os/drafts/` | Case study; its "$15K" Leadership OS figure is wrong |
| CEO Review v1 and v2 | Prototype | 27 Aug 2026 | Tauseef | `/Users/tauseef/ric-os/drafts/world-emblem-ceo-review-v2.html` | Shown to Carlos 27 Aug |
| world-emblem-artifact-ledger.html; world-emblem-artifact-audit.html | Doc | 30 Sep 2026 | Tauseef | `/Users/tauseef/ric-os/drafts/` | Earlier artifact inventory |
| Meridian OS and Meridian OS 2 | Demo | Aug to Sep 2026 | Tauseef | `/Users/tauseef/ric-os/drafts/meridian-os-2.html` | Anonymised demo of this account |
| ONB-1.01 internal pitch video | Video | Oct 2026 | Tauseef | `/Users/tauseef/ric-os/drafts/we-video` | Internal video |
| KPI master source sheet (646 KPIs) | Spreadsheet | 8 Oct 2026 | Tauseef | location unknown | First source map |
| Ecomm-Performance-Marketing-KPI-Data-Map-v5 | Spreadsheet | 13 Oct 2026 | Carlos | location unknown | Marketing field map |
| WE 2027 Monthly KPI Forecasts | Spreadsheet | 29 Oct 2026 | Corey | location unknown | Marketing targets |
| WE Field Book v1.0 | Doc | 1 Sep 2026 | internal | location unknown | Internal field guide |
| "Where We Stand" deck | Deck | 24 to 25 Sep 2026 | Dominik | location unknown | Monthly review |
| Onboarding progress deck / five-layer visual | Deck | 12 Nov 2026 | Tauseef | location unknown | For the SRR call |
| LinkedIn clip of AI CEO commitments | Video | due 12 Nov 2026 | Tauseef | location unknown | Lead generation from Randy's account |
| Client-services data analysis | Doc | 1 May 2026 | Nick | location unknown | Shown to Jim Kozel |

---

## 12. Suggested vault sections

A standard scoping and delivery template set would not hold these.

| Section | Files it would contain | Material that exists |
|---|---|---|
| **Operating method** (the client's Toyota system) | FMDS and the three levels; Hoshin (3-year, 1-year, quarterly, catch-ball); 8-step problem solving and its triggers; standard work types; SRR and IDMP | Heavy: about 50 reference files from the client, Eric's training sessions on 11 and 12 Aug, the Toyota session on 10 Nov |
| **KPI source map** | The 646-KPI master sheet; parent-child map by department; source system per KPI with status; KPIs with no source | Heavy: the master sheet, cascade maps, department mapping sessions from June to November |
| **Findings ledger** (errors found in the client's data) | One file per finding: hidden-column revenue, DART/TRIR, time-to-fill, roll-up omissions, duplicate standard work; retractions | Medium to heavy: at least eight findings with dates, plus one retraction |
| **Access and integration gates** | Business Central (people, attempts, dates); ADP (endpoints, PII position); Windsor; Varmus; Compact; Microsoft 365 | Heavy: tracked since August across about 20 meetings and Linear |
| **Order form chain** | One page per form with signed terms; the numbering conflict; amendment; open forms and draft history | Heavy: three signed forms, an amendment, three OF #004 drafts |
| **Client AI strategy** (the buyer's own plan) | Randy's marketing memo and decision log; Carlos's 2027 AI Hoshin; the 159-agent map; WE's data-layer plan (Fabric, company brain); other vendors | Medium: five documents plus QBR discussion |
| **Department onboarding playbook** | Per department: owner, readiness, mapping status, go-live date, champion, lessons | Medium to heavy: nine departments, each with one to four sessions |
| **Adoption and enforcement** | Usage by week; activity and 8-step counts; Randy's rules (bonuses tied to use, delete the spreadsheets); adoption owner | Medium: weekly health reports and check-ins |
| **Executive agent design** (Chief) | Leader standard work items; skills and schedules; privacy model; autonomy ladder; memory sources (Obsidian, Claude) | Medium: design sessions from July to November |
| **Reference and marketing use** | Case study and permissions; recap video; LinkedIn collaboration; Abundance 360 talk; reference calls given | Light to medium |

---

## 13. Book

### Chapter 1. The account in one page

World Emblem makes emblems, patches and badges. It has about $100M in revenue and about 1,600 to 1,700 people across the US, Mexico, the Dominican Republic and Canada. Its founder and CEO, Randy Carr, runs it on a Toyota-style system: annual Hoshin plans, a cascade of KPIs reviewed daily and weekly, 8-step problem solving, and standard work. Before Supernal, all of that lived in Excel, in more than 87 linked workbooks kept up by two full-time people.

Supernal's work started in April 2026 as a small client-services scoping with the COO. It became a $10K advisory with the CEO in May, then two platforms. Leadership OS ($10K a month) gives the executive team one place to review KPIs, track commitments and work with an AI agent called Chief. FMDS OS ($15K a month) gives each department a live board, with an AI employee called Patch. Together they bring $25K a month.

By mid-November 2026 the weekly executive review runs on Leadership OS, and five department areas are live on FMDS OS. Two things hold the rest back: access to Business Central and ADP on the client side, and adoption of the problem-solving loop, which sits at its 19% baseline against a 60% target. A strategy retainer of up to $120K has been agreed verbally with the Director of AI, and a people-development extension called SRR is being scoped. Account health is 4.0 of 5, Healthy.

Sources: Account OS; Drive: Executive Readout; Drive: 20261021_qbr; Drive: World Emblem - Weekly review, 5 Nov; Linear.

### Chapter 2. Why they bought

Three purchases, three sets of reasons.

The advisory was easy to buy. Nick Agresti already had the COO's attention and a master agreement, and his idea of rebuilding functions as if AI had always existed caught Randy, who asked for an "AI CEO". The fee was $10K for 60 days.

Leadership OS was won in two weeks. In discovery on 14 May, Randy described his week: cadence meetings, an Excel KPI cascade, a commitments list he kept by hand, and a wish for 80 to 85% of his time back. His assistant sent the org chart, meeting transcripts and objectives. On 21 May Tauseef showed a prototype built from those files in about a day. Randy saw his own system in his own terms, said he was doubling the budget, and asked for the floor-level system too. He signed at $10K a month on 28 May.

FMDS OS took six more weeks and was earned by analysis. Through June the team walked the cascade with the people who run it, mapped parent and child KPIs, and mapped 76,000 SharePoint files. They found that safety formulas were reading the wrong columns, that one team's revenue had dropped out of the roll-up so the board read about $624K against nearly $2M a week, and that two people at about $100K a year did nothing but maintain sheets. On 2 Jul those findings were shown to Randy first, and he said the spreadsheets had to go. On 9 Jul he approved $180K on the call.

Sources: World Emblem: AI CEO Discovery, 14 May 2026; Advisory, 21 May, 2 Jul and 9 Jul 2026; AI through FMDS follow-up, 24 Jun and 2 Jul 2026; Advisory, 23 Jun 2026; World Emblem Context, 27 May 2026.

### Chapter 3. How the deal is built

The paper is simple once the numbering is clear. There are two master agreements: one from 5 May 2026 signed by Randy, and one from 22 Jul 2026 signed by the CIO, Phil Jarvis. Under them sit three signed order forms. Order Form #1 is the advisory, $10K fixed. OF-002 is Leadership OS, $10K a month for 12 months from 28 May 2026, with no exit except for breach. OF-003 is FMDS OS, $15K a month for 12 months from 22 Jul 2026. Some internal notes and one Linear milestone call Leadership OS "OF-001"; the signed papers do not.

The two platform forms differ because the client learned between them. Randy felt he signed the first one too fast, and Phil called it vague. So the FMDS form carries six dated milestones, client ownership of the code and data, and, after an amendment on 3 Sep 2026, a right for either side to leave at the end of month six. That window opens around late January 2027.

Around the signed forms are the ones that did not close. A client-services proposal was deferred by the client in June. Two marketing forms, $36K and $180K, were marked lost on 14 Oct when the Director of AI turned strategy away from marketing alone. The $36K form was then rewritten as OF #004, a strategy retainer for the whole organisation at $10K a month, stepping to $5K from month four if the client chooses. SRR, worth about $120K, is in early scoping.

Sources: Drive: signed order forms, MSAs and Amendment No. 1; Drive: OF-004 drafts; Account OS; Sync WE Strategy, 30 Jun 2026; Next Steps AI CS, 4 Jun 2026.

### Chapter 4. The product and why it is built this way

The client's own system has three levels. L1 is the person doing the work, L2 the team board, L3 the executive board. The product follows that shape. FMDS OS serves L1 and L2: a board for each department with targets, daily readings, a place to give a reason and an activity when a KPI is red, the 8-step problem-solving flow, and a library of standard work. Leadership OS serves L3: the weekly T3 review in presentation mode, a ledger of commitments drawn from meetings and email, leader standard work, the org chart, and Hoshin planning. Both read one data store, and one login opens both.

Each has an AI employee. Patch, inside FMDS OS, knows the 8-step method and the standard work, and can build a KPI, set targets from an uploaded sheet or draft a procedure, in English or Spanish. Chief, inside Leadership OS, is a Hermes agent with memory, one per executive, that sends a daily brief and follows up in Teams.

Several choices explain the rest. The build started on the spreadsheets and replaces them one department at a time, so value came before clean data. The board shows both posted and incoming revenue because both are right and people are paid on one of them. There is no drill-down to single transactions, because Randy called it a management system and not a data lake. The 8-step only opens on repeated misses, because Eric Freeman's method treats a single miss as coaching. Each executive has a separate agent, because a shared one exposed the CEO's email. Floor boards stay on the wall, because standing at them is how people are developed.

Sources: Advisory, 4 Jun 2026; World Emblem Eng Questions, 23 Jun 2026; BC Revenue Mapping, 18 Aug 2026; Supernal Weekly Update, 3 Sep 2026; FMDS 8-Step & Standard Work, 12 Aug 2026; WE Sync: Weekly Planning, 5 Oct 2026; Operations FMDS, 13 Oct 2026; Check-In, 12 Nov 2026.

### Chapter 5. How delivery has gone

Delivery has been fast on build and slow on everything that needs the client. The team began FMDS work a week before signature. By 30 Jul, 57 KPIs ran end to end. A soft launch with the sales leaders on 4 Aug stalled on target entry, so the team built templates and bulk assignment, piloted with two reps, and onboarded all 24 sales and service staff on 28 Aug, 13 days after the contract date. The 8-step engine met its 15 Sep date.

Then the pace met three walls. First, revenue. Randy ruled that every number must tie to the general ledger, and the source was argued three ways in August. On 9 Sep he saw $1.54M on the board against about $2M elsewhere; nine days later the cause was found in a client-side roll-up that had missed two reps. The fix held, but full trust waits on a Business Central API that the client's own team took on in September and has not delivered. Second, HR data sits in ADP behind a privacy objection. Third, marketing missed its September date when a connector key died and the new Director of AI cooled on the work.

Health fell to At risk for two weeks around the end of September. It recovered in October: IT and Marketing boards went live, the executive review moved onto Leadership OS on 21 Oct, and Randy tied bonuses to using the system. In November the help centre launched and two more boards went live. Three Linear milestones are past their dates, and one engineer leaves on 20 Nov.

Sources: Linear; Supernal Weekly Update, 30 Jul 2026; FMDS Onboarding series, 4 to 28 Aug 2026; Supernal Dashboard Troubleshooting, 18 Sep 2026; Notion: Weekly Account Health Reporting; WE Sync: Weekly Planning, 26 Oct 2026; Drive: World Emblem - Weekly review, 5 Nov.

### Chapter 6. The people

Randy Carr is the reason the account exists and its largest risk. He decides quickly, treats a verbal yes as binding, uses the product daily, and pushes his team to use it. He also judges value hard: at the QBR he dismissed a $100K saving because no one had left the payroll.

Eric Freeman, who runs organisational development and came from Toyota, is the authority on method. He became a champion in June, trained the Supernal team on 8-step and standard work in August, and is the buyer for SRR.

Carlos Mitchell has changed most. In June he was a marketing lead who doubted the floor system was the best use of money. Randy made him Head of AI. In September he questioned Supernal's code and wanted to build in-house. By October he had a signed AI plan, a budget, and a target of three times his team's cost in value, and at the QBR Randy told him to use Supernal to get there. On 11 Nov he agreed the strategy retainer. He also holds the key to Business Central.

Phil Jarvis, the CIO, signed the FMDS form after redlining it, uses the IT board, and retires at the end of December; Martin Gonzalez takes over. Tony Morando and JC Carr lead sales and service and were the first real users. Gabriella Diorico, Randy's assistant, moves files and runs the review.

On Supernal's side, Nick Agresti opened and holds the relationship, Tauseef Rahman built the prototypes and leads delivery, Ricardo Morel leads engineering, and Dominik Springer now leads strategy with Carlos.

Sources: Quarterly Business Review, 29 Oct 2026; Sync WE Strategy, 30 Jun 2026; WE Internal Bi-Weekly Sync, 16 Sep 2026; WE strategy update | WE offsite, 5 Oct 2026; Scoping Next Phase, 11 Nov 2026; Account OS.

### Chapter 7. What value has shown

The clearest value so far is truth about the client's own numbers. The team produced the company's first map of where its KPIs come from: 646 KPIs, of which 99 had no source, 92 had never been filled and 66 pointed to sources that did not exist. Six of eight executive sheets were broken. About $500K of service revenue was missing from view because of one hidden column. Safety formulas carrying $8.55M of targets were reading the wrong data. Of 695 standard-work documents, 255 were duplicates.

The second value is speed. A red KPI used to take two weeks to reach a sheet and up to a month to reach an executive. Where boards are live it now shows the same day. Two people who compiled data have been freed, and more than 1,000 commitments have been captured from meetings that used to depend on the CEO's own list.

What has not yet shown is the outcome the contract names: time recovered and problems solved. The 8-step completion rate has not moved from 19%. Randy has been direct about what he wants next: an activity logged against a red KPI, the KPI returning to green, and a dollar figure that ties to the annual plan. He also asked for shared KPIs to open the next quarterly review, in a form he can show his bank. Supernal has not yet mapped KPI movement to revenue.

Sources: Quarterly Business Review, 29 Oct 2026; Drive: 20261021_qbr; World Emblem QBR Walkthrough, 28 Oct 2026; Strat², 5 Nov 2026; Drive: World_Emblem_-_Supernal_MSA.pdf.

### Chapter 8. Where it stands and what is next

The next 30 days carry a lot. The strategy retainer should go to Carlos on 14 Nov and start on 16 Nov if signed; it is still unsigned. Saad's last day is 20 Nov, with Doren newly in and an onboarding checklist not yet written. On 30 Nov four Linear milestones fall due (Operations, Finance, IT and Quality, and the AI COO), and the client owes its own decision on whether to build AI in-house, with a partner, or both. Operations and Finance cannot finish without the Business Central API.

Behind those dates is a contract clock. The FMDS form lets either side leave at the end of month six, around late January 2027, and the client's notice could come as early as late December. Randy's own deadlines land in the same weeks: all nine boards live by 31 Dec, Excel gone by 1 Jan. Phil, who signed the FMDS form, retires then.

Three things would make the account safe. Get the Business Central feed, so revenue on the board is beyond argument. Move the 8-step number, with Eric and a named adoption owner, so the contract's own measure improves. And show one red KPI turned green with a dollar value, because that is the proof Randy has asked for. The upside is real: Carlos named Supernal his AI partner for 2027, SRR is wanted by both Eric and Randy, and Randy and Eric already act as references.

Sources: Account OS; Linear; Drive: Amendment_No1_World_Emblem_FINAL.pdf (exit timing inferred); Drive: 20261021_qbr; Supernal Weekly Touchpoint, 8 Oct 2026; Weekly Pipeline Meeting, 11 Nov 2026.

### Chapter 9. Lessons this account teaches

A few things here are worth carrying to other accounts. The first sale came from showing the buyer his own system within a day of getting his files, not from a proposal. The second came from doing real analysis inside the first: errors found in the CEO's own dashboard did more than any demo. Presenting findings before features, as on 2 Jul, set the order of the conversation.

The contract improved with the client's criticism. Milestones, code ownership and a month-six exit made the second form easier to sign and gave the CIO a reason to put his name on it.

The hard lessons are about dependence. Client-side access to core systems was never in Supernal's hands, and it has gated three departments for three months. Building ahead of adoption left a working problem-solving engine with almost no completions. Pitching marketing while the new Director of AI was forming his own plan cost goodwill; stepping back and helping him meet his goals won it back and produced the retainer. And a single sponsor is both the engine and the exposure: two named users on the executive product is a concentration the Linear plan itself calls out.

Sources: Tauseef/Seb, 29 May 2026; Advisory, 2 Jul 2026; Sync WE Strategy, 30 Jun 2026; WE Internal Bi-Weekly Sync, 16 Sep 2026; Linear; Notion: World Emblem Strategy.

---

## 14. Gaps and conflicts

### Could not find or access

- Account OS has no stakeholders, success-plan goals, cadence events, value entries or renewal plan for this account; health history starts 5 Oct 2026 (Account OS).
- No WE-specific margin figure anywhere.
- No signed copy of OF #004; no record of the 9 Apr 2026 discovery call; no written pattern deck shown before 28 May 2026.
- Not opened: "World Emblem Order Form #2 + Supernal document.pdf", the combined MSA + Amendment PDF, the two project-plan sheets, the internal meeting decks, the deprecated OF-004 draft, the two Phil Jarvis call notes of 21 May, and any claude.ai artifact or Loom link.
- Slack: #acnt-world-emblem-internal before 9 Jun 2026 and most thread bodies were not read; #acnt-world-emblem-deployment was read only for 11 to 13 Nov 2026 (it is an automated alert feed).
- Notion: FMDS OS Product Strategy, FMDS OS Deal Strategy and Full Product Architecture pages not fetched; the Notion deal page is an empty template.
- Meetings with no notes yet: T3 of 11 Nov, CS/OC review and Strat of 12 Nov 2026. Fathom summaries were barely used; Granola and local notes carried the load.
- Linear issues were not searched one by one, so "no Linear issue" in section 10 is inferred from the task file.
- Linear has no status update on Leadership OS, and the only FMDS OS update is from 2 Sep 2026 (Linear).

### Where sources disagree

| Topic | Versions | Sources |
|---|---|---|
| Order form numbering | Signed: #1 advisory, OF-002 Leadership OS, OF-003 FMDS. Others: Leadership OS as OF-001 (brief, Linear), as "Order Form #1" (Readout); FMDS as OF-002 or OF2 (2 Jul draft, July notes) | (Drive: signed PDFs; Linear; Drive: Executive Readout; local: world-emblem-artifact-audit.html) |
| Advisory close and MSA | Closed 5 May (Account OS); Randy signed 4 May, MSA effective 5 May | (Account OS; Drive: MSA 1) |
| FMDS signature date and price | 22 Jul at $15K/month (signed PDF, Account OS); "23 Jul at $23k"; "a $25,000 form" | (Drive: World_Emblem_-_Supernal_MSA.pdf; Delivery Planning Weekly, 27 Jul 2026; Randy's Marketing Memo, 23 Jul 2026) |
| Leadership OS price | $10K/month, $120K (signed); case study says $15K | (Drive: world-emblem-of-002-v1-signed.pdf; local: world-emblem-case-study.md) |
| Leadership OS deliverable count | 29 (signed); about 25 or about 36 in notes | (Drive: world-emblem-of-002-v1-signed.pdf; advisory notes) |
| Prototype build time | One day; four hours | (Advisory, 21 May 2026; World Emblem Context, 27 May 2026) |
| OF #004 minimum | $75K (CRM, v2 draft); "$90K" in one note; "$180K to $120K" retainer in a Notion health note | (Account OS; Drive: OF-004 v2; Scoping Next Phase, 11 Nov 2026; Notion: Weekly Account Health Reporting) |
| OF #004 and SRR | Two separate $120K deals (CRM); "2027 retainer converting to SRR model" | (Account OS; Delivery Sync, 9 Nov 2026) |
| Marketing strategy form | $3K/month unsigned; "$5K/month"; "signed, pending Carlos" | (Slack, 28 Aug 2026; GTM + Scoping, 9 Sep 2026; Sync: Dominik & Tauseef, 4 Sep 2026) |
| Safety targets | $8.55M; $8.5M | (Quarterly Business Review, 29 Oct 2026, Granola vs local notes) |
| Standard work counts | 255 of 695; about 1,000; 247 of 818 | (QBR, 29 Oct 2026; QBR roadmap, 22 Oct 2026; Standard work clean up, 30 Oct 2026) |
| KPI totals | 646; 656; breakdown 99/92/66 vs 171/77/165/35 | (QBR; WE strategy update, 5 Oct 2026; vault: world-emblem.yaml › e00fd847) |
| Departments live | 2 of 9 run the weekly loop (QBR); 4 of 7 off the spreadsheet (5 Nov deck); 4 of 9 (Notion, 2 Nov) | (Drive: 20261021_qbr; Drive: World Emblem - Weekly review, 5 Nov; Notion) |
| Department deadline | 6+ by 31 Dec; all nine by 31 Dec; all remaining by 30 Nov; all boards by mid-2027 | (WE Sync, 28 Sep 2026; Drive: 20261021_qbr; Supernal Weekly Update, 5 Nov 2026; QBR) |
| 8-step | "19% to 60%" stated as progress on 16 Sep; zero completions on 10 and 28 Sep; 19% is the historical baseline | (WE Internal Bi-Weekly Sync, 16 Sep 2026; WE Sync, 28 Sep 2026; QBR) |
| 9 Sep revenue discrepancy | Which side showed $2M and which $1.54M differs between Granola and local notes | (T3, 9 Sep 2026) |
| Sales/Service go-live | 28 Aug; 31 Aug; 1 Sep 2026 | (Linear; Drive: strategy drafts) |
| Leadership OS "live" | 9 Jul (strategy draft); 10 Sep (task file) | (Drive: 20260922_strategy_draft.pptx; vault: world-emblem.yaml › we-leados-live) |
| QBR date | File named 21 Oct; held 29 Oct; one note says 31 Oct | (Drive: 20261021_qbr; QBR) |
| Company size | Revenue $100M, $105M or $150M; staff 1,500, 1,600 or 1,700 | (Drive: Executive Readout; Slack, 10 Sep 2026; Drive: 20261021_qbr) |
| Growth target | $250M in three years; in five years; $175M by 2029 and $250M by 2031 | (Notion: World Emblem Strategy; Slack, 10 Sep 2026; Drive: 20261021_qbr) |
| AI employee names | Patch vs Mark (Notion account page); Chief vs AI CEO | (Notion; Slack) |
| Origin of the relationship | Tauseef at Abundance 360 (case study); Nick's pitch (other notes) | (local: world-emblem-case-study.md; World Emblem Context, 27 May 2026) |
| 18 Nov visit | Session with Randy (5 Nov deck); Randy and Carlos away (11 Nov note) | (Drive: World Emblem - Weekly review, 5 Nov; Tauseef / Nick WE vid clip, 11 Nov 2026) |
| Titles | Carlos: Director of Brand, digital marketing lead, Head of AI, Director of AI. Jim Kozel: COO, once CFO. CIO spelled "Phil Jenkins" in the Readout | (various) |
| Proposal file | Named "Leadership OS", contains the Client Services proposal | (Drive: World_Emblem-Proposal-Leadership OS.html) |
| Data vendor quoted to Carlos | "Centric", "Sentric", "possibly Syntax"; likely one vendor mis-transcribed (inferred) | (Scoping Next Phase, 11 Nov 2026; World Emblem | Strat Sync, 11 Nov 2026) |
