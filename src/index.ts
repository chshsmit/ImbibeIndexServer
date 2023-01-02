import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import UserRouter from "./routes/user";
import mongoose from "mongoose";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5500;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use("/user", UserRouter);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_DB_CONNECTION_URI!).then(() => {
  console.log("We are connected");
});
