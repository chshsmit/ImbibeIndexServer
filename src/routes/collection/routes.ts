import express from "express";
import protect from "../../middleware/auth";
import { createCollection } from "./controller";

const router = express.Router();

// Creating a new collection
router.post("/", protect, createCollection);

export default router;
