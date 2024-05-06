import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
function handleCastErrorDB(error: any) {
  console.log(error);
  const message = ` invalid ${error.path}: ${error.value}`;
  return AppError(message, 401);
}
function handleDuplicateData(error: any) {
  console.log(error, "here");
  const value = Object.values(error.keyValue)[0]; //this will work with any duplicate value
  const message = `Duplicate field value: ${value}. Use another value.`;
  return AppError(message, 400);
}
function handleValidationErrorDB(err: any) {
  console.log(err);
  const error = Object.values(err.errors).map((val: any) => val.message);
  const message = `invalid input data ${error.join(", ")}`;
  return AppError(message, 400);
}
function handleJsonWebTokenErrorDB() {
  return AppError("Something when wrong ,please log in again ", 401);
}
const sendErrorDev = (req: Request, res: Response, err: any) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      err: err,
      message: err.message,
      errorStack: err.stack,
    });
  }
};

const sendErrorProd = (req: Request, res: Response, err: any) => {
  //this for api
  if (req.originalUrl.startsWith("/api")) {
    //operational error ,trusted error :send message to client
    if (err.isOperational) {
      // part II then this will run
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        test: "hello world",
      });
    }
    //this is programing or other unknow error : dont leak error detail
    //this is like  the mongoose error
    return res.status(500).json({
      status: "error",
      message: "something when wrong",
    });
  }
  //this for render website
};
export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(req, res, err);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message; //add the message to the error
    //let error = Object.create(err);
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateData(error);
    }
    if (error.name === "handleValidationErrorDB") {
      error = handleValidationErrorDB(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJsonWebTokenErrorDB();
    }
    sendErrorProd(req, res, err);
  }
}
