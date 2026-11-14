import { redirect } from "next/navigation";
import { authEnabled } from "@/lib/auth/config";
import { currentUser } from "@/lib/auth/server";
import { GoogleButton } from "@/components/auth/GoogleButton";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  domain: "ClientOS is for Supernal. Sign in with your @getsupernal.ai Google account.",
  google: "Google sign-in didn’t finish. Try again.",
};

export default async function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  if (authEnabled() && (await currentUser())) redirect(searchParams.next || "/");
  const error = searchParams.error ? ERRORS[searchParams.error] ?? ERRORS.google : null;
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-space-4">
      <div className="flex w-full max-w-[380px] flex-col gap-space-5 rounded-xl border border-border bg-card p-space-6 shadow-sm">
        <div>
          <div className="text-lg font-bold">Supernal</div>
          <div className="text-xs text-muted-foreground">ClientOS</div>
        </div>
        <div className="flex flex-col gap-space-1">
          <h1 className="font-display text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground">The strategy vault for Supernal’s client work. Use your Supernal Google account.</p>
        </div>
        {error && <p role="alert" className="rounded-md border border-[hsl(var(--color-status-error-border))] bg-[hsl(var(--color-status-error-bg))] px-space-3 py-space-2 text-sm text-[hsl(var(--color-status-error-text))]">{error}</p>}
        {authEnabled()
          ? <GoogleButton next={searchParams.next ?? "/"} />
          : <p className="rounded-md border border-dashed border-border px-space-3 py-space-2 text-sm text-muted-foreground">Sign-in isn’t configured on this server: it needs <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. The app is open until then.</p>}
        <p className="text-xs text-muted-foreground">Only @getsupernal.ai accounts can sign in.</p>
      </div>
    </main>
  );
}
