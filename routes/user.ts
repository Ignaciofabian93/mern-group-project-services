import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth";

const user = Router();

user.route("/login").post(loginUser);
user.route("/register").post(registerUser);
user.route("/users").get();
user.route("/users/:id").get();

export default user;
