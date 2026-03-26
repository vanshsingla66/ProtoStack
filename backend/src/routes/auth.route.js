import express from "express";
import multer from "multer";
import { signup, login, logout, parseResume, onboard } from "../controllers/auth.controller.js";

const router = express.Router();
const upload = multer({ dest: "tmp" });

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/parse-resume", upload.single("resume"), parseResume);
router.post("/onboard", onboard);

export default router;