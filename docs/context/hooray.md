# Hooray Agency: ClientOS context document

Written 13 Nov 2026. Depth: light (sections 1 to 10 lean on the June scoping vault; the artifact inventory, feature rationale and book are new work). Sources read: Account OS, 23 vault files (core ones in full, the rest by search), 22 Granola notes, 9 Drive files in full or by summary, the Drive folder trees, two Slack channels plus search, Linear team HOO, one Notion search. Not read: Fathom, Gmail, meeting transcripts (notes only).

---

## 1. Snapshot

- **Who:** Hooray Agency, an independent luxury-hospitality marketing agency in Irvine, California, founded 1993 and rebranded 2019, about 22 to 36 staff, about $7.6M reported revenue, managing dozens of hotel and resort clients (vault: A1-Signal-Intake › company profile; Drive: MSA + Order Form).
- **What they bought:** a 12-month engagement at $8,900 per month ($106,800) to build **Genome**, a data store plus a console where each hotel client reviews its own marketing performance and asks questions in plain language, delivered in 90-day phases (Drive: MSA + Order Form).
- **Where it stands:** Phase 1 is built and live for a 10-hotel pilot. Account managers are onboarded; hotel users are not. Supernal says it is ready and is waiting for Hooray to say go (Drive: Weekly Brief W14; Delivery Sync, 9 Nov 2026).
- **Open question:** what Phase 2 is. A QBR was set for 12 Nov 2026 to settle "Phase 2 or a pivot" (Slack #acnt-hooray-internal, 12 Nov 2026). Its outcome is not in any source I could read.
- **Pod:** Nick Agresti (AM), Jaime Garcia (strategist), Harvy Leyton (FDE) (Account OS).
- **Health:** 3.0 of 5, band Watch, week of 2 to 8 Nov 2026. Tech 2.0 (at risk), Strategic Defensibility 2.0 (at risk), Exec Engagement 3.0, GM 4.0, Build 4.0. Renewal risk medium, driver "Easily displaced" (Account OS).

## 2. Structure of this account

One legal entity (Hooray Agency), one MSA, one order form (OF-001). What makes it unusual is that the product has two layers of customer:

- **Hooray** is Supernal's client and owns everything built (Drive: MSA + Order Form › 6 Ownership).
- **Hooray Clients** are the hotels. They are the intended end users of the console, and Hooray hopes to charge them for it later (Drive: Weekly Brief W14 › Phase 2).
- **Account managers (AMs)** at Hooray sit between the two. They were not in the signed scope as users, but became the first real users (Client View Portal - Workshop, 1 Sep 2026).

Three surfaces were built on one data store:

| Surface | User | In signed scope? |
|---|---|---|
| Vault / "Brain" (GA4, Meta, CM360 data per hotel) | none directly | Yes (Drive: MSA + Order Form › 3.1) |
| Client View / Client Portal | hotel marketing directors | Yes |
| Ask Genome (chat) | hotels, later AMs | Yes |
| Command Center (internal console: accounts, connections, adoption) | Hooray AMs and executives | Listed only as a future expansion (Drive: MSA + Order Form › 4), built anyway (Supernal <> Hooray Weekly Sync, 19 Aug 2026) |

Phases, as tracked in Linear (Linear):

| Phase | Dates | Summary | Status |
|---|---|---|---|
| Phase 1 | 3 Aug to 30 Oct 2026 | Trusted account data; Genome explains performance | In progress, past target date |
| Phase 2 | 2 Nov 2026 to 29 Jan 2027 | Genome prepares AM work for review | Backlog, 0% |
| Phase 3 | 1 Feb to 30 Apr 2027 | Genome monitors accounts and follows up | Backlog |
| Phase 4 | 3 May to 30 Jul 2027 | Genome completes agreed workflows with approval | Backlog |

The Linear Phase 2 to 4 summaries describe an agent roadmap. The client-facing deck describes Phase 2 as a path to charging hotels (PMS data, more hotels, Catalyst, Prophit) (Drive: Weekly Brief W14). The two do not match; see section 14.

Deals (Account OS):

| Title | Value | MRR | Stage | Dates |
|---|---|---|---|---|
| Hooray Agency (Ret+OF1) | $106,800 | $8,900 | Closed Won, active, motion New | Closed 29 Jul 2026 |
| Expansion, additional hotels | not set | not set | Idea, open | Expected close 18 Dec 2026 |

## 3. Arc

Meeting counts are those found in Granola and the Drive notes folder; they are a floor, not a total.

- **Q1 2026.** Nick met CEO Steven Seghers at a hospitality conference where AI search was the main topic. Deal created 19 Mar 2026 (vault: Sales-Notes › Mar 19).
- **Apr 2026 (2 calls).** Discovery I on 30 Apr with David Metze and Roger Burns. David's opening idea was replacing client-facing AM work with agents. Pod pricing of about $10K per month was mentioned (vault: Transcripts/_README › Discovery I).
- **May 2026 (1 call).** Discovery II on 11 May. Scope set as an agency-internal problem. Four jobs named for an AI employee "SAL": intake, classify, clarify, package. Ownership of what is built became a condition (vault: Sales-Notes › May 11).
- **Jun 2026 (at least 8 client calls, 5 internal).** 1 Jun: reporting became the way in. 4 to 5 Jun: scoping files written; proposal at $72,000 year one. 9 to 10 Jun: proposal reviews with David and Roger. 16 Jun: presentation to Steven and Randy at $8,000 per month. 18 Jun: Hooray asked for a sellable client product by 1 Jan 2027. 19 Jun: internal memo at $16,000 per month plus licensing. 23 Jun: order form review, Salamander named as beta. 30 Jun: Hooray said the money was too much; scope cut (Drive: Gemini notes of 16, 18, 23, 30 Jun 2026; Drive: [Internal] Pricing & Licensing Memo; vault: Proposal-v2 › Commercials).
- **Jul 2026 (2 client calls).** 6 Jul: $8,000 per month and 90-day sprints agreed after Randy signed off. 14 Jul: Jaime introduced; the product named Genome. 22 Jul: contract sent. 29 Jul: Steven signed. 30 Jul: Supernal countersigned (Drive: Gemini notes of 6 and 14 Jul 2026; Drive: MSA + Order Form › certificate).
- **Aug 2026 (at least 5 client meetings).** Kickoff about 5 Aug. Design workshops 11 and 18 Aug. Production environment live. By 19 Aug, 4 of 10 accounts connected and Command Center demoed to all four Hooray leaders. Milestones M1 and M2 completed (Slack #acnt-hooray-internal, 5 and 19 Aug 2026; Supernal <> Hooray Weekly Sync, 19 Aug 2026; Linear).
- **Sep 2026 (at least 4 client meetings).** 1 Sep: Client View prototype workshop. Mid-month: wrong metrics found and fixed, causing a slight delay. 21 Sep: Genome V1 in production. 22 to 24 Sep: three feedback sessions that reshaped the product. M3 completed (Client View Portal - Workshop, 1 Sep 2026; Weekly Review, 11 Sep 2026; Delivery Sync, 21 Sep 2026; Linear).
- **Oct 2026.** 14 Oct: Hooray asked for all of about 40 hotels on Genome by 1 Jan 2027 and raised hotel PMS data. 10 AMs invited. Help Center and Connector Hub shipped. Hooray leadership chose to run another platform migration alongside onboarding; rollout moved to 9 Nov (Slack #acnt-hooray-internal, 15 Oct 2026; Weekly Review, 23 Oct 2026; Strat Team Standup, 26 Oct 2026).
- **Nov 2026.** Steven gave feedback pointing to a shift in goals. David pushed back on the 9 Nov hotel onboarding. Ask Genome returned to the Command Center. QBR held or planned 12 Nov around Hooray's AI Summit in Denver (Account OS health note, 2 to 8 Nov; Weekly Review, 6 Nov 2026; Drive: Weekly Brief W14; Slack, 12 Nov 2026).

## 4. Why they bought

Several causes, none sufficient alone:

1. **A measured-feeling pain.** David said account staff spend 60% or more of their time on work that should not need them: chasing vague client briefs and building monthly reports by hand (vault: Sales-One-Pager › problem). The 60% is David's estimate, not a measurement.
2. **Their own build had stalled twice.** An OpenAI chatbot on a document store, then a Google Vertex migration, both stuck because developers were pulled to client problems (vault: Sales-Context › Competing initiatives).
3. **Ownership.** David and Roger needed to be able to say Hooray would own the result if the partnership ended. This removed the "we can do it in house" objection inside Hooray (vault: Sales-Notes › May 11).
4. **Pay over time, with an exit.** No large upfront fee, and a way out at month 6 (Drive: Gemini notes, 16 Jun 2026).
5. **A competitor had framed the same problem.** Another vendor's requirements document described a "Reporting Copilot" on GA4, Google Ads, Meta, Trade Desk and Monday.com. It confirmed reporting was the right entry point (Drive: Hooray Agency, Requirements from Competitor; vault: Sales-Notes › Jun 4).
6. **Trust in the people.** By 17 Jun, Randy, the sceptic, had more confidence in Nick and Supernal than in earlier vendors (Drive: Gemini notes, 18 Jun 2026).
7. **A revenue idea, not just a saving.** The CEO wanted a product hotels would pay for by 1 Jan 2027 (Drive: Gemini notes, 18 Jun 2026).

Alternatives they had: build in house, buy a reporting product such as NinjaCat or Improvado, or do nothing (vault: Scoping-Package › alternatives table). What was shown: an HTML proposal, a prototype and a sample report (GTM + Scoping, 11 Jun 2026; Drive: Sample Report - Hooray.pdf). A reference call with another Supernal client was the planned closing move (vault: Sales-Context › Approval flow); I found no record that it happened.

## 5. Commercials

**Signed (Drive: MSA + Order Form):** $8,900 per month, split $3,000 strategy and $5,900 build; $106,800 over 12 months from 1 Aug 2026; invoiced monthly in advance, net 30; early exit at end of month 6 on 30 days' notice; auto-renews for six-month terms unless 30 days' notice; covers up to 10 connected accounts, more in blocks of 10 at $500 per month; up to $500 per month third-party costs included; Hooray owns code, Genome configuration, database and data.

**Every price discussed, in order:**

| Date | Price | Source |
|---|---|---|
| Mar to Jun 2026 | $60,000 deal value in Pipedrive | (vault: A5-Scope-Definition › commercial) |
| 30 Apr 2026 | about $10K per month pod, plus $500 to $10,000 per module upkeep | (vault: Transcripts/_README › Discovery I) |
| 4 Jun 2026 | $5K per month retainer plus about $12K first project | (vault: Sales-Notes › Jun 4) |
| 5 Jun 2026 | $72,000 year one ($60,000 retainer + $12,000 build); upkeep $7,000 per month listed separately | (vault: Proposal-v2 › Commercials) |
| 16 Jun 2026 | $8,000 per month for 12 months, exit at month 6 | (Drive: Gemini notes, 16 Jun 2026) |
| 19 Jun 2026 | $16,000 per month ($192,000) plus $350 per hotel per month or 15% of billings | (Drive: [Internal] Pricing & Licensing Memo) |
| 30 Jun and 6 Jul 2026 | $8,000 per month | (Drive: Gemini notes, 30 Jun and 6 Jul 2026) |
| 29 Jul 2026 | $8,900 per month signed | (Drive: MSA + Order Form) |

**Dates:** month-6 exit window falls at the end of Jan 2027; term ends 31 Jul 2027 (inferred from the 1 Aug 2026 effective date).

**Unresolved:** price for taking all of about 40 hotels live by 1 Jan 2027, said to carry a monthly increase being scoped (Account OS health note, 12 to 18 Oct). Extra integrations were to be quoted in late Oct (New note, 26 Oct 2026); no quote found. Margin is not stated anywhere. Why the signed figure is $8,900 and not the agreed $8,000 was not found.

## 6. Product

- **Vault / Brain.** Daily pull from GA4, Meta Ads and CM360 into raw tables, then a cleaned reporting model with one definition per metric, served by the Genome API. Live for 10 pilot hotels (Drive: Weekly Brief W14 › architecture).
- **Command Center.** Internal console: Home (users, active users, sources, prompt volume), Accounts, Connections, adoption watch. Used by Hooray AMs and leaders. Live (Supernal <> Hooray Weekly Sync, 19 Aug 2026).
- **Client View / Client Portal.** Hotel-facing: invite-only signup, home dashboard, reports that mirror the old PDF report, live view. Built, no hotel users yet (Client View Portal - Workshop, 1 Sep 2026; Drive: Weekly Brief W14).
- **Ask Genome.** Chat that answers from the hotel's own numbers and sees the screen the user is on. Live in Client View; hidden from Command Center in Sep, returned in Nov (Feedback Session | David & Roger, 23 Sep 2026; Drive: Weekly Brief W14).
- **Help Center.** Self-guided onboarding site. Live (Weekly Review, 23 Oct 2026).
- **Connector Hub.** Where a hotel or AM requests a new data source, including 14 PMS systems and Revinate. Launched Oct, being opened to hotels (New note, 26 Oct 2026; Slack #supernal-squad-the-origin, 28 Oct 2026; Linear HOO-191).
- **SAL.** The scoped AI employee for creative briefs. Never built (vault: B3-AI-Employees; Drive: MSA + Order Form).

### Feature rationale

1. **Hooray owns all of it.** Reason: David and Roger needed an answer to "we can build this ourselves", and a contractor-builds-on-your-land framing. Decided Discovery II, 11 May 2026 (vault: Sales-Notes › May 11).
2. **90-day phases with a gate, not a 12-month plan.** Reason: Hooray saw the product as a gamble on whether hotels would pay, and wanted to stop and re-aim every quarter. Decided 30 Jun and 6 Jul 2026 (Drive: Gemini notes, 30 Jun and 6 Jul 2026).
3. **Hooray-controlled data sources first.** Reason: sources Hooray controls connect without asking each hotel; hotel-owned sources depend on each hotel granting access. Decided 23 Jun 2026 (Drive: Gemini notes, 23 Jun 2026).
4. **AMs test before hotels.** Reason: avoids the difficulty of putting early software in front of clients, and wins internal advocates first. Decided 14 Jul and 1 Sep 2026 (Drive: Gemini notes, 14 Jul 2026; Client View Portal - Workshop, 1 Sep 2026).
5. **An "explain how this was calculated" control under AI output.** Reason: hotel marketing directors are experienced but not data-trained, and trust in AI numbers was a known worry. Decided at the design workshop, Aug 2026 (Drive: Design Workshop Notes).
6. **Suggestions come as accept-or-reject "Opportunities"; no manual input by staff.** Reason: a softer sell, rejections teach the system, and hand-entered content could bias what Genome says. Decided 1 Sep 2026 (Client View Portal - Workshop, 1 Sep 2026).
7. **Lead with Revenue, Transactions, Room Nights and ADR, not blended ROAS.** Reason: 20 to 30% of one pilot hotel's budget goes to brand awareness, so ROAS derails the client conversation; the four metrics match the existing Looker report. Decided 24 Sep 2026 (Genome Feedback Session, 24 Sep 2026).
8. **Compare with the same period last year by default.** Reason: hotel demand is seasonal, so month-on-month misleads. Decided 23 and 24 Sep 2026 (Feedback Session | David & Roger, 23 Sep 2026).
9. **No budget data in reports.** Reason: it would invite rollover questions from clients. Decided 23 Sep 2026 (same).
10. **PDF export.** Reason: usually one person per property has a login and must share reports upward. Decided 23 Sep 2026 (same).

## 7. Use cases and feedback

**Use cases.** AMs: stop building the monthly report by hand; see connector status per hotel. Hotels: read performance live, ask why, share a report. Leaders: see adoption and which questions clients ask, as a signal for upsell (Supernal <> Hooray Weekly Sync, 19 Aug 2026; Drive: Design Workshop Notes).

**Adoption numbers.** 10 AMs invited; 6 accepted by 23 Oct, 4 still pending on 26 Oct (Weekly Review, 23 Oct 2026; New note, 26 Oct 2026). Hotel users: none (Drive: Weekly Brief W14). Logins, sessions and Ask Genome questions are tracked from the week of 9 Nov; no figures seen (Drive: Weekly Brief W14).

**Feedback and what changed:**

| Feedback | From, when | What changed |
|---|---|---|
| Views make sense; content to be discussed | Randy, 19 Aug | Feedback template sent (Weekly Sync, 19 Aug 2026) |
| "Planning & Next Steps" should be "Opportunities" | David, Roger, 1 Sep | Placeholder replaced with accept/reject flow (Workshop, 1 Sep 2026) |
| "Client accounts" unclear; say "Hotels" | David, Roger, 23 Sep | Renamed (Feedback Session, 23 Sep 2026) |
| Ask Genome not useful across properties for AMs | 23 Sep | Hidden in Command Center; restored Nov with David's design (Feedback Session, 23 Sep 2026; Slack #supernal-squad-the-origin, 9 Nov 2026) |
| Briefing text only restates the screen | 23 Sep | Emphasis moved to "ask about this" and "explain this" (same) |
| ROAS leads the home screen | Randy, 24 Sep | Top metrics swapped; ROAS limited to media revenue over media spend; disclaimers added (Genome Feedback Session, 24 Sep 2026) |
| Creative images and campaign view matter | 23 Sep | Creative images in reports shipped (Linear HOO-148) |
| Display cost shows $0 | pilot audit, Oct | In review; two options sent to Roger (Linear HOO-157; Drive: Weekly Brief W14) |

## 8. Stakeholders

| Person | Title and role | Start | Now | Last notable interaction |
|---|---|---|---|---|
| Steven V. Seghers | CEO, signer | Warm, wants to swing big | Driving direction; ideas to make Genome a strategic tool | Met David late Oct on next requirements (Account OS health note, 26 Oct to 1 Nov) |
| Randy Stuck | Senior operations executive; budget; title given as EVP and as SVP Ops | Sceptic, favoured building in house | Engaged; gave detailed metric feedback | Genome Feedback Session, 24 Sep 2026 |
| David Metze | Point of contact; AI lead | Champion | Still champion; pushed back on 9 Nov hotel onboarding | Weekly Review, 6 Nov 2026 |
| Roger Burns | Account leadership; co-champion | Warm | Active reviewer | Shown new build 28 Oct (Slack, 28 Oct 2026) |
| Brian | Validates metric calculations | not known | Sign-off on methodology | Aug 2026 (Prep Hooray, 19 Aug 2026) |
| Rocio, Caitlin | Named pilot testers for PGA | not known | not known | (Linear M4 description) |
| Shelly | Traffic manager; could veto SAL | Neutral to resistant | Out of scope since SAL was dropped (inferred) | (vault: Sales-Context) |
| Billy Kang | Billing contact | | | (Drive: MSA + Order Form) |
| Stephen Garcia | Hooray developer; connected an MCP server to Google Analytics | | | (Drive: Gemini notes, 30 Jun 2026) |

**Supernal over time.** Nick Agresti: seller, then AM throughout. Jaime Garcia: joined scoping in his first week, early Jun; strategy lead from 14 Jul. Tauseef Rahman: set up the scoping workspace on 4 Jun. Thomas Bustos: technical review of the proposal. Harvy Leyton: engineer from late Jul. Vitor Escalfoni: code review. Diana Pedroza: prototype design, feedback sessions. Ryan Williams: contract. Scott Downes: countersigned (Hooray agency proposal scoping setup, 4 Jun 2026; GTM + Scoping, 5 Jun 2026; Slack #acnt-hooray-internal, 19 Aug 2026; Drive: MSA + Order Form).

### Working with David day to day (checked 14 Nov against meetings)

- David Metze is the day-to-day contact. The team finds him slow on anything sent for review or homework; called a small but real challenge that needs better async ways of working (Squad Lab - 1% better, 22 Sep 2026).
- Access is the other friction: Roger and David did not want to give Supernal direct access to Looker Studio, the source behind the KPIs, though the team needed it to trace how numbers are calculated (Weekly Review + Next Cycle Plan, 18 Sep 2026). Presenting to Hooray's account managers was also gated on review first (Delivery Sync, 21 Sep 2026).

## 9. Success and value

| Criterion | Baseline | Target | Current | Source |
|---|---|---|---|---|
| Hotels in reporting workflow | 0 | 10 or more | 10 connected, none with hotel users | (vault: Concept-Alignment › 04; Drive: Weekly Brief W14) |
| Reports on time by day 3 | not set | 95% | not measured | (vault: Concept-Alignment › 04) |
| Hours reclaimed per month | 60% of AM time (estimate) | 50 or more | not measured; Nick estimates about 50% time saving | (vault: Concept-Alignment › 04; Squad Lab, 22 Sep 2026) |
| Phase 1 end state | none | console in hotel hands, feedback readout, Phase 2 scoped | console ready; no hotel sessions; Phase 2 not scoped | (Drive: MSA + Order Form › 3; Drive: Weekly Brief W14) |
| All hotels on Genome | 10 | about 40 by 1 Jan 2027 | 10 | (Slack #acnt-hooray-internal, 15 Oct 2026) |

The first three rows come from the unsigned June scoping and were never agreed with the client. The signed order form has milestones but no numeric success measures.

**Value shown:** monthly reporting automated for the pilot (Squad Lab, 13 Oct 2026). No hours or money figure has been shown to the client. Account OS holds no value entries, success-plan goals, stakeholders or cadence events.

**What the sponsor asked to see:** where the intelligence comes from, and whether client custom GPTs and Catalyst can be included (Steven; Slack #acnt-hooray-internal, 5 Aug 2026); usage tracking by end of Nov (Slack, 15 Oct 2026). A company goal says Hooray should have a baseline and its own metrics by 30 Nov 2026 (Notion: Q4 2026 Supernal Goals).

## 10. Delivery now

| Workstream | State | Milestone | Measured | Learned | Blocker |
|---|---|---|---|---|---|
| Data foundation | Done | M2 100%, 4 Sep | 10 hotels, 3 sources | Each platform's numbers needed rework; wrong metrics found mid-Sep | Display spend before Jul or Aug has no cost in DV360 |
| Genome V1 | Done | M3 100%, 30 Sep | none | | |
| Pilot validation | Late | M4 75%, target 16 Oct | AM invites accepted | Leaders wanted to review before AMs | Hotel sessions not scheduled |
| Rollout and Phase 2 | Late | M5 54%, target 30 Oct | none | Client alignment, not build speed, is the constraint | Go/no-go from Hooray |
| Phase 2 | Not started | M1 0%, 30 Nov | none | | Scope not agreed |

(Linear; Drive: Weekly Brief W14; Delivery Sync, 9 Nov 2026)

- **Decisions waiting:** when hotel users start and who is first; how to close Phase 1 (10 hotels, one hotel, or extend); which display-spend option; what Phase 2 is (Drive: Weekly Brief W14).
- **Slipping:** M4 and M5; the rollout date moved from mid-Oct to 2 Nov to 9 Nov; the Linear Phase 2 project started 2 Nov on paper with no agreed scope (Linear; Weekly Review, 23 Oct 2026).
- **Commitments with no Linear issue found:** quote for extra integrations and the 10 to 40 hotel expansion; Pulse usage tracking for Hooray; splitting Genome into client-facing and internal instances; refresh rules per platform for Randy (New note, 26 Oct 2026; Slack, 15 Oct 2026; Weekly Review, 6 Nov 2026; Genome Feedback Session, 24 Sep 2026). I searched only issues updated in the last 21 days.
- **Next 30 days:** Phase 2 M1 due 30 Nov 2026; Phase 1 Phase Gate re-planned for end of Nov; expansion idea expected 18 Dec 2026 (Linear; Drive: Weekly Brief W14; Account OS).

## 11. Artifacts

Drive files first.

| Title | Kind | Date | Owner | Where | For |
|---|---|---|---|---|---|
| MSA + Order Form (signed) | order form | 30 Jul 2026 | Nick / Ryan | [Drive](https://drive.google.com/file/d/1Y199v98FVh2ezcV-xebdSu1r_C6D2JJA/view) (copies: [Complete_with_Docusign](https://drive.google.com/file/d/1deC_Uwuwqh7IiV6TYxPPrEa_2ZiXJRsE/view), ["Order Form"](https://drive.google.com/file/d/10jWu3bbZ_58Gmb245-L-5IFMJZQsJdZG/view)) | The contract |
| Hooray_Agency-Proposal-v5-90day-phases.html | proposal | 7 Jul 2026 | Jaime / Nick | [Drive](https://drive.google.com/file/d/1lTtRtg4ydekqDZDErdag7K7EbsXDijD9/view) | Final proposal after the scope cut (not opened) |
| Supernal AI + Funnel document.pdf | doc | 14 Aug 2026 | not known | [Drive](https://drive.google.com/file/d/1iAsBpuIGI8lExIq5qw8z8sM3X5LCiDhT/view) | Data extraction with Funnel (not opened) |
| [Internal] Pricing & Licensing Memo | doc | 19 Jun 2026 | Jaime (inferred) | [Drive](https://docs.google.com/document/d/13ScJAr2YpAl4X-EN39pNDmhVY7gtp2sb5pYV5rQwlo0/edit) | The $16K plus licensing case |
| Hooray Agency - Order Form #001 [DEPRECATED] | order form | 24 Jul 2026 | Jaime | [Drive](https://docs.google.com/document/d/1vlXQJTisN9ZHf8EREA-iW3Hed4eJ3lvSZmSzalyMbQ4/edit) | Working copy before signing |
| Hooray Agency - Order Form #001 - V3.docx | order form | 13 Jul 2026 | Jaime | [Drive](https://drive.google.com/file/d/15vnw5_WZs-3oewfeYUs5-Pu1HCm1sIzg/view) | Draft |
| Hooray Agency - Order Form - New Scope (L) | order form | 22 Jun 2026 | Jaime | [Drive](https://docs.google.com/document/d/1RxqEc76qvhAYlxbDg5xT2rQ_gfywwdwh4QUobnn6_jc/edit) | The large two-console scope |
| Hooray Agency - Order Form - 18 Jun Approved | order form | 19 Jun 2026 | Jaime | [Drive](https://docs.google.com/document/d/1uHZe-x-9TxZHMjuQ4KNhmMZlLuyXFhvo_l5euF2XuBA/edit) | Internally approved draft |
| Hooray Agency - Order Form 2 - draft | order form | 17 Jun 2026 | Jaime | [Drive](https://docs.google.com/document/d/1_EXHKFLd5RRn_jjD2iSxxMk4MzMQx0bxIEjIBh3v6yA/edit) | Draft |
| Hooray Agency - Order Form (template-aligned draft v2) | order form | 12 Jun 2026 | Jaime | [Doc](https://docs.google.com/document/d/1hpdf4qwAUDU-h-tsVbLsOVvQaBUzcXwvxp3Qe6PYVmI/edit), [HTML](https://drive.google.com/file/d/1vN8KKixrCpzb5EVbIyF_NThYMA2vzJTA/view) | First draft |
| Milestone Analysis OF1 - Hooray Agency | spreadsheet | 18 Jun 2026 | not known | [Drive](https://docs.google.com/spreadsheets/d/1Md1MqySmH28q4SieYuEHSsmwmRiOxihMfor-QPxMyP0/edit) | Milestone sizing |
| Hooray x Supernal - Kickoff Deck.pptx (sales-era) | deck | 23 Jun 2026 | Nick | [Drive](https://drive.google.com/file/d/1hzdwET9VHiqCyRaJD78wjhjRZ-RKMU1E/view) | Kickoff plan under the large scope |
| Sample Report - Hooray.pdf | doc | 10 Jun 2026 | Hooray | [Drive](https://drive.google.com/file/d/1rYXwCklYNsuVC421AP_eO2dqnLI3FGaP/view) | The monthly report Genome replaces |
| Hooray Agency, Requirements from Competitor | doc | 3 Jun 2026 | Hooray / other vendor | [Drive](https://docs.google.com/document/d/1NQnM1WHahsv70ThHeTmSC_uLTv1gGkXQk1dMwBSViCo/edit) | Rival vendor's scope |
| Gemini notes, 13 sales calls (30 Apr x2, 11 May, 8 Jun, 9 Jun, 10 Jun x2, 16 Jun, 18 Jun, 23 Jun, 30 Jun, 6 Jul, 14 Jul) | doc | Apr to Jul 2026 | Nick | [Folder](https://drive.google.com/drive/folders/1Hr0i5Bovco0wZH_ONMFF60U4e_L6BMwj) | Record of the sale |
| Hooray x Supernal - Kickoff.pptx | deck | 5 to 28 Aug 2026 | Jaime | [Drive](https://docs.google.com/presentation/d/1S5LGRFiHnN6AKbYkVq-D3KGJb-E9EoQN/edit) (also "Kickoff 2", "[OLD] Kickoff" in the [Kick-off folder](https://drive.google.com/drive/folders/1eJGSANo6_gJuuLNAIJEVh6o9_bJ5m4vs)) | Client kickoff |
| Weekly Brief W2 to W14 (13 files; no W12) | deck | 11 Aug to 10 Nov 2026 | Jaime | [Folder](https://drive.google.com/drive/folders/1b8On94FfYoiut0qS8IWmdWuy1qxFMum5); latest [W14](https://drive.google.com/file/d/182oqPsltzcVuUgzCtdMHQbqFQSzNJIN2/view) | Weekly client status |
| Genome-Hooray-AM.pptx and v2 | deck | 14 and 22 Sep 2026 | Jaime | [v2](https://drive.google.com/file/d/1HPkrbyLRJvwR0EOUgmjlmmSWwwGdEZ1i/view), [v1](https://drive.google.com/file/d/1w6f1HK5wsMAE81k49unLv-xhBbp2TtOt/view) | Presenting Genome to AMs and executives |
| Design Workshop Notes | doc | 12 Aug 2026 | Jaime | [Drive](https://docs.google.com/document/d/1BTcosSB3VBpRkvVQR92VqYLKvHevJCFwp6ddXOif9Hs/edit) | Product requirements from workshop |
| Ask Genome - Product Definition | doc | 1 Sep 2026 | Harvy / Jaime | [Drive](https://docs.google.com/document/d/1t-JMu_LD6wOdOqbeh1JJZd_bxYUjNN0UDYPgyMlh5mU/edit) | Chat product spec (not opened) |
| IGNORE_ASK Genome - Documentation System | doc | 1 Sep 2026 | not known | [Drive](https://docs.google.com/document/d/10rJbOvT4BVTpDH5CTycZkLyl-hFZVbl7QRjcSab-zLg/edit) | Superseded |
| Genome - Job Description.docx | doc | 10 Sep 2026 | Jaime | [Drive](https://drive.google.com/file/d/16oJJAMSgRtBLS0BvMPHCqqBorQk9wMZF/view) | Role definition for Genome (not opened) |
| Genome Metrics Inventory (3 versions, latest 25 Aug) | spreadsheet | 18 to 25 Aug 2026 | Harvy | [Latest](https://drive.google.com/file/d/1YnWLtq_FWQ8KQDYWEI8o72HGsGkO8JlY/view), [original](https://docs.google.com/spreadsheets/d/1IWb5IfwtJ9zYP4dWaCjHRf5fqVEo4XVF/edit) | Metric definitions for Brian's sign-off |
| Account Mapping Matrix | spreadsheet | 14 Sep 2026 | not known | [Drive](https://docs.google.com/spreadsheets/d/1lLOpYDBgV6GbYV8j3T-fgYZ0mmJGAVa0jDfsCKWEU1U/edit) | Hotels to platform accounts |
| Kick-off Hooray; Design Workshop 08/11 | doc (transcripts) | 11 Aug 2026 | Jaime | [Folder](https://drive.google.com/drive/folders/1_91VYnHJSjXuVYWid9cEKOtYWAWNVC3u) | Meeting records |
| Feedback - Client View; Feedback - Internal Console | folders | Aug to Sep 2026 | Jaime | [Resources](https://drive.google.com/drive/folders/1N36NvbVNFm4i5_86liVPXLvAlx7tzAZ9) | Client feedback (contents not listed) |
| hooray-agency-brand-brief.md; Hooray Identity Guide Summer 2025.pdf; logo folders | doc | 30 Jul to 12 Aug 2026 | Hooray | [Brand Assets](https://drive.google.com/drive/folders/11Agx62CfbfBTHVs32Kq6hUHhDdk-eqv8) | Branding for the console |

Slack-shared links.

| Title | Kind | Date | Owner | Where | For |
|---|---|---|---|---|---|
| QBR deck | site | 12 Nov 2026 | Jaime | https://qbr-hooray.links.getsupernal.ai/ | Status and Phase 2 discussion (Slack #acnt-hooray-internal) |
| Internal Platform (Command Center) | prototype / app | 18 Aug 2026 | Harvy | https://internal-genome.links.getsupernal.ai/ | Shown at workshop (Slack #acnt-hooray-internal) |
| client-hooray repository | code | 31 Jul 2026 | Harvy | https://github.com/Supernal-Technology/client-hooray | Product code; PRs 89 to 133 shared in Slack #supernal-squad-the-origin |

Other systems and mentions.

| Title | Kind | Date | Owner | Where | For |
|---|---|---|---|---|---|
| PRD: Hooray (Genome), with Key Features and Supporting Documents | doc | Aug to Sep 2026 | Jaime | [Notion](https://app.notion.com/p/b94bd5e8f31883088a8f811c7d43b12d) | Product requirements (not opened) |
| Hooray account page, AI Strategy Hub | doc | 21 Sep 2026 | Jaime | [Notion](https://app.notion.com/p/3aebd5e8f3188004a60fc25efcb3d81b) | Account summary (not opened) |
| Linear projects Hooray Phase 1 to 4 | dashboard | Aug 2026 on | Jaime | [Linear](https://linear.app/supernal-clients/project/hooray-phase-1-dc7e91e3a44e) | Delivery tracking |
| 23 scoping files | doc | 4 to 5 Jun 2026 | Tauseef / Jaime | `/Users/tauseef/ric-os/drafts/vault-export/449-Hooray_Agency_Ret+OF1_/` | June scoping |
| Hooray Help Center | site | 21 Oct 2026 | Jaime | location unknown (link sent in Slack #acnt-world-emblem-internal, 27 Oct 2026, cut off in search) | AM and hotel onboarding |
| Feedback tracking Google Sheet | spreadsheet | Nov 2026 | Jaime | location unknown | Pilot feedback (Delivery Sync, 9 Nov 2026) |
| Feedback template and workshop recording | doc, video | 1 Sep 2026 | Jaime | location unknown | Async review (Workshop, 1 Sep 2026) |
| SAL Vision Deck; HTML proposal v1; June prototype | deck, proposal, prototype | Jun 2026 | Nick / Jaime | location unknown | The original pitch (vault: A1-Signal-Intake; GTM + Scoping, 11 Jun 2026) |
| AskGenome design doc | doc | 10 Sep 2026 | Harvy | location unknown (may be the Drive product definition) | Architecture (Squad Lab, 10 Sep 2026) |
| Session guide for hotel feedback sessions | doc | Nov 2026 | Supernal | location unknown, may not exist yet | Hotel sessions (Drive: Weekly Brief W14) |

Folder notes: `1a1jdT2U…` is the account root with three subfolders. `1UNCTKho…` ("Hooray x Supernal") and `1Hr0i5Bo…` are the sales folders. `1JaAIggr…` returned nothing. The "Sales Transcripts" folder is empty.

## 12. Suggested vault sections

1. **Commercial path (scope and price history).** Files: price timeline; the licensing memo; each order form draft with what changed; the 30 Jun rescope note. Material: a lot (8 order form versions, 13 call notes, one memo).
2. **End-customer layer (the client's clients).** Files: pilot cohort and hotel list; account-to-platform mapping; hotel persona; monetisation options; hotel onboarding plan. Material: moderate (mapping matrix, design workshop notes, W14 Phase 2 slide).
3. **Metric definitions and data trust.** Files: metric inventory; per-platform refresh and lag rules; known data gaps (display spend, missing prior-year data); sign-off log with Brian. Material: a lot.
4. **Feedback log and design decisions.** Files: one file per session (1 Sep, 23 Sep, 24 Sep, Oct pilot audit); decision register with reason and date. Material: a lot.
5. **Phase gates.** Files: one per 90-day phase with definition of done, readout, next-phase plan as signed. Material: thin so far (W14 appendix); the contract requires it.
6. **Client internal alignment.** Files: who decides what at Hooray; competing initiatives (platform migration, Catalyst, custom GPTs, internal developer work); history of overridden decisions. Material: moderate, scattered across standups.
7. **Prior and adjacent client systems.** Files: Looker Studio reports, client custom GPTs, Catalyst / PearlDiver, Prophit, Momentum AIQ, Funnel. Material: moderate.

## 13. Book

### 1. The account in one page

Hooray Agency markets luxury hotels and resorts. It has about 30 years of history, a few dozen staff and about 40 to 50 hotel clients. Supernal builds it a product called Genome: one store of each hotel's marketing data from GA4, Meta and CM360, an internal console for Hooray's account managers, a portal each hotel logs into, and a chat that answers questions about the numbers. Hooray pays $8,900 per month for 12 months from 1 Aug 2026, $106,800 in all, with a way out at month 6, and owns everything built.

Three things set this account apart. First, the product serves Hooray's own clients, so its success depends on people Supernal never meets. Second, what was scoped in early June, an AI employee for creative briefs at $72,000, is not what was signed, and what was signed is not quite what was built. Third, the work runs in 90-day phases, and the scope of each phase is meant to be agreed at a gate.

Phase 1 is built. Ten hotels are connected. Ten account managers have been invited. No hotel has used it. The team's own reading is that the build has gone well and the client's internal alignment has been the hard part. Health is 3.0 of 5, Watch, with the two weakest scores on technical depth and on how easily Supernal could be replaced.

Sources: (Drive: MSA + Order Form); (Drive: Weekly Brief W14); (Account OS); (Delivery Sync, 9 Nov 2026); (vault: Proposal-v2 › Commercials).

### 2. Why they bought

No single reason carried this sale. The starting point was a relationship: Nick met the CEO, Steven Seghers, at a hospitality conference in early 2026, which is why Supernal was in the room at all. The pain was real but unmeasured. David Metze said account staff lose 60% or more of their time to chasing unclear client requests and assembling monthly reports from four platforms that never agree.

Hooray had already tried to solve it. Its developers built a chatbot, then began moving it to Google Vertex, and stalled both times because they kept being pulled onto client problems. That failure made an outside partner thinkable, but it also created the main objection: the operations executive, Randy Stuck, believed they could still do it themselves. Two commercial terms answered him. Hooray would own the code from day one, and it would pay monthly with an exit at month 6, so the bet was small and reversible.

A competing vendor helped without meaning to. Its requirements document, which Hooray shared, framed the same problem as a reporting assistant. That told Supernal to lead with reporting and keep the AI-employee idea as the larger picture. By mid-June Randy trusted Nick more than earlier vendors. And the CEO added a reason of his own: he wanted something hotels would pay for. That last reason later reshaped the deal.

Sources: (vault: Sales-Context › Origin, Political Landscape); (vault: Sales-Notes); (Drive: Hooray Agency, Requirements from Competitor); (Drive: Gemini notes, 18 Jun 2026).

### 3. How the scope changed between scoping and signing

The scoping files of 4 to 5 Jun describe SAL, an AI employee that drafts monthly reports first and packages creative briefs second, for a $5,000 monthly retainer plus a $12,000 build: $72,000 in year one. Eight weeks later Hooray signed for a client-facing data console at $106,800. Four separate forces produced that.

First, the pitch moved. By the 16 Jun presentation Supernal was selling "AI-native" companies, a data store and consoles, at $8,000 per month, and the brief-packaging work had dropped away.

Second, the CEO raised the ambition. On 18 Jun Hooray asked for a product it could sell to hotels by 1 Jan 2027, shown to them in Aug and Sep when budgets are set. That meant an internal console and a hotel console in parallel. Supernal priced it at $16,000 per month, $192,000, plus a licence fee per hotel, and planned to keep the platform as its own property.

Third, the money stopped it. On 30 Jun David said the stretch was too great. Hooray did not know hotels would pay, saw the project as a gamble, and would rather risk about $50,000 than $150,000. Above about $8,000 per month it would hire staff instead. Its own developer had also just connected Google Analytics to an AI tool, which made a small proof feel within reach.

Fourth, the two executives wanted different things, one to swing big and one to spend little. Ninety-day phases let both agree. The licence fee disappeared and Hooray kept full ownership.

Sources: (vault: Proposal-v2 › Commercials); (Drive: Gemini notes, 16, 18, 30 Jun and 6 Jul 2026); (Drive: [Internal] Pricing & Licensing Memo); (Drive: MSA + Order Form).

### 4. How the deal is built

The signed order form is short and unusual. It commits a monthly fee, not a fixed list of work. Phase 1 is described in full: a data store on the sources Hooray controls, a branded console for a demo group of 10 hotels, the Genome chat, and a kit for demonstrating it. After that, each 90-day phase ends in a gate where both sides read what hotels used and asked for, then sign a one-page plan for the next phase, sized to what the fee covers. Work beyond that capacity needs a new order form.

The fee is $3,000 for strategy and $5,900 for build. It covers 10 connected accounts; each further block of 10 costs $500 per month. A connected account is one platform account, not one hotel, so a hotel on three platforms can count as three. That matters for the request to bring about 40 hotels live. Third-party costs up to $500 per month are included.

Hooray owns the console code, Genome's configuration, the database and the data. If it leaves, Supernal runs a paid migration and hands over credentials within 10 business days. The term renews automatically for six months at a time. The early exit falls at the end of Jan 2027, which is also when Phase 2 is due to end.

The order form lists an internal account-manager console as a later option. In practice it was built first.

Sources: (Drive: MSA + Order Form › 2 to 9); (Linear).

### 5. The product and why the September sessions reshaped it

The first version, shown in August, was built from the contract and two design workshops. It led with blended return on ad spend, compared each month with the one before, opened the chat across all hotels, and wrote a short narrative at the top of each report.

Three sessions on 22 to 24 Sep changed much of that, for reasons that came from different places. The hotel business supplied some: demand is seasonal, so the comparison had to be the same month last year, and reviews are quarterly, so a quarter view replaced the rolling 30 days. Hooray's commercial position supplied others. It is paid a share of ad spend and is judged on results it only partly controls. Part of a hotel's budget buys awareness, not bookings, so a return figure at the top starts the wrong conversation. The home screen now leads with revenue, transactions, room nights and average rate, the same order as the old report, and marks figures the agency cannot influence. Budget numbers were left out to avoid arguments about unspent money.

How hotels work supplied more: usually one person per property logs in, so reports had to export to PDF. And the feedback itself was candid about the AI. Text that restated the screen was judged low value; the buttons that ask or explain were what people wanted.

Timing also mattered. Supernal had found wrong metrics earlier in the month, and the executives, burned by an earlier internal project also called Genome, insisted on reviewing before any account manager did.

Sources: (Supernal <> Hooray Weekly Sync, 19 Aug 2026); (Feedback Session | David & Roger, 23 Sep 2026); (Genome Feedback Session, 24 Sep 2026); (Weekly Review, 11 Sep 2026); (Delivery Sync, 21 Sep 2026); (Drive: Design Workshop Notes).

### 6. How delivery has gone

The build went quickly. Within two weeks of kickoff the team had data access, a production environment and an internal console to show. A client leader said, in effect, that the pace would let him sleep. The first three milestones closed on or near their dates: kickoff by 14 Aug, data for all 10 hotels by early Sep, Genome live by the end of Sep.

The data was harder than the screens. Each platform reports differently. Google Ads was not connected, so paid search was derived from GA4. Display spend bought through Trade Desk before mid-2026 has no cost in the newer system, so history is incomplete. Mid-September checks found wrong numbers, which cost about a week and led to a formal comparison with Hooray's Looker reports.

From October the delays came from the client side. The pilot milestone, due 16 Oct, sits at 75%. Rollout, due 30 Oct, sits at 54%. Leadership chose to migrate about 45 hotels off another platform at the same time as onboarding, against the team's advice, and the date moved to 2 Nov and then 9 Nov. David then resisted putting hotels on at all, while the CEO's instruction to proceed stood. On 9 Nov Supernal was still waiting for a go.

Around this the squad built things nobody asked for by contract: a help centre, a connector request hub, usage tracking.

Sources: (Slack #acnt-hooray-internal, 19 Aug 2026); (Linear); (Supernal <> Hooray Weekly Sync, 19 Aug 2026); (Weekly Review, 23 Oct and 6 Nov 2026); (Strat Team Standup, 26 Oct 2026); (Drive: Weekly Brief W14).

### 7. The people

Four people at Hooray decide, and they do not always decide together. Steven Seghers, the CEO, signed the contract and thinks in large moves. He asked early where Genome's intelligence comes from and whether other Hooray tools could be folded in, and in late October he floated turning Genome from a reporting tool into something that carries Hooray's expertise. Randy Stuck holds the budget, began as the sceptic who preferred building in house, and has become a precise reviewer of what the numbers should say. David Metze is the day-to-day contact and the original champion; he has staked his standing on an outside partner working. Roger Burns is the steady co-champion who knows how to move the others.

David and Roger have said they get caught between the CEO and Randy. That gap shows up in delivery: the team reports that decisions made by the working group get overridden by the CEO. Below them sit about eight or nine account managers and three account directors who had not heard of the project until September, and a validator, Brian, who signs off calculations.

On Supernal's side Nick has held the relationship since the first meeting. Jaime runs strategy and product, Harvy builds, Vitor reviews code, Diana designs and runs feedback sessions. They work as one squad across four accounts.

Sources: (Drive: Gemini notes, 18 Jun 2026); (Slack #acnt-hooray-internal, 5 Aug 2026); (Slack #supernal-squad-the-origin, 2 Nov 2026); (Client View Portal - Workshop, 1 Sep 2026); (Strat Team Standup, 26 Oct 2026); (All-Hands, 10 Nov 2026).

### 8. What value has shown, and what is next

So far the value is a working product, not a number. Monthly reporting is automated for the pilot hotels. Nick has estimated a time saving of about half, but nobody has measured the hours account managers spent before or spend now. The June targets of 50 hours a month and 95% on-time reports were never agreed with the client and are not tracked. Six of ten invited account managers had logged in by late October. No hotel has. Hooray has not yet earned anything from Genome, which was the CEO's reason for wanting it.

That is why the scores for defensibility and technical depth are low: a reporting console on three common data sources is something another vendor, or Hooray's own developer, could reproduce.

The next steps are all decisions. Hooray must say when hotels start and how Phase 1 closes. Both sides must agree what Phase 2 is. Four requests are on the table: hotel booking-system data, which is valuable and very hard because every hotel uses a different system; growing from 10 to about 40 hotels by 1 Jan 2027; a Catalyst console; and Prophit as a source. Supernal's internal plan instead describes Genome preparing account-manager work. A QBR on 12 Nov was meant to settle it. The month-6 exit at the end of Jan 2027 is the date that gives this urgency.

Sources: (Squad Lab, 13 Oct and 22 Sep 2026); (Account OS); (Drive: Weekly Brief W14); (Slack #acnt-hooray-internal, 15 Oct and 12 Nov 2026); (Linear); (Drive: MSA + Order Form).

## 14. Gaps and conflicts

**Could not find or access**

- Outcome of the 12 Nov 2026 QBR and anything from the Denver AI Summit. No Granola note after 10 Nov mentions Hooray.
- Whether anyone went to Denver. Budget ruled it out (Delivery Sync, 9 Nov 2026); the trip was approved the same day (All-Hands, 10 Nov 2026); the health note says an in-person meeting on Friday (Account OS).
- Drive folder `1JaAIggrk7VG4rq-2GYYOk-hrT1bPR8vV` returned no files (empty or no access). "Sales Transcripts" is empty.
- Not opened: Proposal v5 HTML, Ask Genome product definition, Genome job description, the QBR site, Notion PRD and account page, Funnel document, the two feedback folders.
- Fathom, Gmail and transcripts were not searched. Granola search was read to the first page only (38 meetings).
- Usage figures, any measured baseline, margin, the reference call, why $8,900 and not $8,000, and any quote for the 40-hotel expansion.
- Account OS has no stakeholders, goals, cadence, value entries or renewal plan for this account.

**Sources disagree**

- **Price.** $60,000 (Pipedrive), $72,000 (vault: Proposal-v2), "$7k order form, about $12k Phase 1" and "about $40k in build fees" (vault: Scoping-Package; A5-Scope-Definition), $96,000, $192,000 (Drive: memo), $106,800 signed.
- **Phase names.** Vault: Phase 1 reporting, Phase 1.5 Trade Desk, Phase 2 briefs. Contract: 90-day phases. Linear: Phases 1 to 4 as an agent roadmap. Client deck: Phase 2 as path to monetisation.
- **Ownership.** The memo planned the hotel platform as Supernal property under licence; the contract gives everything to Hooray.
- **Data sources.** Contract says DV360, GA4, Meta; built on CM360, GA4, Meta, with DV360 only for display spend (Drive: Weekly Brief W14). Vault and competitor document assumed Google Ads and Trade Desk.
- **Scope of first build.** 30 Jun notes say one hotel, one source, Gemini as the model; the contract says 10 hotels and three sources; 14 Jul notes say model-agnostic.
- **Internal console.** Called mandatory on 18 Jun, removed on 30 Jun, listed as a future option in the contract, built in August.
- **Health.** Account OS says Watch at 3.0; the delivery sync lists Hooray as healthy (Delivery Sync, 9 Nov 2026; New note, 26 Oct 2026).
- **Phase 1 status.** The health note says the first phase is complete (Account OS, 26 Oct to 1 Nov); Linear shows M4 at 75% and M5 at 54%; the client deck moves M4 to 9 Nov and M5 to end of Nov.
- **Summit date.** Thursday 12 Nov (Drive: Weekly Brief W14; Slack) versus Friday 13 Nov (Account OS; All-Hands).
- **Names and titles.** Randy appears as "Randy Sto, EVP" (vault), "Randy Stuck" (Drive), "SVP Ops" (memo). Steven's surname appears as Seghers and Sagers. Caitlyn and Caitlin. A "Greg" in one standup note is Hooray's Genome (inferred from context). "Gino" in workshop notes is Genome.
- **Hotel count.** 50 clients (memo), about 45 (Strat Team Standup, 26 Oct 2026), about 40 (Slack, 15 Oct 2026), 40 or 50 (Drive: Weekly Brief W14).
- **Account cap.** 100 accounts agreed on 23 Jun; 10 connected accounts in the contract.
