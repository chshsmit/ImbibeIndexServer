import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import errorHandler from "./middleware/errorHandler";
import CollectionRouter from "./routes/collection/routes";
import FavoritesRouter from "./routes/favorites/routes";
import IngredientRouter from "./routes/ingredients/routes";
import RecipeRouter from "./routes/recipe/routes";
import SearchRouter from "./routes/search/routes";
import TagRouter from "./routes/tags/routes";
import TakeRouter from "./routes/takes/routes";
import UserRouter from "./routes/user/routes";

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
app.use("/favorites", FavoritesRouter);

app.use(errorHandler);
