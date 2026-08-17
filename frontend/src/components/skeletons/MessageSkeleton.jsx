// Widths are varied so the placeholder reads like a real conversation.
const SKELETON_MESSAGES = [
  { mine: false, width: "w-48" },
  { mine: false, width: "w-32" },
  { mine: true, width: "w-40" },
  { mine: false, width: "w-56" },
  { mine: true, width: "w-24" },
  { mine: true, width: "w-44" },
];

const MessageSkeleton = () => {
  return (
    <div className="flex-1 overflow-hidden px-3 sm:px-6 py-4 space-y-3">
      {SKELETON_MESSAGES.map((item, idx) => (
        <div key={idx} className={`flex gap-2.5 ${item.mine ? "justify-end" : "justify-start"}`}>
          {!item.mine && <div className="skeleton size-8 rounded-full shrink-0 self-end" />}
          <div className={`skeleton h-10 rounded-2xl ${item.width}`} />
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
