import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/"));
  }

  return NextResponse.redirect(new URL("/dashboard"));
}

export const config = {
  matcher: "/dashboard/:path*",
};