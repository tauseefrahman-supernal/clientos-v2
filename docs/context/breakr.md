# Breakr (BRKR.IO Inc.): ClientOS context document

Compiled 13 Nov 2026. Depth: DEEP. Account OS account id `01M20ZRNZ66A9TJ9CARAJS4GTP`. Meeting notes often write the name as "Breaker"; the legal entity is BRKR.IO Inc. Source labels: "Notion weekly report" means the Weekly Account Health Reporting database row for the week named; "Slack" means #acnt-breakr-internal unless stated.

---

## 1. Snapshot

- **Who:** BRKR.IO Inc. ("Breakr"), Atlanta, a creator-marketing and fintech platform (creator payments, campaigns, BreakrPay) run by brothers Anthony "Tony" Brown (CEO) and Ameer Brown (CTO) (Account OS; Notion account page; Drive: brkr-io-inc-breakr-of-001-v1-signed.pdf).
- **What they bought first:** one AI employee, **Ella**, a customer-success agent, for $4,000 a month ($48,000 year 1), signed 10 to 11 Mar 2026 (Drive: brkr-io-inc-breakr-of-001-v1-signed.pdf).
- **What they bought second:** OF-003, signed on or about 26 Oct 2026, which makes Supernal Breakr's engineering partner: $21,000 a month for months 1 to 3, then $15,000, $198,000 over a 12-month initial term. It supersedes the $4,000 order form (Drive: brkr-io-inc-breakr-of-003-v2-signed.pdf; Account OS).
- **Where it stands:** Ella v2.0.0 is in production and in daily use. Phase 1 of OF-003 (the frontend for Duolingo's "Creator Networks", 35 features) must be live by 4 Dec 2026. On 12 Nov 2026 the client escalated to Johnny and the strategist on the account called the situation red (Slack, 12 Nov 2026; Linear).
- **Pod:** the Account OS account pod fields are empty; the two deals list AM Johnny, strategist Devan, FDE Aman (Account OS). The real team today is Johnny Borbone (commercial lead), Dominik Springer (AI strategist, since 20 Oct 2026, replacing Devan Leibowitz), Aman Nirala (lead engineer since Mar 2026), Doren Gore (QA engineer, since 5 Nov 2026), with Naveen Lekkalapudi and Thomas Bustos as escalation and support (Slack, 5 Nov and 12 Nov 2026; Breakr x Supernal, 20 Oct 2026; Drive: OF-003).
- **Health:** 4.2 for the week of 2 to 8 Nov 2026 (previous 3.8). Dimensions: Tech 5, Strategic Defensibility 5, Exec Engagement 5, GM 4, Build 2. The band shown is **Watch**, because Build is flagged low, and renewal risk is Medium (Account OS). The Notion report for the same week says Green/Healthy (Notion weekly report, wk of 2 Nov 2026). The two disagree; see section 14.

---

## 2. Structure of this account

This account is not "one client, one AI employee". It has four layers that a standard template would flatten.

**Entities**

| Entity | Role | Source |
|---|---|---|
| BRKR.IO Inc. ("Breakr") | The client. Signs and pays. | (Drive: OF-003) |
| Infinity Constellation Inc. d/b/a Supernal | The contracting party on Supernal's side. Collections pressure in Sep 2026 came from Infinity, not the delivery team. | (Drive: OF-003; Notion weekly report, wk of 14 Sep 2026) |
| Altus Minds | Breakr's staffing agency for core platform engineering (Sagar Dangal, Kishan; team based in Nepal/India). Supernal takes over its platform work after Phase 1. | (Breakr x Supernal, 1 Oct 2026; Drive: OF-003; Notion weekly report, wk of 31 Aug 2026) |
| Duolingo | Breakr's customer. Its Creator Club requirements define the 35 features and the 4 Dec 2026 date. Supernal has no contract with Duolingo. | (Drive: OF-003) |
| Manifest (Manifest Financial) | Acquirer/merger counterparty for Breakr during 2026; ran code diligence on Ella's repo. | (Slack, 13 Aug 2026; Notion weekly reports, wk of 17 Aug and 14 Sep 2026) |
| J.P. Morgan | Breakr's banking counterparty; Supernal sat in on calls about float income on client funds. | (Breakr x JPMorgan Next Steps, 6 Nov 2026; Drive: 2026-06-19 Breakr -- J.P. Morgan) |

**Contract stack**

1. **Governing Agreement:** Supernal Terms & Conditions dated 11 Mar 2026 (Drive: brkr-io-inc-breakr-msa-v1-signed.pdf, not opened).
2. **Order Form of 11 Mar 2026 ("OF-001"):** Ella, two sequential phases inside one engagement. Phase 1 "Core Operations": resolve queries from backend systems, escalate with full context, execute controlled backend corrections. Phase 2 "Learning, Context and Dashboard": learn from team feedback, shared context across conversations, Ella dashboard. $4,000 a month, term 11 Mar 2026 to 9 Mar 2027, auto-renew 12 months (Drive: OF-001).
3. **OF-002 (Ella next phase):** drafted in Sep 2026, never issued. OF-003 states it is "not issued" and that Ella updates are delivered under OF-003 (Drive: OF-003, Section 9; Slack, 15 Sep 2026).
4. **OF-003 plus Amendment No. 1 to the Governing Agreement:** four workstreams in two phases, signed by Scott Downes and Anthony Brown (Drive: OF-003).

**OF-003 workstreams and phases**

| # | Workstream | When | Who builds what |
|---|---|---|---|
| 1 | Creator Networks for Duolingo | Phase 1, to 4 Dec 2026 | Supernal: frontend for 35 features, deployment, CI and browser tests. Breakr (Sagar): backend, data model, payments, cloud infrastructure. Supernal gives up to 5 hours a week of infrastructure support. |
| 1b | 3 platform extras (clipping bounties, ad boosting and rights, creator-side content library) | After Phase 1, within 90 days of go-live | Supernal frontend, Breakr backend. These are the 3 of Breakr's 38 features that are not Duolingo's 35. |
| 2 | Altus Minds takeover | After Phase 1 | Supernal maintains breakr-api and breakr-web; Takeover Report due within 30 days of go-live. |
| 3 | Amp | After Phase 1; discovery to end Mar 2027 | Breakr's platform-wide AI companion on the existing breakr-agent harness; money and CRM changes go through breakr-api; a person approves every outbound action. |
| 4 | Ella | Throughout | Hosting, operation, support; monthly updates resume after Phase 1. The six OF-001 features are carried forward as Exhibit A Part 4. |

(Drive: OF-003, Sections 2 to 4)

Phase 1 milestones: M1 "Run the US program", 16 features testable by 30 Oct 2026; M2 "Scale and international", 14 features testable by 13 Nov 2026; M3 "Long-term program", 5 features testable by 27 Nov 2026; all 35 live in production by 4 Dec 2026. After Phase 1, scope is set by Quarterly Statements of Work (QSOW) and capacity is chosen per contract quarter (Drive: OF-003, Sections 3, 6, 8).

**How it connects:** Ella (workstream 4) is the original product and the reason for trust. Creator Networks is new work on Breakr's own platform, shared with the client's agency engineers. Amp is the future agentic layer that would sit on top of both. A fifth, uncontracted stream, "Strategy & GTM", has grown up around the strategist and has its own Linear project (Linear).

**Deals**

| Title | Motion | Value | MRR | Stage | Dates | Source |
|---|---|---|---|---|---|---|
| Breakr | New | $48,000 | $4,000 | Closed Won, status Active | Closed 11 Mar 2026 | (Account OS) |
| AI Native Expansion | Expansion | $198,000 | not recorded (flagged missing) | Closed Won, status Open | Expected 30 Oct 2026, closed 26 Oct 2026 | (Account OS) |

Note: OF-003 supersedes the first deal ($4,000 ends and is not additive), but Account OS still shows the first deal as Active with $4,000 MRR (Drive: OF-003, Section 9; Account OS).

---

## 3. Arc

**Q1 2026 (sale and start)**
- Tauseef ran scoping for Breakr among other new deals (Notion: Tauseef Current Focus Areas, Mar 2026).
- 10 to 11 Mar 2026: Order form signed by Anthony Brown and Eric Kravitz (Drive: OF-001).
- 4 Mar 2026: the Brown brothers also met Supernal about a separate logistics venture, Auryn Logistics (Supernal AI <> Auryn Logistics - Engineer Scope, 4 Mar 2026).
- 16 Mar 2026: discovery call scheduled with a prepared technical agenda (Delivery Planning Weekly, 16 Mar 2026). 18 Mar: Slack channel created (Slack).
- 24 to 26 Mar 2026: internal concern that the $48,000, 200-hour scope was creeping from payment queries into a finance agent with Stripe integration, and that the delivery team was unprepared on a Monday client call (Sync: Thomas & Tauseef, 24 Mar 2026; Post scoping engagement, 26 Mar 2026).
- Meetings: not countable from the sources reached.

**Q2 2026 (build Ella)**
- April: database access through a long tunnel on 1 Apr; first demo on 1 Apr lifted client confidence; PayPal and Stripe integrated 6 to 8 Apr; Ella live on Render 11 Apr; added to Breakr's Slack 16 Apr; two personas (CS rep for users, teammate for colleagues) by 24 Apr (Slack, 1 to 24 Apr 2026).
- 27 Apr 2026: hours overrun foreseen. The client had dropped Intercom as the data layer mid-project, which meant a custom stateless layer; Naveen recommended treating the extra work as an upsell (Delivery Team Sync, 27 Apr 2026; Slack, 27 Apr 2026).
- 29 Apr to 8 May: production database access blocked by Altus Minds' architect on least-privilege grounds; resolved 8 May via pgbouncer; Ella live on staging (Slack, 29 Apr and 8 May 2026).
- 15 May: Sagar proposed using Breakr's new Business API instead of direct access (Slack, 15 May 2026).
- June: Phase 2 nearly complete but blocked on the Business API not being in production; Slack human-in-the-loop approvals built (Delivery Planning Weekly, 1 Jun and 8 Jun 2026; Slack, 15 Jun 2026).
- 22 Jun 2026: Breakr had a $20 million acquisition offer, founders to stay two years; founders also wanted Supernal as the AI team for a new logistics business (Deal Room Standup, 22 Jun 2026).
- Client meetings: May 6, June 5 (Drive: Transcripts folder).

**July 2026**
- 6 Jul: Ella dashboard on dev shared for feedback (Slack, 6 Jul 2026).
- 13 Jul: Supernal's supply-chain security incident. Breakr was the one client where malicious code executed in production, so it was notified and asked to rotate all secrets; Ella back online 15 Jul (All Hands, 13 Jul 2026; Slack, 15 Jul 2026).
- 20 Jul: Progress and Roadmap session. Business API docs arrived; roadmap shifts from an internal tool towards an agentic service for Breakr's clients (Supernal x Breakr Progress + Roadmap, 20 Jul 2026).
- Go-live held for Mauro's persona report and then Breakr's Intercom widget change (Breakr <> Supernal, 21 Jul 2026; Notion weekly report, wk of 27 Jul 2026).
- Client meetings: 3 (Fathom).

**August 2026**
- 12 Aug: Ella live on production Intercom and dashboard at ella.breakr.app (Slack, 12 Aug 2026).
- 17 Aug: "Ella / Verve incident": Ella auto-replied to a customer by email with incomplete information. Two causes found (Intercom email integration, then Gmail forwarding on the info inbox). Email was rebuilt as draft-for-approval (Notion weekly report, wk of 17 Aug 2026; Breakr x Supernal, 18 Aug 2026).
- 18 Aug: Eisley's last day; Mauro absorbs finance duties (Notion weekly report, wk of 17 Aug 2026; Breakr <> Supernal, 4 Aug 2026).
- 28 Aug: Ameer told his team to go to Ella first; CS Desk alpha live on dev (Slack, 28 Aug 2026).
- Client meetings: 4 (Fathom).

**September 2026**
- 2 Sep: CS Desk live (Slack, 2 Sep 2026). Analytics and Workbench/PostHog connected (Notion weekly report, wk of 7 Sep 2026).
- 15 Sep: new-scope order form drafted for Johnny's pricing review (Slack, 15 Sep 2026).
- Mid to late Sep: invoices four months aged; full balance demanded by 30 Sep with removal of services flagged; Ameer proposed pausing development until paid (Notion weekly reports, wk of 14 Sep and 21 Sep 2026).
- 28 to 29 Sep: invoices 1 to 6 paid, $28,000 received (Slack, 29 Sep 2026).
- Client meetings: 2 (Fathom).

**October 2026**
- 1 Oct: Anthony proposed consolidating all development with Supernal at $15,000 a month; IP ownership clarified (Breakr x Supernal, 1 Oct 2026).
- 6 Oct: new engagement model and "Jarvis-like" vision discussed (Breakr x Supernal, 6 Oct 2026).
- 14 Oct: proposal presented; deal effectively agreed (Breakr x Supernal, 14 Oct 2026).
- 19 Oct: sprint started ahead of signature (Linear; Notion weekly report, wk of 19 Oct 2026).
- 20 Oct: Dominik introduced as strategist; Devan hands over (Breakr x Supernal, 20 Oct 2026; Slack, 21 and 26 Oct 2026).
- 22 Oct: Ella down in production after keys were revoked as a post-security-incident action (Slack, 22 Oct 2026).
- 26 Oct: OF-003 closed (Account OS). 29 Oct: Ella v2.0.0 in production; 5-hour outage the same day when OpenAI embedding credits ran out (Notion weekly report, wk of 26 Oct 2026).
- Client and joint meetings: about 9 (Fathom).

**November 2026 (to 13 Nov)**
- 2 Nov: Tony asks Dominik for GTM and pricing work; Ameer asks him to run the product team (Strat Team Standup, 2 Nov 2026).
- 3 Nov onwards: Dominik runs the daily standup and a new Jira board (Notion weekly report, wk of 2 Nov 2026).
- 6 Nov: scope and timeline call; affiliate deferred to Phase 2 at that point (Next Steps Creator Networks - Duolingo, 6 Nov 2026).
- 8 Nov: all open questions sent to Ameer in one deck (Notion weekly report, wk of 2 Nov 2026).
- 10 Nov: critical analytics bug traced to five pages each computing metrics; Ella release blocked on the Business API security patch reaching production (Breakr x Supernal, 10 Nov 2026).
- 12 Nov: Tony phoned Johnny; internal thread on knowledge transfer, access and scope; alignment meeting being arranged (Slack, 12 Nov 2026).
- Meetings: about 12, mostly daily standups (Fathom).

---

## 4. Why they bought

**The first deal (Ella, Mar 2026)**
- The stated pain in the order form: creators waited while Mauro looked up data by hand across three systems, and a set of backend corrections needed Ameer's manual intervention (Drive: OF-001).
- The promise: Ella queries the backends herself and is autonomous for 60 to 75% of queries, with no financial execution (Drive: OF-001).
- Price point: $4,000 a month was small enough to try (inferred from the deal size and the Notion "Small" tier).
- What was shown or analysed before signing, what alternatives they considered and who else they spoke to: **not found**. The pre-signature sales calls were outside the Fathom search window reached, and Granola holds no client-call notes for Breakr.
- One internal note says Ameer never reviewed the original scope document and only Anthony commented on it (Post scoping engagement, 26 Mar 2026).

**What unlocked the expansion (Oct 2026)**. Several causes, not one:
1. **Service level held through four months of non-payment.** Ameer named this as the reason they trust Supernal with the whole engagement (Notion weekly report, wk of 28 Sep 2026).
2. **Ella became the team's daily tool.** Ameer told the team to use Ella first; Mauro runs his day on it (Slack, 28 Aug 2026; Notion weekly report, wk of 21 Sep 2026).
3. **Cost arithmetic.** Breakr paid about $12,000 a month to its staffing agency plus $4,000 to Supernal; one partner at $15,000 saves money (Notion weekly report, wk of 28 Sep 2026).
4. **A product-management bottleneck.** The higher tier brings a dedicated strategist/product lead (Breakr x Supernal, 1 Oct 2026).
5. **A dated customer mandate.** Duolingo's Creator Club requirements arrived 30 Sep with a 4 Dec outer limit (Notion weekly report, wk of 5 Oct 2026).
6. **Funding closed.** The raise closed at $3 million with about $2 million more in diligence, and investors expect capital deployed against specific things (Notion weekly report, wk of 28 Sep 2026).
7. **IP comfort.** Investor diligence kept raising IP; the answer was that Breakr owns everything built for it and Supernal owns its harness (Breakr x Supernal, 1 Oct 2026).
8. **Strategic thesis.** White-label an agentic platform to agencies for 10 to 15% of outcomes on top of a 3 to 5% take rate (Breakr x Supernal, 1 Oct 2026).

**Alternatives they had:** keep Altus Minds for platform work and Supernal for Ella (a hybrid). Supernal said it could not support third-party vendors' code under its SOC requirements, which made the hybrid unworkable (Breakr x Supernal, 1 Oct 2026).

---

## 5. Commercials

**Pricing model:** monthly retainer for named capacity, not per-deliverable. Base is two engineers at 0.5 FTE each plus a strategist; the client may raise to 1.5 FTE engineering per contract quarter (Drive: OF-003, Sections 5 and 6).

**Every price found**

| When | Price | Context | Source |
|---|---|---|---|
| Mar 2026 | $4,000/mo, $48,000 year 1; first two months ($8,000) due on signing | OF-001; scoped internally at 200 hours | (Drive: OF-001; Sync: Thomas & Tauseef, 24 Mar 2026) |
| 27 Apr 2026 | $4,000 = 4 build points; $5,000 = quarter FTE; $10,000 = double Mason capacity; 30% reserved for maintenance | Internal retainer model discussion | (Delivery Team Sync, 27 Apr 2026) |
| Sep 2026 | $12,000/mo for a first tranche of new Ella scope | Order form held until payment landed | (Notion weekly report, wk of 14 Sep 2026) |
| Sep 2026 | $25,000/mo order form to Tony, not sent | Conflicts with the $12,000 a week earlier | (Notion weekly report, wk of 21 Sep 2026) |
| 1 Oct 2026 | $15,000/mo tier | Anthony's consolidation proposal | (Breakr x Supernal, 1 Oct 2026) |
| 5 Oct 2026 | Client budget $15,000 vs $21,000 proposal | "Pricing misalignment" | (Delivery Sync, 5 Oct 2026) |
| Oct 2026 | Internal: about 1,050 Supernal hours at $250 = $262,500; $23,000/mo is break-even on the points framework; $15,000 covers about 65% of 1,104 expected hours | Margin warning before the number went to the client | (Notion weekly report, wk of 5 Oct 2026) |
| 14 Oct 2026 | $15,000 base, $21,000 for months 1 to 3, 24 months, $378,000 over 24 months | Proposal deck; client all-in product budget $30,000 to $35,000/mo | (Drive: 20261014_Breakr_Supernal.pptx; Breakr x Supernal, 14 Oct 2026) |
| 26 Oct 2026 | 3 x $21,000 + 9 x $15,000 = $198,000 over a 12-month initial term | Signed OF-003 | (Drive: OF-003) |
| Nov 2026 | Idea to hold $21,000 beyond month 3 if the client keeps leaning on Dominik | Not agreed with the client | (Account OS health summary, 7 Nov 2026; Strat Team Standup, 2 Nov 2026) |

**Terms in OF-003** (Drive: brkr-io-inc-breakr-of-003-v2-signed.pdf)
- Invoiced monthly in arrears, net 30; interest 0.5% a month on overdue undisputed amounts. Supernal may not suspend or slow services during a good-faith dispute.
- $21,000 is the maximum monthly fee unless both agree otherwise. Capacity level chosen in writing one month before each contract quarter; a raise runs at least 90 days.
- Initial term 12 months, no termination for convenience, no automatic renewal; month to month afterwards on 30 days' notice. Supernal must notify Breakr 90 days before the term ends.
- Late delivery: recovery plan in 3 business days and extra capacity at Supernal's cost; if go-live is missed by more than 45 days for reasons attributable to Supernal, Breakr may terminate for cause.
- Other termination-for-cause triggers: security breach, no backfill of an engineer within 15 business days, service levels missed in three of six months, acquisition by a named competitor.
- Third-party costs up to $500 a month for Ella included.
- Breakr owns all deliverables on creation, not conditioned on payment; 90-day warranty; 60 days of transition assistance; no Supernal-hosted dependencies without consent; Ella must be exportable.
- Conflicts clause: named individuals may not build similar products for Lumanu, Kale, Trolley, Payment Labs, CreatorIQ, Agentio, Whop or ShopMy during the term and 6 months after.
- Publicity only with written approval per use. Governing law Georgia.

**Renewal date:** about 26 Oct 2027 (inferred from the 12-month initial term and the 26 Oct 2026 close; the exact effective date is the last signature date, not confirmed). The Notion account page still shows 11 Mar 2027 from the superseded order form (Notion account page).

**Payment history:** the first invoice took about six months to pay (Account OS stakeholder note on Tony Brown). Invoices 1 to 6, $28,000, were paid 28 to 29 Sep 2026 after clearing escrow (Slack, 29 Sep 2026; Notion weekly report, wk of 28 Sep 2026).

**Margin:** Notion marks the account "Profitable" (page last edited 8 Sep 2026). GM scored 3 in the week of 19 Oct and 4 in the week of 2 Nov (Notion weekly report, wk of 19 Oct 2026; Account OS). The deal closed about $100,000 below expectation because the term was cut from 24 to 12 months to secure the close (Weekly Pipeline Meeting, 28 Oct 2026).

**Unresolved**
- Whether month 4 onwards stays at $21,000 given the load on the strategist (Account OS health summary).
- GTM and pricing advisory for Tony is not in OF-003 (Strat Team Standup, 2 Nov 2026).
- Whether Sagar has actually been hired full time, which the price assumed (Drive: 20261014_Breakr_Supernal.pptx); not confirmed in any source.
- Account OS has no MRR on the expansion deal.

---

## 6. Product

**Ella (AI employee, live)**
- What it does: customer-success agent with two personas, a read-only customer persona on Intercom and a teammate persona on Slack and the dashboard. Looks up accounts, offers, payouts and invoices across Breakr's Business API, Stripe and PayPal; escalates with a brief; drafts replies; proposes actions that run only after approval (Slack, 24 Apr and 28 Aug 2026; Breakr <> Supernal, 4 Aug 2026).
- **Ella Operations Deck / CS Desk** at ella.breakr.app: all channels converge into tickets with ID, priority and assignment; opens on Escalations; "Draft with Ella"; an Ask Ella thread per ticket; Gmail on the desk; audit log; team management; analytics board (Slack, 30 Oct 2026; Notion weekly reports, wk of 24 Aug and 14 Sep 2026).
- v2.0.0 (29 Oct 2026): four roles (Viewer, Member, Admin, Superuser), Slack identity check, two-person money approvals, tamper-evident audit log, longer answers, lower cost (Slack, 30 Oct 2026; Linear).
- Users: Mauro (CS operations, power user), Ameer, Breakr engineering daily; Jacob and Sam barely (Notion weekly reports, wk of 7 Sep and 21 Sep 2026).
- State: v2.0.0 in production; v2.0.1 on dev waiting for Breakr to deploy the patched Business API to production; a documents subagent in progress (Slack, 12 Nov 2026).
- Stack: Fastify on Render, Supabase Postgres (staging and production vaults), OpenAI embeddings for memory, Opik for brain-run observability, PostHog and Datadog, Supernal Workbench Insights (Slack, 5 Jun, 12 Aug, 13 Sep 2026; Notion weekly report, wk of 5 Oct 2026).

**Creator Networks (product feature set on Breakr's platform, in build)**
- What it does: turns Duolingo's Creator Club (micro creators on a monthly retainer plus bonus) into a managed, branded program inside Breakr: networks, openings and membership, contracts, compliance rules, automatic post detection, retainer pay, single sign-on, audit log, Content Library, affiliate (Drive: OF-003, Section 3).
- Users: Duolingo's program team (brand side) and creators (Drive: OF-003).
- State: frontend for the Oct 30 scope built; M1 at 52% in Linear; M2 (due 13 Nov) and M3 at 0% (Linear). 32 of 47 Duolingo asks built, 9 live and 23 on test (Notion weekly report, wk of 2 Nov 2026).

**Amp (planned):** Breakr's always-present AI companion across the platform. Discovery after 4 Dec, first capabilities agreed by end Mar 2027, first capability live target Jun 2027 (Drive: OF-003; Linear).

**Altus Minds takeover (planned):** maintenance of breakr-api and breakr-web from 4 Dec 2026 (Linear).

**Strategy & GTM (advisory, in progress, uncontracted):** volume pricing schedule, TAM expansion messaging, pricing calculator, agency activation plan for about 200 agencies, API use case, reseller program, six-month product-to-GTM plan (Linear).

### Feature rationale

1. **Customer persona is read-only; money movement always needs a person.** Reason: prevents the AI from executing privileged actions without explicit approval; described as a key safety feature (Breakr <> Supernal, 4 Aug 2026; Drive: OF-001 guardrails).
2. **Email replies are drafts for approval, not auto-sent.** Reason: the Verve incident, where Ella emailed a customer incomplete information (Breakr x Supernal, 18 Aug 2026).
3. **Investigate first, then draft.** Reason: drafts landed in the first minute while triage took about eight, so they read as generic (Notion weekly report, wk of 12 Oct 2026; Breakr x Supernal, 20 Oct 2026).
4. **A second "brain turn" checks every reported number came from a tool, and the dashboard shows which tools fed a result.** Reason: a hallucination and trust problem, made worse by dollars-versus-cents confusion in the API docs (Notion weekly report, wk of 27 Jul 2026; Slack, 15 Jun 2026).
5. **Channel-agnostic brain with a conversation manager, leading to CS Desk.** Reason: the client wanted less dependency on Intercom; one place instead of hopping between Intercom, database, admin panel and email (Slack, 14 Apr 2026; Notion weekly report, wk of 24 Aug 2026).
6. **Ella reads the codebase and proposes a plan, then hands to Claude Code; she does not open pull requests.** Reason: avoids standing up test infrastructure for AI-generated code (Notion weekly report, wk of 31 Aug 2026).
7. **A separate, internal-only Google Cloud project for Gmail.** Reason: the shared project would trigger full Google app verification taking days to weeks (Notion weekly report, wk of 7 Sep 2026).
8. **Two-person approval for money, four roles, Slack identity check, hash-chained audit log.** Reason: Ella on Slack had no per-user guardrail and answered on internal data in client-facing threads; a customer email change is an account-takeover path (Notion weekly reports, wk of 14 Sep and 12 Oct 2026).
9. **Use Breakr's Business API rather than direct database writes.** Reason: Altus Minds' architect wanted least privilege and feared an agent corrupting production data (Slack, 29 Apr and 15 May 2026).
10. **Affiliate built on the existing Campaign model, not a new "Program" layer.** Reason: keeps campaigns as the single hub for analytics and budget tracking (Daily standup, 12 Nov 2026).
11. **Prompt caching and removal of the hidden answer cap.** Reason: Jacob's 76-record request was cut off; the fee only covers $500 a month of third-party costs (Notion weekly report, wk of 19 Oct 2026; Linear).

Open design question with no recorded decision: how paused approvals are stored (in memory with a 10-minute timeout, or a Postgres checkpoint) and how facts are re-checked on resume (Slack, 5 Jun 2026).

---

## 7. Use cases and feedback

**By team**
- **Customer success (Mauro):** answering creator and client questions, troubleshooting, working escalations from CS Desk, a live knowledge base; reports a "zero cases pending" way of working (Breakr x Supernal, 22 Sep 2026).
- **Founders/engineering (Ameer):** ran CS alone for a week with Ella; uses it to triage product bugs; wants an MCP server to drive Ella from Claude Code (Notion weekly reports, wk of 17 Aug and 24 Aug 2026).
- **Finance and accounting (Jacob, Sam):** named but not adopted: purchase-order matching against invoices and the daily invoice tracker spreadsheet (Notion weekly report, wk of 21 Sep 2026).
- **Stated next priority:** the BreakrPay and invoicing lifecycle, then PayPal balance and daily reconciliation, payout re-push, agency roster management, creator email changes (Breakr x Supernal, 25 Aug 2026; Notion weekly report, wk of 31 Aug 2026).

**Adoption and usage numbers**
- Usage score 4, "client uses it proactively" (Notion weekly report, wk of 2 Nov 2026).
- Ameer's estimate: Ella already handles about 90% of CS questions; the rest is actions (Notion weekly report, wk of 24 Aug 2026).
- Pre-launch evaluation: 31 to 41 of 44 hard checks, all critical checks passing (Breakr x Supernal, 11 Aug 2026).
- 33 customer-facing read-only tools; 70+ actions testable at go-live (Notion weekly report, wk of 27 Jul 2026; Supernal x Breakr Progress + Roadmap, 20 Jul 2026).
- Analytics board tracks volume by channel and median and P90 response times (Notion weekly report, wk of 14 Sep 2026). Actual volumes were not found in the sources read.

**Feedback and what changed**
| Feedback | What changed | Source |
|---|---|---|
| Wrong numbers in answers | Verification turn and tool provenance | (Notion weekly report, wk of 27 Jul 2026) |
| Auto-reply incident with Verve | Email rebuilt as approval flow; Gmail forwarding removed | (Notion weekly report, wk of 17 Aug 2026) |
| Generic email drafts | Triage completes before drafting | (Notion weekly report, wk of 12 Oct 2026) |
| Long answers cut off | Cap raised from about 5K to 16K tokens | (Notion weekly report, wk of 26 Oct 2026) |
| Ella asks for a business ID | She looks the record up first | (Linear; Slack, 30 Oct 2026) |
| "Untouched" cases on the desk because Mauro replied by email | Gmail channel built | (Notion weekly reports, wk of 14 Sep and 28 Sep 2026) |
| Mauro wants SLA and first-response times | Open; SLA targets were never set by Ameer | (Notion weekly report, wk of 21 Sep 2026) |
| Ella sometimes says an action is done when it is not | Being watched | (Notion weekly report, wk of 31 Aug 2026) |
| Knowledge base was the main gap; an SOP document Breakr believed it had shared was never seen by the team | Mauro's manual and tagged documents added | (Notion weekly reports, wk of 17 Aug and 31 Aug 2026) |

---

## 8. Stakeholders

**Client**

| Person | Title | Role on the account | Stance then and now | Last notable interaction | Source |
|---|---|---|---|---|---|
| Anthony "Tony" Brown | CEO (signs as Co-CEO) | Economic buyer, signatory, billing contact | Start: only he commented on the scope. Now: wants strategic challenge and GTM help from Dominik; raised concerns to Johnny by phone. Not placed on the Account OS map. | Phone call with Johnny, 12 Nov 2026 | (Account OS; Slack, 12 Nov 2026; Notion weekly report, wk of 26 Oct 2026) |
| Ameer Brown | CTO (named Co-CEO as point of contact in OF-003) | Technical owner, client point of contact, decision bottleneck | Start: did not review the scope. Mid: strong advocate. Account OS: Champion, high influence. Now: hard to reach, shifting scope, escalated internally. | Answered the question list on 12 Nov 2026 | (Account OS; Post scoping engagement, 26 Mar 2026; Slack, 12 Nov 2026) |
| Mauro | Head of CS operations | Power user, de facto discovery partner | Strong advocate since Aug 2026 | Requested an Ella onboarding session for new hires | (Notion weekly reports, wk of 21 Sep and 26 Oct 2026) |
| Sam | Accounting; owns the existing pricing playbook | Potential user; pricing counterpart | Low adoption; engaged on pricing | Pricing session with Dominik, 4 Nov 2026 | (Sam / Dominik, 4 Nov 2026) |
| Jacob | Finance | Potential user | Declined the weekly sync | Wk of 19 Oct 2026 | (Notion weekly report, wk of 19 Oct 2026) |
| Eisley | CS/finance operations | Early subject-matter expert | Left 18 Aug 2026 | Sent an agency-upload demo | (Notion weekly report, wk of 17 Aug 2026) |
| Sagar Dangal | Backend engineer (Altus Minds) | Owns Creator Networks backend and the Business API | Cooperative but often unavailable; critical path | Knowledge-transfer session planned, 11 Nov 2026 | (Drive: 20261014_Breakr_Supernal.pptx; Daily standup, 11 Nov 2026) |
| Kishan | Frontend engineer (agency) | Overlapped with Aman's branch | Neutral | Wk of 26 Oct 2026 | (Notion weekly report, wk of 26 Oct 2026) |
| Kaylie and Drew | New Breakr hires named in the rollout note | To be introduced to accounts | Unknown | n/a | (Linear) |

**Supernal team over time**
- **Sale (to Mar 2026):** Johnny Borbone (owner), Eric Kravitz (sent and signed the first order form), Tauseef Rahman (scoping), Scott Downes (CEO, notices and OF-003 signatory) (Account OS; Drive: OF-001; Notion: Tauseef Current Focus Areas).
- **Mar to Oct 2026:** Devan Leibowitz (project manager/strategist), Aman Nirala (engineer), Naveen Lekkalapudi (engineering leadership, security and deployment), Thomas Bustos (logged 29 hours in the week of 26 Apr; scoping support in Oct), Lucas Stein (Pulse and Workbench onboarding) (Slack).
- **From 20 Oct 2026:** Dominik Springer (AI strategist; calendar cadence transferred 26 Oct), Aman Nirala (lead engineer), Doren Gore (QA, from 5 Nov) (Slack).
- **From 11 Nov 2026:** Breakr sits in Squad 2 ("Polaris") with World Emblem (Squad 2 Kickoff, 11 Nov 2026).

---

## 9. Success and value

**Success criteria and KPIs**

| Criterion | Baseline | Target | Current | Source |
|---|---|---|---|---|
| Autonomous resolution of CS queries | Mauro looks up three systems by hand | 60 to 75% | About 90% of questions answerable (Ameer's estimate, not measured) | (Drive: OF-001; Notion weekly report, wk of 24 Aug 2026) |
| Pre-launch accuracy | 31 of 44 hard checks | All critical checks pass | 41 of 44 | (Breakr x Supernal, 11 Aug 2026) |
| Finance/accounting time saved | none | 20 to 30% on two of five daily tasks each for Jacob and Sam, about 0.2 FTE | Not started | (Breakr x Supernal, 22 Sep 2026) |
| Creator Networks M1 | n/a | 16 features testable by 30 Oct 2026 | 52% in Linear | (Linear) |
| Creator Networks M2 | n/a | 14 features testable by 13 Nov 2026 | 0% in Linear | (Linear) |
| Creator Networks go-live | n/a | 35 features live by 4 Dec 2026 | In progress | (Drive: OF-003) |
| Ella model spend | $471/mo | within the $500/mo allowance | $139/mo | (Breakr x Supernal, 27 Oct 2026) |
| Analytics board latency (P95) | 263 ms | n/a | about 50 ms on dev | (Breakr x Supernal, 10 Nov 2026) |
| SLA and first-response time | n/a | Not defined by the client | Not trackable | (Notion weekly report, wk of 21 Sep 2026) |

Account OS holds no success-plan goals, no value entries and no cadence events for this account (Account OS).

**Value shown to the client:** model cost down about 70%; a week of CS run by one person with Ella; "first line of defence" status; service level held during the payment gap (Notion weekly reports; Slack, 28 Aug 2026).

**What the sponsors have asked to see**
- Tony: a single source of truth across Slack, email, WhatsApp and Intercom for outstanding client needs; a more public-facing Ella where customers self-serve tracking and email changes; a volume pricing schedule and rollout note; an unbiased end-to-end pricing review (Notion weekly reports, wk of 24 Aug and 12 Oct 2026; Linear; Sam / Dominik, 4 Nov 2026).
- Ameer: BreakrPay workflow automation, a product feedback loop, an MCP server, Breakr Lab/AMP/MCP "flywheel", affiliate links and clipping (Notion weekly reports, wk of 24 Aug, 19 Oct and 2 Nov 2026).

---

## 10. Delivery now

| Workstream | State | Milestone % and date | What is measured | What was learned | Blocker |
|---|---|---|---|---|---|
| Creator Networks (Phase 1) | In progress | M1 52% (30 Oct, passed); M2 0% (13 Nov); M3 0% (27 Nov); go-live 0% (4 Dec) (Linear) | Features testable end to end; 32 of 47 asks built (Notion weekly report, wk of 2 Nov 2026) | One question deck works better than chasing calls when the decision-maker is hard to reach (Notion weekly report, wk of 2 Nov 2026) | Ameer's sign-offs; agency engineers out 9 to 11 Nov; scope added without moving the date; affiliate ownership undefined (Slack, 12 Nov 2026) |
| Ella | Live, maintenance during Phase 1 | "Ella v2 live" 100% (29 Oct) (Linear) | Cost, latency, response times | Production must not drift: it was once 36 days and 16 migrations behind dev (Notion weekly report, wk of 19 Oct 2026) | v2.0.1 waits for the Business API security patch in production (Breakr x Supernal, 10 Nov 2026) |
| Altus Minds takeover | Planned | Handover 0% (4 Dec) (Linear) | Takeover Report within 30 days of go-live | The codebase is tightly coupled and five years old; ownership needs knowledge transfer (Slack, 12 Nov 2026) | No knowledge-transfer schedule; no named engineering contact |
| Amp | Planned | Discovery agreed 0% (31 Mar 2027) (Linear) | n/a | Keep the boundary explicit; Lab/AMP/MCP was placed inside Amp discovery (Slack, 20 Oct 2026) | None yet |
| Strategy & GTM | In progress, uncontracted | Pricing and TAM first pass 0% (9 Nov, passed) (Linear) | Drafts delivered | Tony and Ameer pull the strategist in different directions (Strat Team Standup, 2 Nov 2026) | Capacity: 0.5 FTE strategist |
| Platform quality | Emerging | none | Analytics correctness | Five pages each compute metrics; quick fix is one consolidation service, long term a central ledger (Breakr x Supernal, 10 Nov 2026) | Needs Ameer's prioritisation |

**Decisions waiting**
- Must-have scope for 4 Dec, including whether affiliate ships then (Slack, 12 Nov 2026; Next Steps Creator Networks - Duolingo, 6 Nov 2026).
- What "taking over" means: who writes PRDs and designs, who runs the standup and the board (Slack, 12 Nov 2026).
- Analytics quick fix versus refactor (Breakr x Supernal, 10 Nov 2026).
- Fee level from month 4 and whether GTM work is added to the order form (Account OS health summary).
- Whether Breakr's tracking moves to Linear/Workbench; Naveen asked why it is not used (Slack, 28 Oct 2026).

**Slipping**
- M1 is past its 30 Oct date at 52%; M2 is due today at 0% in Linear (Linear). Slack on 12 Nov says the Phase 1 UI was built in half the planned time, so Linear may lag reality (Slack, 12 Nov 2026).
- Pricing and TAM first pass was due 9 Nov; a Pricing/TAM deck is dated 10 Nov (Linear; Drive: 20261110_Breakr_Pricing_TAM).
- Security fixes not yet in production (Notion weekly report, wk of 2 Nov 2026).
- Tony and Ameer stopped attending the weekly sync after the first one under Dominik (Slack, 12 Nov 2026).

**Commitments with no Linear issue**
- Knowledge-transfer sessions with Sagar; Doren's QA and hardening work; Ella v2.0.1 release; documents subagent; monitoring and alerts on Ella credits; Ella onboarding session for new Breakr hires; analytics fix; affiliate network; Business API production deployment date.
- Contract duties: weekly status with hours by engineer and workstream; naming the second engineer within 5 business days; monthly roadmap meeting and demo; capacity choice a month before each quarter; Takeover Report (Drive: OF-003).
- Linear only has issues for M1; day-to-day work is tracked in Breakr's Jira (Linear; Notion weekly report, wk of 2 Nov 2026).

**Dates in the next 30 days**
- 13 Nov 2026: M2 testable date; internal sync "Breakr" (Aman, Tauseef) (Linear; Granola calendar).
- Date to be set: alignment meeting with Johnny, Tony, Ameer and Thomas or Naveen (Slack, 12 Nov 2026).
- 27 Nov 2026: M3 testable (Linear).
- 4 Dec 2026: Creator Networks go-live and Altus Minds handover (Linear).
- 5 Dec 2026: Phase 2 project start (Linear).

---

## 11. Artifacts

| Title | Kind | Date | Owner | Where | What it is for |
|---|---|---|---|---|---|
| brkr-io-inc-breakr-of-003-v2-signed.pdf | Order form | 29 Oct 2026 | Johnny | [Drive](https://drive.google.com/file/d/1GRacRNKk_3bQwLA-w4ED2aW93wP3Jxde/view) | Signed OF-003 with exhibits A to F |
| Supernal_Order_Form_OF-003__Amendment_1_Breakr.pdf | Order form | 29 Oct 2026 | Johnny | [Drive](https://drive.google.com/file/d/1l-MU87qMXk-WNxK85AtcPSiY-XDhkbIj/view) | Copy in Commercial Contracts |
| brkr-io-inc-breakr-of-001-v1-signed.pdf | Order form | 11 Mar 2026 | Eric | [Drive](https://drive.google.com/file/d/1QeyznpoWBiSJnhJvxwMo5HATe6FG4Gnd/view) | Original Ella order form |
| brkr-io-inc-breakr-msa-v1-signed.pdf | Contract | 11 Mar 2026 | n/a | [Drive](https://drive.google.com/file/d/11o1skw9wtF66JCkdjnGBRQFQ4GJUX8Wi/view) | Governing terms |
| brkr-io-inc-breakr-bundle-v1-signed.pdf / BRKR_IO_Supernal_Final + Supernal document.pdf | Contract bundle | Mar 2026 | n/a | [Drive](https://drive.google.com/file/d/1v0vUdwWeK5wd2OaHYrAj7GoKTnq8RrCV/view), [Drive](https://drive.google.com/file/d/1BX8Nae8MxjAeo_vg6eocI74Ce0gxmGFU/view) | Signed bundle, two copies |
| brkr-io-inc-breakr-of-003-v1-draft.docx / Supernal Order Form OF-003 Breakr.docx | Order form draft | 13 to 28 Oct 2026 | Dominik | [Drive](https://drive.google.com/file/d/1R9Gl2UBJ1XxDkT7GL0Sirnqh2DREH9oa/view), [Drive](https://drive.google.com/file/d/1JWN4FfMedMdZuOilCeNmdJj7Skgciz_i/view) | Drafts before redlines |
| 20261014_Breakr_Supernal.pptx | Proposal deck | 14 Oct 2026 | Dominik, Johnny | [Drive](https://drive.google.com/file/d/1OObz9zTcoo5k4BelYNXZ9zWlBnEc1dI6/view) | Expansion proposal and pricing |
| Breakr × Supernal · Phase 1 plan.pptx | Deck | 20 Oct 2026 | Dominik | [Drive](https://drive.google.com/file/d/1DgwBRtNFU4aDz5rwWG2bDX3eKhjqvUCY/view) | Phase 1 plan with milestones |
| 20261108_Breakr × Supernal · Creator Networks questions.pptx | Deck | 8 Nov 2026 | Dominik | [Drive](https://drive.google.com/file/d/1DS-YRciwmyOWOCp1Cj08s1p9EEZVS9Wi/view) | All open scope questions for Ameer |
| 20261110_Breakr_Pricing_TAM | Deck | 10 Nov 2026 | Dominik | [Drive](https://docs.google.com/presentation/d/1VTNyW_RVP4A9ZaXpiBolF18LlP_aawHyrYUDnQpxtww/edit) | Pricing and TAM work for Tony |
| Breakr_roadmap_hours | Spreadsheet | 13 Oct 2026 | Dominik, Aman | [Drive](https://docs.google.com/spreadsheets/d/1Tw0OD3us8Pp5sUoZi1yA0_p8j808HGmG9t7VzzMXQZo/edit) | Hours estimate behind the proposal |
| Transcripts folder (17 docs, 5 May to 21 Jul 2026) | Docs | 2026 | auto | [Drive](https://drive.google.com/drive/folders/1y1jTFSxMThX2mMHJMrvkrCvqaSKIYDvW) | Client call transcripts, including two J.P. Morgan-titled calls |
| Client Facing / Meetings folder | Folder | 3 Nov 2026 | Dominik | [Drive](https://drive.google.com/drive/folders/1MLPE7QrOCgqcecgM-HGZS8ERA-qGA-mm) | Not listed |
| Weekly updates folder | Folder | Nov 2026 | Dominik | [Drive](https://drive.google.com/drive/folders/1nb5cbnpzoGkcgHO7OvVaA0ZJzSJNvHt9) | Weekly updates given to the client (Slack, 12 Nov 2026) |
| Final SOW | Doc | Mar 2026 | Tauseef (inferred) | [Google Doc](https://docs.google.com/document/d/1bk4-6TMnzCUcseQgMpoff0CwksPHhn_aCbBAnsVwTJw/edit) | Linked from the Notion deal page |
| New-scope order form draft (OF-002) | Order form draft | 15 Sep 2026 | Devan | [Google Doc](https://docs.google.com/document/d/1giuX4EarETxw9L2bIRIidoeqc6xoYCQI/edit) | Never issued (Slack, 15 Sep 2026) |
| Breakr Mar 30 Agenda | Doc | 30 Mar 2026 | Devan | [Google Doc](https://docs.google.com/document/d/1X4nnkkv-ZmpFUFrD1DpMrngazr-ynCEJ7LytEDH2AmY/edit) | Running agenda |
| Oct 20 agendas (two versions) | Doc | 20 Oct 2026 | Devan | [Google Doc](https://docs.google.com/document/d/1srlqthDK78K0omZx6rg9g-aqwsVzxS_spKH6e-5diZw/edit) | Agenda if founders join or not |
| Doc shared by Aman | Doc | 20 Oct 2026 | Aman | [Google Doc](https://docs.google.com/document/d/1gVaqPqC4fWQffcREZUy4pAfZF-OatrLYCuH6Czt8o04/edit) | Purpose not read |
| Creator Networks design | Claude artifact | 14 Oct 2026 | Aman (inferred) | [claude.ai](https://claude.ai/artifact/8TBRkJ5WsxJMfu9zifmXR5) | Design Naveen used to judge the estimate |
| "Where we're at" summary | Claude artifact | 20 Jul 2026 | Devan, Aman | [claude.ai](https://claude.ai/code/artifact/9c5f97e8-0c99-4cf4-9109-a8770382e7b1) | Used on the roadmap call |
| Ella Operations Deck | Dashboard (live app) | Aug 2026 onwards | Aman | https://ella.breakr.app/ | Production console and CS Desk |
| Ella dashboard (dev) | Dashboard | 6 Jul 2026 | Aman | https://breakr-agent-dashboard-dev.onrender.com/ | Dev environment |
| Test widget | Prototype | 3 Jun 2026 | Aman | https://breakr-cs-agent.onrender.com/ | Invite-only test widget |
| Loom: Slack escalations and Ella on Render | Video | 11 Apr 2026 | Aman | [Loom](https://www.loom.com/share/62705465be174f20a6d63e959b6b1b24) | Progress demo |
| Loom: Stripe integration | Video | 8 Apr 2026 | Aman | [Loom](https://www.loom.com/share/f954f8ac868c4cec8d3386817bf0bde9) | Progress demo |
| Loom: RBAC and Gmail work update | Video | 28 Sep 2026 | Aman | [Loom](https://www.loom.com/share/f922e80575fb4db28cc8e3e6f0442085) | Work update, 40 hours logged |
| Fathom: async with Sagar | Video | 16 Apr 2026 | Aman | [Fathom](https://fathom.video/share/mhVjL799w7JBmszr6WZMzs2kfHMRaqWy) | Database access alignment |
| Fathom: handover sync | Video | 20 Oct 2026 | Devan | [Fathom](https://fathom.video/share/jZV_Psym5s6U8YMFWxfm1WG2Jz38WhTx) | Handover to Dominik |
| Ella v2 walkthrough video (under 9 minutes) | Video | 30 Oct 2026 | Aman | Slack attachment, #acnt-breakr-internal | Release announcement |
| Pull request for first production release | Code | 17 Jul 2026 | Aman | https://github.com/Supernal-Technology/breakr-render/pull/2 | Production release setup |
| Linear projects: Phase 1, Phase 2, Strategy & GTM | Project plan | Oct to Nov 2026 | Dominik | [Phase 1](https://linear.app/supernal-clients/project/phase-1-creator-networks-for-duolingo-5b08b4f63a19), [Phase 2](https://linear.app/supernal-clients/project/phase-2-platform-takeover-amp-and-ella-8b68bd7b0965), [GTM](https://linear.app/supernal-clients/project/strategy-and-gtm-943a04b75ac0) | Milestones |
| Notion account page and 14 weekly reports | Docs | Jul to Nov 2026 | Devan, then Dominik | [Notion](https://app.notion.com/p/3a7bd5e8f31881e8bc54e7f68152bb86) | Account record and weekly health |
| Creator Networks PRD and roadmap for Duolingo | Doc | 30 Sep to Oct 2026 | Ameer | location unknown (Breakr's Confluence, inferred) | Frozen reference in OF-003 Exhibit B |
| Design boards CN-00 to CN-09 and AMP-00 to AMP-09 | Design | Oct 2026 | Breakr | location unknown | Hi-fi designs referenced in OF-003 |
| Creator Networks interactive demo | Demo | Oct 2026 | Breakr | location unknown (URL given verbally on 14 Oct 2026) | Vision walkthrough |
| Eisley's SOP document; Mauro's Notion Ops Playbook (about 150 docs) | Docs | 2024 to 2026 | Breakr | location unknown (Breakr's Notion) | Knowledge base sources |
| Scoping doc for email approvals, MCP server, feedback loop | Doc | Aug 2026 | Aman | location unknown | Next-phase scope |
| List of keys Breakr must rotate | Doc | 10 Jul 2026 | Aman | location unknown | Security incident response |
| Jira board (new) and Confluence | Project board | Nov 2026 | Dominik / Breakr | Breakr's Atlassian, no access | Day-to-day tracking |

---

## 12. Suggested vault sections

These are categories this account has that a standard scoping-and-delivery template set (discovery, proposal, SOW, build plan, status) would not hold.

1. **Contract obligations register.** Files: order-form lineage (OF-001, unissued OF-002, OF-003 and what supersedes what); committed dates and remedies; duties calendar (weekly status with hours, monthly roadmap meeting, QSOW 15 days before each quarter, capacity choice, 90-day end-of-term notice); restricted-competitor list and staffing rules; security requirements (Exhibit C). Material: heavy; one 65,000-character signed document plus the amended terms.
2. **Three-party delivery boundary.** Files: who-builds-what matrix (Supernal frontend, Breakr/Sagar backend, 5 hours a week infra); access and credentials register; knowledge-transfer log with Altus Minds; dependency notices sent; takeover inventory. Material: moderate and growing; this is the live source of friction on 12 Nov 2026.
3. **The client's customer: Duolingo program.** Files: Creator Networks PRD and roadmap (frozen versions); the 35/38 feature matrix by milestone with acceptance criteria; the "asks" tracker (32 of 47); the questions deck and answers; Duolingo supplier security requirements. Material: heavy, but the source documents live in Breakr's tools.
4. **Client corporate events and solvency.** Files: fundraising timeline; acquisition/merger thread (the $20 million offer, Manifest, asset purchase); diligence requests touching Supernal (repo access, IP questions); payment and collections history. Material: moderate, scattered across weekly reports and Slack.
5. **AI employee operating record (Ella).** Files: release notes by version; incident log with causes and fixes (13 Jul security incident, 17 Aug Verve email, 22 Oct key revocation, 29 Oct credits outage, 3 Nov memory crash); evaluation results; cost and latency history; governance (roles, approved write actions, approval rules). Material: heavy.
6. **Unprompted scope ledger.** Files: a dated list of every ask that arrived outside a planning meeting, where it was placed (in scope, Amp discovery, new order form, declined) and who answered. Material: heavy; at least four major expansions in six weeks before signing and more since (public-facing Ella, Lab/AMP/MCP, affiliate, clipping, Shopify tracking, storefront).
7. **Advisory workstream (Strategy & GTM).** Files: pricing and TAM deck; volume pricing schedule; rollout note; API go-to-market process; agency activation plan; notes from banking calls on float income. Material: moderate, new since 2 Nov 2026, and not software.
8. **Capacity and pricing workings.** Files: roadmap hours sheet; hours-by-lane estimates (1,600 total, about 800 Supernal); points and break-even analysis; quarterly capacity decisions; QSOWs once they exist. Material: moderate.
9. **Founder operating notes.** Files: how each founder decides and what each wants from the strategist; reachability patterns (often accept but do not join calls); what has worked (one offline question deck, show instead of ask, a short daily sync). Material: light but high value.
10. **Knowledge sources owned by the client.** Files: index of Mauro's Notion playbook, Eisley's SOP, customer-facing tagged documents, Verve creator FAQ, and which are safe for the customer persona. Material: moderate; the content sits in Breakr's Notion.

---

## 13. Book

### Chapter 1. The account in one page

Breakr is a creator-marketing and payments platform run by two brothers, Tony and Ameer Brown. It began with Supernal in March 2026 as one of the smallest accounts: a single AI employee called Ella, a customer-success agent, for $4,000 a month. By late October it had signed an order form worth $198,000 over twelve months that makes Supernal its engineering partner. Under that form Supernal builds the screens for a product called Creator Networks, which Breakr sold to Duolingo and must be live by 4 December 2026, then takes over the platform work of Breakr's staffing agency, then builds an AI companion called Amp. Ella keeps running throughout. The team is small: Aman Nirala as lead engineer since the first week, Dominik Springer as strategist since 20 October, Doren Gore on quality, and Johnny Borbone holding the commercial relationship. Health reads 4.2 with a Watch band because the build dimension is scored 2. The week this document was written the client had phoned Johnny with concerns, and the strategist privately called the account red. The opportunity is large and so is the exposure: a fixed date owed to someone else's customer, a codebase Supernal did not write, and two founders who want different things from the same half-time strategist.

Sources: (Account OS), (Drive: OF-001), (Drive: OF-003), (Slack, 12 Nov 2026), (Linear).

### Chapter 2. Why they bought

The first purchase was modest and specific. Creators waited for answers while one person, Mauro, looked things up by hand in three systems, and a class of backend fixes needed Ameer personally. Ella was scoped to answer from the systems directly, escalate with a full brief, and make a narrow set of corrections, with no power to move money. The sources reached do not show the sales conversations, the alternatives considered or what was demonstrated; an internal note says only Tony commented on the scope and Ameer never reviewed it.

The second purchase had many causes. Ella had become the team's first stop. Supernal kept the service running through four months of unpaid invoices, and Ameer said that was why they would trust Supernal with everything. The money worked: about $12,000 a month to the agency plus $4,000 to Supernal became $15,000 to one partner. Breakr lacked product management and the new tier came with a strategist. Duolingo had handed over requirements with a hard date. A funding round had just closed and investors wanted capital tied to named work. Investor diligence had been asking who owns the code, and the answer was clean. Behind all of it sat Tony's thesis of white-labelling an agentic platform to agencies for a share of outcomes.

Sources: (Drive: OF-001), (Post scoping engagement, 26 Mar 2026), (Notion weekly report, wk of 28 Sep 2026), (Breakr x Supernal, 1 Oct 2026), (Notion weekly report, wk of 5 Oct 2026).

### Chapter 3. How the deal is built

There are three documents that matter. The governing terms date from 11 March 2026. The first order form covered Ella in two phases for $4,000 a month. A second order form for more Ella scope was drafted in September, priced at $12,000 in one weekly report and $25,000 in the next, and never sent because payment was outstanding. The third, OF-003, replaced the first outright: the $4,000 fee ended and is not additive.

OF-003 sells capacity. The base is $15,000 a month for two engineers at half time each plus a strategist. For the first three months it is $21,000 for an extra half engineer, to fund the Creator Networks sprint. Each quarter Breakr chooses base or raised capacity, and $21,000 is the ceiling unless both agree. The proposal on 14 October was for 24 months with automatic renewal, $378,000 in total; the signed form is 12 months with no automatic renewal, $198,000, and the pipeline review recorded the deal as about $100,000 lighter than expected. The form is unusually protective of the client: fixed committed dates with a recovery plan at Supernal's cost, a right to terminate if go-live slips more than 45 days for Supernal's reasons, ownership on creation regardless of payment, a named list of competitors Supernal's people may not serve, and 60 days of free transition help. Internally the price was flagged as thin: about 1,050 hours were estimated for Supernal's share, later cut to just under 800.

Sources: (Drive: OF-003), (Drive: 20261014_Breakr_Supernal.pptx), (Notion weekly reports, wk of 14 Sep, 21 Sep, 5 Oct and 12 Oct 2026), (Weekly Pipeline Meeting, 28 Oct 2026).

### Chapter 4. Ella, and why she is built this way

Ella has two faces. Customers meet a read-only persona through Intercom. The Breakr team works with a teammate persona in Slack and in the Operations Deck, a console where every request from every channel becomes a ticket. Almost every design choice traces back to something that went wrong or nearly did. Early answers contained wrong numbers, partly because the API documentation confused dollars and cents, so a second pass now checks that every figure came from a tool. In August she emailed a customer of a Breakr client an incomplete answer, so email became a draft that a person sends. Drafts written before the investigation finished read as generic, so she now investigates first. She answered on internal data in client-facing Slack threads, so version 2 added roles, a Slack identity check, two-person approval for anything involving money and a tamper-evident audit log. The agency's architect feared an agent with write access to production, so she works through Breakr's Business API. Ameer wanted her to fix product bugs, and the team chose to have her read the code and write a plan for a coding tool, not open changes herself, to avoid building test infrastructure for machine-written code. The client's wish to depend less on Intercom produced a channel-agnostic design from April, which is why the CS Desk was possible in August.

Sources: (Slack, 14 Apr, 29 Apr, 15 Jun and 30 Oct 2026), (Notion weekly reports, wk of 27 Jul, 17 Aug, 31 Aug, 14 Sep and 12 Oct 2026), (Breakr <> Supernal, 4 Aug 2026).

### Chapter 5. How delivery has gone

The first build was fast and bumpy. Aman reached the database through a chain of tunnels on 1 April and demonstrated the same day. Integrations with PayPal, Stripe, Intercom and Slack followed within three weeks. Then the dependencies began. Production database access stalled until 8 May. The client dropped Intercom as the data layer mid-project, which enlarged the work and prompted an internal hours-overrun warning on 27 April. Phase 2 waited through June and July for Breakr's Business API and its documentation. Supernal's own security incident in July hit Breakr hardest: it was the one client where attacker code ran in production. Go-live then waited on a persona report from Mauro and a widget change from Sagar, and finally happened on 12 August.

From there the pattern reversed. Features shipped weekly: the CS Desk, image understanding, analytics, access control, Gmail. September's best client call came in the same week Supernal was threatening to switch the service off over unpaid invoices. October brought the expansion, a week lost to contract redlines while the sprint ran unsigned, and a production release that had drifted 36 days behind development. Creator Networks screens were built ahead of plan, but the work now depends on a backend engineer who is often away and on decisions from Ameer.

Sources: (Slack, 1 Apr to 12 Aug 2026), (Delivery Team Sync, 27 Apr 2026), (All Hands, 13 Jul 2026), (Notion weekly reports, wk of 21 Sep and 19 Oct 2026).

### Chapter 6. The people

Tony Brown is the chief executive, the signatory and the one who pays. He is focused on go-to-market and fundraising, which an account note links to the six months the first invoice took. He now wants the strategist as a strategic challenger on pricing and market size. Ameer Brown is the technical founder and the named point of contact. He was the account's loudest advocate by late summer and is its bottleneck now: decisions sit with him, he was unreachable for a week in early November, and he keeps adding scope. He wants the strategist to run his engineering team. Mauro, who runs customer-success operations, is the real daily user and has been doing discovery on Supernal's behalf, naming the finance workflows worth automating. Sam and Jacob in accounting and finance are the adoption gap. Eisley, the early subject expert, left in August and took with him a procedures document the team had never seen. On the engineering side, Sagar Dangal of Altus Minds owns the backend and is the critical path.

On Supernal's side, the account has had one constant, Aman, and one handover: Devan Leibowitz ran it from March until Dominik Springer took over on 20 October. The founders reacted warmly but noticed. Naveen Lekkalapudi and Thomas Bustos step in at moments of risk.

Sources: (Account OS), (Notion weekly reports, wk of 17 Aug, 21 Sep, 12 Oct and 26 Oct 2026), (Strat Team Standup, 2 Nov 2026), (Slack, 12 Nov 2026).

### Chapter 7. What value has shown

Most of the value so far is observed, not measured. Ameer estimated in August that Ella could already answer about nine in ten customer-success questions and that the rest were actions. He ran support alone for a week with both operations staff away. Mauro reported a clean desk with nothing pending and said Ella solved cases he was stuck on. Before launch, Mauro's own evaluation moved from 31 to 41 of 44 hard checks. The harder numbers are on cost and speed: monthly model spend fell from $471 to $139 after prompt caching, and the analytics board's slow responses dropped from 263 to about 50 milliseconds. The one quantified business case not yet delivered is Mauro's estimate that two finance and accounting people could each save 20 to 30% of the time on two of their five daily tasks, about a fifth of a full-time role in total.

What is missing is a shared scoreboard. Account OS has no success-plan goals or value entries. Service-level targets were never set by the client, so the analytics cannot show on-track or off-track. The original 60 to 75% autonomy target has no measured counterpart. A value recap for the first quarterly review would have to be assembled from weekly reports.

Sources: (Notion weekly reports, wk of 24 Aug and 21 Sep 2026), (Breakr x Supernal, 11 Aug, 22 Sep, 27 Oct and 10 Nov 2026), (Account OS).

### Chapter 8. The company around the account

Breakr spent 2026 in motion as a company, and that shaped every commercial step. In June the founders had a $20 million acquisition offer and expected to stay on for two years. By August this was a sale to Manifest, which was due to take over accounts payable at the end of the month, and Manifest's side asked for read access to Ella's code for a quality check. By mid-September the structure had changed from an equity merger to an asset purchase. In parallel Breakr was raising money: $2.25 million committed of $3 million in August, closed at $3 million with roughly $2 million more in diligence by late September. Cash was tight throughout, which is why invoices went unpaid until the end of September and why the team was told to price expansion with that timing in mind. The founders also floated a second business, logistics dispatch software, twice in the year. Supernal has been pulled into conversations well outside software: banking calls about earning float income on client funds, a call with a media company, pricing strategy. Each of these is a reason the account behaves differently from a normal retainer.

Sources: (Deal Room Standup, 22 Jun 2026), (Slack, 13 Aug and 10 Nov 2026), (Notion weekly reports, wk of 17 Aug, 14 Sep and 28 Sep 2026), (Breakr x JPMorgan Next Steps, 6 Nov 2026).

### Chapter 9. Where it stands and what is next

Three weeks remain to 4 December. The screens for the first milestone are built, but the plan shows the first milestone at 52% and the second, due 13 November, at zero. Affiliate was deferred on 6 November and is back in the list for 4 December on 12 November, with nobody named as owner. Breakr's answers that week added Shopify tracking, a storefront, hybrid deals and clipping without moving the date. A critical analytics flaw surfaced in Breakr's own platform. Security fixes and an Ella release are waiting on Breakr to deploy its patched API.

On 12 November Tony called Johnny. The internal reading is that the gap is about what "taking over" means: Ameer handed the strategist far more than the order form covers, without a handover, and then was absent. Aman asked for scheduled knowledge transfer and a named engineering contact. Dominik asked for a ten-minute daily sync, one board, an agreed must-have scope, and to stop sending question lists and show work instead. Naveen asked Johnny to back the team and for admin access to match the ownership being asked for. An alignment meeting between Johnny, the founders and Thomas or Naveen is being arranged. After go-live come the agency handover, the first quarterly statement of work in January, and the question of whether the fee stays at $21,000.

Sources: (Linear), (Next Steps Creator Networks - Duolingo, 6 Nov 2026), (Breakr x Supernal, 10 Nov 2026), (Slack, 12 Nov 2026), (Account OS).

---

## 14. Gaps and conflicts

**Could not find or access**
- The pre-signature sales history (before 11 Mar 2026): first calls, what was shown, alternatives. The Fathom search reached only meetings from 1 Jul 2026; Granola has only internal notes mentioning Breakr.
- Granola holds no client-call notes for this account; client calls are in Fathom and the Drive Transcripts folder. The four local June transcripts in `/Users/tauseef/ric-os/meetings/` (9, 16, 19, 23 Jun 2026) and the Drive transcripts were not read in full.
- Slack: #stg-acnt-breakr-internal was not read. Several thread parents were seen by title only ("New Scope", "Creator Networks / Duolingo", "Breakr Strategic Roadmap Convo", "Ella / Verve incident", "Build Hours Overrun Foreseen", "Breakr Expansion / Scoping Support"). Channel history before 30 Mar 2026 was not read. Two screenshots on the 12 Nov thread were not opened.
- Drive files listed but not opened: the governing terms, the Phase 1 plan deck, the questions deck, the Pricing/TAM deck, the roadmap hours sheet, the Meetings folder and the weekly updates folder.
- Breakr's Jira, Confluence, PRD, design boards and Notion playbook: no access. Supernal Workbench/Pulse data: not queried.
- The exact OF-003 effective date, the name of the "second engineer" in the order form (Doren Gore is the likely person, inferred), and whether Sagar was hired full time.
- Actual Ella volumes (conversations, resolution rate) and any measured autonomy rate.

**Sources disagree**
- **Health:** Account OS 4.2 with a Watch band and Build 2; Notion Green/Healthy for the same week; Dominik calls it red on 12 Nov (Account OS; Notion weekly report, wk of 2 Nov 2026; Slack, 12 Nov 2026).
- **Pod:** Account OS account pod empty; Account OS deals say Devan as strategist; Devan left the account on 20 to 26 Oct 2026 (Account OS; Slack, 26 Oct 2026).
- **Deals:** Account OS shows the $4,000 deal as Active; OF-003 says it is superseded. The expansion deal has no MRR recorded (Account OS; Drive: OF-003).
- **Term:** proposal and 14 Oct call said 24 months with auto-renewal; the signed form says 12 months, no auto-renewal (Drive: 20261014_Breakr_Supernal.pptx; Drive: OF-003).
- **Notion account page is stale** (last edited 8 Sep 2026): ARR $48,000, Stage "Maintenance", Tier Small, renewal 11 Mar 2027, kickoff 1 May 2026, although work began in late March 2026 (Notion account page; Slack, 30 Mar and 1 Apr 2026).
- **Signature timing:** the same weekly report says "Contract signed" and "Contract still unsigned"; Account OS says closed 26 Oct; the signed PDF was filed 29 Oct (Notion weekly report, wk of 19 Oct 2026; Account OS; Drive).
- **Invoice overdue flag:** Notion keeps "Invoice overdue" ticked through the week of 19 Oct although all invoices were paid on 28 to 29 Sep (Notion weekly reports; Slack, 29 Sep 2026).
- **Second order form price:** $12,000 a month in one report, $25,000 the next week (Notion weekly reports, wk of 14 Sep and 21 Sep 2026).
- **Phase 1 hours (April):** one note says Phase 1 finished under budget at about 100 of 200 hours; a second note the same day says the team was approaching the 200-hour limit (Delivery Planning Weekly, 27 Apr 2026; Delivery Team Sync, 27 Apr 2026).
- **Feature counts:** 35 Duolingo features, 38 with Breakr's extras, and "32 of 47 Duolingo asks" in the weekly report (Drive: OF-003; Notion weekly report, wk of 2 Nov 2026).
- **Affiliate:** inside milestone 2 in OF-003 and Linear; deferred to Phase 2 on 6 Nov; listed again for 4 Dec on 12 Nov (Drive: OF-003; Next Steps Creator Networks - Duolingo, 6 Nov 2026; Slack, 12 Nov 2026).
- **Progress:** Linear shows milestone 1 at 52% and milestone 2 at 0%; Slack says the Phase 1 UI was built in half the planned time and the delivery sync said a week early (Linear; Slack, 12 Nov 2026; Delivery Sync, 2 Nov 2026).
- **Titles:** Account OS has Tony as CEO and Ameer as CTO; OF-003 names Ameer "Co-CEO" as point of contact and Anthony signs as "Co-CEO" (Account OS; Drive: OF-003).
- **Company sale figures:** a $20 million offer in June; an earlier note about the founders records a different figure of $10 million over five years; later reports describe an asset purchase by Manifest with no price (Deal Room Standup, 22 Jun 2026; Supernal AI <> Auryn Logistics, 4 Mar 2026; Notion weekly report, wk of 14 Sep 2026).
- **"Zenni invoices unpaid":** the August reports use this phrase; what "Zenni" refers to is unclear (Notion weekly report, wk of 17 Aug 2026).
- **Tracking system:** Linear has three projects but issues only for milestone 1; the working board is Breakr's Jira (Linear; Slack, 28 Oct 2026).
