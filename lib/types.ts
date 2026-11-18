// Domain types. They mirror the `clientos` schema, so the seed backend and the
// Supabase backend return the same shapes.

export type Tone = "ok" | "warn" | "err" | "info" | "";
export type ShareStatus = "local" | "proposed" | "shared" | "standard";
export type FileState = "active" | "hidden" | "archived" | "deleted";

export const GROUPS = ["Sales Strategy", "Deal Strategy", "Technical Strategy", "Delivery Strategy"] as const;
export type GroupId = 0 | 1 | 2 | 3;

export interface Health { score: string; band: string; tone: Tone }

export interface SalesDeal { id: string; stage: string; motion: string; owner: string; people: string[]; confidence: string; value: string; mrr: string; expectedClose: string; nextStep: string; description: string; updatedAt: string }

export interface Account {
  slug: string;
  /** "delivery" for accounts with signed work; "sales" for open pipeline deals being scoped. */
  stage: "delivery" | "sales";
  industry: string;
  squad: string | null;
  deal: SalesDeal | null;
  /** For an expansion deal: the slug of the account in delivery it expands. */
  parent: string | null;
  name: string;
  strategist: string;
  pod: string;
  mrr: string;
  closedValue: string;
  closedCount: number;
  health: Health | null;
  freshness: string[];
  transcriptCount: number;
}

export interface Deal { name: string; value: string; stage: string; phase: number; note: string }
export interface SoldItem { form: string; promised: string; met: string; tone: Tone }
export interface ArcPeriod { period: string; meetings: number | null; points: string[] }
export interface Workstream { name: string; state: string; tone: Tone; pct: number | null; due: string; measured: string; learned: string; attention: boolean }
export interface Tile { file: string; section: string; title: string; headline: string; tone: Tone; state: string }
export interface Decision { title: string; detail: string; action: string }
export interface Slip { kind: string; tone: Tone; item: string; detail: string }
export interface DateItem { when: string; what: string }
export interface FeedItem { meeting: string; date: string; changes: string[] }
export interface Person { name: string; title: string; note: string; influence: string; disposition: string }
export interface Metric { criterion: string; now: string; state: string; tone: Tone }
export interface AccountOsRecord { record: string; now: string; proposes: string }
export interface Rationale { decision: string; why: string; source: string }
export interface Answer { q: string; a: string }

export interface Overview {
  deals: Deal[];
  lost: string;
  sold: SoldItem[];
  arc: ArcPeriod[];
  disagreements: string[];
  streams: Workstream[];
  tiles: Tile[];
  decisions: Decision[];
  slipping: Slip[];
  dates: DateItem[];
  feed: FeedItem[];
  people: Person[];
  metrics: Metric[];
  accountOs: AccountOsRecord[];
  rationale: Rationale[];
  answers: Answer[];
}

export interface Chapter { sort: number; title: string; minutes: number; lenses: string[]; body: string; sources: string[] }

export interface Artifact { id: string; kind: string; title: string; dated: string; description: string; url: string; provider: string; sensitive: boolean }

export interface Category {
  slug: string;
  group: GroupId;
  name: string;
  description: string;
  status: ShareStatus;
  isCore: boolean;
  createdBy: string;
  origin: string;          // account name or "every project"
}

export interface Template {
  category: string;        // category slug
  name: string;
  description: string;
  body: string;            // markdown skeleton
  status: ShareStatus;
  onlyAccount: string | null;
  createdBy: string;
  origin: string;
}

export interface VaultFile {
  path: string;            // "<Category name>/<File>" or a core file name
  category: string | null; // category slug
  template: string | null; // template name, null for a custom file
  group: GroupId;
  summary: string;
  content: string;         // markdown; empty when only a summary exists
  source: "template" | "human" | "stella" | "import";
  state: FileState;
  shown?: boolean;         // in the vault sidebar; unset means shown when the file has content
  inBook: boolean;
}

export interface Workflow {
  slug: string;
  name: string;
  kind: "external" | "internal";
  cadence: string;
  audience: string;
  inputs: string[];
  output: string;
  note: string;
  standard: boolean;
}

/** A meeting pulled in for a project from Granola or Fathom (listed, never its transcript text). */
/** summary is the call's 5 to 8 line summary (digested calls only, else empty); headline this project's one line; transcriptId opens the transcript panel. */
export interface Recording { provider: "granola" | "fathom" | "upload"; id: string; title: string; date: string; participants: string[]; kind: "client" | "internal" | "multi"; summary: string; url: string; altUrl: string; headline?: string; transcriptId?: string }

export interface AccountBundle {
  account: Account;
  overview: Overview;
  book: Chapter[];
  artifacts: Artifact[];
  recordings: Recording[];
  files: VaultFile[];
  workflows: Workflow[];
}
