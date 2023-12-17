import { Router } from "express";
import { getRooms, getRoom, createRoom, updateRoom } from "../controllers/room";

const room = Router();

room.route("/rooms").get(getRooms).post(createRoom);
room.route("/rooms/:id").get(getRoom).put(updateRoom);

export default room;
