import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00F0FF",
          purple: "#B026FF",
          pink: "#FF00E5",
          blue: "#0066FF",
          green: "#00FF88",
          yellow: "#FFD700",
        },
        dark: {
          DEFAULT: "#0A0A0F",
          light: "#1A1A2E",
          lighter: "#2A2A3E",
        },
        accent: {
          primary: "#00F0FF",
          secondary: "#B026FF",
          tertiary: "#FF00E5",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        heading: ['"Be Vietnam Pro"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      backgroundImage: {
        "gradient-neon": "linear-gradient(135deg, #00F0FF 0%, #B026FF 50%, #FF00E5 100%)",
        "gradient-dark": "linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%)",
        "gradient-mesh": "radial-gradient(at 0% 0%, rgba(0, 240, 255, 0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(176, 38, 255, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 0, 229, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(0, 102, 255, 0.1) 0px, transparent 50%)",
        "gradient-card": "linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(176, 38, 255, 0.05) 100%)",
      },
      boxShadow: {
        neon: "0 0 8px rgba(0, 240, 255, 0.2), 0 0 16px rgba(0, 240, 255, 0.1)",
        "neon-lg": "0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.15)",
        "neon-purple": "0 0 8px rgba(176, 38, 255, 0.2), 0 0 16px rgba(176, 38, 255, 0.1)",
        "neon-pink": "0 0 8px rgba(255, 0, 229, 0.2), 0 0 16px rgba(255, 0, 229, 0.1)",
        "glow-cyan": "0 0 12px rgba(0, 240, 255, 0.25)",
        "glow-purple": "0 0 12px rgba(176, 38, 255, 0.25)",
        "glow-pink": "0 0 12px rgba(255, 0, 229, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseNeon: {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.8", filter: "brightness(1.3)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0, 240, 255, 0.2)" },
          "50%": { boxShadow: "0 0 12px rgba(0, 240, 255, 0.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [forms],
};

export default config;
