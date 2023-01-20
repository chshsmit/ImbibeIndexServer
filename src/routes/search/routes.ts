import express from "express";
import { searchRecipes } from "./controller";

const router = express.Router();

//--------------------------------------------------------------------------------

router.get("/", searchRecipes);

//--------------------------------------------------------------------------------

export default router;
