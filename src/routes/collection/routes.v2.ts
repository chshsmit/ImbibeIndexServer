import express from "express";
import { protectV2 } from "../../middleware/auth";
import { createCollection } from "./controller.v2";

const router = express.Router();

// Creating a new collection
router.post("/", protectV2, createCollection);

export default router;
