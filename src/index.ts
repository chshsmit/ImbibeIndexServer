import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import UserRouter from "./routes/user/routes";
import RecipeRouter from "./routes/recipe/routes";
import CollectionRouter from "./routes/collection/routes";
import TagRouter from "./routes/tags/routes";
import IngredientRouter from "./routes/ingredients/routes";
import TakeRouter from "./routes/takes/routes";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import errorHandler from "./middleware/errorHandler";
import cors from "cors";

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 5500;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use("/user", UserRouter);
app.use("/recipe", RecipeRouter);
app.use("/collection", CollectionRouter);
app.use("/tags", TagRouter);
app.use("/ingredients", IngredientRouter);
app.use("/takes", TakeRouter);

app.use(errorHandler);

console.log(process.env.NODE_ENV);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_DB_CONNECTION_URI!).then(() => {
  console.log("We are connected");
});
