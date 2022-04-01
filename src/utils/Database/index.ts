import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { CollectionEntry } from "../../model/CollectionEntry";
import { Recipe } from "../../model/Recipe";
import { TestModel } from "../../model/TestModel";
import { User } from "../../model/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_DB,
  synchronize: true,
  entities: [TestModel, User, CollectionEntry, Recipe],
});
