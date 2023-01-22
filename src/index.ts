import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import errorHandler from "./middleware/errorHandler";
import CollectionRouter from "./routes/collection/routes";
import IngredientRouter from "./routes/ingredients/routes";
import IngredientRouterV2 from "./routes/ingredients/routes.v2";
import RecipeRouter from "./routes/recipe/routes";
import SearchRouter from "./routes/search/routes";
import TagRouter from "./routes/tags/routes";
import TagRouterV2 from "./routes/tags/routes.v2";
import TakeRouter from "./routes/takes/routes";
import UserRouter from "./routes/user/routes";
import UserRouterV2 from "./routes/user/routes.v2";

import CollectionRouterV2 from "./routes/collection/routes.v2";

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
app.use("/search", SearchRouter);

// V2
app.use("/v2/user", UserRouterV2);
// Recipe placeholder
app.use("/v2/collection", CollectionRouterV2);
app.use("/v2/tags", TagRouterV2);
app.use("/v2/ingredients", IngredientRouterV2);
// Take placeholder
// Search placeholder

app.use(errorHandler);

console.log(process.env.NODE_ENV);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_DB_CONNECTION_URI!).then(() => {
  console.log("We are connected");
});
