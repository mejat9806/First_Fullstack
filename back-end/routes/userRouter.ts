import express from "express";
import { getUser, signIn, signUp } from "../controller/authController";

export const userRouter = express.Router();

userRouter.route("/").post(signUp);

userRouter.get("/profile", getUser);
userRouter.post("/login", signIn);
