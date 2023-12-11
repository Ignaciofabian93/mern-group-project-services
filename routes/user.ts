import { Router } from "express";
import { registerUser, getUsers, getUser } from "../controllers/user";

const user = Router();

user.route("/register").post(registerUser);
user.route("/users").get(getUsers);
user.route("/users/:id").get(getUser);

export default user;
