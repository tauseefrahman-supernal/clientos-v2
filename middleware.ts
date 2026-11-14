import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { allowedEmail, anonKey, authEnabled, supabaseUrl } from "@/lib/auth/config";

// Every page and API route needs a signed-in @getsupernal.ai user. The middleware also keeps the
// Supabase session cookie fresh. Exceptions: the login page and the sign-in callback; and on a
// local dev server, API calls from scripts (no browser cookies, localhost only) so the evaluation
// and import scripts keep working.

const PUBLIC = [/^\/login$/, /^\/auth\//];

export async function middleware(req: NextRequest) {
  if (!authEnabled()) return NextResponse.next();
  const path = req.nextUrl.pathname;
  if (PUBLIC.some((r) => r.test(path))) return NextResponse.next();

  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(supabaseUrl()!, anonKey()!, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (user && allowedEmail(user.email)) return res;

  const isApi = path.startsWith("/api/");
  const local = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(req.nextUrl.hostname);
  const script = !req.cookies.getAll().some((c) => c.name.startsWith("sb-")) && !req.headers.get("sec-fetch-site");
  if (isApi && local && script) return res;

  if (user) await supabase.auth.signOut(); // signed in with another domain
  if (isApi) return NextResponse.json({ error: "Sign in with your Supernal Google account." }, { status: 401 });
  const to = req.nextUrl.clone();
  to.pathname = "/login";
  to.search = user ? "?error=domain" : `?next=${encodeURIComponent(path + req.nextUrl.search)}`;
  return NextResponse.redirect(to);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)"],
};
