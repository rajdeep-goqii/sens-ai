/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      animation: {
        typing: "typing 3s steps(30, end)",
        cursor: "blink 1s step-end infinite",
        shine: "shine 2s infinite",
      },
      keyframes: {
        shine: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            h3: {
              marginBottom: "1rem",
              color: "#1e293b", // text-slate-800
            },
            h4: {
              marginBottom: "0.75rem",
              color: "#334155", // text-slate-700
            },
            p: {
              marginBottom: "0.5rem",
              lineHeight: "1.75",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwind-scrollbar"),
    require("@tailwindcss/typography"),
  ],
  daisyui: {
    themes: ["light"],
    base: true,
    styled: true,
    utils: true,
  },
};
