import Router from "express";

import { isAuthenticated } from "../middlewares/auth-middleware";
import {
  getChats,
  createChat,
  deleteChat,
  updateChat,
} from "../controllers/chats-controller";

const chatsRouter = Router();

chatsRouter.get("/", isAuthenticated, getChats);
chatsRouter.post("/", isAuthenticated, createChat);
chatsRouter.delete("/", isAuthenticated, deleteChat);
chatsRouter.put("/", isAuthenticated, updateChat);

export default chatsRouter;
