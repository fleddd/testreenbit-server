import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChat extends Document {
  displayName: string;
  lastMessageText: string;
  lastMessageDate: string;
  avatar: string;
  membersId: string[];
}

const ChatSchema = new Schema<IChat>({
  displayName: { type: String, required: true },
  lastMessageText: { type: String, required: true },
  lastMessageDate: { type: String, required: true },
  avatar: { type: String, required: true },
  membersId: { type: [String], required: true },
});

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
