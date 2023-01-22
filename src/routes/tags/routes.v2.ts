import express from "express";
import { createTags, getTags } from "./controller.v2";
const router = express.Router();

// Create tags
router.post("/", createTags);

// Get tagss
router.get("/", getTags);

export default router;
