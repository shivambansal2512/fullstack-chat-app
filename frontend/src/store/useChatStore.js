import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUsers: [], // ids of everyone currently typing to us

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      // Rethrow so MessageInput knows it failed and can keep the user's draft.
      throw error;
    }
  },

  markMessagesRead: async (userId) => {
    try {
      await axiosInstance.put(`/messages/read/${userId}`);
      set({
        messages: get().messages.map((m) =>
          m.senderId === userId ? { ...m, read: true } : m
        ),
      });
    } catch (error) {
      console.error("Error marking messages read:", error);
    }
  },

  // Subscribed once for the whole app, not per open chat. The handlers read
  // selectedUser through get() so they stay correct when the user switches chats.
  subscribeToChatEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      if (!selectedUser || newMessage.senderId !== selectedUser._id) return;

      set({ messages: [...get().messages, newMessage] });

      // We are looking at this chat right now, so mark it read immediately.
      // Without this the sender's tick stays on "Sent" until we reopen the chat.
      get().markMessagesRead(selectedUser._id);
    });

    socket.on("typing", ({ senderId }) => {
      const { typingUsers } = get();
      if (typingUsers.includes(senderId)) return;
      set({ typingUsers: [...typingUsers, senderId] });
    });

    socket.on("stopTyping", ({ senderId }) => {
      set({ typingUsers: get().typingUsers.filter((id) => id !== senderId) });
    });

    socket.on("messagesRead", ({ by }) => {
      // Only the messages we sent to that person turn into double ticks.
      set({
        messages: get().messages.map((m) => (m.senderId === by ? m : { ...m, read: true })),
      });
    });
  },

  unsubscribeFromChatEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("typing");
    socket.off("stopTyping");
    socket.off("messagesRead");
    set({ typingUsers: [] });
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
