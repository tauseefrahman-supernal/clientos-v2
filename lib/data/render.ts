import type { AccountBundle, Template, VaultFile } from "@/lib/types";

/** The markdown shown for a vault file: its content, or the empty template it starts from. */
export function fileMarkdown(_b: AccountBundle, f: VaultFile, templates: Template[]): { markdown: string; generated: boolean } {
  if (f.content) return { markdown: f.content, generated: false };
  const t = templates.find((x) => x.category === f.category && x.name === f.template);
  return { generated: false, markdown: t?.body ? `_Not filled yet. The template it starts from:_\n\n${t.body}` : "_Empty._" };
}

/** Find a file by full path ("Technical Strategy/Integrations") or by name ("Integrations"). */
export function findFile(files: VaultFile[], key: string | undefined | null): VaultFile | null {
  if (!key) return null;
  return files.find((f) => f.path === key) ?? files.find((f) => f.path.endsWith(`/${key}`)) ?? null;
}
