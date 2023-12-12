import { Request, Response } from "express";
import Room from "../models/room";
import User from "../models/user";

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
    const { name, creator } = req.body;
    const user = await User.findOne({ uid: creator });
    if (!user) {
      res.status(401).json({ message: "User not found" });
    } else {
      const room = await Room.create({ name, creator: user._id });
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
