import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authControllers";

const authRouter = Router();

authRouter.route("/login").post(loginUser);
authRouter.route("/register").post(registerUser);

export default authRouter;
