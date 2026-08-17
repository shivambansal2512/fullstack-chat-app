import { create } from "zustand";
import { THEMES, DEFAULT_THEME } from "../constants";

const saved = localStorage.getItem("chat-theme");

// Older builds saved DaisyUI's built-in theme names ("coffee", "night"...).
// Those no longer exist, so ignore anything we don't recognise.
const initialTheme = THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME;

export const useThemeStore = create((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
