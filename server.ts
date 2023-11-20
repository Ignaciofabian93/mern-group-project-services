import express from "express";
import cors from "cors";
import { config } from "dotenv";

import connectDB from "./config/connectDb";
config();

const PORT = process.env.PORT || 4000;
connectDB();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
