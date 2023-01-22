import express from "express";
import { protectV2 } from "../../middleware/auth";
import { createCollection, getRootCollectionForUser } from "./controller.v2";

const router = express.Router();

// Creating a new collection
router.post("/", protectV2, createCollection);

// Getting collection for specific user
router.get("/user", protectV2, getRootCollectionForUser);

export default router;
