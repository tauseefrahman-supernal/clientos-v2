"use server";

import { revalidatePath } from "next/cache";
import { addDocumentFile, addTemplateFile, decide, proposeTemplate, setFileState } from "@/lib/data";
import type { FileState, GroupId } from "@/lib/types";
import { addMember, removeMember, setPersonRole } from "@/lib/data/team";
import { actionRefusal, canAssign, currentAccess, Refusal, type ActionKind, type ActionResult } from "@/lib/auth/access";
import { decideSuggestion, suggestionProject } from "@/lib/memory/digest";

// Server actions for the prototype store. Each one revalidates every page so the
// library, vault and search reflect the change.
// Server actions are public POST endpoints: each checks access here, never only in the UI (lib/auth/rules.ts actionAllowed).
// Next masks thrown Error messages in production, so refusals come back as { ok: false, error } (lib/auth/rules.ts
// ActionResult); the client turns them into a message with unwrapAction. Unexpected errors still throw.

/** Runs fn when the signed-in person may do this kind of change (on this project); a refusal is returned, not thrown. */
async function guarded<T>(kind: ActionKind, slug: string | null, fn: (by: string) => Promise<T>): Promise<ActionResult<T>> {
  const access = await currentAccess();
  const refused = actionRefusal(access, kind, typeof slug === "string" ? slug : null);
  if (refused) return refused;
  try {
    const value = await fn(access.person?.name ?? "You");
    revalidatePath("/", "layout");
    return { ok: true, value };
  } catch (e) {
    if (e instanceof Refusal) return { ok: false, error: e.message };
    throw e;
  }
}

export async function setFileStateAction(slug: string, path: string, state: FileState) {
  return guarded("vault", slug, async () => { await setFileState(slug, path, { state }); return null; });
}

export async function toggleInBookAction(slug: string, path: string, inBook: boolean) {
  return guarded("vault", slug, async () => { await setFileState(slug, path, { inBook }); return null; });
}

export async function saveFileAction(slug: string, path: string, content: string) {
  return guarded("vault", slug, async () => { await setFileState(slug, path, { content }); return null; });
}

export async function proposeTemplateAction(slug: string, path: string) {
  return guarded("vault", slug, async () => { await proposeTemplate(slug, path, "You"); return null; });
}

export async function decideAction(kind: "category" | "template", category: string, template: string | null, approve: boolean) {
  return guarded("approval", null, async () => { await decide(kind, category, template, approve); return null; });
}

export async function setFileShownAction(slug: string, path: string, shown: boolean) {
  return guarded("vault", slug, async () => { await setFileState(slug, path, { shown }); return null; });
}

export async function addTemplateAction(slug: string, category: string, template: string, group: number) {
  return guarded("vault", slug, async () => (await addTemplateFile(slug, category, template, Math.min(3, Math.max(0, group)) as GroupId))?.path ?? null);
}

export async function saveDocumentAction(slug: string, group: number, title: string, content: string) {
  return guarded("vault", slug, async () => {
    if (!content.trim()) return null;
    return (await addDocumentFile(slug, Math.min(3, Math.max(0, group)) as GroupId, title, content.slice(0, 500_000), "You"))?.path ?? null;
  });
}

export async function addMemberAction(slug: string, personId: string, role: string) {
  return guarded("team", slug, async () => { await addMember(slug, personId, role); return null; });
}

export async function removeMemberAction(slug: string, personId: string, role: string) {
  return guarded("team", slug, async () => { await removeMember(slug, personId, role); return null; });
}

export async function setPersonRoleAction(personId: string, role: "admin" | "member") {
  return guarded("role", null, async () => { await setPersonRole(personId, role); return null; });
}

/** Accept or reject a suggested vault fact. Only an admin or the project's strategist; checked here, not only in the UI. */
export async function decideSuggestionAction(id: string, accept: boolean): Promise<ActionResult> {
  const slug = await suggestionProject(id);
  if (!slug) return { ok: false, error: "No such suggestion." };
  const access = await currentAccess();
  if (!canAssign(access, slug)) return { ok: false, error: "Only an admin or this project's strategist can accept or reject suggestions." };
  try { await decideSuggestion(id, accept === true, access.person?.name ?? "You"); }
  catch (e) { if (e instanceof Refusal) return { ok: false, error: e.message }; throw e; }
  revalidatePath("/", "layout");
  return { ok: true, value: null };
}
