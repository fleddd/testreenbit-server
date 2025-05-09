import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Successfuly conected to MongoDb - " + conn.connection.host);
  } catch (e) {
    console.error(e);
  }
};
