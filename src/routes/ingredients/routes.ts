import express from "express";
import protect from "../../middleware/auth";
import { createIngredient } from "./controller";
const router = express.Router();

router.post("/", protect, createIngredient);

export default router;
