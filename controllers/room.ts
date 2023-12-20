import { Request, Response } from "express";
import Room from "../models/room";

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find();
    if (!rooms) {
      res.status(400).json({ message: "Rooms not found" });
    } else {
      res.status(200).json({ message: "Rooms found", rooms: rooms });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      res.status(400).json({ message: "Room not found" });
    } else {
      res.status(200).json({ message: "Room found", room: room });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Name is required" });
    } else {
      const room = await Room.create({ name });
      if (!room) {
        res.status(400).json({ message: "Room not created" });
      } else {
        res.status(200).json({ message: "Room created", room: room });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { messages } = req.body;

    const checkRoom = await Room.findOne({ _id: id });
    if (!checkRoom) {
      res.status(400).json({ message: "Room not found" });
    }

    checkRoom.messages.push(...messages, {
      username: messages.username,
      text: messages.text,
      image: messages.image ? messages.image : null,
      date: messages.date,
    });

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { name: checkRoom.name, messages: checkRoom.messages },
      { new: true }
    );

    if (updatedRoom) {
      res.status(201).json({ message: "Room updated", room: updatedRoom });
    } else {
      res.status(404).json({ message: "Room not updated" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
