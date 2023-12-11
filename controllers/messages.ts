import { Request, Response } from "express";
import Message from "../models/message";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find();
    if (!messages) {
      res.status(404).json({ message: "No messages found" });
    } else {
      res.status(200).json({ message: "Messages found", messages: messages });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const message = await Message.findById(id);
    if (!message) {
      res.status(404).json({ message: "Message not found" });
    } else {
      res.status(200).json({ message: "Message found", text: message });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const saveMessage = async (req: Request, res: Response) => {
  try {
    const { user, content, room } = req.body;
    const message = await Message.create({ user, content, room });
    if (!message) {
      res.status(404).json({ message: "Message not saved" });
    } else {
      res.status(200).json({ message: "Message saved", text: message });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { id, content } = req.body;
    const message = await Message.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    if (!message) {
      res.status(404).json({ message: "Message not updated" });
    } else {
      res.status(200).json({ message: "Message updated", text: message });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      res.status(404).json({ message: "Message not deleted" });
    } else {
      res.status(200).json({ message: "Message deleted", text: message });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
