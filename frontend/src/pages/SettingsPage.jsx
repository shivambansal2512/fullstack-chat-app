import { Check, CheckCheck } from "lucide-react";

import Avatar from "../components/Avatar";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const PREVIEW_MESSAGES = [
  { id: 1, text: "Hey! Did you get a chance to look at it?", isMine: false },
  { id: 2, text: "Yes, just finished. Looks great 🎉", isMine: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-full overflow-y-auto bg-base-200">
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Appearance</h1>
          <p className="text-sm text-base-content/50 mt-1">Pick an accent colour for the app</p>
        </div>

        {/* Accent picker */}
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-colors ${
                theme === t.id
                  ? "border-primary bg-primary/10"
                  : "border-base-300 bg-base-100 hover:border-base-content/20"
              }`}
            >
              <span
                className="size-8 rounded-full"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-sm">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Live preview - uses the theme that is already applied to the page */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-base-content/60">Preview</h2>

          <div className="rounded-2xl border border-base-300 overflow-hidden bg-base-200">
            <div className="h-14 px-4 flex items-center gap-3 bg-base-100 border-b border-base-300">
              <Avatar user={{ fullName: "Emma Thompson" }} className="size-9 text-xs" />
              <div>
                <p className="text-sm font-semibold leading-tight">Emma Thompson</p>
                <p className="text-xs text-base-content/45">Active now</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[75%] flex flex-col items-end">
                    <div
                      className={`px-3.5 py-2 text-sm rounded-2xl ${
                        message.isMine
                          ? "bg-primary text-primary-content rounded-br-md"
                          : "bg-base-100 border border-base-300 rounded-bl-md"
                      }`}
                    >
                      {message.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1 text-[11px] text-base-content/40">
                      <span>10:24</span>
                      {message.isMine &&
                        (message.id === 2 ? (
                          <CheckCheck className="size-3.5 text-info" />
                        ) : (
                          <Check className="size-3.5" />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
