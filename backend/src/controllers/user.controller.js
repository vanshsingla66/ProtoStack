import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { formatUser } from "../utils/formatUser.js";

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

