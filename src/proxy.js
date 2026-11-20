import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/equipment/:id", "/payment/:path*"],
};

export function proxy(request) {
  const token = getSessionCookie(request);

  if (!token) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
