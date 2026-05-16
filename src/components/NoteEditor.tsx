"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Save, Trash2 } from "lucide-react";

export type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function NoteEditor({
  note,
  onClose,
  onSaved,
  onDeleted,
}: {
  note: Note | null; // null = creating new
  onClose: () => void;
  onSaved: (n: Note) => void;
  onDeleted?: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
  }, [note]);

  async function save() {
    if (!title.trim() || !content.trim()) return toast.error("Title and content required");
    setSaving(true);
    const url = note ? `/api/notes/${note._id}` : "/api/notes";
    const res = await fetch(url, {
      method: note ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return toast.error(data.error || "Save failed");
    toast.success("Saved");
    onSaved(data.note);
  }

  async function remove() {
    if (!note) return;
    if (!confirm("Delete this note?")) return;
    const res = await fetch(`/api/notes/${note._id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Delete failed");
    toast.success("Deleted");
    onDeleted?.(note._id);
  }

  return (
    <div className="card p-5 flex flex-col h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">{note ? "Edit note" : "New note"}</h2>
        <button onClick={onClose} className="text-mute hover:text-white"><X className="w-4 h-4" /></button>
      </div>
      <input className="input mb-3" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea
        className="input flex-1 font-mono resize-none"
        placeholder="Write securely…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-2 mt-3">
        <button onClick={save} disabled={saving} className="btn-primary">
          <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
        </button>
        {note && (
          <button onClick={remove} className="btn-danger">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
