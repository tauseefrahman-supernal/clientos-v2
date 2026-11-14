# RxVIP: ClientOS context document

Written 13 Nov 2026. Depth: DEEP. Sources read: Account OS (account, health history, 3 deals), 71 local meeting-note files (19 May to 10 Nov 2026; notes sections, not full transcripts), 14 Granola notes not held locally (7 Apr to 15 May, and 16 Oct to 11 Nov), Fathom summary scan (47 matches, Jul to Nov), Linear team RXVIP (1 project, 9 milestones, 97 issues), Drive (three "RxVIP" folders plus 12 recording folders; 3 documents opened in full), Slack #acnt-rxvip-internal (22 Sep to 12 Nov read; link search back to 15 Sep), Notion (account page, deal page, Pharmacy OS page, weekly report 2 to 6 Nov, GTM update 12 Nov). Patient names that appear in sources are left out on purpose.

---

## 1. Snapshot

- **Who.** RxVIP is the trading name of Syntrixs LLC (d/b/a RxVIP Network), owned by Dan Benamoz, a pharmacy operator in Boca Raton, Florida, who runs a small group of independent pharmacies (Rayne Medicine Shoppe in Louisiana is the pilot) and has ambitions to manage tribal-owned pharmacies (Drive: RxVIP + Supernal document.pdf; RxVIP x SupernalAI: Part 1, 8 Apr 2026).
- **What they bought.** Order Form #1, signed 14 May 2026: a $45,000 one-time build of one AI Employee that works the PioneerRx Priority Fill queue (9 deliverables, 23 points), plus a $1,500 per location per month Operational Fee once live (Drive: RxVIP + Supernal document.pdf). The Operational Fee was never started (Linear RXVIP-65, canceled).
- **Where it stands.** OF#1 was closed by Dan on 22 Sep 2026 (Linear; Account OS). The AI Employee runs at one store, Rayne, 7am to 7pm on weekdays, and covers about 35% of the store's scripts, because cycle fills (about half of volume) sit in a different PioneerRx queue that was never in scope (Path Forward Alignment, 4 Nov 2026). Development has been paused since late October pending a new contract (RxVIP Sync: Weekly Planning, 9 Nov 2026).
- **The deal in motion.** Order Form #2 has been rejected three times in different shapes since 28 Sep. A fourth shape ($4,000 a month for about 90 days, then $4,500, then $2,500 plus per-script fees) was accepted verbally by Dan on 11 Nov and drafted as "RxVIP: Order Form #002" on 12 Nov; it is with Thomas Bustos for review and is unsigned (Slack #acnt-rxvip-internal, 11 and 12 Nov 2026; Drive: RxVIP: Order Form #002).
- **Pod.** Nick Agresti (AM), Tauseef Rahman (strategist), Doren Gore (FDE) (Account OS). Stuart Childs joined for expansion on 15 Sep; Johnny Borbone took over the commercial conversation with Dan from 4 Nov (RxVIP Weekly, 15 Sep 2026; Deal Desk Weekly Review, 10 Nov 2026).
- **Health.** 2.8 out of 5, band Watch, recorded 6 Nov 2026 by Nick for the week of 2 to 8 Nov. Dimensions: Tech 1 (critical flag), Build 2 (low flag), Strategic Defensibility 3, Exec Engagement 4, GM 4. No score yet for the week of 9 Nov; it is due (Account OS). The Notion weekly report for the same week says Critical (Notion: RxVIP (Nov 2 - Nov 6)).

**Why health is low.** The score is an equal-weight mean of five dimensions, and two of them drag it down (Account OS):

1. **Tech has been 1 in every recorded week since 5 Oct.** The dimension carries no written note, so the reasons below are read from the meetings and are (inferred) as the scorer's reasons. PioneerRx has no public API, so the AI Employee drives a Windows desktop app by clicks (Progress + Way Forward, 22 Sep 2026). PioneerRx throws undocumented pop-ups and CAPTCHA challenges, crashes often (90 failed restarts in one day in late October), and there is no test environment, so every fix ships to the live pharmacy (RxVIP Sync: Weekly Planning, 26 Oct 2026; Notion search result, RxVIP (Oct 19 - Oct 23)). The private LLM access was suspended once for sending CAPTCHA screenshots (OF2 Scope Discovery, 18 Sep 2026). A refill bug rewrote past fill dates, including on a controlled substance, which affects state monitoring reports (RxVIP Weekly, 13 Oct 2026).
2. **Build has been 2 since 5 Oct.** The build covers about 35% of store scripts and completes roughly 40% of what it picks up; the Linear milestone "AI Employee Runs 100% of Rayne Volume" was due 28 Oct and shows 0%; nothing has been built since late October because no order form is signed (Path Forward Alignment, 4 Nov 2026; Linear; RxVIP Sync: Weekly Planning, 9 Nov 2026).
3. **Strategic Defensibility is 3.** Dan is moving stores from PioneerRx to DRX, a pharmacy system whose AI data entry costs 12 cents a script and covers all script types (Path Forward Alignment, 4 Nov 2026).
4. **Exec Engagement moved from 1 to 4.** It was 1 on 9 and 16 Oct, when the weekly work ran through Andrea and Dan was not in the room; it rose to 3 and then 4 once Nick and Johnny were speaking to Dan weekly (Account OS health history).
5. **Score history:** 2.2 (week of 5 Oct, At risk), 2.2 then revised to 2.6 (week of 12 Oct), 2.6 (week of 19 Oct), 2.8 (week of 26 Oct), 2.8 (week of 2 Nov) (Account OS).

---

## 2. Structure of this account

### Entities

| Entity | What it is | Source |
|---|---|---|
| Syntrixs LLC (d/b/a RxVIP Network) | The contracting client. Signs the MSA, both order forms and the BAA. Billing contact Dan Benamoz. | (Drive: RxVIP + Supernal document.pdf) |
| Rayne Medicine Shoppe, Rayne, Louisiana | The pilot store and the only store where the AI Employee is live. Andrea Bourque's own store. Uses PioneerRx since 2020. No compounds. | (Kickoff, 19 May 2026; RxVIP Weekly, 7 Oct 2026; Linear) |
| Second Louisiana store, written "Delone's", "DeLone's", "Delray" and "Del Rey" in different sources | Next store in the rollout. Does compounds. | (RxVIP Weekly, 11 Aug 2026; Linear) |
| New Iberia store | Highest volume, about 7,000 to 8,000 scripts a month, does compounds. Onboarding was set for 28 Oct, moved to 29 Oct, then frozen. | (RxVIP Weekly, 27 Oct and 3 Nov 2026) |
| Samantha's store, Illinois | Pays TJM Labs $2,500 a month for a competing bot. Dan's first choice for the next rollout on 22 Sep. | (Progress + Way Forward, 22 Sep 2026) |
| Hub City, Lubbock, Texas | Dan's second priority on 22 Sep because of payroll cost. | (Progress + Way Forward, 22 Sep 2026) |
| CommandRx and SynapseRx | Dan's own software, built by Mathieu "Mat" Silverstein: a multi-tenant Next.js monorepo on Neon and Vercel covering finance reporting and a pharmacist consultation app. The AI Employee's data is meant to feed it. | (RxVIP x SupernalAI: Part 1, 8 Apr 2026; Supernal AI x RxVIP, 6 May 2026) |
| TigerBytes | The pharmacies' IT provider (Andre Duplantier). Controls the workstation, VPN and remote access. | (Technical Sync, 24 Jun 2026) |
| PioneerRx | The pharmacy system the AI Employee operates. Not a party, but every constraint on the build comes from it. | (many) |

The four stores named in the draft Order Form #002 are Rayne, Delray, New Iberia and a fourth still marked TBC (Drive: RxVIP: Order Form #002).

### Contract stack

1. **MSA**, dated 14 May 2026, between Infinity Constellation Inc. (d/b/a Supernal) and Syntrixs LLC. Signed by Eric Kravitz and Dan Benamoz (Drive: RxVIP + Supernal document.pdf).
2. **Business Associate Agreement** (Schedule A), same date, covering patient data under HIPAA (Drive: RxVIP + Supernal document.pdf).
3. **Order Form #1**: the build plus the per-location Operational Fee. Complete.
4. **Order Form #2**: four versions so far, none signed (see Commercials).

### Order Form #1: what was sold

One AI Employee, "PioneerRx Fill Automation", 23 points across 9 deliverables, listed in build order (Drive: RxVIP + Supernal document.pdf):

| # | Deliverable | Points | What happened |
|---|---|---|---|
| 1 | Priority Fill queue monitor and Rx classification | 2 | Done (Linear RXVIP-20) |
| 2 | e-Script processing through F12 fill | 4 | Done (Linear RXVIP-5, 23) |
| 3 | Missing patient, prescriber and drug record creation | 4 | Done (Linear RXVIP-17) |
| 4 | Adjudication watcher and automatic label printing | 2 | Canceled (Linear RXVIP-16) |
| 5 | MTM doctor-cancellation handler | 1 | Done (Linear RXVIP-11) |
| 6 | Exception queue and escalation routing | 2 | Done, but delivered as PioneerRx tasks instead of a separate screen (Linear RXVIP-1; Check-In, 21 Aug 2026) |
| 7 | Technician pre-check station workflow | 2 | Canceled; the pre-check queue is where technicians verify the AI's work (Linear RXVIP-21; RxVIP Weekly, 3 Aug 2026) |
| 8 | Patient "prescription ready" SMS, two-way | 2 | Canceled (Linear RXVIP-14) |
| 9 | Patient reply intent classifier | 4 | On hold, moved under OF#2 (Linear RXVIP-13) |

Work added during OF#1 that the order form did not list: refill, IVR, auto-refill and batch fill script types (the order form names e-Scripts and IVR refills only), denial queue automation, unmatched MTM matching by date of birth, a private vision LLM for pop-ups, the 7am to 7pm run window, and a claim system for more than one instance (Linear RXVIP-18, 44, 45, 40, 73; RxVIP Weekly, 30 Jun and 11 Aug 2026). So four of the nine contracted deliverables were not built as written, and at least five pieces of unlisted work were built instead. No change order recording that swap was found.

### Phases as tracked in Linear

Project "RxVIP Pharmacy AI Platform", lead Tauseef, started 19 May 2026, target 31 Aug 2026, status In Progress (Linear):

| Milestone | Target | Progress |
|---|---|---|
| Engineering & Data Foundation Built | 30 Jun 2026 | 100% |
| AI Employee Fills Orders Independently in PioneerRx | 7 Jul 2026 | 100% |
| AI Employee Completes the Order Lifecycle, Patient Communication Included | 31 Jul 2026 | 100% (four of its issues canceled) |
| AI Employee Runs All Fill Requests Independently | 15 Aug 2026 | 100% |
| Fill Workflow Verified Across 500 End-to-End Fill Cases | 31 Aug 2026 | 100%, cleared 21 Sep at 517 completed of 1,419 processed |
| Andrea Sign-Off and OF#1 Close-Out | 22 Sep 2026 | 100% |
| AI Employee Runs 100% of Rayne Volume | 28 Oct 2026 | 0% |
| AI Employee Running Across New Stores: 5 Stores Onboarded | 30 Nov 2026 | 25% |
| OF#2 Scope and Multi-Site Expansion | 31 Dec 2026 | 25% |

