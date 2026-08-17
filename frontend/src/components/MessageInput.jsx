import { useRef, useState, useCallback } from "react";
import { Loader2, Paperclip, Send, X } from "lucide-react";
import toast from "react-hot-toast";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { MAX_IMAGE_SIZE_MB } from "../constants";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();

  const emitTyping = useCallback(() => {
    if (!socket || !selectedUser) return;
    socket.emit("typing", { receiverId: selectedUser._id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 1500);
  }, [socket, selectedUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (socket && selectedUser) socket.emit("stopTyping", { receiverId: selectedUser._id });
    clearTimeout(typingTimeoutRef.current);

    try {
      setIsSending(true);
      await sendMessage({ text: text.trim(), image: imagePreview });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      // The store already showed a toast. Keep the draft so nothing is lost.
    } finally {
      setIsSending(false);
    }
  };

  const canSend = Boolean(text.trim() || imagePreview) && !isSending;

  return (
    <div className="shrink-0 p-3 sm:p-4 bg-base-100 border-t border-base-300">
      {imagePreview && (
        <div className="relative w-20 mb-3">
          <img src={imagePreview} alt="Preview" className="size-20 object-cover rounded-xl" />
          <button
            type="button"
            onClick={removeImage}
            disabled={isSending}
            className="absolute -top-2 -right-2 size-5 rounded-full bg-base-300 hover:bg-error hover:text-white
              flex items-center justify-center disabled:opacity-50"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending}
          title="Attach image"
          className={`size-11 shrink-0 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50
            ${imagePreview ? "text-primary bg-primary/15" : "text-base-content/50 hover:bg-base-300 hover:text-base-content"}`}
        >
          <Paperclip className="size-5" />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            emitTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 h-11 px-4 rounded-xl bg-base-200 border border-base-300 text-sm
            placeholder:text-base-content/40 focus:outline-none focus:border-primary/60"
        />

        <button
          type="submit"
          disabled={!canSend}
          title="Send message"
          className={`size-11 shrink-0 rounded-xl flex items-center justify-center transition-colors
            ${canSend
              ? "bg-primary text-primary-content hover:opacity-90"
              : "bg-base-300 text-base-content/30 cursor-not-allowed"}`}
        >
          {isSending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
