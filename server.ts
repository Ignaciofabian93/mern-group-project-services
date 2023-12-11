import express, { Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { config } from "dotenv";
import user from "./routes/user";
import room from "./routes/room";
import connectDB from "./config/connectDb";

config();
const PORT = process.env.PORT || 8081;

connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Ok" });
});
app.use("/api", user);
app.use("/api", room);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["chat-app"],
    credentials: true,
  },
});

interface User {
  id: string;
  username: string;
}

interface Rooms {
  [roomName: string]: User[];
}

const rooms: Rooms = {}; // Se crea el objeto de rooms
io.on("connection", (socket: Socket) => {
  console.log("Socket conectado");

  socket.on("joinRoom", (roomName: string, username: string) => {
    console.log("socket data: ", roomName, username);
    // Crea el room si no existe
    if (!rooms[roomName]) {
      rooms[roomName] = [];
    }

    // Unirse al room
    socket.join(roomName);
    rooms[roomName].push({ id: socket.id, username });

    // Notica a los demás usuarios del usuario que acaba de entrar
    io.to(roomName).emit("userJoined", { username, users: rooms[roomName] });

    // Envía mensaje de bienvenida al usuario ingresado
    socket.emit("message", {
      username: "Server",
      text: `Bienvenido al chat ${roomName}!`,
    });
  });

  // Controla el envío de mensajes
  socket.on("sendMessage", (roomName: string, message: string) => {
    io.to(roomName).emit("message", {
      username: socket.id,
      text: message,
    });
  });

  // Controla la desconexión
  socket.on("disconnect", () => {
    console.log("User disconnected");

    // Encuentra y elimina a los usuarios del room
    Object.keys(rooms).forEach((roomName) => {
      rooms[roomName] = rooms[roomName].filter((user) => user.id !== socket.id);
      io.to(roomName).emit("userLeft", {
        id: socket.id,
        users: rooms[roomName],
      });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});
