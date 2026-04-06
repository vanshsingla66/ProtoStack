import express from "express";
import multer from "multer";
import {
  signup,
  login,
  logout,
  getMe,
  onboard,
  parseResume,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF and DOCX files are supported"));
    }

    cb(null, true);
  },
});

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/onboard", protect, onboard);
router.post("/parse-resume", upload.single("resume"), parseResume);

// protected route
router.get("/me", protect, getMe);

export default router;