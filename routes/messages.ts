import { Router } from "express";
import {
  getMessages,
  getMessage,
  saveMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/messages";

const messages = Router();

messages.route("/messages").get(getMessages).post(saveMessage);
messages
  .route("/messages/:id")
  .get(getMessage)
  .put(updateMessage)
  .delete(deleteMessage);

export default messages;
