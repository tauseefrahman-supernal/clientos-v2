"use server";

import { revalidatePath } from "next/cache";
import { addTemplateFile, decide, proposeTemplate, setFileState } from "@/lib/data";
import type { FileState, GroupId } from "@/lib/types";

// Server actions for the prototype store. Each one revalidates every page so the
// library, vault and search reflect the change.

export async function setFileStateAction(slug: string, path: string, state: FileState) {
  setFileState(slug, path, { state });
  revalidatePath("/", "layout");
}

export async function toggleInBookAction(slug: string, path: string, inBook: boolean) {
  setFileState(slug, path, { inBook });
  revalidatePath("/", "layout");
}

export async function saveFileAction(slug: string, path: string, content: string) {
  setFileState(slug, path, { content });
  revalidatePath("/", "layout");
}

export async function proposeTemplateAction(slug: string, path: string) {
  proposeTemplate(slug, path, "You");
  revalidatePath("/", "layout");
}

export async function decideAction(kind: "category" | "template", category: string, template: string | null, approve: boolean) {
  decide(kind, category, template, approve);
  revalidatePath("/", "layout");
}

export async function setFileShownAction(slug: string, path: string, shown: boolean) {
  setFileState(slug, path, { shown });
  revalidatePath("/", "layout");
}

export async function addTemplateAction(slug: string, category: string, template: string, group: number) {
  const f = addTemplateFile(slug, category, template, Math.min(3, Math.max(0, group)) as GroupId);
  revalidatePath("/", "layout");
  return f?.path ?? null;
}
