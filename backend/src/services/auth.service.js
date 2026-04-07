import User from "../models/User.js";

export const createUser = async ({ email, password, fullName }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  return await User.create({ email, password, fullName });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid credentials");
  }

  return user;
};