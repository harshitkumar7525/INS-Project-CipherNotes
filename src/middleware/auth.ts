import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JwtPayload } from "@/utils/jwt";

/*
Extracts and verifies the JWT from the `token` httpOnly cookie.
Returns the decoded payload or a NextResponse 401 on failure.
*/
 
export function requireAuth(req: NextRequest): JwtPayload | NextResponse {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
