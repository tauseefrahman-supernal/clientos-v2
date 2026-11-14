import type { GroupId, ShareStatus } from "@/lib/types";

// The library is four high-level categories, one per strategy group. Each holds the core
// templates every project starts with, plus shared templates the team has added. A project's
// own extra files sit in the same category, local to that project, until proposed and approved.

export const CORE: { slug: string; group: GroupId; name: string; description: string; dirs: string[] }[] = [
  { slug: "core-sales", group: 0, name: "Sales Strategy", description: "Who the client is, who decides, and the deal going in.", dirs: ["sales-strategy/Inputs", "sales-strategy/Outputs"] },
  { slug: "core-deal", group: 1, name: "Deal Strategy", description: "The real constraint, what is scoped, and what is left open.", dirs: ["phase-a/Inputs", "phase-a/Outputs"] },
  { slug: "core-tech", group: 2, name: "Technical Strategy", description: "Data, integrations, the AI employee, the plan and the commercials.", dirs: ["phase-b/Inputs", "phase-b/Outputs"] },
  { slug: "core-delivery", group: 3, name: "Delivery Strategy", description: "What every account in delivery runs on.", dirs: ["phase-c/Inputs"] },
];

/** Core file names drop the old step numbering: "A2-Diagnostic-Discovery" becomes "Diagnostic-Discovery". */
export const coreName = (file: string) => file.replace(/\.md$/, "").replace(/^[A-C]\d+-/, "");

type Shared = { group: GroupId; name: string; description: string; status: ShareStatus; createdBy: string; origin: string; body: string };
export const SHARED: Shared[] = [
  { group: 2, name: "Feature-Rationale", status: "shared", createdBy: "Tauseef", origin: "World Emblem", description: "Each design decision with its reason and the meeting where it was made.", body: "One row per design decision. An engineer or new strategist reads this before changing anything.\n\n## Decisions\n\n| Decision | Why | Decided in (meeting) | Decided by | Still true? |\n|---|---|---|---|---|\n\n## Reversed decisions\n\n| Was | Now | Why it changed | Source |\n|---|---|---|---|" },
  { group: 2, name: "Use-Cases-and-Feedback", status: "shared", createdBy: "Tauseef", origin: "World Emblem", description: "Use cases by team, adoption, and the feedback that changed the product.", body: "## Use cases\n\n| Use case | Team | Who | How often |\n|---|---|---|---|\n\n## Feedback\n\n| Date | From | Feedback | What changed | Source |\n|---|---|---|---|---|" },
  { group: 2, name: "Design-System", status: "proposed", createdBy: "Jaime", origin: "Hooray Agency", description: "How the product looks and feels: principles, components, variations and why.", body: "## Principles\n\n| Principle | Why | Example | Source |\n|---|---|---|---|\n\n## Components\n\n| Component | Purpose | Used on | Link |\n|---|---|---|---|\n\n## Variations\n\n| Screen or flow | Variations tried | Chosen | Why |\n|---|---|---|---|" },
  { group: 2, name: "Security-and-Compliance", status: "proposed", createdBy: "Sven", origin: "Heritage", description: "The rules the client operates under, where the product runs, and every incident with its fix.", body: "## Obligations\n\n| Rule | Set by | Applies to | How we meet it | Source |\n|---|---|---|---|---|\n\n## Incidents\n\n| Date | What happened | Found by | Fix | State |\n|---|---|---|---|---|" },
  { group: 3, name: "Stakeholders", status: "shared", createdBy: "Tauseef", origin: "World Emblem", description: "Client people, their stance now, and where they sit on the Account OS power map.", body: "## Client\n\n| Name | Title | Role on the account | Influence | Disposition | Now | Our owner |\n|---|---|---|---|---|---|---|\n\n## Supernal pod\n\n| Name | Role | Since | Until |\n|---|---|---|---|" },
  { group: 3, name: "Weekly", status: "shared", createdBy: "Tauseef", origin: "World Emblem", description: "Only what is specific to this week: decisions, slipping items, call prep.", body: "## Decisions\n\n| Decision | Why now | Owner |\n|---|---|---|\n\n## Slipping\n\n| Kind | Item | Since | Next step |\n|---|---|---|---|\n\n## Call prep\n\n| Meeting | Present | Ask | Risks | Hold back |\n|---|---|---|---|---|" },
  { group: 3, name: "Adoption-Plan", status: "shared", createdBy: "Tauseef", origin: "World Emblem", description: "Who goes live when, what helps them, and whether they are using it.", body: "## Rollout\n\n| Group | State | Go-live | Waiting on | Owner (client) |\n|---|---|---|---|---|\n\n## Usage signals\n\n| Signal | Now | Target | Source | As of |\n|---|---|---|---|---|" },
  { group: 3, name: "Stakeholder-Comms", status: "proposed", createdBy: "Tauseef", origin: "World Emblem", description: "Replies and updates owed to stakeholders, and what was sent.", body: "## Owed\n\n| To | What | Why now | Due |\n|---|---|---|---|\n\n## Sent\n\n| Date | To | What | Reply |\n|---|---|---|---|" },
];

