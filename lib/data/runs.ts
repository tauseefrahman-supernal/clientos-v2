import "server-only";
import { db, dbEnabled } from "./db";
import { getAccount, listTemplates, setFileState } from "./index";
import { askStella } from "@/lib/stella/agent";
import { splitEvidence } from "@/lib/stella/evidence";
import { SCOPING_STEPS } from "@/lib/scoping";

// Workflow runs (clientos.workflow_runs): Stella drafts a workflow's output from its input files; a
// person approves it, or marks an external one sent. Approving a scoping step writes the draft into
// the vault file that step produces, which moves the deal's scoping track forward. My View and each
// project's Work page read the same runs.

export type RunStatus = "running" | "draft" | "approved" | "sent" | "failed";
export type Run = { id: string; project: string; workflow: string; status: RunStatus; title: string; draft: string; startedBy: string | null; startedAt: string; approvedBy: string | null };

const fileForStep = new Map<string, string>(SCOPING_STEPS.filter((s) => s.file).map((s) => [s.slug, s.file as string]));

async function workflowRow(accountId: string, slug: string) {
  const { data } = await db().from("workflows").select("id").eq("account_id", accountId).eq("slug", slug).maybeSingle();
  return (data?.id as string) ?? null;
}
async function accountId(slug: string) {
  const { data } = await db().from("accounts").select("id").eq("slug", slug).maybeSingle();
  return (data?.id as string) ?? null;
}

const toRun = (r: Record<string, unknown>, project: string, workflow: string): Run => ({
  id: r.id as string, project, workflow, status: r.status as RunStatus, title: String(r.draft ?? "").match(/^#\s+(.+)$/m)?.[1] ?? "", draft: String(r.draft ?? ""),
  startedBy: (r.started_by as string) ?? null, startedAt: r.started_at as string, approvedBy: (r.approved_by as string) ?? null,
});

/** The latest run of each workflow on these projects, keyed "project/workflow". */
export async function latestRuns(slugs: string[]): Promise<Map<string, Run>> {
  const out = new Map<string, Run>();
  if (!dbEnabled() || !slugs.length) return out;
  const { data, error } = await db().from("workflow_runs").select("id,status,draft,started_by,started_at,approved_by,accounts!inner(slug),workflows!inner(slug)")
    .in("accounts.slug", slugs).order("started_at", { ascending: false }).limit(1000);
  if (error) throw new Error(error.message);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const r of (data ?? []) as any[]) {
    const key = `${r.accounts.slug}/${r.workflows.slug}`;
    if (!out.has(key)) out.set(key, toRun(r, r.accounts.slug, r.workflows.slug));
  }
  return out;
}

/** Run a workflow: Stella reads its inputs and drafts its output. Returns the saved run. */
export async function runWorkflow(slug: string, workflowSlug: string, by: string): Promise<Run> {
  if (!dbEnabled()) throw new Error("Workflow runs need the database (Supabase).");
  const b = await getAccount(slug);
  if (!b) throw new Error("No such project, or you are not assigned to it.");
  const w = b.workflows.find((x) => x.slug === workflowSlug);
  if (!w) throw new Error(`No workflow ${workflowSlug} on ${b.account.name}.`);
  const [aid] = [await accountId(slug)];
  const wid = aid && (await workflowRow(aid, workflowSlug));
  if (!aid || !wid) throw new Error("This project is not in the database yet; run the import.");

  const { data: row, error } = await db().from("workflow_runs").insert({ workflow_id: wid, account_id: aid, started_by: by, status: "running" }).select("*").single();
  if (error || !row) throw new Error(error?.message ?? "Could not start the run.");

  const file = fileForStep.get(workflowSlug) && b.account.stage === "sales" ? fileForStep.get(workflowSlug)! : null;
  const template = file ? (await listTemplates()).find((t) => t.name === file)?.body ?? "" : "";
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const prompt = [
    `Run the "${w.name}" workflow for ${b.account.name}.`,
    `It is for: ${w.audience}. Cadence: ${w.cadence}. It produces: ${w.output}.`,
    w.inputs.length ? `It draws on these vault files: ${w.inputs.join(", ")}. Read them first, and anything else in the vault that bears on it.` : "",
    file ? `Once approved, your document becomes this project's ${file} file. Write it as that file: start with "# ${file.replace(/-/g, " ")}" and keep the template's section headings:\n\n${template}` : `Title the document "${w.name}: ${b.account.name} (${date})".`,
    "Write the output with create_document, then reply in one or two lines with what it covers and what is missing. Mark anything the vault does not hold as a gap rather than guessing.",
  ].filter(Boolean).join("\n\n");

  let draft = "", reply = "", failure: string | null = null;
  try {
    for await (const ev of askStella([slug], [{ role: "user", content: prompt }])) {
      if (ev.type === "document" && !draft) draft = ev.doc.content;
      else if (ev.type === "text") reply += ev.delta;
      else if (ev.type === "reset") reply = "";
      else if (ev.type === "error") failure = ev.message;
    }
  } catch (e) { failure = e instanceof Error ? e.message : String(e); }
  // The reply is shown as the failure; its evidence block, if any, is not.
  if (!draft && !failure) failure = splitEvidence(reply).answer.trim() || "Stella did not produce a document.";

  const status: RunStatus = failure ? "failed" : "draft";
  const { data: done } = await db().from("workflow_runs").update({ status, draft: failure ? `# Run failed\n\n${failure}` : draft, finished_at: new Date().toISOString() }).eq("id", row.id).select("*").single();
  return toRun(done ?? row, slug, workflowSlug);
}

/** Approve a draft (writing a scoping step's output into the vault), mark it sent, or discard it. */
export async function decideRun(runId: string, action: "approve" | "sent" | "discard", by: string): Promise<Run | null> {
  const { data: r } = await db().from("workflow_runs").select("*,accounts!inner(slug,stage),workflows!inner(slug)").eq("id", runId).maybeSingle();
  if (!r) return null;
  const slug = r.accounts.slug as string, wf = r.workflows.slug as string;
  if (!(await getAccount(slug))) return null;
  if (action === "discard") { await db().from("workflow_runs").delete().eq("id", runId); return null; }
  const status: RunStatus = action === "approve" ? "approved" : "sent";
  const file = r.accounts.stage === "sales" ? fileForStep.get(wf) : undefined;
  if (action === "approve" && file && r.draft) {
    const b = await getAccount(slug);
    const f = b?.files.find((x) => x.template === file);
    if (f) await setFileState(slug, f.path, { content: r.draft, state: "active", shown: true }, by);
  }
  const { data } = await db().from("workflow_runs").update({ status, ...(action === "approve" ? { approved_by: by } : { sent_to: "marked sent" }) }).eq("id", runId).select("*").single();
  return toRun(data ?? r, slug, wf);
}
