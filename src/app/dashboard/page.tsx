"use client";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, FileText } from "lucide-react";
import toast from "react-hot-toast";
import NoteEditor, { Note } from "@/components/NoteEditor";

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Note | null>(null);
  const [creating, setCreating] = useState(false);

  async function load(q = "") {
    setLoading(true);
    const res = await fetch(`/api/notes${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error || "Failed to load");
    setNotes(data.notes);
  }

  useEffect(() => { load(); }, []);

  const showEditor = creating || !!active;
  const editingNote = creating ? null : active;

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Your notes</h1>
          <p className="text-sm text-mute">Encrypted with DES before storage.</p>
        </div>
        <button
          onClick={() => { setActive(null); setCreating(true); }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" /> New note
        </button>
      </header>

      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
        <input
          className="input pl-9"
          placeholder="Search by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(query)}
        />
      </div>

      <div className="grid md:grid-cols-[1fr_1.2fr] gap-4">
        <div className="space-y-2">
          {loading ? (
            <div className="card p-8 text-center text-mute">Loading…</div>
          ) : notes.length === 0 ? (
            <div className="card p-12 text-center">
              <FileText className="w-8 h-8 mx-auto text-mute mb-2" />
              <p className="font-semibold">No notes yet</p>
              <p className="text-sm text-mute">Create your first encrypted note.</p>
            </div>
          ) : (
            notes.map((n) => (
              <button
                key={n._id}
                onClick={() => { setCreating(false); setActive(n); }}
                className={`w-full text-left card p-4 hover:border-accent/40 transition ${
                  active?._id === n._id ? "border-accent/60 shadow-glow" : ""
                }`}
              >
                <div className="font-medium truncate">{n.title}</div>
                <div className="text-xs text-mute mt-1 truncate">{n.content.slice(0, 80)}</div>
                <div className="text-[10px] text-mute mt-2 font-mono">
                  {new Date(n.updatedAt).toLocaleString()}
                </div>
              </button>
            ))
          )}
        </div>

        <div>
          {showEditor ? (
            <NoteEditor
              note={editingNote}
              onClose={() => { setActive(null); setCreating(false); }}
              onSaved={(saved) => {
                setCreating(false);
                setActive(saved);
                setNotes((prev) => {
                  const exists = prev.find((p) => p._id === saved._id);
                  return exists
                    ? prev.map((p) => (p._id === saved._id ? saved : p))
                    : [saved, ...prev];
                });
              }}
              onDeleted={(id) => {
                setNotes((prev) => prev.filter((p) => p._id !== id));
                setActive(null);
              }}
            />
          ) : (
            <div className="card p-12 text-center text-mute h-full grid place-items-center">
              <div>
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <p>Select a note or create a new one.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
