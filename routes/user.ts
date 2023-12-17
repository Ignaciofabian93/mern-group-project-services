import { Router } from "express";
import {
  registerUser,
  getUsers,
  getUser,
  updateUser,
} from "../controllers/user";

const user = Router();

user.route("/register").post(registerUser);
user.route("/users").get(getUsers);
user.route("/users/:id").get(getUser).put(updateUser);

export default user;
