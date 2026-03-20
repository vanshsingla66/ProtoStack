import User from "../models/User.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= FILE UPLOAD SETUP =================
const parserUploadPath = path.resolve(__dirname, "../../tmp");

if (!fs.existsSync(parserUploadPath)) {
  fs.mkdirSync(parserUploadPath, { recursive: true });
}

export const upload = multer({ dest: parserUploadPath });

// ================= SIGNUP =================
export async function signup(req, res) {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    const token = jwt.sign(
      { userID: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      user: newUser,
      token,
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ================= LOGIN =================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userID: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      user,
      token,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ================= LOGOUT =================
export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

// ================= RESUME PARSER =================
export async function parseResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname.toLowerCase();

    // ✅ Python script path
    const pyScript = path.resolve(
      __dirname,
      "../../../ml_models/resume-parser/parse_cli.py"
    );

    // ✅ VENV Python path (MAIN FIX 🔥)
    const pythonPath = path.resolve(
      __dirname,
      "../../../ml_models/resume-parser/venv/bin/python"
    );

    // ✅ Check script exists
    if (!fs.existsSync(pyScript)) {
      console.error("Parser script not found:", pyScript);
      fs.unlink(filePath, () => {});
      return res.status(500).json({ message: "Parser script not found" });
    }

    // ✅ Check python exists
    if (!fs.existsSync(pythonPath)) {
      console.error("Venv Python not found:", pythonPath);
      fs.unlink(filePath, () => {});
      return res.status(500).json({ message: "Python environment not found" });
    }

    // ✅ Validate file type
    const fileType =
      originalName.endsWith(".pdf")
        ? "pdf"
        : originalName.endsWith(".docx")
        ? "docx"
        : null;

    if (!fileType) {
      fs.unlink(filePath, () => {});
      return res.status(400).json({
        message: "Only PDF and DOCX files are supported",
      });
    }

    // ✅ Run parser using venv python
    execFile(
      pythonPath,
      [pyScript, filePath],
      { timeout: 20000 },
      (err, stdout, stderr) => {
        // Safe delete
        fs.unlink(filePath, () => {});

        if (err) {
          console.error("Parser execution error:", err.message);
          console.error("stderr:", stderr);
          return res.status(500).json({
            message: "Resume parsing failed",
          });
        }

        try {
          const parsed = JSON.parse(stdout.trim());

          return res.status(200).json({
            success: true,
            parsed,
          });

        } catch (parseErr) {
          console.error("JSON parse error:", parseErr);
          console.error("stdout:", stdout);

          return res.status(500).json({
            message: "Parser did not return valid JSON",
          });
        }
      }
    );

  } catch (error) {
    console.error("parseResume error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ================= ONBOARD =================
export async function onboard(req, res) {
  try {
    const { userId, education, role, skills, goal, parsedResume } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isOnboarded = true;
    user.onboardingData = {
      education: education || "",
      role: role || "",
      skills: Array.isArray(skills) ? skills : [],
      goal: goal || "",
    };

    user.parsedResume = parsedResume || {};

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Onboard error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}