/** Which file each numbered section of an account's research document is loaded into. */
export const RESEARCH_TO_FILE: Record<number, string> = {
  1: "Sales-One-Pager",
  3: "Sales-Context",
  4: "Concept-Alignment",
  2: "Context-Building",
  6: "Product-Segmentation",
  14: "Diagnostic-Discovery",
  5: "Phasing-Commercial",
  9: "Delivery-Plan",
  7: "Use-Cases-and-Feedback",
  8: "Stakeholders",
  10: "Project-Plan",
};

/** A project-specific section from the research merges into the file it belongs in. Anything not listed becomes its own file. */
export const SECTION_TO_FILE: Record<string, string> = {
  "design": "Design-System", "product design and ux": "Design-System", "product experience and decks": "Design-System",
  "feedback log and design decisions": "Use-Cases-and-Feedback",
  "product vision and architecture decisions": "Product-Segmentation",
  "commercial path": "Phasing-Commercial", "pricing and offer evolution": "Phasing-Commercial", "pricing experiments and unit economics": "Phasing-Commercial",
  "order forms and points ledger": "Phasing-Commercial", "contract obligations register": "Phasing-Commercial", "trigger-based order form design": "Phasing-Commercial",
  "metric definitions and data trust": "Integrations", "access and integration gates": "Integrations", "certifier and data source registry": "Integrations",
  "client software and integration partner": "Integrations", "kpi source map": "Integrations", "host system constraints (pioneerrx)": "Integrations",
  "security and compliance": "Security-and-Compliance", "security incident record": "Security-and-Compliance", "data handling and compliance": "Security-and-Compliance",
  "regulated operation and compliance": "Security-and-Compliance", "regulatory and compliance context": "Security-and-Compliance", "incidents and handover": "Security-and-Compliance",
  "adoption and enforcement": "Adoption-Plan", "training programme": "Adoption-Plan", "department onboarding playbook": "Adoption-Plan",
  "operations runbook and store rollout": "Adoption-Plan", "pilot programme": "Adoption-Plan",
  "competitor intelligence": "Sales-Research", "competitor file": "Sales-Research", "competing platform netsuite": "Sales-Research",
};

