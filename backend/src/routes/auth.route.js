import express from "express";
import {
  signup,
  login,
  logout,
  getMe
} from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// protected route
router.get("/me", protect, getMe);

export default router;