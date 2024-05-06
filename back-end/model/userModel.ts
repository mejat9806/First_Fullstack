import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";

interface User {
  email: string;
  name: string;
  role: "user" | "dev" | "admin";
  password: string;
  passwordConfirmed: any;
  correctPassword(inputPassword: string, passFromDB: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: [validator.isEmail, "must be a valid email address"],
  },

  name: {
    type: String,
    required: [true, "name is required"],
  },
  role: {
    type: String,
    enum: ["user", "dev", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please enter password"],
    minLength: 8,
    select: false, //this is not show up when we fetch the user
  },
  passwordConfirmed: {
    type: String,
    required: [true, "please enter password again"],
    validate: {
      validator: function (this: User, el: string) {
        //this only works on CREATE/SAVE
        return el === this.password;
      },
      message: "passwords do not match ",
    },
  },
  active: { type: Boolean, default: true, select: false },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmed = undefined as unknown as string;
  next();
});

userSchema.methods.correctPassword = async function (
  inputPassword: string,
  passFromDB: string,
) {
  const result = await bcrypt.compare(inputPassword, passFromDB);
  return result;
};
export const User = mongoose.model<User>("User", userSchema);
