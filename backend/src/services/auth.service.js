import User from "../models/User.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../lib/mailer.js";

const VERIFICATION_OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000;            // 1 minute

// ================= OTP GENERATION =================
const createVerificationOtp = () => {
  const verificationOtp = crypto.randomInt(100000, 999999).toString();

  const verificationOtpHash = crypto
    .createHash("sha256")
    .update(verificationOtp)
    .digest("hex");

  return {
    verificationOtp,
    verificationOtpHash,
    verificationOtpExpiresAt: new Date(Date.now() + VERIFICATION_OTP_TTL_MS),
    verificationOtpIssuedAt: new Date(), // ← explicit issuedAt
  };
};

// ================= ISSUE EMAIL =================
const issueVerificationEmail = async (user) => {
  // Cooldown check using explicit issuedAt
  if (user.emailVerificationOtpIssuedAt) {
    const elapsed = Date.now() - new Date(user.emailVerificationOtpIssuedAt).getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      const secondsLeft = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
      throw new Error(`Please wait ${secondsLeft}s before requesting another code`);
    }
  }

  const {
    verificationOtp,
    verificationOtpHash,
    verificationOtpExpiresAt,
    verificationOtpIssuedAt,
  } = createVerificationOtp();

  user.emailVerificationOtp = verificationOtpHash;
  user.emailVerificationOtpExpiresAt = verificationOtpExpiresAt;
  user.emailVerificationOtpIssuedAt = verificationOtpIssuedAt;

  await user.save();

  // ✅ Awaited — failures surface immediately
  await sendVerificationEmail({
    to: user.email,
    fullName: user.fullName,
    otp: verificationOtp,
  });
};

// ================= CREATE USER =================
export const createUser = async ({ email, password, fullName }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password || !fullName) {
    throw new Error("All fields are required");
  }

  let user = await User.findOne({ email: normalizedEmail });

  // Exists but not verified → resend OTP
  if (user && !user.isEmailVerified) {
    await issueVerificationEmail(user);
    throw new Error("Verification code resent. Please check your inbox.");
  }

  // Verified user already exists
  if (user && user.isEmailVerified) {
    throw new Error("Email already exists");
  }

  // Create new user
  user = await User.create({
    email: normalizedEmail,
    password,
    fullName,
    isEmailVerified: false,
  });

  await issueVerificationEmail(user);

  return user;
};

// ================= RESEND VERIFICATION =================
export const resendVerificationEmail = async (email) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email: normalizedEmail });

  // Prevent account enumeration
  if (!user || user.isEmailVerified) {
    return {
      message: "If your account exists and is unverified, a verification code has been sent.",
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

  const otpHash = crypto
    .createHash("sha256")
    .update(String(otp).trim())
    .digest("hex");

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
  user.emailVerificationOtpIssuedAt = undefined; // clean up

  await user.save();

  return user;
};