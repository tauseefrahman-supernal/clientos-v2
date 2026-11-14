import { NextResponse } from "next/server";
import { authClient } from "@/lib/auth/server";
import { allowedEmail } from "@/lib/auth/config";

export const dynamic = "force-dynamic";

// Google sends the user back here with a one-time code. Exchange it for a session, then
// keep only @getsupernal.ai accounts (the database also refuses new users from other domains).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const fail = (reason: string) => NextResponse.redirect(new URL(`/login?error=${reason}`, url.origin));

  if (url.searchParams.get("error")) return fail(/Only @getsupernal/i.test(url.searchParams.get("error_description") ?? "") ? "domain" : "google");
  if (!code) return fail("google");
  const supabase = authClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return fail("google");
  if (!allowedEmail(data.user?.email)) { await supabase.auth.signOut(); return fail("domain"); }
  return NextResponse.redirect(new URL(safeNext, url.origin));
}
