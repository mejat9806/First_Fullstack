import mongoose from "mongoose";
import { app } from "./src";

const DB =
  process.env.MONGODB_URL?.replace(
    "<PASSWORD>",
    `${process.env.MONGODB_PASSWORD}`,
  ) ?? "";

async function conDB() {
  await mongoose
    .connect(DB)
    .then(() => console.log("Connected to database"))
    .catch((err) => err.message);
}
conDB();
const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(".... listening on port " + port);
});
