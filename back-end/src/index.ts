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

const corsOptions = {
  origin: ["https://127.0.0.1:4000", "https://localhost:5173"],
  methods: ["GET", "POST"], // Allow GET and POST requests
  allowedHeaders: [
    "Content-Type", // Include Content-Type header
    "set-cookie",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
  ],
  exposedHeaders: ["Content-Length"], // Expose this custom header
  credentials: true, // Allow credentials (cookies, HTTP authentication)
  preflightContinue: false, // Do not continue if preflight request fails
};

app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
//   next();
// });
app.options("*", cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" })); //It parses incoming requests with URL-encoded payloads and is based on a body parser.this is for form
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);
