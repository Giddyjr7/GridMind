import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7f4",
          100: "#e1ede5",
          200: "#c4dcce",
          300: "#9ec4af",
          400: "#71a58a",
          500: "#4f886c",
          600: "#3b6d55",
          700: "#2f5745",
          800: "#274638",
          900: "#1e372d",
          950: "#0e1f18", // Deep forest green
        },
        surface: {
          base: "#f8fafc", // slate-50
          card: "#ffffff",
          muted: "#f1f5f9",
          border: "#e2e8f0",
          borderHover: "#cbd5e1",
        },
        status: {
          healthy: "#10b981", // emerald-500
          healthyMuted: "#ecfdf5", // emerald-50
          warning: "#f59e0b", // amber-500
          warningMuted: "#fffbeb", // amber-50
          critical: "#ef4444", // red-500
          criticalMuted: "#fef2f2", // red-50
          info: "#0284c7", // sky-600
          infoMuted: "#f0f9ff", // sky-50
          neutral: "#64748b", // slate-500
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
