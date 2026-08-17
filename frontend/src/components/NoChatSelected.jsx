import { MessagesSquare, Zap, CheckCheck, ImageIcon } from "lucide-react";

// Doubles as a quick feature highlight for anyone opening the app for the first time.
const FEATURES = [
  { icon: Zap, label: "Realtime delivery" },
  { icon: CheckCheck, label: "Read receipts" },
  { icon: ImageIcon, label: "Image sharing" },
];

const NoChatSelected = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-6 bg-base-200 px-8">
      <div className="size-16 rounded-2xl bg-primary/15 flex items-center justify-center">
        <MessagesSquare className="size-8 text-primary" />
      </div>

      <div className="text-center space-y-1.5">
        <h2 className="text-xl font-semibold">Your messages</h2>
        <p className="text-sm text-base-content/50">
          Pick someone from the list to start a conversation.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {FEATURES.map((feature) => (
          <div
            key={feature.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-base-100 border border-base-300 text-xs text-base-content/70"
          >
            <feature.icon className="size-3.5 text-primary" />
            {feature.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoChatSelected;
