import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now },
});

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);

export default Room;
