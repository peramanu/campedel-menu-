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
        gold: {
          DEFAULT: "#C9A96E",
          light: "#DFC08A",
          dark: "#A8854A",
        },
        pine: {
          DEFAULT: "#2D5016",
          light: "#3D6B1F",
          dark: "#1E3710",
        },
        bg: {
          light: "#FAFAF8",
          dark: "#1A1A18",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#242420",
        },
        muted: {
          light: "#6B6B5E",
          dark: "#9B9B8E",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(0,0,0,0.06)",
        "card-dark": "0 2px 16px 0 rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
