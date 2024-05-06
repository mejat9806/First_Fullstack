import mongoose, { Document, Model, Schema, Types } from "mongoose";

interface PostType extends Document {
  title: string;
  subtitles?: string;
  content: string;
  createdAt: Date;
  image: string[];
  like?: number;
  user: Types.ObjectId;
}

const postSchema: Schema<PostType> = new mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: [50, "Title must be less than 50 characters"],
      required: true,
    },
    subtitles: {
      type: String,
      maxLength: [1000, "Subtitles must be less than 1000 characters"],
    },
    content: {
      type: String,
      maxLength: [1000, "Content must be less than 1000 characters"],
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    image: [String],
    like: { type: Number },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must have a User"],
    },
  },
  {
    // Options object for virtual properties
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

//Define pre middleware for population
postSchema.pre<PostType>(/^find/, function (next) {
  this.populate({ path: "user", select: "name photo" });
  next();
});

export const Post: Model<PostType> = mongoose.model<PostType>(
  "Post",
  postSchema,
);
