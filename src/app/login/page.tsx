"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error || "Login failed");
    toast.success("Welcome back");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <form onSubmit={onSubmit} className="card p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6 text-accent font-mono">
          <Lock className="w-5 h-5" /> CipherNotes
        </div>
        <h1 className="text-2xl font-semibold mb-1">Login</h1>
        <p className="text-sm text-mute mb-6">Access your encrypted vault.</p>
        <label className="text-xs text-mute">Email</label>
        <input className="input mt-1 mb-4" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="text-xs text-mute">Password</label>
        <input className="input mt-1 mb-6" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="btn-primary w-full">{loading ? "Signing in…" : "Sign in"}</button>
        <p className="text-sm text-mute mt-4 text-center">
          New here? <Link href="/signup" className="text-accent hover:underline">Create account</Link>
        </p>
      </form>
    </main>
  );
}
