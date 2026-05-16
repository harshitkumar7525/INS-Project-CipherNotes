import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CipherNotes — Encrypted Notes",
  description: "End-to-end encrypted notes with DES",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-white antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#0f141b", color: "#e6edf3", border: "1px solid #1f2a36" },
          }}
        />
      </body>
    </html>
  );
}
