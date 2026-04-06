import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { formatUser } from "../utils/formatUser.js";
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import imagekit from "../lib/imagekit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resumeParserScript = path.resolve(
  __dirname,
  "../../../ml_models/resume-parser/parse_cli.py"
);

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

const runResumeParser = (resumeSource) => {
  const command = process.env.PYTHON_BIN || "python3";
  const result = spawnSync(command, [resumeParserScript, resumeSource], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  const output = (result.stdout || "").trim();

  if (!output) {
    throw new Error(result.stderr?.trim() || "Resume parser returned no output");
  }

  let parsedOutput;
  try {
    parsedOutput = JSON.parse(output);
  } catch {
    throw new Error("Resume parser returned invalid JSON");
  }

  if (parsedOutput?.error) {
    throw new Error(parsedOutput.error);
  }

  return parsedOutput;
};

// ================= SIGNUP =================
export async function signup(req, res) {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create({ email, password, fullName });

    generateToken(res, newUser._id);

    res.status(201).json({
      success: true,
      user: formatUser(newUser),
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ================= LOGIN =================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(res, user._id);

    res.status(200).json({
      success: true,
      user: formatUser(user),
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ================= ONBOARD USER =================
export async function onboard(req, res) {
  try {
    const {
      userId,
      education = "",
      role = "",
      skills = [],
      goal = "",
      parsedResume = {},
      resumeUrl = "",
    } = req.body;

    const targetUserId = req.user?._id || userId;

    if (!targetUserId) {
      return res.status(400).json({ message: "User id is required" });
    }

    const parsedResumeData = parsedResume && typeof parsedResume === "object"
      ? parsedResume
      : {};

    const finalResumeUrl = parsedResumeData.resumeUrl || resumeUrl || "";

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      {
        onboardingData: {
          education,
          role,
          skills: normalizeSkills(skills),
          goal,
        },
        parsedResume: {
          ...parsedResumeData,
          resumeUrl: finalResumeUrl,
        },
        isOnboarded: true,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: formatUser(updatedUser),
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ================= PARSE RESUME =================
export async function parseResume(req, res) {
  const file = req.file;

  if (!file?.buffer) {
    return res.status(400).json({ message: "Resume file is required" });
  }

  try {
    const uploadResult = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "/prostack/resumes",
      useUniqueFileName: true,
    });

    const parsed = runResumeParser(uploadResult.url);

    const parsedWithUrl = {
      ...parsed,
      resumeUrl: uploadResult.url,
      imagekitFileId: uploadResult.fileId,
    };

    res.status(200).json({
      success: true,
      parsed: parsedWithUrl,
      resumeUrl: uploadResult.url,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || "Failed to parse resume",
    });
  }
}

// ================= LOGOUT =================
export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true });
}

// ================= GET CURRENT USER =================
export async function getMe(req, res) {
  try {
    res.json({
      success: true,
      user: formatUser(req.user),
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
