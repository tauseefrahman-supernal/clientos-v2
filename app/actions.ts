"use server";

import { revalidatePath } from "next/cache";
import { addDocumentFile, addTemplateFile, decide, proposeTemplate, setFileState } from "@/lib/data";
import type { FileState, GroupId } from "@/lib/types";
import { addMember, removeMember, setPersonRole } from "@/lib/data/team";
import { actionAllowed, canAssign, currentAccess, NO_PROJECT_ACCESS, type ActionKind } from "@/lib/auth/access";
import { decideSuggestion, suggestionProject } from "@/lib/memory/digest";

// Server actions for the prototype store. Each one revalidates every page so the
// library, vault and search reflect the change.
// Server actions are public POST endpoints: each checks access here, never only in the UI (lib/auth/rules.ts actionAllowed).

/** Throws unless the signed-in person may do this kind of change (on this project); returns their access. */
async function allow(kind: ActionKind, slug: string | null = null) {
  const access = await currentAccess();
  if (!actionAllowed(access, kind, typeof slug === "string" ? slug : null)) throw new Error(kind === "approval" || kind === "role" ? "Only an admin can do that." : NO_PROJECT_ACCESS);
  return access;
}

export async function setFileStateAction(slug: string, path: string, state: FileState) {
  await allow("vault", slug);
  await setFileState(slug, path, { state });
  revalidatePath("/", "layout");
}

export async function toggleInBookAction(slug: string, path: string, inBook: boolean) {
  await allow("vault", slug);
  await setFileState(slug, path, { inBook });
  revalidatePath("/", "layout");
}

export async function saveFileAction(slug: string, path: string, content: string) {
  await allow("vault", slug);
  await setFileState(slug, path, { content });
  revalidatePath("/", "layout");
}

export async function proposeTemplateAction(slug: string, path: string) {
  await allow("vault", slug);
  await proposeTemplate(slug, path, "You");
  revalidatePath("/", "layout");
}

export async function decideAction(kind: "category" | "template", category: string, template: string | null, approve: boolean) {
  await allow("approval");
  await decide(kind, category, template, approve);
  revalidatePath("/", "layout");
}

export async function setFileShownAction(slug: string, path: string, shown: boolean) {
  await allow("vault", slug);
  await setFileState(slug, path, { shown });
  revalidatePath("/", "layout");
}

export async function addTemplateAction(slug: string, category: string, template: string, group: number) {
  await allow("vault", slug);
  const f = await addTemplateFile(slug, category, template, Math.min(3, Math.max(0, group)) as GroupId);
  revalidatePath("/", "layout");
  return f?.path ?? null;
}

export async function saveDocumentAction(slug: string, group: number, title: string, content: string) {
  await allow("vault", slug);
  if (!content.trim()) return null;
  const f = await addDocumentFile(slug, Math.min(3, Math.max(0, group)) as GroupId, title, content.slice(0, 500_000), "You");
  revalidatePath("/", "layout");
  return f?.path ?? null;
}

export async function addMemberAction(slug: string, personId: string, role: string) {
  await allow("team", slug);
  await addMember(slug, personId, role);
  revalidatePath("/", "layout");
}

export async function removeMemberAction(slug: string, personId: string, role: string) {
  await allow("team", slug);
  await removeMember(slug, personId, role);
  revalidatePath("/", "layout");
}

export async function setPersonRoleAction(personId: string, role: "admin" | "member") {
  await allow("role");
  await setPersonRole(personId, role);
  revalidatePath("/", "layout");
}

/** Accept or reject a suggested vault fact. Only an admin or the project's strategist; checked here, not only in the UI. */
export async function decideSuggestionAction(id: string, accept: boolean) {
  const slug = await suggestionProject(id);
  if (!slug) throw new Error("No such suggestion.");
  const access = await currentAccess();
  if (!canAssign(access, slug)) throw new Error("Only an admin or this project's strategist can accept or reject suggestions.");
  await decideSuggestion(id, accept === true, access.person?.name ?? "You");
  revalidatePath("/", "layout");
}
