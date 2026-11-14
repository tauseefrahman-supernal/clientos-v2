import { NextResponse } from "next/server";
import { authClient } from "@/lib/auth/server";
import { authEnabled } from "@/lib/auth/config";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (authEnabled()) await authClient().auth.signOut();
  return NextResponse.redirect(new URL("/login", new URL(req.url).origin), { status: 303 });
}
