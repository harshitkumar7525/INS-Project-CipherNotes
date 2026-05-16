import Link from "next/link";
import { Lock, Shield, KeyRound } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(0,255,163,0.08),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(34,211,238,0.06),transparent_40%)]" />
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-mono text-accent">
          <Lock className="w-5 h-5" />
          <span className="font-semibold tracking-wide">CipherNotes</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="btn-ghost">Login</Link>
          <Link href="/signup" className="btn-primary">Get started</Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-24 text-center">
        <p className="text-accent font-mono text-xs tracking-[0.3em] uppercase mb-4">
          DES · JWT · MongoDB
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Notes, encrypted <span className="text-accent">at rest</span>.
        </h1>
        <p className="mt-6 text-mute max-w-xl mx-auto">
          CipherNotes encrypts every note with DES before it ever touches the database.
          Only you can read them.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link href="/signup" className="btn-primary">Create account</Link>
          <Link href="/login" className="btn-ghost">I have an account</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-24 grid md:grid-cols-3 gap-4">
        {[
          { icon: Shield, t: "Zero-trust storage", d: "Ciphertext only in MongoDB. Keys live in env." },
          { icon: KeyRound, t: "DES + bcrypt", d: "Notes encrypted with DES, passwords with bcrypt." },
          { icon: Lock, t: "JWT sessions", d: "HttpOnly cookies, protected routes, clean logout." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="card p-5">
            <Icon className="w-5 h-5 text-accent" />
            <h3 className="mt-3 font-semibold">{t}</h3>
            <p className="text-sm text-mute mt-1">{d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
