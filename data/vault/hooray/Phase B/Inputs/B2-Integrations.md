# B2 — Integrations
> **Phase:** Builder · **Role:** Input
> **Answers:** INTEGRATIONS only. External systems, auth models, sync cadence, webhooks, failure handling.
> **This file is NOT for:** internal data model (B1), Employee logic (B3), delivery planning (B4).
> **Sources:** B1-Data-Layer.md, A4-Product-Segmentation.md, Competitor Requirements doc (file 193), Discovery II transcript (file 191).

---

## Integration Inventory

| # | System | Direction | Auth Model | Sync Cadence | Confidence | Phase |
|---|---|---|---|---|---|---|
| 1 | Google Analytics 4 | Read | OAuth 2.0 (service account for Tier 1; per-client OAuth for Tier 2) | Monthly pull (reporting cycle) + weekly health check | Medium | Phase 1 |
| 2 | Meta Ads Manager | Read | Meta Marketing API — Business Manager token | Monthly pull + weekly health check | Medium | Phase 1 |
| 3 | Google Ads | Read | Google Ads API — MCC manager token | Monthly pull + weekly health check | Medium | Phase 1 |
| 4 | Google Workspace (Drive + Docs) | Read | Service account OAuth — scoped read | On-demand (at runtime per SAL request) | High | Phase 1 |
| 5 | Monday.com | Read + Write | GraphQL API — Supernal service token | Write: on SAL output completion. Read: health check. | High | Phase 1 (write status), Phase 2 (write briefs) |
| 6 | Trade Desk | Read | Reporting API — agency seat token | Monthly pull (where available); manual CSV fallback | Low | Phase 1 (fallback) / Phase 2 (live) |
| 7 | Intake Channel (email/portal/Slack — TBD) | Read | _Pending Shelly session_ | Real-time inbound webhook | _Pending_ | Phase 2 |
| 8 | Granola / Notion (meeting notes — optional) | Read | Webhook or API | Real-time on meeting completion | Low | Phase 2 / optional |

---

## Integration Detail

### 1 — Google Analytics 4

**Endpoint:** GA4 Data API (`analyticsdata.googleapis.com`)
**Auth:**
- Tier 1 (Hooray master accounts): Service account with property-level read access. Single credential covers all Tier 1 properties.
- Tier 2 (client-delegated): Per-client OAuth 2.0 flow. Hotel client grants Hooray read access; Hooray provides refresh token to Supernal. Tokens stored in secrets manager.
**Sync:**
- Monthly report pull: runs on day 2 of each month for the prior full calendar month.
- Weekly health check: confirms API connectivity and metric freshness for each active property.
**Failure handling:**
- Token expiry → automated refresh attempt × 3 → alert to David Metze if all fail.
- Property access revoked → flag client as "data unavailable" in Vault; Care team notified; manual fallback initiated.
- API quota exceeded → retry with exponential backoff; alert if not resolved within 4 hours.

---

### 2 — Meta Ads Manager

**Endpoint:** Meta Marketing API (`graph.facebook.com/v19+`)
**Auth:** Business Manager System User token. Long-lived token (60-day refresh). All Hooray-managed ad accounts accessible under one Business Manager. Client-delegated accounts require per-client agency access grant.
**Sync:**
- Monthly report pull: day 2 of each month for prior calendar month.
- Weekly delivery health: check for paused campaigns, budget exhaustion, delivery errors.
**Failure handling:**
- Token expiry → automated refresh. Meta tokens expire at 60 days; refresh scheduled at day 45.
- Rate limit hit → backoff queue; no data loss.
- Account access revoked → flag client in Vault; alert David; manual fallback.
**Notes:**
- Meta Business Verification may be required for certain API scopes. Confirm during onboarding.
- Pixel conversion data: only available where the hotel client's pixel is properly configured. SAL will surface "conversion tracking not configured" flag per client where pixel is absent.

---

### 3 — Google Ads

**Endpoint:** Google Ads API v16+
**Auth:** OAuth 2.0 via Google Ads Manager Account (MCC). Agency MCC token covers all linked client accounts. Tier 2 clients: linked via client account invitation workflow.
**Sync:**
- Monthly report pull: day 2 of each month.
- Weekly health: campaign status checks, budget pacing alerts.
**Failure handling:**
- MCC link broken → flag client in Vault; alert David.
- API deprecation → Supernal platform team maintains version currency; no client action required.

---

### 4 — Google Workspace (Drive + Docs)

