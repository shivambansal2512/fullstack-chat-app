// Accent options. `id` must match a theme name in tailwind.config.js.
export const THEMES = [
  { id: "chatty-indigo", label: "Indigo", color: "#6366f1" },
  { id: "chatty-emerald", label: "Emerald", color: "#10b981" },
  { id: "chatty-rose", label: "Rose", color: "#f43f5e" },
];

export const DEFAULT_THEME = "chatty-indigo";

// Kept below the server's 10mb JSON limit - base64 is ~33% larger than the file.
export const MAX_IMAGE_SIZE_MB = 5;
