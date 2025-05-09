import Router from "express";

import { isAuthenticated } from "../middlewares/auth-middleware";
import {
  getMessages,
  sendMessage,
  deleteMessage,
  editMessage,
} from "../controllers/message-controller";

const messageRouter = Router();

messageRouter.get("/", isAuthenticated, getMessages);
messageRouter.post("/", isAuthenticated, sendMessage);
messageRouter.put("/", isAuthenticated, editMessage);
messageRouter.delete("/", isAuthenticated, deleteMessage);

export default messageRouter;