// Standard workflows on every account (the Work page). Inputs are file names.
export const STANDARD_WORKFLOWS = [
  { slug: "health", name: "Weekly health", kind: "internal", cadence: "Weekly, by Monday", audience: "Account manager, strategist", output: "Account OS weekly health score", inputs: ["Weekly", "Project-Plan"] },
  { slug: "review", name: "Weekly client review", kind: "external", cadence: "Weekly", audience: "Client sponsor and champions", output: "Review deck and agenda", inputs: ["Weekly", "Project-Plan", "Stakeholders"] },
  { slug: "report", name: "Weekly delivery report", kind: "internal", cadence: "Weekly, Saturday", audience: "Delivery leadership", output: "Notion weekly account report", inputs: ["Weekly"] },
  { slug: "checkin", name: "Weekly project check-in", kind: "internal", cadence: "Weekly", audience: "Engineers and strategist", output: "Updated project plan", inputs: ["Project-Plan"] },
  { slug: "pulse", name: "Pulse and Workbench upkeep", kind: "internal", cadence: "Weekly", audience: "Strategist, FDE", output: "Pulse metrics for the account", inputs: ["Delivery-Plan", "Project-Plan"] },
  { slug: "proposal", name: "Proposal and order form", kind: "external", cadence: "When a deal opens", audience: "Account executive, client buyer", output: "Proposal, order form", inputs: ["Phasing-Commercial", "Proposal-v2"] },
  { slug: "monthly", name: "Monthly account review", kind: "internal", cadence: "Monthly", audience: "Account executive, account manager, strategist", output: "Account plan update", inputs: ["AI-Strategy-Roadmap", "Stakeholders"] },
] as const;

// Scoping workflows for a deal still in sales. Inputs are file names.
export const SALES_WORKFLOWS = [
  { slug: "intake", name: "Sales intake", kind: "internal", cadence: "When the deal is created", audience: "Account executive, strategist", output: "Sales-Intake filled", inputs: ["Sales-Intake"] },
  { slug: "research", name: "Client and industry research", kind: "internal", cadence: "Before the first call", audience: "Strategist", output: "Sales-Research, with what similar projects learned", inputs: ["Sales-Research"] },
  { slug: "discovery", name: "Discovery call prep and readout", kind: "external", cadence: "Each discovery call", audience: "Client buyer and champion", output: "Call agenda, then Discovery-Readout", inputs: ["Sales-Intake", "Discovery-Readout"] },
  { slug: "concept", name: "Concept alignment", kind: "external", cadence: "After discovery", audience: "Client sponsor", output: "Concept-Alignment document", inputs: ["Diagnostic-Discovery", "Concept-Alignment"] },
  { slug: "prototype", name: "Prototype brief", kind: "internal", cadence: "Prototype stage", audience: "Mason or FDE", output: "Prototype-Summary", inputs: ["Product-Segmentation", "Prototype-Summary"] },
  { slug: "proposal", name: "Proposal", kind: "external", cadence: "Proposal stage", audience: "Client buyer", output: "Proposal", inputs: ["Scope-Definition", "Phasing-Commercial", "Proposal"] },
  { slug: "deal-desk", name: "Deal desk review", kind: "internal", cadence: "Before pricing goes out", audience: "Deal desk", output: "Pricing and gate sign-off", inputs: ["Phasing-Commercial"] },
  { slug: "order-form", name: "Order form", kind: "external", cadence: "Order Form stage", audience: "Client signer", output: "Order form", inputs: ["Phasing-Commercial", "Scope-Definition"] },
] as const;

/** Account OS account ids of the accounts in delivery, so pipeline deals on them are not listed twice. */
export const DELIVERY_ACCOUNT_IDS: Record<string, string> = {
  "01M20ZRNWXHKB4Y57ZZ7JK9GE4": "world-emblem", "01M20ZRNTEWZYRS75TKQ6GF7HY": "heritage", "01M20ZRP3ZMV8XGQDSQW5G0SMP": "hooray",
  "01M20ZRP3D7FNW8DYARH1B29P6": "rafferty", "01M20ZRP2Z3HZ9KHYTPF19EFW4": "rafferty", "01M20ZRNZ66A9TJ9CARAJS4GTP": "breakr",
  "01M20ZRP0HTRXKTCBF39VX8WE7": "sunflower-wellness", "01M2RXE43BE1HBE7641ZPEPS3T": "rxvip", "01M20ZRNXA7N9N1C7RNR2R3Z7A": "ethic-select",
  "01M2RXDZ044DS53DPHD4FQW4DF": "super-73",
};
