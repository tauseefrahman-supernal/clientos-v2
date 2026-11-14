import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/shell/AppShell";
import { backend, listAccounts, listCategories, listTemplates } from "@/lib/data";
import { buildSearchIndex } from "@/lib/search";
import { authEnabled } from "@/lib/auth/config";
import { currentUser } from "@/lib/auth/server";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-lora" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = { title: "ClientOS — Supernal" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  // Signed out (only the login page is reachable): render it bare, with no project data in the page.
  const signedOut = authEnabled() && !user;
  const accounts = signedOut ? [] : await listAccounts();
  const index = signedOut ? [] : buildSearchIndex(accounts, await listCategories(), await listTemplates());
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${mono.variable}`}>
      <body className="m-0 min-h-screen bg-background font-sans text-foreground">
        <TooltipProvider delayDuration={300}>
          {signedOut ? children : (
            <AppShell saved={backend() === "supabase"} user={user} searchIndex={index} names={Object.fromEntries(accounts.map((b) => [b.account.slug, b.account.name]))} projects={accounts.map((b) => ({ slug: b.account.slug, name: b.account.name, stage: b.account.stage }))}>{children}</AppShell>
          )}
        </TooltipProvider>
      </body>
    </html>
  );
}
