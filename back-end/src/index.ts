import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { postRouter } from "../routes/postRouter";
import morgan from "morgan";
import cors from "cors";

import cookieParser from "cookie-parser";
import { globalErrorHandler } from "../controller/errorController";
import { userRouter } from "../routes/userRouter";

export interface customRequestOptions extends Request {
  user?: any;
}
export type ExpressBasic = {
  req: Request;
  res: Response;
  next: NextFunction;
};

dotenv.config();

export const app = express();
// const corsOptions = {
//   methods: ["GET", "POST"], // Allow GET and POST requests
//   allowedHeaders: [
//     "set-cookie",
//     "Content-Type",
//     "Access-Control-Allow-Origin",
//     "Access-Control-Allow-Credentials",
//   ],
//   exposedHeaders: ["Content-Length"], // Expose this custom header
//   credentials: true, // Allow credentials (cookies, HTTP authentication)
//   preflightContinue: false, // Do not continue if preflight request fails
// };
app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
  }),
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");

  next();
});

app.options("*", cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" })); //It parses incoming requests with URL-encoded payloads and is based on a body parser.this is for form
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);
