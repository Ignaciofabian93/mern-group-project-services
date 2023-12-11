import { Request, Response } from "express";
import { hash, compare, genSalt } from "bcrypt";
import { sign } from "jsonwebtoken";
import User from "../models/user";
import { firebaseAuth } from "../config/firebase";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      res.status(400).json({ message: "User not found" });
    } else {
      const match = await compare(password, checkUser.password);
      if (!match) {
        res.status(400).json({ message: "Invalid password" });
      } else {
        const token = sign({ id: checkUser._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).json({ message: "Login successful", token });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      res.status(401).json({ message: "Email already exists" });
    } else {
      //Guardar el usuario en firebase
      const saveInFirebase = await firebaseAuth.createUser({
        displayName: name,
        email: email,
        password: password,
        emailVerified: false,
        disabled: false,
      });
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      const user = User.create({
        uid: saveInFirebase.uid,
        name,
        email,
        password: hashedPassword,
      });
      if (!user) {
        res
          .status(401)
          .json({ message: "An error ocurred while creating user" });
      } else {
        res.status(201).json({ message: "User created successfully" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(401).json({ message: "Users not found" });
    } else {
      res.status(200).json({ users: users });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    const user = await User.findOne({ uid });
    if (!user) {
      res.status(401).json({ message: "User not found" });
    } else {
      res.status(200).json({ user: user });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
