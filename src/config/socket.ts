import express from "express";
import http from "http";
import { Types } from "mongoose";
import { Server } from "socket.io";
import { respondWithQuote, sendRandomQuoteToRandomChat } from "./quote";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

type ObjectType = {
  userId?: string;
};

const userSocketMap: ObjectType = {};
const userToggleMap: Record<string, NodeJS.Timeout | null> = {};

export const getReceiverSocketId = (userId: string | Types.ObjectId) =>
  userSocketMap[userId as keyof ObjectType];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on(
    "requestQuote",
    (chatId: string, displayName: string, avatar: string) => {
      respondWithQuote(socket, chatId, displayName, avatar);
    }
  );

  socket.on("toggleRandomQuotes", (isEnabled: boolean) => {
    if (isEnabled) {
      userToggleMap[socket.id] = setInterval(() => {
        sendRandomQuoteToRandomChat(socket);
      }, 20000);
    } else {
      if (userToggleMap[socket.id]) {
        const intervalId = userToggleMap[socket.id];
        if (intervalId) {
          clearInterval(intervalId as NodeJS.Timeout);
        }
        userToggleMap[socket.id] = null;
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userToggleMap[socket.id]) {
      clearInterval(userToggleMap[socket.id] as NodeJS.Timeout);
      delete userToggleMap[socket.id];
    }
  });
});

export { app, io, server };
