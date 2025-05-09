import { Socket } from "socket.io";
import { Message } from "../models/message-model";
import { Chat } from "../models/chat-model";

export async function getRandomQuote(): Promise<string> {
  try {
    const response = await fetch("https://zenquotes.io/api/random");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data[0].q;
  } catch (error) {
    console.error("Error fetching random quote:", error);
    throw new Error("Failed to fetch random quote");
  }
}

export const respondWithQuote = (
  socket: Socket,
  chatId: string,
  displayName: string,
  avatar: string
) => {
  setTimeout(async () => {
    try {
      const quote = await getRandomQuote();
      console.log(chatId);
      const newMessage = new Message({
        senderId: socket.id,
        text: quote,
        chatId,
      });

      await newMessage.save();

      socket.emit(
        "receiveQuote",
        {
          text: newMessage.text,
          chatId: newMessage.chatId,
          senderId: newMessage.senderId,
          time: newMessage.createdAt,
        },
        displayName,
        avatar
      );
    } catch (error) {
      console.error("Error sending quote:", error);

      socket.emit("receiveQuote", "Failed to fetch a quote. Please try again.");
    }
  }, 3000);
};

export const sendRandomQuoteToRandomChat = async (socket: Socket) => {
  try {
    const randomChat = await Chat.aggregate([{ $sample: { size: 1 } }]);
    if (!randomChat.length) {
      console.error("No chats found.");
      return;
    }
    const chat = randomChat[0];
    const quote = await getRandomQuote();
    const newMessage = new Message({
      senderId: socket.id,
      text: quote,
      chatId: chat._id,
    });
    await newMessage.save();
    socket.emit(
      "receiveQuote",
      {
        text: newMessage.text,
        chatId: newMessage.chatId,
        senderId: newMessage.senderId,
        time: newMessage.createdAt,
      },
      chat.displayName,
      chat.avatar
    );
  } catch (error) {
    console.error("Error sending random quote to random chat:", error);
  }
};
