import mongoose from "mongoose";
import { app } from "./src";
import https from "https";
import fs from "fs";

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

const port = process.env.PORT || 4000;
const httpsOptions = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};

const server = https.createServer(httpsOptions, app);
server.listen(port, () => {
  console.log(".... listening on port " + port);
});
