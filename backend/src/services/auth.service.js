import User from "../models/User.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../lib/resend.js";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const createVerificationToken = () => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenHash = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  return {
    verificationToken,
    verificationTokenHash,
    verificationTokenExpiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
  };
};

const issueVerificationEmail = async (user) => {
  const {
    verificationToken,
    verificationTokenHash,
    verificationTokenExpiresAt,
  } = createVerificationToken();

  user.emailVerificationToken = verificationTokenHash;
  user.emailVerificationTokenExpiresAt = verificationTokenExpiresAt;

  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verificationUrl = `${frontendUrl}/signin?verifyToken=${verificationToken}`;

  await sendVerificationEmail({
    to: user.email,
    fullName: user.fullName,
    verificationUrl,
  });

  return verificationToken;
};

// ================= CREATE USER =================
export const createUser = async ({ email, password, fullName }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  let user = await User.findOne({ email: normalizedEmail });

  // 🔥 If user exists but NOT verified → resend instead of blocking
  if (user && !user.isEmailVerified) {
    await issueVerificationEmail(user);

    throw new Error("Verification email resent. Please check your inbox.");
  }

  // ❌ If verified user exists → block
  if (user && user.isEmailVerified) {
    throw new Error("Email already exists");
  }

  // ================= CREATE NEW USER =================
  user = await User.create({
    email: normalizedEmail,
    password,
    fullName,
    isEmailVerified: false,
  });

  try {
    await issueVerificationEmail(user);
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    await User.deleteOne({ _id: user._id });

    throw new Error("Unable to send verification email.");
  }

  return user;
};

// ================= RESEND VERIFICATION =================
export const resendVerificationEmail = async (email) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user || user.isEmailVerified) {
    return {
      message:
        "If your account exists and is unverified, a verification email has been sent.",
    };
  }

  await issueVerificationEmail(user);

  return {
    message: "Verification email resent. Please check your inbox.",
  };
};

// ================= LOGIN =================
export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid credentials");
  }

  if (!user.isEmailVerified) {
    const error = new Error("Please verify your email before logging in");
    error.statusCode = 403;
    error.code = "EMAIL_NOT_VERIFIED";
    throw error;
  }

  return user;
};

// ================= VERIFY EMAIL =================
export const verifyEmailToken = async (token) => {
  if (!token) {
    throw new Error("Verification token is required");
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: tokenHash,
    emailVerificationTokenExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = "";
  user.emailVerificationTokenExpiresAt = undefined;

  await user.save();

  return user;
};