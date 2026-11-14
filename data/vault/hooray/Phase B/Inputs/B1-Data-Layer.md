# B1 — Data Layer
> **Phase:** Builder · **Role:** Input
> **Answers:** DATA MODEL only. Entities, schemas, volumes, retention, privacy, access architecture.
> **This file is NOT for:** integration specs (B2), Employee logic (B3), delivery plan (B4).
> **Sources:** A4-Product-Segmentation.md (Vault section), A5-Scope-Definition.md (assumptions + feasibility), Competitor Requirements doc (file 193), Discovery II transcript (file 191).

---

## Canonical Entities

The Vault unifies six data domains. Every SAL Work Product draws from one or more of these.

| Entity | Primary Source | Confidence | Notes |
|---|---|---|---|
| **Hotel Client** | Hooray internal + GA4 properties | High | Master entity — all reporting and brief data is scoped to a hotel client. |
| **Campaign** | GA4, Meta Ads, Google Ads, Trade Desk | Medium | Cross-platform normalisation required (different metric schemas per platform). |
| **Performance Metric** | GA4, Meta Ads, Google Ads, Trade Desk | Medium | Core input for Performance Report WP. Aggregated, not row-level. |
| **Report** | SAL output (generated) | High | Structured record: hotel_client_id, period, platform coverage, narrative body, anomaly flags, next-step suggestions, AM review status. |
| **Brief Request** | Intake channel (email/portal/Slack — TBD) | _Pending Shelly session_ | Core input for Packaged Brief WP. |
| **Brief** | SAL output (generated) | High | Structured record: hotel_client_id, request_type, parameters_confirmed, context_from_workspace, completeness_score, monday_task_id. |
| **Knowledge Asset** | Google Workspace | High | Brand guides, competitor profiles, customer personas, campaign templates. Accessed via live connector, not static ingestion. |
| **Monday Task** | Monday.com (write) | High | Output surface for Packaged Brief WP. Linked to brief_id. |

---

## Data Access Architecture

### Tiered Access Model (critical design decision)

Hooray's hotel clients sit across three access categories. The data model must accommodate all three.

| Tier | Description | Platforms | Volume |
|---|---|---|---|
| **Tier 1 — Hooray Master Accounts** | Hooray manages the ad accounts directly under agency master access. Full API read access. | GA4, Google Ads, Meta Ads | Majority of clients |
| **Tier 2 — Client-Delegated Access** | Hotel client owns the account; grants Hooray read access at the account level. Per-client authorisation required. | GA4, Meta Ads (varies) | Subset of clients |
| **Tier 3 — Manual Export Fallback** | Hotel client will not or cannot grant API access. Data enters via structured manual export (CSV/Excel) per reporting cycle. | Trade Desk (primarily) | Minority of clients; expected to shrink over time |

**Critical assumption:** GA4 and Meta Ads are non-negotiable for Phase 1 go-live. No hotel client enters the reporting workflow until Tier 1 or Tier 2 access is confirmed for both platforms. Tier 3 (manual) is an interim accommodation, not a permanent design.

---

## Per-Source Schema Notes

### Google Analytics 4 (GA4)
- **API:** GA4 Data API (standard). Read-only.
- **Key metrics ingested:** Sessions, users, pageviews, conversions (goal completions), channel grouping, device category, booking events (if configured), landing page performance.
- **Scope:** Per property (one property per hotel client). Hooray master account covers Tier 1; per-client OAuth for Tier 2.
- **Volume:** ~30–50 hotel clients → ~30–50 properties. Monthly pull per reporting cycle; possible weekly pulse.
- **Anomaly signals:** YoY / WoW deviations > threshold (configurable per client). Conversion rate drops. Traffic source shifts.
- **Retention:** 90-day rolling in Vault for trend analysis. Monthly snapshots retained for 13 months (full YoY).

### Meta Ads Manager
- **API:** Meta Marketing API. Read-only.
- **Key metrics ingested:** Impressions, reach, CPM, CPC, CTR, spend, conversions (pixel), ROAS (where configured), ad set performance.
- **Scope:** Per ad account. Business Manager access preferred.
- **Volume:** ~30–50 hotel clients → variable (some clients share ad account structures). Monthly pull.
- **Anomaly signals:** Spend pacing vs. budget, CPC spikes, ROAS drops, delivery errors.
- **Retention:** 90-day rolling. Monthly snapshots retained for 13 months.

