import daisyui from "daisyui";

// One dark palette, shared by every accent below.
// base-200 = deepest (app background), base-100 = panels, base-300 = borders.
const darkBase = {
  neutral: "#1a2130",
  "neutral-content": "#e4e9f0",
  "base-100": "#131924",
  "base-200": "#0b0f17",
  "base-300": "#232c3b",
  "base-content": "#e4e9f0",
  info: "#38bdf8",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#f87171",
  "--rounded-box": "1rem",
  "--rounded-btn": "0.75rem",
  "--border-btn": "1px",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    // Three accents of the same dark theme, instead of DaisyUI's 32 presets.
    themes: [
      {
        "chatty-indigo": {
          ...darkBase,
          primary: "#6366f1",
          "primary-content": "#ffffff",
          secondary: "#a855f7",
          accent: "#22d3ee",
        },
      },
      {
        "chatty-emerald": {
          ...darkBase,
          primary: "#10b981",
          "primary-content": "#04231a",
          secondary: "#14b8a6",
          accent: "#38bdf8",
        },
      },
      {
        "chatty-rose": {
          ...darkBase,
          primary: "#f43f5e",
          "primary-content": "#ffffff",
          secondary: "#ec4899",
          accent: "#fb923c",
        },
      },
    ],
    darkTheme: "chatty-indigo",
  },
};
