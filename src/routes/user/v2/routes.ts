import express from "express";
import { registerUser } from "./controller";

const router = express.Router();

router.post("/test", registerUser);

export default router;
