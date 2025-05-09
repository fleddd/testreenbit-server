import express from "express";
import helmet from "helmet";
import cookieparser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter, chatsRouter, messageRouter } from "./routes";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDb } from "./config/db";
import "./config/passport";
import { app, server } from "./config/socket";

dotenv.config();

app.use(express.json());
connectDb();

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI as string,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL_ORIGIN,
    credentials: true,
  })
);

app.use(helmet());
app.use(cookieparser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/message", messageRouter);

server.listen(process.env.PORT || 3030, () => {
  console.log("server started on port " + process.env.PORT);
});
