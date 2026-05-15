import type { Config } from "tailwindcss";

// CAccessRoots brand palette.
// "brand" is mapped to sage — this is the everyday voice across the app.
// Deeper accents (forest, river) and terracotta show up for headings,
// primary CTAs, info moments, and sensitivity flags.

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Sage — the everyday voice
        brand: {
          50: "#F1F4EE",
          100: "#E4EBD8",
          200: "#C8D7B2",
          300: "#AEC392",
          400: "#91AC74",
          500: "#74935A",
          600: "#5D7D45",
          700: "#476035",
          800: "#3D5430",
          900: "#243B20",
        },
        // Deep forest — primary CTAs, page titles, admin nav
        forest: {
          50: "#E8EFE6",
          100: "#C5D6BF",
          200: "#9DB994",
          400: "#5E8552",
          600: "#3D5C33",
          700: "#2F4A2F",
          900: "#1B2E1B",
        },
        // River — links, informational moments, partner nav
        river: {
          50: "#EAF1F6",
          100: "#BBD3E0",
          200: "#8FB6CC",
          400: "#5C90AB",
          500: "#4A7A93",
          700: "#2E5266",
          900: "#1A3340",
        },
        // Warm neutrals — paper, surface, borders
        oat: {
          50: "#FAF6EE",
          100: "#F4EEDF",
          200: "#EBE0C2",
        },
        sand: {
          100: "#EFE5CF",
          200: "#DECCA7",
          400: "#B49C6B",
        },
        // Olive — body and headline ink, warm not cold
        olive: {
          400: "#7A7B5C",
          600: "#5B5C42",
          700: "#4A4F39",
          900: "#2A2D1F",
        },
        // Terracotta — sensitive flags, destructive actions
        terra: {
          50: "#FAEDE5",
          100: "#F4D5C0",
          200: "#EDB791",
          400: "#D27A52",
          600: "#B5563A",
          700: "#8E3E26",
          900: "#5A2716",
        },
        // Ink — semantic aliases pointing at the olive ramp
        ink: {
          DEFAULT: "#2A2D1F",   // olive 900
          muted: "#5B5C42",     // olive 600
          subtle: "#7A7B5C",    // olive 400
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Iowan Old Style", "Palatino Linotype", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(42,45,31,0.04), 0 8px 24px rgba(42,45,31,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
