import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("auth-storage"); // Zustand persist stores in localStorage, but middleware only reads cookies
  const { pathname } = request.nextUrl;

  // Protect dashboard and other pages
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // protect dashboard and subroutes
};
