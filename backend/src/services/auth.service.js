import User from "../models/User.js";

// ================= CREATE USER =================
export const createUser = async ({ email, password, fullName }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const user = await User.create({
    email: normalizedEmail,
    password,
    fullName,
    isEmailVerified: true,
  });

  return user;
};

// ================= LOGIN =================
export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid credentials");
  }

  return user;
};