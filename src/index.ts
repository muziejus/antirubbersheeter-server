import dotenv from "dotenv";
import express from "express";
const app = express();

dotenv.config();

const port = process.env.SERVER_PORT;

app.get("/", (_, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
