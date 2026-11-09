import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0A0A0A",
          blue: "#007BA7",
          pink: "#FF2D95",
          surface: "#121212",
          card: "#171717",
          cardHover: "#202020",
          border: "#292929",
          textPrimary: "#FFFFFF",
          textSecondary: "#A1A1AA",
          textMuted: "#71717A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #007BA7 0%, #FF2D95 100%)",
        "brand-gradient-subtle": "linear-gradient(135deg, rgba(0,123,167,0.18) 0%, rgba(255,45,149,0.12) 100%)",
        "radial-blue": "radial-gradient(circle at center, rgba(0, 123, 167, 0.22) 0%, transparent 70%)",
        "radial-pink": "radial-gradient(circle at center, rgba(255, 45, 149, 0.16) 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-blue": "0 0 35px -5px rgba(0, 123, 167, 0.45)",
        "glow-pink": "0 0 35px -5px rgba(255, 45, 149, 0.4)",
        "card-depth": "0 20px 50px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
      },
      animation: {
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

