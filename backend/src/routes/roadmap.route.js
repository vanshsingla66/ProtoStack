import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateRoadmap, listRoadmaps, getRoadmap, deleteRoadmap } from "../controllers/roadmap.controller.js";

const router = express.Router();

// Protected endpoints
router.post("/generate", protect, generateRoadmap);
router.get("/", protect, listRoadmaps);
router.get("/:id", protect, getRoadmap);
router.delete("/:id", protect, deleteRoadmap);

export default router;
