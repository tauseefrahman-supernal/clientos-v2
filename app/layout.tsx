import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/shell/AppShell";
import { listAccounts, listCategories, listTemplates } from "@/lib/data";
import { buildSearchIndex } from "@/lib/search";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-lora" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = { title: "ClientOS — Supernal" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const index = buildSearchIndex(listAccounts(), listCategories(), listTemplates());
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${mono.variable}`}>
      <body className="m-0 min-h-screen bg-background font-sans text-foreground">
        <TooltipProvider delayDuration={300}>
          <AppShell searchIndex={index} names={Object.fromEntries(listAccounts().map((b) => [b.account.slug, b.account.name]))}>{children}</AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
