import { generateToken } from "../utils/generateToken.js";
import { formatUser } from "../utils/formatUser.js";

import {
  createUser,
  loginUser,
  resendVerificationEmail,
  verifyEmailToken,
} from "../services/auth.service.js";
import { onboardUserService } from "../services/user.service.js";
import { parseResumeService } from "../services/resume.service.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    await createUser(req.body);

    res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email to continue.",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    await verifyEmailToken(token);

    res.json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);

    generateToken(res, user._id);

    res.json({
      success: true,
      user: formatUser(user),
    });
  } catch (err) {
    res.status(err.statusCode || 401).json({
      message: err.message,
      code: err.code,
    });
  }
};

// RESEND VERIFICATION EMAIL
export const resendVerification = async (req, res) => {
  try {
    const result = await resendVerificationEmail(req.body.email);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ONBOARD
export const onboard = async (req, res) => {
  try {
    const user = await onboardUserService(req.body, req.user?._id);

    res.json({
      success: true,
      user: formatUser(user),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PARSE RESUME
export const parseResume = async (req, res) => {
  if (!req.file?.buffer) {
    return res.status(400).json({ message: "Resume required" });
  }

  try {
    const result = await parseResumeService(req.file);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ success: true });
};

// GET ME
export const getMe = (req, res) => {
  res.json({
    success: true,
    user: formatUser(req.user),
  });
};