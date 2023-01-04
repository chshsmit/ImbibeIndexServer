import express from "express";
import protect from "../../middleware/auth";
import { createCollection, getRootCollectionForUser } from "./controller";

const router = express.Router();

// Creating a new collection
router.post("/", protect, createCollection);

// Getting collection for specific user
router.get("/user", protect, getRootCollectionForUser);

export default router;
