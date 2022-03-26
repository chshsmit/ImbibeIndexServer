import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import authenticationRouter from "./routes/authentication";
import { AppDataSource } from "./utils/Database";

const PORT = 5000;
const app = express();

//------------------------------------------------------------------------------------
// Middlewares
//------------------------------------------------------------------------------------

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

//------------------------------------------------------------------------------------
// Routes
//------------------------------------------------------------------------------------

app.use("/auth", authenticationRouter);

//------------------------------------------------------------------------------------
// Initialization of app
//------------------------------------------------------------------------------------

// We want to initialize the db connection then run the app
AppDataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
  });
});
