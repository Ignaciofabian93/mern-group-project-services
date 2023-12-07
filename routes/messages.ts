import { Router } from "express";

const messages = Router();

messages.route("/").get();

export default messages;
