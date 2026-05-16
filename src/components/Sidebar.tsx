"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, FileText, LogOut, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function Sidebar({ email }: { email?: string }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  }
  return (
    <aside className="w-64 shrink-0 border-r border-border bg-panel min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 text-accent font-mono px-2 py-3">
        <Lock className="w-5 h-5" />
        <span className="font-semibold">CipherNotes</span>
      </div>
      <nav className="mt-4 space-y-1">
        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-panel2 text-mute hover:text-white">
          <FileText className="w-4 h-4" /> All notes
        </Link>
        <Link href="/dashboard?new=1" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-panel2 text-mute hover:text-white">
          <Plus className="w-4 h-4" /> New note
        </Link>
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        {email && <p className="text-xs text-mute px-2 mb-2 truncate">{email}</p>}
        <button onClick={logout} className="btn-ghost w-full justify-start">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
