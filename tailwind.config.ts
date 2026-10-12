import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        // Celulares de poco alto: compactamos para que todo quepa sin scroll
        short: { raw: "(max-height: 720px)" },
        // Pantallas más anchas que la foto vertical (tablet, escritorio)
        wider: { raw: "(min-aspect-ratio: 9/16)" },
      },
      colors: {
        brand: {
          // Rojo exacto extraído del logo (#d7010c) — sin mezcla naranja
          50: "#fde9e9",
          100: "#fac6c6",
          400: "#e8140f",
          500: "#d7010c",
          600: "#b8000a",
          700: "#8f0008",
          900: "#500005",
        },
        bamboo: {
          // Verde bambú exacto extraído del logo (#86bb2d)
          400: "#9bcf43",
          500: "#86bb2d",
          600: "#699423",
        },
      },
      keyframes: {
        "expand-in": {
          "0%": { transform: "scale(0.2)", opacity: "0" },
          "60%": { transform: "scale(1.04)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "ring-out": {
          "0%": { transform: "scale(0.3)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        // Golpe de la revelación: sacudida corta con rebote
        impact: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "10%": { transform: "scale(1.06) translate(-6px, 4px)" },
          "22%": { transform: "scale(1.045) translate(6px, -5px)" },
          "36%": { transform: "scale(1.03) translate(-4px, 3px)" },
          "52%": { transform: "scale(1.015) translate(3px, -2px)" },
          "72%": { transform: "scale(1.005) translate(-1px, 1px)" },
          "100%": { transform: "scale(1) translate(0, 0)" },
        },
        flash: {
          "0%": { opacity: "0", transform: "translate(-50%, -50%) scale(0.4)" },
          "14%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translate(-50%, -50%) scale(1)" },
        },
        shockwave: {
          "0%": { opacity: "0.95", transform: "translate(-50%, -50%) scale(0.15)" },
          "100%": { opacity: "0", transform: "translate(-50%, -50%) scale(6)" },
        },
        dust: {
          "0%": { opacity: "0", transform: "translate3d(0, 0, 0) scale(0.6)" },
          "20%": { opacity: "0.95" },
          "100%": { opacity: "0", transform: "translate3d(var(--dx), -38vh, 0) scale(1)" },
        },
        rays: {
          "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
        "drop-in": {
          "0%": { transform: "translateY(-110%)" },
          "60%": { transform: "translateY(4%)" },
          "80%": { transform: "translateY(-1.5%)" },
          "100%": { transform: "translateY(0)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.8deg)" },
          "50%": { transform: "rotate(1.8deg)" },
        },
        "focus-zoom": {
          "0%": { filter: "blur(16px)", transform: "scale(1)" },
          "100%": { filter: "blur(0)", transform: "scale(1.12)" },
        },
        "rise-in": {
          "0%": { transform: "translateY(45%) scale(0.85)", opacity: "0" },
          "70%": { transform: "translateY(-3%) scale(1.02)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        confetti: {
          "0%": { transform: "translate(0, 0) rotate(0deg) scale(0.3)", opacity: "0" },
          "15%": { opacity: "1" },
          "100%": {
            transform: "translate(var(--x), var(--y)) rotate(var(--r)) scale(1)",
            opacity: "0",
          },
        },
      },
      animation: {
        impact: "impact 0.75s ease-out both",
        flash: "flash 0.9s ease-out both",
        shockwave: "shockwave 1.2s cubic-bezier(0.15, 0.7, 0.3, 1) both",
        dust: "dust 7s ease-in infinite both",
        rays: "rays 45s linear infinite",
        "drop-in": "drop-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        sway: "sway 6s ease-in-out infinite",
        "focus-zoom": "focus-zoom 2.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both",
        "rise-in": "rise-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both",
        confetti: "confetti 1.3s cubic-bezier(0.2, 0.8, 0.3, 1) 0.7s both",
        "expand-in": "expand-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "ring-out": "ring-out 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
