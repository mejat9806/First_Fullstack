import express, { Express, NextFunction, Request, Response } from "express";
import { Post } from "../model/postModel";
import { createPost, getAllPost } from "../controller/postController";
import { protect } from "../controller/authController";

export const postRouter = express.Router();

postRouter.route("/").get(getAllPost).post(createPost);
