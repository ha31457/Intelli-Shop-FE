/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // enables light/dark via class strategy
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // Our premium palette
        background: "#0f0f0f",
        foreground: "#f9fafb", // light gray text on dark
        primary: {
          DEFAULT: "#fbbf24", // amber-400/500 (golden)
          foreground: "#1f2937", // dark text on golden
        },
        secondary: {
          DEFAULT: "#374151", // gray-700 (cards, panels)
          foreground: "#f3f4f6", // text-gray-100
        },
        muted: {
          DEFAULT: "#1f2937", // gray-800
          foreground: "#9ca3af", // muted gray-400
        },
        accent: {
          DEFAULT: "#fbbf24", // reuse amber for accents
          foreground: "#111827",
        },
        card: {
          DEFAULT: "#111827", // deep gray with glassmorphism overlay
          foreground: "#f3f4f6",
        },
        border: "#1f2937", // gray border
        input: "#1f2937", // dark input bg
        ring: "#fbbf24", // amber glow on focus
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