### Google Ads
- **API:** Google Ads API (v16+). Read-only.
- **Key metrics ingested:** Impressions, clicks, CPC, CTR, spend, conversion events, Quality Score (where available), campaign type breakdown.
- **Scope:** Manager account (MCC) where Hooray is the agency. Per-client linked accounts for Tier 2.
- **Volume:** ~30–50 hotel clients. Monthly pull.
- **Anomaly signals:** Budget utilisation, Quality Score degradation, sudden CPL changes.
- **Retention:** 90-day rolling. Monthly snapshots retained for 13 months.

### Trade Desk
- **API:** Trade Desk Reporting API. Read-only.
- **Key metrics ingested:** Impressions, clicks, CPM, viewability, conversion tracking (where configured).
- **Scope:** Agency seat access. Confidence: Low (platform access structure not yet validated).
- **Volume:** Subset of hotel clients. Monthly pull.
- **Dependency:** Trade Desk integration deferred to Phase 1.5 or Phase 2 if API access is not confirmed during onboarding. Manual export fallback available.
- **Retention:** 90-day rolling. Monthly snapshots retained for 13 months.

### Google Workspace
- **API:** Google Drive API + Google Docs API. Read-only (no writes from SAL to Workspace).
- **Key assets accessed:** Client brand guides (Google Docs), competitive analysis documents, customer persona profiles, past campaign briefs (reference for brief packaging).
- **Scope:** Hooray organisational account — all client folders accessible via service account.
- **Access:** Service account with scoped read permissions. No client-level OAuth required (Hooray controls).
- **Freshness:** Live connector — not ingested/indexed statically. SAL queries relevant documents per request at runtime.
- **Volume:** Variable per client. Estimated 5–30 documents per hotel client.

### Monday.com
- **API:** Monday.com GraphQL API. Read + write.
- **Purpose:** SAL writes Packaged Brief tasks and report status updates to Monday.com boards.
- **Key writes:** Create task (brief_id, hotel_client, request_type, completeness_score, due_date, AM_assignee). Update report delivery status.
- **Scope:** Hooray workspace. Credentials: Supernal service account with board-level write access.
- **Volume:** Phase 2 — multiple brief tasks per day. Phase 1 — report status writes only.

---

## Cross-Source Data Normalisation

**The core data engineering challenge:** GA4, Meta, Google Ads, and Trade Desk use different metric schemas, naming conventions, and attribution models. SAL's Performance Report must produce a consistent narrative across platforms without conflating incompatible metrics.

**Normalisation requirements:**
1. **Spend:** standardise to USD, budget period (monthly), and platform label
2. **Conversions:** define per-client what counts as a conversion across each platform (booking inquiry, form submit, phone click, etc.) — this mapping must be configured per hotel client during onboarding
3. **Period alignment:** all platforms aligned to calendar month. Trade Desk may require manual period adjustment.
4. **Attribution model:** default to last-click where platform exposes attribution; flag where multi-touch is available and different
5. **Anomaly baseline:** computed per hotel client per platform over trailing 3-month rolling average

---

## Privacy + Governance

- **PII minimisation (Phase 1):** Vault ingests aggregated metrics only — no guest-level, contact-level, or personally identifiable data.
- **Client contract compliance:** Before any hotel client's data flows through the Vault, Hooray must confirm the client's contract permits AI-assisted reporting. This is an onboarding gate, not a build gate.
- **Data residency:** Data stays within Supernal's infrastructure (US-based). No data sharing with third-party AI model providers beyond what is required for SAL inference (token-level, not bulk export).
- **Retention policy:** 13-month rolling retention for monthly snapshots. 90-day rolling for sub-monthly data. Hooray retains all rights to their client data.

---

## Data Quality Flags

| Source | Gap | Severity | Resolution |
|---|---|---|---|
| GA4 | Per-client property access not yet mapped | 🔴 Critical | David to audit Hooray master vs. delegated accounts before build |
| Meta Ads | Business Manager access for all clients not confirmed | 🔴 Critical | David to audit before build |
| Trade Desk | API access structure unknown | 🟡 Medium | Validate during onboarding; fallback to manual export |
| Conversion events | Not standardised across hotel clients | 🟡 Medium | Per-client conversion mapping required at onboarding |
| Google Workspace | Folder structure and file naming not validated | 🟢 Low | David to confirm folder access during Phase 1 build |
