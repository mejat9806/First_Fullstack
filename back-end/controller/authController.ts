import { catchAsync } from "../utils/catchAsync";
import { User } from "../model/userModel";
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { promisify } from "util";
import { AppError } from "../utils/appError";
import { customRequestOptions } from "../src";
import { CookieParseOptions } from "cookie-parser";

const verifyToken = (token: string, secret: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      passwordConfirmed: req.body.password,
      role: req.body.role,
    });
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({ newUser }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      message: "User created successfully",
      data: newUser,
      token: token,
    });
  },
);

// export const signIn = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return next(AppError("please provide a valid email and password", 404));
//     }
//     const user = await User.findOne({ email: email }).select("+password");
//     if (!user) {
//       return next(AppError("please enter a valid email and password", 401));
//     }
//     if (!user || !(await user.correctPassword(password, user.password))) {
//       return next(AppError("please provide correct Email or password  ", 401));
//     }
//     const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
//       expiresIn: process.env.JWT_EXPIRES_IN,
//     });

//     const maxAge = process.env.JWT_COOKIES_EXPIRES_IN * 60 * 60 * 100000;

//     const cookiesOptions: CookieOptions = {
//       // expires: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000),
//       maxAge: maxAge,
//       secure: false,
//       httpOnly: false,
//       sameSite: "none",
//     };
//     res.cookie("jwt", token, cookiesOptions);

//     res.status(200).json({
//       message: " login success",
//       user,
//     });
//   },
// );

export const signIn = catchAsync(
  async (req: customRequestOptions, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(AppError("please provide a valid email and password", 404));
    }
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return next(AppError("please enter a valid email and password", 401));
    }
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(AppError("please provide correct Email or password  ", 401));
    }
    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: "10d",
    });

    const refreshToken = jwt.sign(
      { user },
      process.env.REFRESH_JWT_SECRET as string,
      { expiresIn: "1d" },
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true, //https
      sameSite: "none", //cross site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  },
);

export const refresh = (req: customRequestOptions, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(401).json({ message: "Unauthorized " });
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_JWT_SECRET as string,
    {},
    async (err: any, decode: any) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundUser = await User.findOne({ email: decode.email });
      if (!foundUser) return res.status(401).json({ message: "Unauthorized " });
      const accessToken = jwt.sign(
        foundUser,
        process.env.JWT_SECRET as string,
        { expiresIn: "10s" },
      );
      res.json({ accessToken });
    },
  );
};
export const logOut = (req: customRequestOptions, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(204);
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true, //https
    sameSite: "none", //cross site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ message: "send" });
};
export const protect = catchAsync(
  async (req: customRequestOptions, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    const decoded = await verifyToken(
      token as string,
      process.env.JWT_SECRET as string,
    );
    console.log(decoded.user._id);
    const currentUser = await User.findById(decoded.user._id);
    req.user = currentUser;
    next();
  },
);
export const getUser = catchAsync(
  async (req: customRequestOptions, res: Response, next: NextFunction) => {
    const { jwt: token } = req.cookies;
    console.log(token);

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET as string, {}, (err, user) => {
        if (err) throw err;
        res.json(user);
      });
    } else {
      res.json(null);
    }
  },
);
