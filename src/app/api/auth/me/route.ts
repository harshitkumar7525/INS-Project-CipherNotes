import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({ user: { id: auth.userId, email: auth.email } });
}
