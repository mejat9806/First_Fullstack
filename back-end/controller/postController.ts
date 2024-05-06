import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Post } from "../model/postModel";
import { ExpressBasic, customRequestOptions } from "../src";

export const getAllPost = catchAsync(
  async (
    req: customRequestOptions,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    console.log(req.user, "here");
    const posts = await Post.find().populate({ path: "user" });
    res.status(200).json({
      message: "Success hello 22332",
      posts,
    });
  },
);
export const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postDataToSend = req.body;
    const post = await Post.create(postDataToSend);
    res.status(200).json({
      status: "Success",
      data: post,
    });
  },
);
