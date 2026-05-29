import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import { requireAuth } from "@/middleware/auth";
import { encryptDES, decryptDES } from "@/utils/encryption";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().min(1).max(50000).optional(),
});

function badId(id: string) {
  return !mongoose.Types.ObjectId.isValid(id);
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  if (badId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  const note = await Note.findOne({ _id: params.id, user: auth.userId }).lean<any>();
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    note: {
      _id: note._id,
      title: note.title,
      content: safeDecrypt(note.content, params.id),
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    },
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  if (badId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    await connectDB();
    const update: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) update.title = parsed.data.title;
    if (parsed.data.content !== undefined) {
      console.log(`\n[DES] Encrypting note content on PUT /api/notes/${params.id}`);
      update.content = encryptDES(parsed.data.content, true);
    }
    const note = await Note.findOneAndUpdate(
      { _id: params.id, user: auth.userId },
      update,
      { new: true }
    ).lean<any>();
    if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      note: {
        _id: note._id,
        title: note.title,
        content: safeDecrypt(note.content, params.id),
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  if (badId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  const res = await Note.deleteOne({ _id: params.id, user: auth.userId });
  if (res.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

function safeDecrypt(ct: string, id: string) {
  try {
    console.log(`\n[DES] Decrypting note content on GET /api/notes/${id}`);
    return decryptDES(ct, true);
  } catch { return ""; }
}