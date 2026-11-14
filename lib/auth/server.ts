import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { allowedEmail, anonKey, authEnabled, supabaseUrl } from "./config";

/** Supabase client bound to the signed-in user's cookies (server components, route handlers, actions). */
export function authClient() {
  const store = cookies();
  return createServerClient(supabaseUrl()!, anonKey()!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => { try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* read-only in server components; the middleware refreshes */ } },
    },
  });
}

export type SignedIn = { id: string; email: string; name: string; avatar: string | null };

/** The signed-in Supernal user, or null. When sign-in is not configured, returns null. */
export async function currentUser(): Promise<SignedIn | null> {
  if (!authEnabled()) return null;
  const { data } = await authClient().auth.getUser();
  const u = data.user;
  if (!u || !allowedEmail(u.email)) return null;
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  return { id: u.id, email: u.email!, name: String(meta.full_name ?? meta.name ?? u.email!.split("@")[0]), avatar: typeof meta.avatar_url === "string" ? meta.avatar_url : null };
}
