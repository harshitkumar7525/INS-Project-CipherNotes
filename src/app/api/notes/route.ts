import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import { requireAuth } from "@/middleware/auth";
import { encryptDES, decryptDES } from "@/utils/encryption";

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().min(1).max(50000),
});

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await connectDB();
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const filter: Record<string, unknown> = { user: auth.userId };
  if (q) filter.title = { $regex: q, $options: "i" };
  const notes = await Note.find(filter).sort({ updatedAt: -1 }).lean();
  const decrypted = notes.map((n: any) => ({
    _id: n._id,
    title: n.title,
    content: safeDecrypt(n.content),
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  }));
  return NextResponse.json({ notes: decrypted });
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    await connectDB();
    console.log("\n[DES] Encrypting note content on POST /api/notes");
    const ciphertext = encryptDES(parsed.data.content, true);
    const note = await Note.create({
      user: auth.userId,
      title: parsed.data.title,
      content: ciphertext,
    });
    return NextResponse.json({
      note: {
        _id: note._id,
        title: note.title,
        content: parsed.data.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function safeDecrypt(ct: string) {
  try {
    console.log("\n[DES] Decrypting note content on GET /api/notes");
    return decryptDES(ct, true);
  } catch { return ""; }
}