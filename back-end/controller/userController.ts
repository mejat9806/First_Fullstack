import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { User } from "../model/userModel";

// export const createUser = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const data = req.body;
//     if (!data) {
//       return next(AppError("no data provided", 404));
//     }
//     const user = await User.create({
//       email: data.email,
//       name: data.name,
//       role: data.role,
//       password: data.password,
//       passwordConfirmed: data.passwordConfirmed,
//     });
//     res.status(200).json({
//       status: "success",
//       data: user,
//     });
//   },
// );
