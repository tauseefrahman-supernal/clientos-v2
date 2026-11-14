import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { allowedEmail, anonKey, authEnabled, supabaseUrl } from "./config";

/** Supabase client bound to the signed-in user's cookies (server components, route handlers, actions). */
export function authClient() {
  const store = cookies();
  return createServerClient(supabaseUrl()!, anonKey()!, {
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => { try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* read-only in server components; the middleware refreshes */ } },
    },
  });
}

export type SignedIn = { id: string; email: string; name: string; avatar: string | null };

/**
 * The signed-in Supernal user, or null (also null when sign-in is not configured). The session token
 * is verified with getClaims(): locally against the project's signing keys when it uses asymmetric
 * keys, otherwise by asking Supabase. Computed once per request.
 */
export const currentUser = cache(async (): Promise<SignedIn | null> => {
  if (!authEnabled()) return null;
  const { data, error } = await authClient().auth.getClaims();
  const c = data?.claims as (Record<string, unknown> & { sub?: string; email?: string }) | undefined;
  if (error || !c?.sub || !allowedEmail(c.email)) return null;
  const meta = (c.user_metadata ?? {}) as Record<string, unknown>;
  return { id: c.sub, email: c.email!, name: String(meta.full_name ?? meta.name ?? c.email!.split("@")[0]), avatar: typeof meta.avatar_url === "string" ? meta.avatar_url : null };
});
