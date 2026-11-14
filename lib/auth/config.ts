// Sign-in settings shared by the middleware, server code and the login page.
// Sign-in is on when the project URL and its anon (publishable) key are set.

export const ALLOWED_DOMAIN = "getsupernal.ai";

export function supabaseUrl(): string | null {
  const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  if (!raw) return null;
  try { return new URL(/^https?:\/\//.test(raw) ? raw : `https://${raw}`).origin; } catch { return null; }
}

export const anonKey = (): string | null => (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim() || null;

export const authEnabled = (): boolean => !!supabaseUrl() && !!anonKey();

export const allowedEmail = (email: string | null | undefined): boolean =>
  !!email && email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
