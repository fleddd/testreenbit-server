import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
  avatar: string;
}

const UserSchema = new Schema<IUser>({
  googleId: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);
