/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "var(--bg-primary)",
        bgCard: "var(--bg-card)",
        accent: "var(--accent)",
        accentGlow: "var(--accent-glow)",
        textPrimary: "var(--text-primary)",
        textMuted: "var(--text-muted)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        syne: ["Syne", "sans-serif"],
      },
    },
  },
  plugins: [],
}
