import User from "../models/User.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../lib/mailer.js";

const VERIFICATION_OTP_TTL_MS = 10 * 60 * 1000;

const createVerificationOtp = () => {
  const verificationOtp = crypto.randomInt(100000, 1000000).toString();
  const verificationOtpHash = crypto
    .createHash("sha256")
    .update(verificationOtp)
    .digest("hex");

  return {
    verificationOtp,
    verificationOtpHash,
    verificationOtpExpiresAt: new Date(Date.now() + VERIFICATION_OTP_TTL_MS),
  };
};

const issueVerificationEmail = async (user) => {
  const {
    verificationOtp,
    verificationOtpHash,
    verificationOtpExpiresAt,
  } = createVerificationOtp();

  user.emailVerificationOtp = verificationOtpHash;
  user.emailVerificationOtpExpiresAt = verificationOtpExpiresAt;

  await user.save();

  await sendVerificationEmail({
    to: user.email,
    fullName: user.fullName,
    otp: verificationOtp,
  });

  return verificationOtp;
};

// ================= CREATE USER =================
export const createUser = async ({ email, password, fullName }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  let user = await User.findOne({ email: normalizedEmail });

  if (user && !user.isEmailVerified) {
    await issueVerificationEmail(user);

    throw new Error("Verification code resent. Please check your inbox.");
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

    throw new Error("Unable to send verification code.");
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
        "If your account exists and is unverified, a verification code has been sent.",
    };
  }

  await issueVerificationEmail(user);

  return {
    message: "Verification code resent. Please check your inbox.",
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
export const verifyEmailOtp = async ({ email, otp }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !otp) {
    throw new Error("Email and verification code are required");
  }

  const otpHash = crypto.createHash("sha256").update(String(otp).trim()).digest("hex");

  const user = await User.findOne({
    email: normalizedEmail,
    emailVerificationOtp: otpHash,
    emailVerificationOtpExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Invalid or expired verification code");
  }

  user.isEmailVerified = true;
  user.emailVerificationOtp = "";
  user.emailVerificationOtpExpiresAt = undefined;

  await user.save();

  return user;
};