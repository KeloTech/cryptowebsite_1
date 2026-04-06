import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Nunito", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "Nunito",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        /** Primary text — deep jungle teal */
        ink: "#1a403a",
        /** Secondary body copy — darker for contrast on pastel backgrounds */
        muted: "#2d4f47",
        /** Tertiary / captions */
        subtle: "#3f6258",
        /** Page wash / cards */
        surface: "#f0faf6",
        elevated: "#ffffff",
        /** Soft borders */
        line: "rgba(26, 64, 58, 0.14)",
        accent: {
          DEFAULT: "#4ab8c9",
          hot: "#d4a0c4",
          lime: "#8fd9b0",
          cyan: "#7dd3e8",
        },
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(240,250,246,0) 0%, rgba(232,248,242,0.75) 45%, rgba(224,244,236,0.95) 100%), radial-gradient(ellipse 85% 55% at 50% -15%, rgba(74,184,201,0.22), transparent 55%)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.8s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-12px) rotate(1deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
