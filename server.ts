import express, { Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";

import auth from "./routes/auth";

import Message from "./models/message";

import connectDB from "./config/connectDb";
config();

const PORT = process.env.PORT || 8081;
connectDB();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", auth);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Ok" });
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["chat-app"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("message", async (message) => {
    console.log("message: ", message);
    // const newMessage = await Message.create({
    //   user: message.userId,
    //   content: message.content,
    // });
    io.emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});
