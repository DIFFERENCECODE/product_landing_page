import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark green brand palette from screenshots
        brand: {
          bg: "#0d2b1e",       // deepest background
          surface: "#112d20",   // card / section background
          card: "#153626",      // elevated card
          border: "#1e4a32",    // subtle border
          accent: "#a8e63d",    // lime-green CTA / highlight
          "accent-hover": "#92cc2a",
          muted: "#6b8f76",     // muted text on dark bg
          label: "#a8e63d",     // section label colour (lime)
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-geist-serif)", "Georgia", "serif"],
      },
      fontSize: {
        // Typography scale per spec: H1=60, H2=30, H3=20, H4=18, H5=16
        "display": ["60px", { lineHeight: "1.05", fontWeight: "700" }],
        "h2": ["30px", { lineHeight: "1.2", fontWeight: "700" }],
        "h3": ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        "h4": ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        "h5": ["16px", { lineHeight: "1.5", fontWeight: "500" }],
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
