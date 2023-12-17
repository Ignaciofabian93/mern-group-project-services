import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String },
});

const MessageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: [ContentSchema],
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
