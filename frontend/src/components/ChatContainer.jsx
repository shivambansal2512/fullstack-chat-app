import { Fragment, useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";

import Avatar from "./Avatar";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, formatDateLabel, isSameDay } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    markMessagesRead,
    typingUsers,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const bottomRef = useRef(null);

  const isTyping = typingUsers.includes(selectedUser._id);

  useEffect(() => {
    getMessages(selectedUser._id);
    markMessagesRead(selectedUser._id);
  }, [selectedUser._id, getMessages, markMessagesRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="h-full w-full flex flex-col bg-base-200">
      <ChatHeader />

      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-base-content/40">
                No messages yet — say hi to {selectedUser.fullName.split(" ")[0]} 👋
              </p>
            </div>
          )}

          {messages.map((message, idx) => {
            const prev = messages[idx - 1];
            const next = messages[idx + 1];
            const isMine = message.senderId === authUser._id;

            // Show a date separator whenever the day changes.
            const showDate = !prev || !isSameDay(prev.createdAt, message.createdAt);

            // A "group" is a run of messages from the same person on the same day.
            const isFirstInGroup =
              showDate || prev.senderId !== message.senderId;
            const isLastInGroup =
              !next ||
              next.senderId !== message.senderId ||
              !isSameDay(next.createdAt, message.createdAt);

            return (
              <Fragment key={message._id}>
                {showDate && (
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-base-300" />
                    <span className="text-[11px] uppercase tracking-wider text-base-content/40">
                      {formatDateLabel(message.createdAt)}
                    </span>
                    <div className="flex-1 h-px bg-base-300" />
                  </div>
                )}

                <div
                  className={`
                    flex gap-2.5 animate-message-in
                    ${isMine ? "justify-end" : "justify-start"}
                    ${isFirstInGroup ? "mt-4" : "mt-1"}
                  `}
                >
                  {/* Avatar sits at the bottom of the other person's group */}
                  {!isMine && (
                    <div className="w-8 shrink-0 self-end">
                      {isLastInGroup && (
                        <Avatar user={selectedUser} className="size-8 text-[11px]" />
                      )}
                    </div>
                  )}

                  <div className={`max-w-[75%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                    <div
                      className={`
                        px-3.5 py-2 text-sm leading-relaxed rounded-2xl
                        ${isMine ? "bg-primary text-primary-content" : "bg-base-100 border border-base-300"}
                        ${isLastInGroup && (isMine ? "rounded-br-md" : "rounded-bl-md")}
                      `}
                    >
                      {message.image && (
                        <a href={message.image} target="_blank" rel="noopener noreferrer">
                          <img
                            src={message.image}
                            alt="Attachment"
                            className={`max-w-[240px] rounded-lg hover:opacity-90 transition-opacity
                              ${message.text ? "mb-1.5" : ""}`}
                          />
                        </a>
                      )}
                      {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}
                    </div>

                    {/* Time + ticks only on the last message of a group */}
                    {isLastInGroup && (
                      <div className="flex items-center gap-1 mt-1 px-1 text-[11px] text-base-content/40">
                        <time>{formatMessageTime(message.createdAt)}</time>
                        {isMine &&
                          (message.read ? (
                            <CheckCheck className="size-3.5 text-info" />
                          ) : (
                            <Check className="size-3.5" />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </Fragment>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5 mt-4 animate-message-in">
              <div className="w-8 shrink-0 self-end">
                <Avatar user={selectedUser} className="size-8 text-[11px]" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-base-100 border border-base-300 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-base-content/40 animate-bounce [animation-delay:0ms]" />
                <span className="size-1.5 rounded-full bg-base-content/40 animate-bounce [animation-delay:150ms]" />
                <span className="size-1.5 rounded-full bg-base-content/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
