import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0d12",
        panel: "#0f141b",
        panel2: "#141b24",
        border: "#1f2a36",
        accent: "#00ffa3",
        accent2: "#22d3ee",
        danger: "#ff4d6d",
        mute: "#7a8a99",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(0,255,163,0.15)",
      },
    },
  },
  plugins: [],
} satisfies Config;
