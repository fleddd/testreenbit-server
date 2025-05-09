import { Chat, IChat } from "../models/chat-model";
import { Request, Response } from "express";
import { Message } from "../models/message-model";

export const getChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find({ membersId: req.user?.googleId });

    const response = await Promise.all(
      chats.map(async (chat: IChat) => {
        const lastMsg = await Message.findOne({ chatId: chat._id })
          .sort({ createdAt: -1 })
          .lean();

        return {
          chatId: String(chat._id),
          displayName: chat.displayName,
          lastMessageText: lastMsg?.text,
          lastMessageDate: lastMsg?.createdAt,
          avatar: chat.avatar || process.env.DEFAULT_AVATAR_URL || "",
          membersId: chat.membersId,
        };
      })
    );

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const createChat = async (req: Request, res: Response) => {
  const { displayName, membersId } = req.body;
  if (!displayName || !Array.isArray(membersId) || membersId.length === 0) {
    res.status(400).json({
      error: "Display name and a non-empty members ID array are required",
    });
    return;
  }

  try {
    const newChat = new Chat({
      displayName,
      membersId,
      lastMessageText: " ",
      lastMessageDate: " ",
      avatar: process.env.DEFAULT_AVATAR_URL || "",
    });

    await newChat.save();
    res.status(201).json({
      chatId: newChat._id,
      displayName: newChat.displayName,
      membersId: newChat.membersId,
      lastMessageText: newChat.lastMessageText,
      lastMessageDate: newChat.lastMessageDate,
      avatar: newChat.avatar,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  const { chatId } = req.body;
  try {
    await Chat.findOneAndDelete(chatId);
    await Message.deleteMany({ chatId });
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete chat" });
  }
};

export const updateChat = async (req: Request, res: Response) => {
  const { displayName, chatId } = req.body;
  if (!displayName || !chatId) {
    res.status(400).json({ error: "Display name and chat ID are required" });
    return;
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { displayName },
      { new: true }
    );

    if (!updatedChat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ error: "Failed to update chat" });
  }
};
