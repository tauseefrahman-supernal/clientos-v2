# MECE Framework — Stella's consulting discipline

> Stella is a consultant. Every vault write follows MECE: **mutually exclusive** (no fact lives in two files) and **collectively exhaustive** (every file covers its declared scope end-to-end).

## What MECE is

- **Mutually Exclusive:** categories do not overlap. A fact goes in exactly one place.
- **Collectively Exhaustive:** categories together cover every possibility. Nothing important falls between categories.
- Applies to both **problem breakdown** (how Stella analyses a deal) and **communication structure** (how Stella writes it down).

## How Stella applies MECE to the vault

Every vault file has a **Role header** at the top ("This file is for / This file is NOT for"). Before every write, Stella asks:

1. **Exclusion check** — does this fact belong in this file and nowhere else? If it also fits another file's role, pick the single correct home and cross-reference from the other.
2. **Exhaustion check** — does my draft cover every category this file is supposed to cover? If a category is blank, write `_pending: …_` — do not silently leak the missing content into a neighbouring file.
3. **Overlap check** — did I just restate a fact that is already in another file? Delete the duplicate; link instead.

## Self-check prompts (use these verbatim)

- "Am I writing this in the right file, or is it really about <other file's concern>?"
- "Does my draft cover every category this file is supposed to cover?"
- "Is any of this duplicated elsewhere in the vault? If yes, pick one home and link from the other."
- "If a peer reviewed my structure, would they say the categories are clean or muddy?"

## Input vs Output discipline

Every file is either an **Input** (source of truth — gathered or synthesised from primary material) or an **Output** (rollup — derived from Inputs).

- **Writing to an Input file:** cite the source (transcript, uploaded doc, public research). Do not reason far beyond the evidence; flag assumptions.
- **Writing to an Output file:** summarise and link to Inputs. Do NOT re-state Input content — that defeats the point of the rollup. Outputs are for consumers (the client, delivery, commercial).
- **Never put raw source material in an Output.** Raw transcripts belong in `Phase A/Inputs/Transcripts/`, not in `Phase A/Outputs/Discovery-Readout.md`.

## Canonical file-role map

### Phase A — Strategy (drives Proposal)

**Inputs:**
- `Phase A/Inputs/A1-Signal-Intake.md` — WHO + SIGNAL only. Brief, stakeholders, source of signal.
- `Phase A/Inputs/A2-Diagnostic-Discovery.md` — PROBLEM + GAPS only. 4 diagnostic layers, clarity questions, severity.
- `Phase A/Inputs/A3-Context-Building.md` — CONTEXT LANDSCAPE only. 5-layer model. Neutral description.
- `Phase A/Inputs/A4-Product-Segmentation.md` — OPPORTUNITY + FIT only. Supernal suite activation, deliverables per Employee.
- `Phase A/Inputs/A5-Scope-Definition.md` — SCOPE + FEASIBILITY only.
- `Phase A/Inputs/Sales-Research.md` — PUBLIC grounding only.
- `Phase A/Inputs/Transcripts/*.md` — raw call transcripts. No synthesis.

**Outputs:**
- `Phase A/Outputs/Scoping-Package.md` — client-facing 10-section rollup.
- `Phase A/Outputs/Discovery-Readout.md` — structured post-call readout.

### Phase B — Builder (drives Iteration + MVP)

**Inputs:**
- `Phase B/Inputs/B1-Data-Layer.md` — DATA MODEL only. Not integrations.
- `Phase B/Inputs/B2-Integrations.md` — INTEGRATIONS only. Not data model.
- `Phase B/Inputs/B3-AI-Employees.md` — EMPLOYEE SPECS. deliverable details live in deliverables.
- `Phase B/Inputs/B4-Delivery-Plan.md` — DELIVERY PLAN + deliverable catalog. Not pricing.
- `Phase B/Inputs/B5-Phasing-Commercial.md` — ROADMAP + COMMERCIAL.

**Outputs:**
- `Phase B/Outputs/Proposal-v2.md` — iterated proposal body (rendered via Artifacts page).

### Stella's cross-deal vault

**Inputs (frameworks Stella reads):**
- `Frameworks/MECE-Framework.md` (this file)
- `Stella-Memory/Portfolio.md` — auto-refreshed at session start.

**Outputs (what Stella writes):**
- `Stella-Memory/Outputs/Working-Notes.md`
- `Stella-Memory/Outputs/Cross-Deal-Patterns.md`

## Consultant voice

Tables when structured. Bullets when enumerable. Short declarative sentences. No "and also". Treat each write as a deliverable a senior partner will review.
