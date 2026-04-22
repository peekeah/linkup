import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env['NEXTAUTH_SECRET'] }); 
  const { pathname } = req.nextUrl;

  // If user is not authenticated and trying to access dashboard, redirect to home
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is authenticated and on home page, redirect to dashboard
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow all other requests to continue
  return NextResponse.next();
}


export const config = {
  matcher: ["/", "/dashboard/:path*"],
};