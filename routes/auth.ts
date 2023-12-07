import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth";

const auth = Router();

auth.route("/login").post(loginUser);
auth.route("/register").post(registerUser);

export default auth;
