import { ArrowLeft, X } from "lucide-react";

import Avatar from "./Avatar";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isTyping } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <header className="h-16 shrink-0 px-3 sm:px-4 flex items-center gap-3 bg-base-100 border-b border-base-300">
      {/* Back button - phones only, since the list is hidden there */}
      <button
        onClick={() => setSelectedUser(null)}
        className="md:hidden size-9 rounded-xl flex items-center justify-center hover:bg-base-300"
        title="Back to contacts"
      >
        <ArrowLeft className="size-5" />
      </button>

      <div className="relative shrink-0">
        <Avatar user={selectedUser} className="size-10 text-sm" />
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-base-100" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold truncate leading-tight">{selectedUser.fullName}</h3>
        <p className="text-xs text-base-content/45">
          {isTyping ? "typing..." : isOnline ? "Active now" : "Offline"}
        </p>
      </div>

      {/* Close button - desktop only */}
      <button
        onClick={() => setSelectedUser(null)}
        className="hidden md:flex size-9 rounded-xl items-center justify-center text-base-content/50 hover:bg-base-300 hover:text-base-content"
        title="Close chat"
      >
        <X className="size-5" />
      </button>
    </header>
  );
};

export default ChatHeader;
