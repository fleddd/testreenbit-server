import { Request, Response } from "express";
import { Message } from "../models/message-model";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.query; // Extract chatId from query parameters
    if (!chatId) {
      res.status(400).json({ message: "chatId is required" });
      return;
    }

    const findMessages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .lean();

    const messages = findMessages.map((message) => ({
      text: message.text,
      chatId: message.chatId,
      senderId: message.senderId,
      time: message.createdAt,
      id: message._id,
    }));

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text, chatId, senderId } = req.body;
    if (!text || !chatId || !senderId) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const newMessage = new Message({
      senderId: senderId,
      text,
      chatId: chatId,
    });
    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Coulnd't send message." });
    return;
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.body;

    if (!messageId) {
      res.status(400).json({ message: "Message ID is required." });
      return;
    }

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({ message: "Message not found." });
      return;
    }

    await Message.deleteOne({ _id: messageId });

    res
      .status(200)
      .json({ message: "Message deleted successfully.", messageId });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const editMessage = async (req: Request, res: Response) => {
  try {
    const { messageId, newText } = req.body;
    if (!messageId || !newText) {
      res.status(400).send({ errorMsg: "Some required fields are empty!" });
      return;
    }
    const editedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        text: newText,
      },
      { new: true }
    );
    res.status(200).json(editedMessage);
  } catch (error) {
    console.error("editMessage error in message controller");
    res.status(500).send({
      errorMsg: "Internal server error.",
    });
  }
};
