import express from "express";
import { createTags, getTags } from "./controller";
const router = express.Router();

// Create tags
router.post("/", createTags);

router.get("/", getTags);

export default router;
