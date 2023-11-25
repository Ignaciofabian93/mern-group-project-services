import express from "express";
import cors from "cors";
import { config } from "dotenv";

import authRouter from "./routes/authRoutes";

import connectDB from "./config/connectDb";
config();

const PORT = process.env.PORT || 4000;
connectDB();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);

console.log("logeando alguna cosa");
console.log("Carlos");


app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
