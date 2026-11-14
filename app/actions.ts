"use server";

import { revalidatePath } from "next/cache";
import { addDocumentFile, addTemplateFile, decide, proposeTemplate, setFileState } from "@/lib/data";
import type { FileState, GroupId } from "@/lib/types";

// Server actions for the prototype store. Each one revalidates every page so the
// library, vault and search reflect the change.

export async function setFileStateAction(slug: string, path: string, state: FileState) {
  await setFileState(slug, path, { state });
  revalidatePath("/", "layout");
}

export async function toggleInBookAction(slug: string, path: string, inBook: boolean) {
  await setFileState(slug, path, { inBook });
  revalidatePath("/", "layout");
}

export async function saveFileAction(slug: string, path: string, content: string) {
  await setFileState(slug, path, { content });
  revalidatePath("/", "layout");
}

export async function proposeTemplateAction(slug: string, path: string) {
  await proposeTemplate(slug, path, "You");
  revalidatePath("/", "layout");
}

export async function decideAction(kind: "category" | "template", category: string, template: string | null, approve: boolean) {
  await decide(kind, category, template, approve);
  revalidatePath("/", "layout");
}

export async function setFileShownAction(slug: string, path: string, shown: boolean) {
  await setFileState(slug, path, { shown });
  revalidatePath("/", "layout");
}

export async function addTemplateAction(slug: string, category: string, template: string, group: number) {
  const f = await addTemplateFile(slug, category, template, Math.min(3, Math.max(0, group)) as GroupId);
  revalidatePath("/", "layout");
  return f?.path ?? null;
}

export async function saveDocumentAction(slug: string, group: number, title: string, content: string) {
  if (!content.trim()) return null;
  const f = await addDocumentFile(slug, Math.min(3, Math.max(0, group)) as GroupId, title, content.slice(0, 500_000), "You");
  revalidatePath("/", "layout");
  return f?.path ?? null;
}