**Endpoint:** Google Drive API v3 + Google Docs API
**Auth:** Service account with domain-wide delegation (Hooray IT admin grants access). Scoped to read-only across Hooray's Drive.
**Sync:** On-demand. SAL queries relevant client folders at runtime when generating a brief or adding context to a report. No bulk ingestion — live connector.
**Folder conventions assumed:**
- One folder per hotel client, named consistently (validation required during Phase 1 onboarding).
- Brand guides, competitive docs, and campaign templates discoverable by file name pattern or metadata label.
**Failure handling:**
- Folder not found → SAL proceeds without Workspace context; flags gap in brief output.
- Permission denied → alert to David for folder structure fix.

---

### 5 — Monday.com

**Endpoint:** Monday.com GraphQL API (`api.monday.com/v2`)
**Auth:** Supernal service account token. Scoped to Hooray workspace boards designated for SAL output.
**Writes (Phase 1):** Report delivery status updates to designated tracking board.
**Writes (Phase 2):** Create new task per Packaged Brief (fields: hotel_client, request_type, brief_summary, completeness_score, AM_assignee, due_date, monday_item_id → stored in Vault for linking).
**Reads:** Health check — confirm board availability and API connectivity.
**Failure handling:**
- API unavailability → queue writes; retry up to 6 hours; alert Care team if unresolved.
- Board structure changed by Hooray admin → SAL flags mismatch; Care team validates field mapping.
**Notes:** Monday.com board structure and required fields to be confirmed with Shelly during working session (Phase 2 prerequisite).

---

### 6 — Trade Desk

**Endpoint:** Trade Desk Reporting API (MyReport)
**Auth:** Agency seat credentials. Access structure not yet validated.
**Sync:** Monthly pull (where API access confirmed). Manual CSV export fallback for all clients until API validated.
**Confidence:** Low. During Phase 1, Trade Desk data defaults to manual export. Phase 1.5 or Phase 2: live API connection contingent on access confirmation.
**Failure handling:** Falls back to manual export process. No dependency on Trade Desk for Phase 1 critical path.

---

### 7 — Intake Channel (TBD — Phase 2)

**Options under consideration (pending Shelly working session):**
- **Email inbound:** SAL monitors a dedicated email address (e.g., briefs@hooray.agency). New emails trigger intake flow. Standard IMAP/webhook via email provider.
- **Portal:** A lightweight intake form accessible to hotel marketing directors. Structured fields reduce clarification burden.
- **Slack:** Hotel marketing directors on a shared Slack channel. SAL monitors for intake keywords and responds.

**Design constraint:** The intake channel must feel appropriate for hotel marketing directors — the decision will affect SAL's communication register and response format. This is a Shelly + David decision, not a technical one.

**Phase 2 dependency:** Intake channel selection blocks Phase 2 build start.

---

### 8 — Meeting Notes (Granola / Notion — Optional, Phase 2)

_Not in active Phase 1 scope. Included here as a potential Phase 2 connector._
- If Hooray adopts Granola or Notion for meeting notes, SAL can ingest transcripts to enrich brief context (e.g., what did the hotel client say in their last call that's relevant to this campaign request?).
- Auth: Webhook integration or Notion API, depending on tool selected.
- This integration would enhance the Packaged Brief WP (Phase 2) but is not on the Phase 1 critical path.

---

## Integration Dependency Map

```
Phase 1 critical path:
  GA4 ─────────────┐
  Meta Ads ────────┼──► SAL Performance Report ──► Monday.com (status write) ──► AM Review
  Google Ads ──────┘
  Google Workspace ────────────────────────────────────────────────────────────► (context layer, optional for Phase 1)

Phase 2 adds:
  Intake Channel ──────────────────────────────────────────┐
  Google Workspace ────────────────────────────────────────┼──► SAL Packaged Brief ──► Monday.com (task write)
  GA4 (contextual pull for brief enrichment) ──────────────┘
```

---

## Failure Handling Summary

| Scenario | Detection | Response | Escalation |
|---|---|---|---|
| API token expired | Automated health check | Retry refresh × 3 | Alert David Metze |
| Client API access revoked | Health check failure | Flag client in Vault; manual fallback | Alert Care team |
| Monday.com unavailable | Write queue failure | Queue + retry 6 hrs | Alert Care team |
| Data quality anomaly detected | SAL metric validation | Flag in report output | Surface in Pulse alert; Care team reviews |
| Trade Desk API unavailable | Health check | Switch to manual export for cycle | No escalation needed |
| Workspace folder not found | Runtime query failure | Proceed without context; flag in output | Alert David for folder audit |
