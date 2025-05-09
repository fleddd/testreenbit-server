import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface IMessage extends Document {
  id: string;
  text: string;
  senderId: string;
  chatId: string;
  createdAt?: Date; // Optional because Mongoose adds it automatically
  updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: { type: String, required: true },
    text: { type: String, required: true },
    senderId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