### How the pieces connect

The AI Employee is a packaged Windows program (.exe) on a dedicated machine inside the store. It logs in to PioneerRx, works the Priority Fill queue in a fixed order (e-scripts, future fills, IVR, auto-refill, batch fill), sends unknown pop-ups to a private LLM, and creates a PioneerRx task for a person whenever it cannot finish a script (RxVIP Weekly, 3 Aug and 29 Sep 2026; Check-In, 21 Aug 2026). Its state store was meant to move from local SQLite to Mat's Neon database so that several stores and CommandRx could share it; that move is stuck on a restricted credential, a security review by Mat and a BAA (Linear RXVIP-53, 81, 102, 103). Each new store needs its own machine, its own PioneerRx account and a setup visit by Doren (RxVIP Sync: Weekly Planning, 26 Oct 2026; Technical Sync, 24 Jun 2026).

### Every deal

| Title | Value | MRR | Stage | Dates | Note |
|---|---|---|---|---|---|
| RxVIP (Order Form #1) | $45,000 | $0 | Closed Won, one-time | Closed 15 May 2026 | Owner Nick. Pod Nick, Tauseef, Doren. (Account OS) |
| RxVIP Pharmacy OF1 Completion | $22,500 | not set | Closed Won, then removed | Closed 22 Sep 2026 | Removed record. It was the second half of the build fee, billed 23 Sep after completion was confirmed on the 22 Sep call. (Account OS) |
| Order Form #2 | $48,000 | not set | Order Form | Expected close 16 Nov 2026 | Next step text still reads "Need to reduce per pharmacy cost and come back with new plan." Updated 11 Nov. (Account OS) |

Sources disagree on the OF#2 value: Account OS holds $48,000; the Deal Desk on 3 Nov called it $60K; the 28 Sep draft was $120,000; the 12 Nov draft commits $12,000 (Account OS; Deal Desk Weekly Review, 3 Nov 2026; Drive: both order form drafts).

---

## 3. Arc

Meeting counts are unique meetings found for the account (client and internal), from local notes plus Granola.

**Q1 2026 (pre-sale).** Dan came in through outreach. By 25 Mar he had asked for a 90-minute session; on 27 Mar an internal sync logged a problem where Dan's developer questioned Supernal's legitimacy (Weekly Pipeline Review, 25 Mar 2026; Sync: Consulting Process, 27 Mar 2026; that note was not opened in full).

**Apr 2026 (about 7 meetings).** Discovery on 8 Apr: Dan described managing tribal-owned pharmacies, 6 locations opening in 7 months, a possible 41 Indian Health Service clinics in Oklahoma and 200 stores by the end of 2027, and a goal of 1,000 prescriptions a day with four or fewer people. Supernal first proposed a three-track co-development plan (engineering foundation, platform build, AI employees) of 62 point-scored pieces at 12 points a month; Dan's ceiling was $5,000 a month per location and he wanted payback within a year (RxVIP x SupernalAI: Part 1, 8 Apr 2026; New note, 28 Apr 2026).

**May 2026 (about 8 meetings).** The team found that TJM Labs, a competitor Dan already used, automates PioneerRx by browser and vision automation because PioneerRx has no API, and that the broad platform proposal could not meet Dan's 1 Jun date. The scope was cut to one clear module: PioneerRx fill automation. Andrea became the main contact because she gave realistic answers. The order form was signed 14 May, scope reviewed with Andrea 15 May, kickoff held 19 May (TGM Labs Pharmacy Integration Strategy, 1 May 2026; Sync: Eric & Tauseef, 12 May 2026; Scope Review, 15 May 2026; Kickoff, 19 May 2026).

**Jun 2026 (10 meetings).** A month of access and infrastructure trouble: a shared workstation that staff also used for printing, no test account (PioneerRx quoted about $2,000 a month for one and then stopped answering), Tailscale held up by a HIPAA review, a surprise password lock that cost a day. First demos on 11 Jun (queue monitor, dummy patient) and 23 Jun (a test e-script filled end to end). On 30 Jun the pod admitted internally that it had sold an "agent" and built click automation, and set a two-phase plan (RxVIP Weekly, 2, 9, 16, 23 and 30 Jun 2026; Progress Update I, 11 Jun 2026; RxVIP sync on future integration, 30 Jun 2026).

**Jul 2026 (6 meetings).** Live testing exposed the pop-up problem. Andrea rejected rule-based fixes twice and pointed at TJM Labs adapting faster. Supernal committed to a vision LLM. By 15 Jul the AI Employee had filled 50+ live e-scripts and refills without help, and Dan laid out a bigger vision (phone intake, texting, sync programs) (RxVIP Weekly, 7 Jul 2026; Testing & Review, 8 and 10 Jul 2026; Update II, 15 Jul 2026).

**Aug 2026 (12 meetings).** Private LLM for pop-ups shipped (3 Aug). All five script types automated (11 Aug). Daily live testing began. On 17 Aug the AI Employee idled all day because PioneerRx queues do not refresh on their own. First numbers on 21 Aug: 276 processed, 110 completed, 40%. Exception handling moved to PioneerRx tasks. On 25 Aug Andrea delivered PioneerRx's list of 169 edit-flag rules (RxVIP Weekly, 3, 11, 18 and 25 Aug 2026; Check-In, 21 Aug 2026).

**Sep 2026 (12 meetings).** Andrea away until 12 Sep. On 17 Sep the private LLM access was suspended for processing CAPTCHA screenshots. On 21 Sep the internal status went red: 31 cases in a week, 6 cases an hour. On the same day the 500-case target cleared (517 completed) and Andrea confirmed OF#1 complete. On 22 Sep Dan closed OF#1 at the monthly review and the OF#2 roadmap was shown. OF#2 was priced at $10,000 a month on 23 Sep and presented 28 Sep (OF2 Scope Discovery, 18 and 21 Sep 2026; RxVIP Sync: Weekly Planning, 21 Sep 2026; Progress + Way Forward, 22 Sep 2026; Confirm RxVIP Order Form #2 Pricing, 23 Sep 2026).

**Oct 2026 (10 meetings).** Dan rejected OF#2 because others could deploy similar capability for a $10K integration and $400 a store (Slack #acnt-rxvip-internal, 30 Sep 2026). He sent the DRX price list and asked for a product that competes with DRX; the pod drafted a Pharmacy OS vision, then dropped it. On 7 Oct the "missing volume" was traced to cycle fills, which Andrea's technician processes by hand. On 13 Oct the refill date bug surfaced. Pricing moved to a per-task model; Nick presented it to Dan on 30 Oct and it did not land (Sync: RxVIP OF 2 Pricing, 5 Oct 2026; RxVIP Weekly, 7 and 13 Oct 2026; Confirm Variable Costs, 29 Oct 2026; The Numbers for a Win-Win, 30 Oct 2026).

**Nov 2026 to date (5 meetings).** Three options sent 2 to 3 Nov. On 4 Nov Dan asked why the build covers 35% and said he is moving stores to DRX; Johnny told him to use DRX if confident and to come back for what DRX does not do. Scope was redefined as cycle fills plus a learning loop, about 95% coverage. Cycle-fill walkthrough with Andrea on 10 Nov. Dan said yes to the $4,000 a month plan on 11 Nov. Order Form #002 drafted 12 Nov (RxVIP Weekly, 3 and 10 Nov 2026; Path Forward Alignment, 4 Nov 2026; Slack #acnt-rxvip-internal, 11 and 12 Nov 2026).

---

## 4. Why they bought

There were several causes, and they changed over time.

**Why Order Form #1.**

1. **A labour target, not a software wish.** Dan wanted a pharmacy that handles 1,000 prescriptions a day with four or fewer people, against 200 a day with two or three in an average store (RxVIP x SupernalAI: Part 1, 8 Apr 2026).
2. **A deadline.** A first tribal pharmacy was due to open 1 Jun 2026 and Dan wanted something working by then (New note, 28 Apr 2026).
3. **A competitor already in the building.** TJM Labs was installed at one of Dan's stores (onboarded in about 3 days by VPN and remote login) and cost $2,500 a month at Samantha's store. Supernal was positioned as the custom option against TJM's one-size product; Nick suspected Dan was running the two against each other (Kickoff, 19 May 2026; TGM Labs Pharmacy Integration Strategy, 1 May 2026).
4. **Ownership.** Dan and Mat already had CommandRx and wanted to own what was built, with the code able to join their repository (Progress Update I, 11 Jun 2026). This reason came back in November as the main argument against DRX (Johnny / Dan 1:1, 11 Nov 2026).
5. **A narrowed, concrete scope.** The first proposal (62 points across three tracks) was too broad. The deal closed only after it was cut to one module with a clear finish, with Andrea as the realistic voice (Sync: Eric & Tauseef, 12 May 2026). The 12 May note priced that module at $15,000 a month; the signed form is a $45,000 one-time build plus $1,500 a location a month. No source explains the change (Drive: RxVIP + Supernal document.pdf).
6. **What Andrea wanted from it.** To free pharmacists and technicians from e-script entry so they can counsel patients and run clinical programs, not to beat a person on speed (RxVIP Weekly, 11 Aug 2026).

What was analysed or shown before signing: the TJM Labs technical overview (Drive: TJM Labs Technical Overview May 2026.pdf), an overlap analysis of TJM against Dan's software (TGM Labs Pharmacy Integration Strategy, 1 May 2026), and a point-scored proposal. No clickable prototype was found for the first sale.

**Why Order Form #2 kept failing, and what unlocked it.**

- 28 Sep: $10,000 a month retainer. Rejected because Dan could not see how to resell it against cheaper tools (Slack #acnt-rxvip-internal, 30 Sep 2026).
- Early Oct: a completion fee of $22.5K plus $1.5K a store. Rejected against DRX's list price (Notion: RxVIP: Pharmacy OS Vision, Prototype and Economics).
- 30 Oct: $10,000 a month plus 20 cents a script split 11 to Dan and 9 to Supernal. Dan said the 40-pharmacy assumption was unrealistic and $10K was an enterprise price for a small operator (The Numbers for a Win-Win, 30 Oct 2026).
- 11 Nov: $4,000 a month for about 90 days. Accepted. What changed: Johnny joined and could make decisions live on the call; the price fell below Supernal's own cost; the scope became one sentence Dan cared about (finish the build to about 95% of scripts); costs were shown line by line instead of as a bundled retainer; and Dan would own the product, which DRX cannot offer (Deal Desk Weekly Review, 3 and 10 Nov 2026; Johnny / Dan 1:1, 11 Nov 2026).

---

## 5. Commercials

### Order Form #1 (signed 14 May 2026)

- Build Fee $45,000, one-time, non-refundable, billed 50% on signing and 50% when all nine deliverables are ready for production (Drive: RxVIP + Supernal document.pdf). The second $22,500 was billed 23 Sep (Account OS).
- Operational Fee $1,500 per location per month from live deployment, covering model and API costs, infrastructure, monitoring, adaptation to PioneerRx changes and business-hours support; capped at 20 locations; a Variable Cost Review lets Supernal propose a higher fee if direct costs pass $1,500 a location in 30 days (Drive: RxVIP + Supernal document.pdf).
- The Operational Fee was never charged. The Linear issue to start it was canceled, and when Dan heard the $1,500 figure again in late October he reacted badly; he believed he was paying $15,000 to $17,000 in total (Linear RXVIP-65; Catchup: Nick & Tauseef, 26 Oct 2026).
- No delivery date is written in the order form; three months was a verbal expectation (RxVIP sync on future integration, 30 Jun 2026).
- The order form describes the AI Employee as "browser-based"; PioneerRx is a Windows desktop application (Drive: RxVIP + Supernal document.pdf; Progress Update I, 11 Jun 2026).

### Every Order Form #2 price discussed

| Date | Shape | Outcome | Source |
|---|---|---|---|
| 23 to 28 Sep | $10,000 a month for 12 months ($120,000), 51 points, 8 points a month; OF#1 Operational Fee continues | Rejected by Dan | (Drive: RxVIP x Supernal: Order Form #2) |
| 23 Sep | $1,500 per pharmacy rollout fee, separate | Rejected | (RxVIP Sync: Weekly Planning, 5 Oct 2026) |
| 30 Sep | Nick's target: $10K to $15K development and under $400 a pharmacy | Internal direction | (Slack #acnt-rxvip-internal, 30 Sep 2026) |
| 5 Oct | $16K to $20K a month retainer, free for Dan's 7 stores, 15% of what Dan charges new pharmacies | Not presented as an order form | (Sync: RxVIP OF 2 Pricing, 5 Oct 2026) |
| 16 Oct | Per completed task; DRX's 12 cents as benchmark, Dan floated 25 cents; plus a $10K to $15K a month development retainer | Internal | (Account OS health note, 24 Oct 2026) |
| 28 Oct | Pharmacy pays 30 cents a script, Dan keeps 20, Supernal 10, plus $10K retainer | Internal; Thomas said 30 cents will not sell against DRX | (Rx VIP pricing and pharmacy expansion strategy, 28 Oct 2026) |
| 29 to 30 Oct | $10K a month; 20 cents a completed task, 11 to Dan and 9 to Supernal; no setup or per-pharmacy fee; Dan owns all IP | Presented by Nick; not accepted | (Confirm Variable Costs, 29 Oct 2026; The Numbers for a Win-Win, 30 Oct 2026) |
| 2 to 3 Nov | Three options. 1: roll out the 35% build, $250 a store onboarding, $100 a store a month plus 9 cents a task. 2: full coverage. 3: MedSync call bot, about $16K a month, unscoped | Dan did not choose | (Deal Desk Weekly Review, 3 Nov 2026) |
| 7 Nov | $16,000 total, $4,000 a month for 4 months, exit at month 3; then no monthly fee, 9 cents a completed script until 10 pharmacies, then 5 cents; $500 per new pharmacy | Internal one-pager | (Slack #acnt-rxvip-internal, 7 Nov 2026) |
| 10 Nov | $12K for 3 months, then per-script | Agreed at Deal Desk | (Deal Desk Weekly Review, 10 Nov 2026) |
| 11 Nov | $4,000 a month build; $4,500 a month between completion and 10 pharmacies; $2,500 a month after 10 pharmacies, with variable script fees; $12,000 committed | Dan said yes | (Johnny / Dan 1:1, 11 Nov 2026; Slack #acnt-rxvip-internal, 11 Nov 2026) |

The price for Option 2 on 2 to 3 Nov is recorded three ways: about $10K a month (RxVIP Weekly, 3 Nov 2026), "$8K over six months" (Deal Desk Weekly Review, 3 Nov 2026) and $8K a month for six months plus $500 a store (Notion: RxVIP (Nov 2 - Nov 6)).

### Draft Order Form #002 (12 Nov 2026, unsigned)

- Phase 1, about 90 days: $4,000 a month, scripts free, $12,000 committed. Phase 2, until 10 pharmacies are live: $4,500 a month plus $0.09 per completed script. Phase 3, 10 or more pharmacies: $2,500 a month plus $0.05 per completed script. $500 once per new network pharmacy. Scripts handed to a person carry no fee. Model and infrastructure costs included (Drive: RxVIP: Order Form #002).
- Term 12 months, auto-renewing, 30 days' notice. Client may exit at the Phase 2 start with 15 days' notice before Day 90. If rollout runs past Day 90, Phase 1 continues at $4,000 (Drive: RxVIP: Order Form #002).
- It replaces the OF#1 Operational Fee and all ongoing OF#1 obligations (Drive: RxVIP: Order Form #002).
- Renewal date: none is set in Account OS (renewal plan empty, risk Medium, driver "Overall health on watch"). Notion still shows 15 Aug 2026, the old 90-day mark. If signed on the expected close date, the 12-month term would end about 16 Nov 2027 (inferred) (Account OS; Notion account page).

### Margin

- Cost to Supernal during the build: $6,500 a month (half of Doren, a quarter of Tauseef, 15% of Nick), against $4,000 billed, a loss of $2,500 a month, about $10,000 carried over four months (Johnny / Dan 1:1, 11 Nov 2026; Slack #acnt-rxvip-internal, 7 Nov 2026).
- After launch the one-pager assumed about $600 a month of Doren's time and 3,000 completed scripts per pharmacy per month; at 9 cents and 4 stores that is $1,080 a month in. Model and infrastructure cost per script has not been measured (Slack #acnt-rxvip-internal, 7 Nov 2026).
- Earlier floors: breakeven $9.6K a month, or $115K a year for one mason plus a third of a strategist; minimum acceptable $120K a year (Rx VIP pricing and pharmacy expansion strategy, 28 Oct 2026). The signed-off plan sits well below that floor. Naveen approved outcome-based pricing as a one-off that will not be repeated (Deal Desk Weekly Review, 10 Nov 2026).
- Johnny's stated intent: hold about $4K a month until Dan passes 10 pharmacies, and staff it lightly (Slack #acnt-rxvip-internal, 10 Nov 2026). He also described pricing to Dan as cost plus 45%, which does not match a build phase run at a loss (Johnny / Dan 1:1, 11 Nov 2026).

### Unresolved

- Section 8, Ownership, is flagged in the draft as the main open item, including the rate for a self-hosting migration sprint (Drive: RxVIP: Order Form #002).
- Fourth store name and Dan's signing title are TBC (Drive: RxVIP: Order Form #002).
- Whether Dan has decided: Slack on 11 Nov says he said yes and is ready to sign; Johnny's call note of the same day says Dan is reviewing and will respond next week (Slack #acnt-rxvip-internal, 11 Nov 2026; Johnny / Dan 1:1, 11 Nov 2026).
- HIPAA readiness for network pharmacies (BAAs, subprocessor list, data handling) was called unresolved on 9 Oct and again in the 12 Nov GTM update (Fathom: GTM + Scoping, 9 Oct 2026; Notion: RxVIP - 2026-11-12).
- MedSync and inbound call agent: Tauseef is to scope it and price it before the holidays. Reference prices so far: about $500 a month per pharmacy on top of a $370 base, telecom minutes separate (Johnny / Dan 1:1, 11 Nov 2026).

---

## 6. Product

### What exists

**The AI Employee (Priority Fill).** Unnamed; "Al", "Phil", "Albert" and "Andrea" were floated and nothing was decided (RxVIP Weekly, 22 Sep 2026; Progress + Way Forward, 22 Sep 2026). The team writes "AIE". A Windows program that works the PioneerRx Priority Fill queue: reads each fill request, matches patient, prescriber and drug, fills fields from SIG codes, presses F12, and moves on. Handles five script types: e-script, future fill, IVR, auto-refill, batch fill. Also clears the denial queue, cancels doctor-cancelled MTM items and matches unmatched MTM by date of birth (RxVIP Weekly, 3 and 11 Aug 2026; Linear). Used by: nobody directly; it runs unattended, and Andrea's technicians (Anna, Charlie, Amelie) work the tasks it creates. State: live at Rayne only, weekdays 7am to 7pm, auto-started by Windows Task Scheduler (Slack #acnt-rxvip-internal, 30 Sep and 11 Oct 2026).

**Pop-up handler.** First a deterministic rule list, then a private vision LLM that receives a screenshot when the program is blocked for more than 3 seconds, then a local knowledge base checked first with the LLM as fallback, then Andrea's 169 PioneerRx edit-flag rules loaded in (RxVIP Weekly, 3 and 25 Aug 2026; RxVIP Sync: Weekly Planning, 28 Sep 2026). CAPTCHA screens are never sent to the LLM since the 17 Sep suspension (OF2 Scope Discovery, 18 Sep 2026). State: live, covers under half of what appears; about 1,000 pop-up types are thought to exist (Path Forward Alignment, 4 Nov 2026).

**Human hand-off through PioneerRx tasks.** When a script cannot be finished, the program creates a task assigned to everybody, with the reason, in PioneerRx's own task list. State: live since late August (Check-In, 21 Aug 2026).

**Operator dashboard.** A Windows screen built by Doren in October: live counts of processed, completed and handed-off scripts, error screens, start, stop, pause. State: built and shown to Andrea 27 Oct; not rolled out as the default because switching it on first disabled auto-start; rework requested (Slack #acnt-rxvip-internal, 21 Oct 2026; RxVIP Sync: Weekly Planning, 26 Oct 2026).

**Run log and daily numbers.** A Google Sheet "Testing Log August 2026" filled by Doren, plus per-run CSV logs on the store machine. State: sheet in use and still being edited on 13 Nov; the CSVs could not be copied off the machine for weeks because of an IT restriction (Drive file list; RxVIP Sync: Weekly Planning, 28 Sep and 5 Oct 2026).

**Neon data path.** Schema, queue tables and device-to-pharmacy binding for a shared cloud database, reviewed by Mat, who asked for six security changes (row-level isolation per pharmacy, audit event on every state change, a "saving" state, lease checks, emergency shut-off). State: in review; no test database with two pharmacies yet (Slack #acnt-rxvip-internal, 25 Sep 2026; Linear RXVIP-81, 97, 98).

### Planned in the draft Order Form #002

Store dashboard per store and per day; cycle fills at Rayne (week 4); fixed rules with reason codes (week 6); learning loop with a review screen (week 10); packaged install and onboarding runbook; rollout to 4 stores (about day 90) (Drive: RxVIP: Order Form #002).

### Discussed and not in the current draft

eFax and incoming documents intake, handwritten prescription reading, PhilRx (also written FillRx) two-platform operation, compounds, insurance eligibility search, patient SMS, a MedSync call bot, phone answering, prior authorisation, a full pharmacy operating system (Drive: RxVIP x Supernal: Order Form #2; Progress + Way Forward, 22 Sep 2026; Notion: Pharmacy OS page).

### Feature rationale

1. **Drive the screen, because there is no API.** PioneerRx offers API access only to selected partners; the first check the team made (Progress + Way Forward, 22 Sep 2026; TGM Labs Pharmacy Integration Strategy, 1 May 2026).
2. **Pilot at Rayne, not at the busiest or the short-staffed store.** Andrea chose her own store because she is on site weekly and did not want to hand an unfinished system to a store already onboarding TJM (Kickoff, 19 May 2026).
3. **Test in production during agreed windows.** There is no PioneerRx staging copy, so testing ran before opening and in blocks where staff stayed out of the queue (RxVIP Weekly, 23 Jun and 3 Aug 2026).
4. **Vision LLM for pop-ups instead of size or position rules.** Andrea rejected rules as unscalable and cited TJM's adaptive approach; the 47-page manual documents no pop-ups (Testing & Review, 8 Jul 2026; Update II, 15 Jul 2026).
5. **Private, tenant-isolated model.** Screenshots contain patient data, so they go to a private model, not a public API (RxVIP sync on future integration, 30 Jun 2026; Update II, 15 Jul 2026).
6. **Hand-offs live inside PioneerRx's task list.** Keeps staff in the tool they already use and avoids a second portal (RxVIP Weekly, 7 Jul 2026; Check-In, 21 Aug 2026).
7. **Skip the pre-check queue.** It is where technicians verify the AI's work, so automating it removes the check (RxVIP Weekly, 3 Aug 2026).
8. **E-scripts first, refresh after every script.** Future fills were being worked first and the program rested 15 minutes between cycles, so e-scripts for waiting customers sat for 3 hours (RxVIP Weekly, 29 Sep 2026).
9. **Weekdays 7am to 7pm only.** Insurers restrict fill hours, and many states require staff on site; a 24-hour run was agreed on 22 Sep and reversed within weeks (Progress + Way Forward, 22 Sep 2026; RxVIP Weekly, 7 Oct 2026).
10. **Never solve CAPTCHA or critical comments.** Critical comments mark drug interactions and allergies and must reach a pharmacist; CAPTCHA handling caused the model suspension (Testing & Review, 8 Jul 2026; RxVIP Weekly, 10 Nov 2026).
11. **A person keeps the patient sync warning step in cycle fills.** Deciding which medicines to fill needs patient calls and notes; the AI Employee only works the resulting queue (RxVIP Weekly, 10 Nov 2026).
12. **Say "agent" or "AI employee", never "bot", with the client.** Nick's rule, because that is what was sold (RxVIP sync on future integration, 30 Jun 2026).

---

## 7. Use cases and feedback

### Use cases by team

- **Pharmacy technicians at Rayne:** stop typing e-scripts and refills; work only the tasks the AI Employee hands off; verify its entries in the pre-check queue (RxVIP Weekly, 3 and 12 Aug 2026).
- **Pharmacist and operations lead (Andrea):** arrive to an empty queue and spend time on counselling, blood pressure monitoring and sync programs (RxVIP Weekly, 11 Aug 2026; RxVIP Weekly, 22 Sep 2026).
- **Owner (Dan):** cut payroll, run stores on thinner crews, and resell the tool to other PioneerRx pharmacies in his network (Progress + Way Forward, 22 Sep 2026; The Numbers for a Win-Win, 30 Oct 2026).
- **Mat:** receive store-level data in CommandRx (Update II, 15 Jul 2026).

### Usage numbers over time

| Period | Processed | Completed | Rate | Source |
|---|---|---|---|---|
| To 15 Jul | 50+ live fills | all | n/a | (Update II, 15 Jul 2026) |
| Two weeks to 21 Aug | 276 | 110 | 40% | (Check-In, 21 Aug 2026) |
| OF#1 total, 10 Aug to 21 Sep, 26 run days, 160 hours | 1,419 | 517 | 36% | (Progress + Way Forward, 22 Sep 2026) |
| Week of 14 Sep | 31 | n/a | n/a | (RxVIP Sync: Weekly Planning, 21 Sep 2026) |
| Week to 5 Oct | 399 | 173 | 43% | (RxVIP Sync: Weekly Planning, 5 Oct 2026) |
| Week to 13 Oct | 511 | 269 | 47% | (RxVIP Weekly, 13 Oct 2026) |
| Week to 26 Oct | 483 | 188 | 39% | (RxVIP Sync: Weekly Planning, 26 Oct 2026) |
| October | 4,206 picked up of 5,769 in the Priority queue | 1,728 | 41% | (RxVIP Weekly, 10 Nov 2026) |

Other figures: average 90 seconds a case by 22 Sep, down from about 7 minutes; 7.3 cases an hour over OF#1; zero errors where the AI Employee entered wrong data during OF#1, all non-completions being hand-offs; hand-off reasons during OF#1 were 30% unknown pop-ups, 20% errors such as no stock, 11% routed by rule, 17% new errors caught (Progress + Way Forward, 22 Sep 2026). October hand-offs: 2,480, of which 45% PioneerRx pop-ups and 28% other issues such as unreadable e-scripts (RxVIP Weekly, 10 Nov 2026). A Slack post on 5 Nov is titled as completion moving from 9.4% to 23% for the Rayne store; its content was not readable (Slack #acnt-rxvip-internal, 5 Nov 2026).

Adoption: the Notion report scores usage 3, "Driven: core team uses it" (Notion: RxVIP (Nov 2 - Nov 6)). Andrea's team applied a 4-hour rule from September: any script sitting more than 4 hours is processed by hand (RxVIP Weekly, 22 Sep 2026).

### Feedback and what changed

| Feedback | From | What changed | Source |
|---|---|---|---|
| Rule-based pop-up handling will not scale | Andrea, 7 to 8 Jul | Vision LLM built, shipped 3 Aug | (Testing & Review, 8 Jul 2026; RxVIP Weekly, 3 Aug 2026) |
| The AI sat idle all day with a full queue | Andrea, 18 Aug | Queue refresh added; start moved to 7am; two technicians asked to watch and email | (RxVIP Weekly, 18 Aug 2026) |
| Tell me the moment something breaks | Andrea, 16 Jun and 13 Oct | Escalation rule: email all three of Tauseef, Doren and Stuart with screenshots | (RxVIP Weekly, 16 Jun and 13 Oct 2026) |
| Still slow | Samantha via Andrea to Dan, 22 Sep | Layout caching, button fingerprints, pop-up watcher; plain fills 2.2 times faster | (Progress + Way Forward, 22 Sep 2026; Slack #acnt-rxvip-internal, 26 Sep 2026) |
| Scripts sat untouched for hours | Andrea, 22 and 29 Sep | E-scripts first, refresh after each script, 15-minute rest removed | (RxVIP Weekly, 29 Sep 2026) |
| The AI is changing old fill dates | Andrea, 13 Oct | Refill detection by Rx number; filled date only written when empty; log of affected scripts for Andrea to audit | (RxVIP Weekly, 13 Oct 2026; Slack #acnt-rxvip-internal, 13 Oct 2026) |
| Do not run on days we are closed | Andrea, 13 Oct | Weekday-only schedule; holiday calendar requested; a holiday view posted 12 Nov | (RxVIP Weekly, 13 Oct 2026; Slack #acnt-rxvip-internal, 12 Nov 2026) |
| I want a trend report each meeting | Dan, 22 Sep | Promised; no evidence it was delivered | (Progress + Way Forward, 22 Sep 2026) |
| Why does it cover 35% | Dan, 4 Nov | Scope reset to cycle fills plus learning loop | (Path Forward Alignment, 4 Nov 2026) |
| Day supply on old scripts is being changed on renewals | Andrea, 10 Nov | Open; Andrea to send examples | (RxVIP Weekly, 10 Nov 2026) |

---

## 8. Stakeholders

### Client

| Person | Title and role | At the start | Now | Last notable interaction |
|---|---|---|---|---|
| Dan Benamoz | Owner of Syntrixs LLC; signs and pays. Aged 68 at the time of the sale. | Big vision, unrealistic dates, largely absent from weekly work (Sync: Eric & Tauseef, 12 May 2026) | Engaged weekly since late October, price-driven, moving stores to DRX, still wants to own the product. Nick described him internally as very inconsistent (Slack #acnt-rxvip-internal, 30 Oct 2026) | 11 Nov 2026 call with Johnny: accepted $12,000 over 3 months (Johnny / Dan 1:1, 11 Nov 2026) |
| Andrea Bourque | Pharmacist, runs day-to-day operations; point of contact for operations in both order forms. Account OS: Supporter, Medium influence, placed 24 Sep. | Careful and exacting; set two hard rules at kickoff (no changes without her approval; clinical messages go to a person) (Kickoff, 19 May 2026) | The account's working champion; argued for finishing cycle fills before anything new and asked to be in every Dan meeting (Notion: RxVIP (Nov 2 - Nov 6)) | 10 Nov 2026 cycle-fill and learning-loop walkthrough (RxVIP Weekly, 10 Nov 2026) |
| Mathieu "Mat" Silverstein | Dan's developer; built CommandRx and SynapseRx; technical contact in both order forms | Wanted the code in his monorepo; was said to claim a platform was ready when little was built (Sync: Eric & Tauseef, 12 May 2026) | Careful reviewer of the Neon design; Dan says he is not a fit for ongoing engineering (The Numbers for a Win-Win, 30 Oct 2026) | Email exchange on domain for alert emails and Neon test results, late Oct (RxVIP Sync: Weekly Planning, 26 Oct 2026) |
| Meagan Loschiavo | Dan's assistant; a 26 Oct note also calls her his sister. Schedules Dan. | Scheduler | Same | On the 4 Nov call (Path Forward Alignment, 4 Nov 2026) |
| Andre Duplantier | TigerBytes, the pharmacies' IT provider | Offered to image a PioneerRx server onto an isolated machine (Technical Sync, 24 Jun 2026) | Gatekeeper for machine access and file copy | Jun to Oct access requests |
| Samantha | Runs the Illinois store that uses TJM Labs | Not involved | Source of the "still slow" comment; Dan later credited the AI with keeping her store going on a thin crew (Notion: RxVIP (Nov 2 - Nov 6)) | Indirect only |
| Anna | Technician at Rayne; processes cycle fills by hand, about an hour a day | Not involved | Key to the cycle-fill build | 10 Nov 2026 (RxVIP Weekly, 10 Nov 2026) |
| Charlie | Andrea's assistant, on site daily; backup contact for logins | n/a | Same | (RxVIP Weekly, 7 Jul 2026) |
| Amelie, Leah, Jasmine, Shauna | Technicians and staff named for monitoring, queue hand-off and template exports | n/a | n/a | (RxVIP Weekly, 12 and 18 Aug 2026; Scope Review, 15 May 2026) |

Account OS holds one stakeholder only (Andrea). Dan, Mat and Meagan are not on the power map (Account OS).

### Supernal team over time

- **Nick Agresti**, account executive and account manager from the first call; owner of all three deals (Account OS). On 30 Jun he called RxVIP his lowest priority (RxVIP sync on future integration, 30 Jun 2026).
- **Tauseef Rahman**, strategist and project lead from discovery; runs the weekly, writes the order forms, decks and pricing models.
- **Doren Gore**, forward-deployed engineer, sole builder, full-time on RxVIP until late October, when he asked about other work; joining World Emblem in November (RxVIP Sync: Weekly Planning, 26 Oct and 9 Nov 2026).
- **Naveen Lekkalapudi**, head of engineering: feasibility, private LLM, CAPTCHA mitigation, pricing floor.
- **Ryan Williams**, CRO: on discovery and the monthly reviews.
- **Eric Kravitz**: contract structure and signatory in May.
- **Stuart Childs**: introduced 15 Sep to take over expansion from Nick; recorded one health score.
- **Thomas Bustos**: pricing models from October; reviews Order Form #002.
- **Johnny Borbone**: joined the Dan conversation 4 Nov; closed the verbal yes on 11 Nov.
- **Lucas Stein**: Pulse and work-product setup (Sep). **Devan**: posted "Human Led for RxVIP" on 13 Oct (content not read).

---

## 9. Success and value

### Success criteria and KPIs

| Criterion | Baseline | Target | Current | Source |
|---|---|---|---|---|
| New prescription started every 30 seconds through parallel instances; full process within 2 minutes | Manual 15 seconds to a few minutes | 30 seconds start rate | One instance, about 90 seconds a case | (Progress Update I, 11 Jun 2026; Progress + Way Forward, 22 Sep 2026) |
| 500 fills verified end to end | 0 | 500 by 31 Aug | 517 on 21 Sep, three weeks late | (Linear) |
| Autonomous operation at 90 days | n/a | 15 Aug | Reached for five script types; not for the whole store | (Update II, 15 Jul 2026) |
| Cases per hour | 6 to 12 | 40 to 50 | 7.3 over OF#1 | (RxVIP Weekly, 18 and 25 Aug 2026; Progress + Way Forward, 22 Sep 2026) |
| Completion rate of scripts picked up | 40% (Aug) | not set; order form calls completion figures targets, not warranties | 41% (October) | (Check-In, 21 Aug 2026; RxVIP Weekly, 10 Nov 2026) |
| Share of total store scripts covered | not measured before October | about 95% after cycle fills and learning loop | about 35% | (Path Forward Alignment, 4 Nov 2026) |
| Run 100% of Rayne's reachable Priority Fill volume, staff operate it without Supernal | 80 to 90 of about 350 a day | 100% by 28 Oct | Called 100% of in-scope volume on 7 and 13 Oct; milestone shows 0% in Linear | (Linear; RxVIP Weekly, 7 and 13 Oct 2026) |
| 5 stores onboarded | 1 | 5 by 30 Nov | 1 | (Linear) |
| Accuracy | n/a | Dan's bar: 99% | Zero wrong-entry errors reported in OF#1; then the refill date bug in October | (RxVIP x SupernalAI: Part 1, 8 Apr 2026; RxVIP Weekly, 13 Oct 2026) |
| Dan's grade | n/a | B or B+ | Ryan asked for a grade on 22 Sep; the Fathom summary records a B | (Progress + Way Forward, 22 Sep 2026; Fathom summary, 22 Sep 2026) |

The KPI written into the draft Order Form #002: share of each store's in-scope script volume completed end to end, shown as completed, correctly handed to a person, and not reachable, daily on the dashboard (Drive: RxVIP: Order Form #002).

### Value shown to the client

- OF#1 deck on 22 Sep: 1,419 processed, 517 completed, 90 seconds average, 160 hours of operation (Progress + Way Forward, 22 Sep 2026).
- Dan said on 4 Nov that the stores are keeping up on a thin crew and credited the technology (Notion: RxVIP (Nov 2 - Nov 6)). On 30 Oct he reported a manager saying she would be badly stuck without it (The Numbers for a Win-Win, 30 Oct 2026).
- Cost comparisons used in pricing: a technician costs about 76 cents a script at $23 an hour; DRX charges 12 cents; Supernal proposes 9 cents (Rx VIP pricing and pharmacy expansion strategy, 28 Oct 2026).
- No dollar value has been recorded in Account OS (value entries empty; success plan has no goals) (Account OS).

### What the sponsor has asked to see

- A trend report at each review (Dan, 22 Sep) (Progress + Way Forward, 22 Sep 2026).
- The split of new prescriptions against refills, and time per script by type (Dan, 30 Oct) (The Numbers for a Win-Win, 30 Oct 2026; Slack #acnt-rxvip-internal, 3 Nov 2026).
- 100% script coverage first, then the MedSync call bot, at a cost he can resell with a small margin, and an answer to why the build covers 35% (Notion: RxVIP (Nov 2 - Nov 6)).
- Unit costs for onboarding and maintenance, separate from development (The Numbers for a Win-Win, 30 Oct 2026).

---

## 10. Delivery now

| Workstream | State | Milestone % and date | What is measured | What was learned | Blocker |
|---|---|---|---|---|---|
| AI Employee at Rayne (five script types) | Live, in maintenance; no development since late Oct | 0%, 28 Oct (Linear) | Picked up, completed, handed off, per day | Scope must be checked against the store's real queues, not a list of script types (Notion: RxVIP (Nov 2 - Nov 6)) | Day-supply bug on renewals open; PioneerRx crashes |
| Cycle fills | Scoped 10 Nov; not started | Week 4 after signature (draft OF#002) | Cycle-fill scripts completed | A person must keep the sync-warning step (RxVIP Weekly, 10 Nov 2026) | Order form unsigned |
| Fixed rules and learning loop | Rules partly defined 10 Nov; not started | Week 6 and week 10 after signature | Hand-offs by reason code | 60% of pick-ups are handed off; unreadable e-scripts are a large share and rules will not fix them | Needs Andrea's drug list, examples and videos from staff |
| Operator dashboard and controls | Built; not default | Linear RXVIP-104 and 83, Planned | Run status, errors | Auto-start and manual controls must both work | Rework not done; no test machine |
| Neon production data path | In review | Linear RXVIP-81 In Review; 103 Planned | n/a | Tenant isolation has to be in before a second store | Restricted credential, two-pharmacy test database, BAA |
| Store rollout (Delray, New Iberia, a fourth) | Frozen since 3 Nov | 25%, 30 Nov (Linear) | Stores live | A store needs a machine, credentials and a setup visit | Dan's decision; machine per store (RXVIP-58, due 15 Oct, still Planned) |
| Onboarding handbook | Not started | RXVIP-66, due 28 Oct, Planned | n/a | n/a | Promised 22 Sep |
| Order Form #002 | Drafted 12 Nov, in review | Expected close 16 Nov (Account OS) | n/a | Send a directionally right proposal fast (Deal Desk Weekly Review, 10 Nov 2026) | Ownership section; 4th store; Dan's signature |
| MedSync and call agent | To be scoped | Pricing before the holidays | n/a | DRX does not offer it | Not started |

**Decisions waiting.**
- Approve Order Form #002 and settle Section 8 (Ownership) and the self-hosting migration rate: Thomas, Johnny, Nick (Slack #acnt-rxvip-internal, 12 Nov 2026).
- Name the fourth store and Dan's signing title (Drive: RxVIP: Order Form #002).
- Whether alert emails go from Supernal's domain or RxVIP's; Mat said Supernal's, Doren says the client's (RxVIP Sync: Weekly Planning, 26 Oct 2026).
- What to do about unreadable e-scripts: improve reading or carve them out of the KPI (RxVIP Weekly, 10 Nov 2026).
- Who replaces Doren's hours as he moves onto World Emblem, given the plan assumes half of his time (RxVIP Sync: Weekly Planning, 9 Nov 2026; Johnny / Dan 1:1, 11 Nov 2026).

**Slipping.**
- "AI Employee Runs 100% of Rayne Volume", due 28 Oct, 0% (Linear).
- RXVIP-58 dedicated machine per store, due 15 Oct; RXVIP-66 handbook and RXVIP-67 Rayne rollout, due 28 Oct (Linear).
- Nine issues due 31 Aug still In Progress or Planned, including RXVIP-41, 53, 54, 55, 57, 59 (Linear).
- Linear has had no update since 28 Oct, and an automated check has flagged the project as Behind in Slack about every two days since 25 Sep with no reply seen (Linear; Slack #acnt-rxvip-internal).
- Revised cost and timeline promised to Dan for 6 Nov went out on 11 Nov (Notion: RxVIP (Nov 2 - Nov 6)).

**Commitments with no Linear issue found.**
- Trend report for Dan at each review (22 Sep).
- Learning-loop artifact for Andrea's review: fixed rules, learning items, out of scope (Tauseef, 10 Nov).
- Day-supply bug investigation (Doren, 10 Nov).
- Log of scripts whose dates were changed, for Andrea's audit (27 Oct).
- PioneerRx crash-frequency data for Andrea to send to PioneerRx (27 Oct).
- New-versus-refill breakdown and October logs for Dan (3 Nov).
- Pulse web dashboard with numbers only (3 Nov).
- MedSync and call agent scope and pricing (11 Nov).
- Cycle fills and learning loop themselves (no issues yet).

**Dates in the next 30 days.**
- 16 Nov 2026: expected close of Order Form #2 (Account OS).
- Week of 16 Nov: Dan responds on the proposal; Johnny reconnects on the call-agent exercise (Johnny / Dan 1:1, 11 Nov 2026).
- 17 Nov: next weekly with Andrea (inferred from the Tuesday cadence).
- 30 Nov: Linear targets for five stores onboarded and for Delray and New Iberia onboarding (Linear).
- Before the holiday season: MedSync and call agent pricing to Dan (Johnny / Dan 1:1, 11 Nov 2026).
- About 14 Dec: Milestone 1 (cycle fills and store dashboard) if signed on 16 Nov (inferred from "end of week 4").

---

## 11. Artifacts

Links to claude.ai artifacts are given without their share keys.

### Drive

| Title | Kind | Date | Owner | Where | What it is for |
|---|---|---|---|---|---|
| RxVIP (shared-drive account folder: Client Facing, Commerical Contracts, Internal Facing, Transcripts) | folder | 24 Jun 2026 | Supernal shared drive | https://drive.google.com/drive/folders/1xWiimQd_2NJeZzD0RTC8IyeKcZRMOv_0 | Main account folder |
| RxVIP + Supernal document.pdf | order form | 14 May 2026 | Eric Kravitz, Dan Benamoz | https://drive.google.com/file/d/1T0rR07QiLsfOjt_VLriFF7PHj8TeRu_M/view | Signed MSA, Order Form #1 and BAA |
| RxVIP x Supernal: Order Form #2 | order form | 22 to 28 Sep 2026 | Tauseef | https://docs.google.com/document/d/1CyvUvaXcQvfTJWr14mBVUPnS-XO93yxfBRe-0D1Gwpo/edit | First OF#2: $10K a month, 51 points, 7 milestones. Rejected |
| RxVIP: Order Form #002 | order form | 12 Nov 2026 | Tauseef | https://docs.google.com/document/d/1YTXupDzq7C3qzOQYa8lrteAqHGD5yIryZE147w_txJw/edit | Current draft: $4,000, $4,500, $2,500 phases. In review |
| rxvip-of-002-v1-draft.docx | order form | 28 Oct 2026 | not stated | https://drive.google.com/file/d/1G8cZlnHdD46vENrWaW6fLrU2q-ymauqx/view | Earlier Word draft (not opened) |
| rxvip-of-002-v2-draft.docx | order form | 12 Nov 2026 | not stated | https://drive.google.com/file/d/1fKih7tWetgkjJF2QK_fJ04a8daUMOrcV/view | Word version of the current draft (not opened) |
| RxVIP (second folder holding the two .docx drafts) | folder | 28 Oct 2026 | Supernal shared drive | https://drive.google.com/drive/folders/1pw0OEEFR7JDztj1Db-HwuyYveCBLxn8H | Order form drafts |
| RxVIP (Rayne Pharmancy): Testing Log August 2026 | spreadsheet | 21 Aug 2026, edited 13 Nov | Doren, Tauseef | https://docs.google.com/spreadsheets/d/1OaEvGhdK2rLq3xidL15UuJEOpDexQ2-UdcIrXSd7NdI/edit | Daily run numbers; the record of performance (not opened) |
| RxVIP: Monthly Review, Sep 15 2026 | deck | 15 to 22 Sep 2026 | Tauseef | https://docs.google.com/presentation/d/1mM5CJJAAL3pEIdlikvYAaIFi6FEKO843tQDNrHaIQ-8/edit | OF#1 results and OF#2 roadmap shown to Dan 22 Sep |
| RxVIP: Monthly Review Jul 15, 2026 | deck | 15 Jul 2026 | Tauseef | https://docs.google.com/presentation/d/13lUCQTIWq7ho7_kx8Nru2XAeGg_m_D2VjDblR6JM94A/edit | Phase 1 review for Dan and Mat |
| AI Employee Client Alignment Document.pdf | doc | 15 Jul 2026 | not stated | https://drive.google.com/file/d/1P7_OByxMJmme2MMXJGCC89Tmx7Z55PQF/view | Alignment document on the AI Employee (not opened) |
| Dev Pipeline Architecture (June).pdf | doc | Jun 2026 | Doren (inferred) | https://drive.google.com/file/d/1HAcu6bXXLCto1G42UFarLSDKIV9wyhS0/view | Development pipeline diagram |
| Pioneer RX: Tech Course notes.pdf | doc | Jul 2026 | not stated | https://drive.google.com/file/d/1UTB_J6hDMat8uB00mSmu8q-3SfH_vO_q/view | Notes from the PioneerRx course; knowledge base source |
| Pioneer RX: Training Manual Notes.pdf | doc | Jul 2026 | not stated | https://drive.google.com/file/d/1rn7k37G1AQdJOVurOpX5OWzNXiQ7lKgl/view | Notes on the PioneerRx manual |
| RxVIP x Supernal: Kickoff | doc | 19 May to 4 Jun 2026 | Tauseef | https://docs.google.com/document/d/1y3sp07OKevkyDXoGL2LoKYDL0Ysxv8UO39vmGyC3_bg/edit | Kickoff document |
| TJM Labs Technical Overview May 2026.pdf | doc | 21 May 2026 | TJM Labs, via client | https://drive.google.com/file/d/1dfAa0oDNqp2cfzO0A2OYCKuXyseMqWxq/view | Competitor's technical overview |
| Pioneer RX (subfolder of Internal Facing) | folder | 15 May 2026 | Supernal shared drive | https://drive.google.com/drive/folders/1TY6VpH6JU_v5fVPyqso1EwYqBkzjFvgA | PioneerRx reference material (contents not listed) |
| Rafferty Ventures: Weekly Update, Sep 16 | deck | 16 Sep 2026 | not stated | https://docs.google.com/presentation/d/1w1yutCrsggfx6jMYkjSvenM9ptbzFTQI46_k4yGHwfg/edit | Misfiled: another client's deck sitting in RxVIP's Client Facing folder |
| RxVIP (third folder) with two "Notes by Gemini" docs | folder | 11 Jun and 15 Jul 2026 | Supernal shared drive | https://drive.google.com/drive/folders/1TDG5Mi7jMUQ5tvopQ28nnlJg9LEEQ4uC | Gemini notes of Progress Update I and Update II |
| Order form doc linked from Linear | order form | not stated | not stated | https://docs.google.com/document/d/1cAS4kdq5zzBIWNdVv9Uw2v_Yyiy0dBStFFDBEEtRsuU/edit | Linked as "OrderForm" in the Linear project (not opened) |
| The call with Dan (notes doc) | doc | about 28 Sep 2026 | Nick | https://docs.google.com/document/d/1n22Hzmeo1lf_kC6SfqUymWpmS7bCB1mFl8kzkYnPFEc/edit | Notes of the call where Dan rejected OF#2 (not opened) |
| RxVIP: Where the AI Employee Stands | deck | 15 Oct 2026 | Tauseef | https://docs.google.com/presentation/d/1VAw2PZcy0nRhU7dyqGPD57DaFaArwD8UqmjHYBWJvWM/edit | Slides explaining why the product looked short and why it was not |
| Video of the 30 Oct call with Dan | video | 30 Oct 2026 | Nick | https://drive.google.com/file/d/1mVDUH9dSSplFe0Mz6ych_oqakd3h69d6/view | Recording of "The Numbers for a Win-Win" |
| 12 meeting recording folders in Tauseef's My Drive (11 Aug to 4 Nov) | video | Aug to Nov 2026 | Tauseef | Drive, parent 1JyCVX8DvvVGkqySA2BogUj2n3NdDW6MY | Recordings of weeklies, pricing calls and the 4 Nov alignment call |

### Shared in Slack

| Title | Kind | Date | Owner | Where | What it is for |
|---|---|---|---|---|---|
| Monthly Review site | site | 22 Sep 2026 | Tauseef | https://monthly-review-rxvip.links.getsupernal.ai/ | Hosted monthly review for the 22 Sep meeting |
| RxVIP Pricing Model | dashboard | 5 Oct 2026 | Thomas | https://claude.ai/artifact/RZDZgyuRL2yPHGceAD7VnJ | Retainer and revenue-share pricing model |
| Pharmacy OS repositioning | doc | 6 Oct 2026 | Tauseef | https://claude.ai/artifact/XNV7ZMZucFxh6EFdRGBR3o | Proposal to reposition RxVIP as an AI-native pharmacy operating system, for Naveen's review |
| Pricing calculator V1 | dashboard | 27 Oct 2026 | Tauseef | https://claude.ai/artifact/JZVYn1f7S8K9kkr3vLH9Cx | Per-script pricing calculator |
| Win-win partnership pitch | deck | 29 Oct 2026 | Tauseef | https://claude.ai/artifact/Pz3RfeBd4cYZB2n48mgb2F | Deck for Nick's 30 Oct call with Dan |
| Storytelling deck for the 4 Nov call | deck | 4 Nov 2026 | Tauseef | https://claude.ai/artifact/6kBy94BSwGNQ4z1ALmtU11 | Explains the three options |
| Three-slide deck for the 4 Nov call | deck | 4 Nov 2026 | Tauseef | https://claude.ai/artifact/HDcoujVJsxzVCG2BKi2NMG | Refined after Thomas's feedback; presented to Dan |
| One-pager for Dan and the numbers behind it | proposal | 7 Nov 2026 | Tauseef | Slack #acnt-rxvip-internal (attachment not opened) | $16,000 over 4 months, then per-script |
| Johnny's proposal for Dan | proposal | 10 Nov 2026 | Johnny | Slack #acnt-rxvip-internal (attachment not opened) | What was sent before the 11 Nov call |
| RxVIP Holiday dashboard | dashboard | 12 Nov 2026 | Doren | Slack #acnt-rxvip-internal (not opened) | Holiday schedule for the AI Employee |
| Holidays for the AI Employee | doc | 15 Oct 2026 | Tauseef | Slack #acnt-rxvip-internal (not opened) | Days the AI Employee should not run |
| Human Led for RxVIP | doc | 13 Oct 2026 | Devan | Slack #acnt-rxvip-internal (not opened) | Proposal to use people to fill gaps the AI leaves |
| Pulse Onboarding | doc | 25 Sep 2026 | Tauseef | Slack #acnt-rxvip-internal (not opened) | Putting RxVIP tracking on Pulse |
| Crash report and dashboard .exe update | doc | 21 and 29 Oct 2026 | Doren | Slack #acnt-rxvip-internal (not opened) | PioneerRx crash record; dashboard build status |
| Reply to Mat's security review | doc | 25 Sep 2026 | Doren | Slack #acnt-rxvip-internal | Six agreed changes to the Neon queue design |

### Notion, Linear and other systems

| Title | Kind | Date | Owner | Where | What it is for |
|---|---|---|---|---|---|
| RxVIP account page | doc | updated 31 Aug 2026 | Tauseef | https://app.notion.com/p/3a7bd5e8f3188199b28bcbd46da463c1 | Account record, hygiene checklist, links to 16 weekly reports |
| Weekly Account Health reports (16, 20 Jul to 6 Nov) | doc | weekly | Tauseef, drafted by RIC | Notion, Weekly Account Health Reporting | Weekly status, fires, exec asks |
| RxVIP: Pharmacy OS Vision, Prototype and Economics | proposal | 7 Oct 2026 | Tauseef | https://app.notion.com/p/3f1bd5e8f31881c29665f3574ac1a770 | Vision, four-screen prototype plan, pricing table, compliance path |
| RxVIP - 2026-11-12 (GTM weekly update) | doc | 12 Nov 2026 | automated | https://app.notion.com/p/416bd5e8f3188117ac43c71accb8df40 | Deal status roll-up |
| RxVIP (GTM account) and "Order form 2" opportunity | doc | Oct 2026 | Strats | https://app.notion.com/p/3f4bd5e8f31881eb95c8ccc99d8b9fce | GTM tracking |
| RxVIP (deal page, GTM & Scoping) | doc | 25 Mar to 4 May 2026 | Tauseef | https://app.notion.com/p/32ebd5e8f318802888bbc4929226b74e | Pre-sale deal record; sized X-Large ($250k+) |
| ENG-877: RxVIP Vision-Model Spike | doc | 14 Jul 2026 | Engineering | https://app.notion.com/p/39dbd5e8f318813aa3d9ef018c1ed781 | Comparison of vision models for pop-up handling |
| Tenant-Isolated LLM (Heritage & RxVIP): Architecture & Requirements | doc | 7 Jul 2026 | Engineering | https://app.notion.com/p/396bd5e8f318812a8567d210375da2af | Private model architecture |
| Linear project: RxVIP Pharmacy AI Platform | dashboard | 31 Jul 2026 | Tauseef | https://linear.app/supernal-clients/project/rxvip-pharmacy-ai-platform-d94ea01ac92a | Milestones and issues |
| ProjectOS plan | dashboard | not stated | Tauseef | https://supernal-pms-production.up.railway.app/clients/4c0a2b6c-d398-482c-adf7-f26f2097527b | Earlier project plan, linked from Notion |
| Code repository RxVIP-software-automation | site | 2026 | Doren | GitHub, Supernal-Technology organisation | AI Employee code; feature branches to staging to main |

### Mentioned in meetings only (location unknown)

| Title | Kind | Date | Owner | Where | What it is for |
|---|---|---|---|---|---|
| The AI Employee .exe and its Task Scheduler setup | prototype | Jul 2026 onward | Doren | location unknown (store machine) | The product itself |
| Operator dashboard .exe | prototype | Oct 2026 | Doren | location unknown (store machine) | Live status and controls |
| Three-option one-pager sent to Dan | proposal | 2 to 3 Nov 2026 | Nick | location unknown | Options 1, 2 and 3 with costs |
| First co-development proposal (62 points, three tracks) | proposal | 28 Apr 2026 | Tauseef | location unknown | The original, broader pitch |
| DRX competitive analysis | doc | 5 Oct 2026 | Tauseef | location unknown | Side-by-side with DRX |
| DRX statement of work and price list sent by Dan | doc | early Oct 2026 | client | location unknown | The price anchor |
| Andrea's PioneerRx pop-up rules sheet (169 edit flags) | spreadsheet | 25 Aug 2026 | Andrea | location unknown | Source for pop-up rules |
| SIG codes list and SMS template export | spreadsheet | 15 May 2026 | Andrea, Shauna | location unknown | Reference data |
| Pop-up screenshot document | doc | Aug 2026 onward | Doren | location unknown | Unknown pop-ups for Andrea to rule on |
| Log of scripts with changed dates | spreadsheet | 27 Oct 2026 | Tauseef, Doren | location unknown | Andrea's audit of the refill bug (holds patient-linked records) |
| Loom walkthroughs of the fill script | video | Jun and Jul 2026 | Doren | location unknown | Internal demos |
| Operating manual for the AI Employee | doc | promised 22 Sep 2026 | Tauseef | not found; may not exist | Start, stop, stuck, escalate |
| Learning-loop artifact (fixed rules, learning items, out of scope) | doc | 10 Nov 2026 | Tauseef | location unknown | For Andrea's review |
| Thomas's 60-slide visual deck | deck | 29 Oct 2026 | Thomas | location unknown | Reference for client pitches |

---

## 12. Suggested vault sections

Context this account has that a standard scoping and delivery template set would not hold.

1. **Host System Constraints (PioneerRx).** Files: PioneerRx-Behaviour-Log (no API, one process at a time, no auto-refresh, re-login screens, crash patterns), Pop-Up-Rule-Register (the 169 edit flags, Andrea's overrides, what goes to a person), Environment-and-Access (machines, VPN, TigerBytes, time windows, no staging), Vendor-Contact-History (requests to PioneerRx and the answers). Material: heavy; it fills most of 40 weekly meetings and two training-note PDFs.
2. **Volume and Queue Map.** Files: Store-Volume-By-Queue (Priority Fill, cycle fill, PhilRx, walk-ins, incoming documents, per store), Script-Type-Taxonomy (eight types and which are in scope), Coverage-Denominator-Rules (which number is the 100%). Material: heavy and contradictory; this is the gap that produced the 35% surprise.
3. **Regulated Operation and Compliance.** Files: HIPAA-and-BAA-Register (Syntrixs BAA, subprocessors, Neon, network pharmacies), Controlled-Substance-Incident-Log (the refill date bug and the audit), Operating-Hours-and-Staffing-Rules (insurer hours, weekends, holidays), Model-Provider-Policy-Events (the CAPTCHA suspension). Material: moderate, spread across meetings, Linear and the order forms.
4. **Pricing Experiments and Unit Economics.** Files: Price-Offers-Timeline (eleven shapes, who rejected what and why), Unit-Economics-Model (cost per script, breakeven by pharmacy count), Internal-Floors-and-Exceptions (the $9.6K floor and the one-off approval), Reseller-Model (Dan as channel, what he charges pharmacies). Material: heavy; six pricing calls, four calculator artifacts, two order form drafts.
5. **Competitor File.** Files: DRX-Profile (price, coverage, gaps), TJM-Labs-Profile (how it integrates, price, where installed), Side-By-Side-Positioning. Material: moderate; one competitor PDF, a Notion page and repeated meeting references.
6. **Client Software and Integration Partner.** Files: CommandRx-and-SynapseRx-Overview, Neon-Tenant-Design (schema, Mat's six changes), Code-Ownership-and-Repo-Access. Material: moderate; mostly Linear issues 8.1 to 8.15 and one long Slack reply.
7. **Operations Runbook and Store Rollout.** Files: Store-Onboarding-Runbook, Operator-Handbook (start, stop, stuck, escalate), Store-Roster (stores, systems, volumes, machine status), Escalation-Protocol. Material: thin today; promised since 22 Sep and now a contracted deliverable.
8. **Product Experience and Decks.** Files: Operator-Dashboard-Screens, Store-Dashboard-Spec, Monthly-Review-Decks, Vision-Prototype-Plan (the four-screen Pharmacy OS prototype that was planned and not built). Material: moderate; two monthly decks, a hosted review site, five claude.ai decks and the dashboard build. There is no brand or visual design system for this account.

---

## 13. Book

### Chapter 1. The account in one page

RxVIP is the trading name of Syntrixs LLC, owned by Dan Benamoz, who runs a handful of independent pharmacies and wants to manage many more. In May 2026 he bought one thing from Supernal: an AI Employee that does the data entry for prescription fill requests inside PioneerRx, the pharmacy system his stores use. The price was $45,000 for the build plus $1,500 per store per month once live. The build ran from 19 May to 22 Sep 2026 at one store, Rayne Medicine Shoppe in Louisiana, with the store's pharmacist, Andrea Bourque, as the daily partner.

The AI Employee works. It picked up 4,206 scripts in October and completed 1,728 of them without help. It also covers only about 35% of what the store fills, because roughly half of the volume, the cycle fills, sits in a separate queue nobody scoped. The monthly fee was never charged. A second order form has been proposed four times since late September; the fourth, at $4,000 a month for about 90 days, was accepted verbally on 11 Nov and is unsigned.

Health is 2.8 out of 5. Tech scores 1 because the product drives a fragile desktop app with no API and no test environment. Build scores 2 because coverage is partial and work has been paused. The client is moving stores to a competitor that charges 12 cents a script.

Sources: Account OS; Drive: RxVIP + Supernal document.pdf; RxVIP Weekly, 10 Nov 2026; Path Forward Alignment, 4 Nov 2026; Slack #acnt-rxvip-internal, 11 Nov 2026.

### Chapter 2. Why they bought

Dan arrived with a labour target: a pharmacy that fills 1,000 prescriptions a day with four people or fewer. He also had a date, a first tribal pharmacy opening on 1 Jun 2026, and a story about scale, with 41 clinics in Oklahoma and 200 stores by the end of 2027. Supernal answered first with a broad co-development plan of 62 scored pieces across a data foundation, a platform and AI employees. It did not close. Dan's ceiling was $5,000 a month per location and he wanted his money back within a year.

Three things then narrowed the deal. The team learned that a competitor Dan already used, TJM Labs, automates PioneerRx by driving the screen, because PioneerRx has no API; that showed both what was possible and what Dan would compare against. The team accepted that the June date ruled out anything broad. And Andrea, who runs operations, became the main contact because her answers were realistic where Dan's and his developer's were not. The scope shrank to one module with a clear finish, and it was signed on 14 May.

Ownership mattered throughout. Dan and his developer Mat Silverstein already had their own software, CommandRx, and wanted to own what was built. Andrea's reason was different again: she wanted pharmacists counselling patients instead of typing e-scripts.

Sources: RxVIP x SupernalAI: Part 1, 8 Apr 2026; New note, 28 Apr 2026; TGM Labs Pharmacy Integration Strategy, 1 May 2026; Sync: Eric & Tauseef, 12 May 2026; RxVIP Weekly, 11 Aug 2026.

### Chapter 3. How the deal is built

There is one client entity, Syntrixs LLC, and one master agreement dated 14 May 2026 with a HIPAA business associate agreement attached. Under it sits Order Form #1: a $45,000 one-time build fee, half on signing and half on completion, for nine deliverables worth 23 points, plus an Operational Fee of $1,500 per location per month, capped at 20 locations. The order form has no delivery date; three months was a spoken expectation.

What was delivered differs from what was written. Five of the nine deliverables were built. Label printing, the technician pre-check station and patient text messaging were canceled, and the reply classifier was put on hold. In their place the team built four more script types, denial queue handling, a private vision model for pop-ups and a longer run window. No change order records the swap. Dan closed the order form on 22 Sep and the second $22,500 was billed the next day. The Operational Fee was never started, and when Dan heard the figure again in October he objected.

Order Form #2 has had four shapes: $10,000 a month for twelve months; a completion fee plus a per-store fee; $10,000 a month plus 20 cents a script; and the current draft, $4,000 a month for about 90 days, then $4,500, then $2,500 once ten pharmacies are live, with 9 and then 5 cents per completed script. Account OS carries the deal at $48,000, expected to close 16 Nov.

Sources: Drive: RxVIP + Supernal document.pdf; Linear; Account OS; Drive: RxVIP x Supernal: Order Form #2; Drive: RxVIP: Order Form #002; Catchup: Nick & Tauseef, 26 Oct 2026.

### Chapter 4. The product and why it is built this way

The AI Employee is a Windows program on a dedicated machine in the store. It logs in to PioneerRx, opens the Priority Fill queue, reads each request, matches patient, prescriber and drug, fills the fields, presses F12 and moves to the next. It handles five script types in a fixed order, e-scripts first.

Almost every design choice is a response to PioneerRx. There is no API, so the program clicks. There is no staging copy, so testing happens on the live system in agreed windows. The software throws pop-ups that no manual documents; the first answer was a list of rules, which Andrea rejected as unscalable, and the second was a private vision model that looks at a screenshot and decides. The model is private because screenshots hold patient data. When the program cannot finish a script it creates a task in PioneerRx's own task list with the reason, so staff stay in the tool they know.

Some limits are deliberate. The pre-check queue is left alone because that is where technicians verify the AI's work. Critical comments, which flag drug interactions and allergies, always go to a pharmacist. CAPTCHA screens are skipped after the model provider suspended access for processing them. The program runs on weekdays from 7am to 7pm, because insurers restrict fill hours and staff must be present. In the client's hearing it is an AI employee or an agent, never a bot.

Sources: RxVIP Weekly, 3 Aug and 29 Sep 2026; Testing & Review, 8 Jul 2026; Check-In, 21 Aug 2026; OF2 Scope Discovery, 18 Sep 2026; Progress + Way Forward, 22 Sep 2026; RxVIP sync on future integration, 30 Jun 2026.

### Chapter 5. How delivery has gone

June went to access. The only workstation was shared with staff who printed patient records on it each morning. PioneerRx would not provide a test account. A remote access tool waited on a HIPAA review. A password lock cost a day. By 23 Jun a test e-script was filled end to end in front of Andrea.

July brought live testing and the pop-up wall. Andrea told the team twice that rules would not work and that a competitor was moving faster. The vision model shipped on 3 Aug and all five script types were automated by 11 Aug. Then the numbers arrived: 276 processed and 110 completed in the first two weeks, 40%. One day the program sat idle because PioneerRx does not refresh its own queues. In September the model access was suspended over CAPTCHA screenshots, weekly throughput fell to 31 cases, and the internal status went red, in the same week that the 500-case target cleared at 517 and Andrea signed off.

October was spent finding out why volume looked low. Scripts were being skipped, priorities were wrong, and PioneerRx crashed, 90 times in one day. On 7 Oct the real cause surfaced: about half of the store's scripts are cycle fills, processed by a technician in another queue. On 13 Oct a refill bug was found to have rewritten past fill dates, including on a controlled substance. Development stopped in late October while the contract was argued.

Sources: RxVIP Weekly, 9, 16 and 23 Jun 2026; Testing & Review, 8 Jul 2026; Check-In, 21 Aug 2026; RxVIP Weekly, 18 Aug 2026; RxVIP Sync: Weekly Planning, 21 Sep and 26 Oct 2026; RxVIP Weekly, 7 and 13 Oct 2026.

### Chapter 6. The people

Dan Benamoz owns the company, signs and pays. He thinks in large numbers and changes direction often: a tribal pharmacy network in April, phone and texting agents in July, a product to compete with DRX in October, a call bot for medication sync in November. The number of pharmacies he controls has been given as seven, five, four and one active. He was absent from the weekly work for most of the build and has been on calls weekly since late October. He wants to own what is built.

Andrea Bourque is the pharmacist who runs operations and the reason the build got as far as it did. She chose her own store for the pilot, set rules on day one, supplied PioneerRx's rule list when the vendor would not, and found both serious bugs. She pushes back hard and is usually right. She has asked to be in every meeting with Dan, because scope shifts when she is not.

Mat Silverstein built Dan's existing software and reviews the data design carefully. Andre Duplantier at TigerBytes controls the machines. Anna, a technician, does cycle fills by hand and holds the knowledge the next phase needs.

On the Supernal side, Nick Agresti owns the account, Tauseef Rahman leads strategy and delivery, and Doren Gore is the only engineer. Johnny Borbone stepped in on 4 Nov and closed the verbal yes. Thomas Bustos and Naveen Lekkalapudi set pricing and the cost floor.

Sources: RxVIP x SupernalAI: Part 1, 8 Apr 2026; Kickoff, 19 May 2026; RxVIP Weekly, 25 Aug and 3 Nov 2026; The Numbers for a Win-Win, 30 Oct 2026; Confirm Variable Costs, 29 Oct 2026; Deal Desk Weekly Review, 10 Nov 2026; Account OS.

### Chapter 7. What value has shown

The clearest numbers are operational. Over the first order form the AI Employee processed 1,419 prescriptions in 26 run days and completed 517, at an average of 90 seconds a case, down from about seven minutes at the start. In October it picked up 4,206 of the 5,769 scripts in the Priority Fill queue and completed 1,728, which is 41%. The rest were handed to a person with a reason: 45% for PioneerRx pop-ups it did not know, 28% for other problems such as e-scripts it could not read.

The client has said, in his own way, that it helps. On 4 Nov Dan described a store keeping up on a thin crew and credited the technology, and a week earlier he passed on a manager's view that she would be stuck without it. Set against a technician at about 76 cents a script, 9 cents is cheap.

What has not been shown is money. Account OS has no value entries and no success goals. Dan asked on 22 Sep for a trend report at every review and there is no sign he received one. He has since asked for the split of new prescriptions against refills and for time per script by type. The measure that now matters, share of total store volume completed, was not tracked until October, and the answer, about 35%, came as a surprise to the sponsor.

Sources: Progress + Way Forward, 22 Sep 2026; RxVIP Weekly, 10 Nov 2026; Notion: RxVIP (Nov 2 - Nov 6); The Numbers for a Win-Win, 30 Oct 2026; Rx VIP pricing and pharmacy expansion strategy, 28 Oct 2026; Account OS.

### Chapter 8. The pricing saga

No part of this account took more internal time than price. The first second-phase offer, on 28 Sep, was $10,000 a month for a year. Dan declined because he could not see how to resell it when others quoted a $10,000 integration and $400 a store. He then sent the price list of DRX, a newer pharmacy system at about $435 a month per store with AI data entry at 12 cents a script, and asked for something that competes with it. The pod spent early October on a pharmacy operating system vision priced at $16,000 to $20,000 a month with a revenue share. Andrea called competing with DRX financially irresponsible, and the idea was dropped.

The next model charged per completed script. Versions ran from 30 cents down to 20, split with Dan, on top of a $10,000 retainer, and assumed 40 pharmacies. Dan said the assumption was unrealistic and the retainer was an enterprise price. Internally the floor was $9,600 a month.

The offer that landed is below that floor: $4,000 a month against a cost of $6,500, so Supernal carries about $10,000, recovered only if Dan reaches ten pharmacies. Naveen approved it as a one-off. Two lessons were recorded: price against the competitor's anchor, not against cost, and send a roughly right proposal quickly.

Sources: Slack #acnt-rxvip-internal, 30 Sep and 7 Nov 2026; Sync: RxVIP OF 2 Pricing, 5 Oct 2026; RxVIP Weekly, 7 Oct 2026; Confirm Variable Costs, 29 Oct 2026; The Numbers for a Win-Win, 30 Oct 2026; Johnny / Dan 1:1, 11 Nov 2026; Deal Desk Weekly Review, 10 Nov 2026.

### Chapter 9. Where it stands and what is next

As of 13 Nov the draft Order Form #002 is with Thomas for review. It commits $12,000 over about 90 days for three milestones: cycle fills and a store dashboard at Rayne by week 4, fixed rules by week 6 and a learning loop by week 10, then a packaged install and rollout to four stores by about day 90. Open points are the ownership section, the name of the fourth store and Dan's signature. Account OS expects the close on 16 Nov.

Several things have to be true for the plan to hold. The learning loop has to turn a 60% hand-off rate into something much lower, against roughly 1,000 undocumented pop-up types. Unreadable e-scripts need a decision. A day-supply bug on renewals is open. The plan assumes half of Doren's time while he is moving onto another account. Each new store needs a machine, credentials and a visit, and the shared data path through Neon is still in review. Linear has not been updated since 28 Oct and its dates are all in the past.

Beyond the build, Dan wants a call agent that phones patients before their medicines are packaged; Tauseef owes a scope and a price before the holidays. And the larger risk remains: Dan has said he is moving stores to DRX, which would shrink the number of PioneerRx stores the AI Employee can serve.

Sources: Drive: RxVIP: Order Form #002; Slack #acnt-rxvip-internal, 12 Nov 2026; Account OS; RxVIP Weekly, 10 Nov 2026; RxVIP Sync: Weekly Planning, 9 Nov 2026; Johnny / Dan 1:1, 11 Nov 2026; Path Forward Alignment, 4 Nov 2026; Linear.

---

## 14. Gaps and conflicts

### Could not find or access

- **Slack attachments.** Posts that are a file or canvas with a title only could not be opened: the 7 Nov one-pager file, Johnny's 10 Nov proposal, the 4 Nov deck file, "RxVIP Order Form 2" (12 Nov), "RxVIP Holiday dashboard", "Holidays for the AI Employee", "Human Led for RxVIP", "Pulse Onboarding", the 5 Nov completion post, the 21 Oct crash report. A file search of the channel returned nothing.
- **Slack history before 22 Sep** was not read message by message (only a link search back to 15 Sep). No client-shared channel exists; #acnt-rxvip-internal is the only channel with "rxvip" in its name.
- **Drive files listed but not opened:** the Testing Log sheet, both monthly review decks, the two .docx drafts, the client alignment PDF, the "call with Dan" notes doc, the Linear-linked order form doc, and the contents of the "Pioneer RX" and "Transcripts" subfolders.
- **claude.ai artifacts** shared in Slack were recorded by link and description only; none was opened.
- **Notion weekly reports:** only 2 to 6 Nov was read in full; the other 15 by search snippet. The GTM account page and the "Order form 2" opportunity page were not opened.
- **Meeting notes pending or missing:** the local files for 10 Aug, 18 Aug (queue performance and handover plan), 24 Aug and 8 Sep (two meetings) have no notes yet and their transcripts were not read. The 14 Aug testing session has no transcript. The 27 Mar note on a problem with Dan's developer, the 15 May "Tauseef / Lucas" note and the 2 Nov and 9 Nov internal syncs were not opened.
- **Fathom** summaries were scanned from 1 Jul only; earlier recordings were taken from the local notes. No full transcript was opened for any meeting.
- **Not found anywhere:** the signed-off list of which OF#1 deliverables were swapped; invoices or payment status (Notion says no invoice overdue); the first 62-point proposal document; the three-option one-pager; a DRX comparison document; an operating manual; a trend report sent to Dan; per-script model and infrastructure cost; the reason the Account OS deal value is $48,000.
- **Account OS is nearly empty for this account:** one stakeholder, no success goals, no cadence events, no value entries, no whitespace ideas, no renewal plan, no health score for the current week.

### Where sources disagree

- **Health.** Account OS: 2.8, Watch. Notion weekly report for the same week: Critical.
- **Order Form #2 value.** $48,000 (Account OS), $60K (Deal Desk, 3 Nov), $120,000 (28 Sep draft), $12,000 committed (12 Nov draft).
- **Has Dan agreed.** Slack, 11 Nov: he said yes and is ready to sign. Johnny's call note, 11 Nov: he is reviewing and will respond next week.
- **The 11 Nov price against the 7 Nov one-pager.** One-pager: $16,000 over 4 months and no monthly fee after launch. Call note and draft: $12,000 over 3 months, then $4,500 and $2,500 monthly fees. The 9 Nov strat standup also records Nick wanting $5K, and Fathom records a $5K a month minimum.
- **Cost-plus claim.** Johnny described the price as cost plus 45% while the same note shows the build phase at a $2,500 a month loss.
- **How many pharmacies Dan has.** Seven (6 May and 5 Oct), five after closing one (29 Oct), four to five (3 Nov), one active and one in the wings (30 Oct), four stores in the draft order form.
- **Rayne's volume.** About 4,500 scripts a month (11 Aug); 4,500 to 5,000 completed a month, 5,100 in October and 6,200 in September (27 Oct); about 255 to 320 a day (7 to 13 Oct); 600 a day (30 Oct, as said to Dan); 18,000 a month with 9,000 cycle fills (10 Nov notes).
- **Cycle fills as a share of volume.** About half (13 Oct), 52% (10 Nov), 70% (4 Nov), 40% (Fathom summary, 10 Nov).
- **Coverage.** "100% of in-scope volume" (7 and 13 Oct) and "about 35% of scripts" (4 Nov) describe the same build against different denominators. The Linear milestone for 100% of Rayne volume shows 0%.
- **DRX pricing.** $435 a month plus 12 cents a script plus $10K setup (5 Oct); $439 a month plus $1,500 activation (Notion, 7 Oct); "$4.55/mo" in the 7 Oct meeting notes, which looks like a transcription error for $435.
- **Store names.** The second store is "Delone's", "DeLone's", "Delray" and "Del Rey". On 11 Aug it and New Iberia are separate stores; the 13 Oct notes place "Delone's" in New Iberia; Linear lists Delray and New Iberia as separate.
- **Competitor and platform names.** TJM Labs and TGM Labs; PhilRx and FillRx; Mat and Matt.
- **OF#1 size and timing.** 23 points in the order form; "about 30 points over 5 months" in the 23 Sep pricing call. The 90-day mark is given as 15 Aug counted from 15 May, while kickoff was 19 May.
- **OF#1 pricing before signing.** $15,000 a month in the 12 May note; $45,000 one-time plus $1,500 a location in the signed form.
- **Run hours.** A 24-hour run was agreed with Andrea on 22 Sep; the same day Dan said insurers restrict fill hours; the program has run weekdays 7am to 7pm since.
- **Automation type.** The order form says "browser-based automation"; the product automates a Windows desktop application.
- **Notion account page.** Shows stage "First build", ARR $45,000, renewal 15 Aug 2026 and an empty Drive folder field; last edited 31 Aug. All four are out of date.
- **Deal Desk on effort.** 10 Nov: full scope completable in 30 days with a few hours a week of Doren's time. 4 Nov: cycle fill 2 weeks, full build with learning loop 3 months. The draft order form uses about 90 days and the cost model uses half of Doren's time.
