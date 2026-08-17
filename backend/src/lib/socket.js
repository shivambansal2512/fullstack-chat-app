import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// One person can have the app open in several tabs or on two devices, so each
// user id holds a set of socket ids. Storing a single id meant that closing one
// tab marked them offline everywhere, even with other tabs still connected.
const userSockets = new Map(); // userId -> Set of socketIds

function addUserSocket(userId, socketId) {
  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId).add(socketId);
}

function removeUserSocket(userId, socketId) {
  const sockets = userSockets.get(userId);
  if (!sockets) return;

  sockets.delete(socketId);
  // Only offline once the last tab is gone.
  if (sockets.size === 0) userSockets.delete(userId);
}

export function getOnlineUserIds() {
  return [...userSockets.keys()];
}

/** Sends an event to every tab the given user has open. */
export function emitToUser(userId, event, payload) {
  const sockets = userSockets.get(String(userId));
  if (!sockets) return;

  for (const socketId of sockets) {
    io.to(socketId).emit(event, payload);
  }
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    addUserSocket(userId, socket.id);
    io.emit("getOnlineUsers", getOnlineUserIds());
  }

  socket.on("typing", ({ receiverId }) => {
    emitToUser(receiverId, "typing", { senderId: userId });
  });

  socket.on("stopTyping", ({ receiverId }) => {
    emitToUser(receiverId, "stopTyping", { senderId: userId });
  });

  socket.on("disconnect", () => {
    if (!userId) return;

    removeUserSocket(userId, socket.id);
    io.emit("getOnlineUsers", getOnlineUserIds());
  });
});

export { io, app, server };
