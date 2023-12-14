import express, { Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { config } from "dotenv";
import user from "./routes/user";
import room from "./routes/room";
import messages from "./routes/messages";
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
app.use("/api", messages);

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
  room: string;
}

interface Rooms {
  [roomName: string]: User[];
}

interface RoomCounts {
  [roomName: string]: number;
}

const rooms: Rooms = {}; // Se crea el objeto de rooms
const roomCounts: RoomCounts = {}; // Se crea el objeto de roomCounts
io.on("connection", (socket: Socket) => {
  console.log("Socket conectado");

  socket.on("joinRoom", (roomName: string, username: string) => {
    // Crea el room si no existe
    if (!rooms[roomName]) {
      rooms[roomName] = [];
    }

    // Unirse al room
    socket.join(roomName);
    rooms[roomName].push({ id: socket.id, username, room: roomName });

    // Notica a los demás usuarios del usuario que acaba de entrar
    io.to(roomName).emit("userJoined", { username, users: rooms[roomName] });

    // Envía mensaje de bienvenida al usuario ingresado
    socket.emit("message", {
      username: "Servidor",
      text: `Bienvenido al chat ${roomName}!`,
    });

    roomCounts[roomName] = rooms[roomName].length;

    // Notifica a los usuarios del room los usuarios conectados
    io.to(roomName).emit("activeUsers", { room: roomName, count: roomCounts });
  });

  // Controla el envío de mensajes
  socket.on(
    "sendMessage",
    (roomName: string, message: string, username: string) => {
      io.to(roomName).emit("message", {
        username,
        text: message,
      });
    }
  );

  // Controla el envío de imágenes
  socket.on(
    "sendImage",
    (roomName: string, imageData: string, username: string) => {
      io.to(roomName).emit("message", {
        username,
        text: "Envío una imagen",
        image: imageData, // You can pass the image data to the client
      });
    }
  );

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

      roomCounts[roomName] = rooms[roomName].length;

      // Notifica a los usuarios del room los usuarios que quedan conectados.
      io.to(roomName).emit("activeUsers", {
        room: roomName,
        count: roomCounts,
      });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});
