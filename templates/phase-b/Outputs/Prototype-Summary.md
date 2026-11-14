# Prototype Summary

> **Phase:** Technical Strategy · **Role:** Output
> **Answers:** WHAT working AI product to build for sales impact, HOW to build it, and WHAT it proves once built. This is both the build prompt — written so it can be handed to an Ant Farm environment or to Claude Code and produce a working prototype — and the Deal Room prototype handoff (Stage 3).
> **This file is for:** the build spec, the demo link, the canonical module list, evidence, and known limitations.
> **This file is NOT for:** pricing (`Phase A/Outputs/Proposal.md`).
> **Canonical modules:** defined HERE; `Phase A/Outputs/Proposal.md` references them by id.
> **Upstream sources:** `Phase B/Inputs/B1-Data-Layer.md`, `B2-Integrations.md`, `B3-AI-Employees.md`, `B4-Delivery-Plan.md`; the Proposal; the transcripts.
> **Save instruction:** After writing, call `save_document` with `file_type: "prototype_spec"`, `step_id: "B4"`.
> **Filename is the Deal Room contract:** the Deal Room reads this exact path for its Prototype stage. Do not rename it.
> **Handoff contract:** `Frameworks/Deal-Room-Handoff.md` — add YAML frontmatter per the schema there (§2).
> **Framework:** `Frameworks/MECE-Framework.md`

## HOUSE RULES
- The prototype proves **one** thing fast: the time-to-value moment from the proposal. MVP-first, then layer.
- No em dashes. Be concrete: name the inputs, the flow, and what the user sees.

## 1. What we're building (one line)
_[The working AI product, in one sentence.]_

## 2. Why it matters / sales impact
_[What this demonstrates to the client; the objection it answers; the "first 30 days" win it makes real.]_

## 3. Target user + core scenario
_[Who uses it, when, in what context. The single end-to-end scenario the prototype must nail.]_

## 4. The core flow
_[Step-by-step: input → processing → output. What the user does, what the system does, what comes back.]_

## 5. Data + systems
_[Minimum data sources to get a v1. What is real vs stubbed for the demo. Integrations touched.]_

## 6. What to demo
_[The exact thing to show, to whom, by when. Keep it to something visible in week 1-2.]_

## 7. Success criteria
_[Binary: the prototype works if … . How we know value is proven.]_

## 8. Build notes (for Ant Farm / Claude Code)
_[Stack hints, constraints, what to skip for v1, known risks. Enough for an autonomous build to start.]_

## 9. Out of scope (for the prototype)
_[What we are deliberately not building yet.]_

## 10. Demo link

- **Hosted URL:** _[the live prototype link, once built]_
- **Status:** _[not started | building | live | retired]_

## 11. What the prototype proves

_(One paragraph: the single thing this demo must make the client believe, built on their data.)_

## 12. Screens built

| Screen | Purpose | Primary data | Module shown |
|---|---|---|---|
|  |  |  |  |

- **Data slice used:** …
- **Integrations:** …

## 13. Module menu (canonical)

_(Mirror the frontmatter `modules` here in readable form — name, outcome, price. These ids are what `Phase A/Outputs/Proposal.md` references.)_

## 14. Known limitations vs production

- …
