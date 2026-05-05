import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createInterviewSession, submitInterview } from "../controllers/interview.controller.js";

const router = express.Router();

router.get("/session", protect, createInterviewSession);
router.post("/analyze", protect, submitInterview);

export default router;