import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        "primary-dark": "#1E3A8A",
        accent: "#3B82F6",
        "accent-light": "#60A5FA",
        surface: "#DBEAFE",
        ink: "#0B0F1A",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(60% 60% at 50% 0%, rgba(59,130,246,0.25) 0%, rgba(30,58,138,0) 60%), linear-gradient(180deg, #0B0F1A 0%, #1E3A8A 100%)",
        "dot-grid":
          "radial-gradient(rgba(96,165,250,0.18) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-grid": "24px 24px",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        float: "float 8s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
