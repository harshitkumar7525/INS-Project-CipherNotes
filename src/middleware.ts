import { NextRequest, NextResponse } from "next/server";

// Edge middleware: gate /dashboard with cookie presence (verification happens in API routes).
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isDash = req.nextUrl.pathname.startsWith("/dashboard");
  if (isDash && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
