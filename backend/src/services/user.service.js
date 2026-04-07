import User from "../models/User.js";
import { normalizeSkills } from "../utils/normalizeSkills.js";

export const onboardUserService = async (data, currentUserId) => {
  const {
    userId,
    education,
    role,
    skills,
    goal,
    parsedResume,
    resumeUrl,
  } = data;

  const targetUserId = currentUserId || userId;

  if (!targetUserId) {
    throw new Error("User id is required");
  }

  const parsedResumeData =
    parsedResume && typeof parsedResume === "object"
      ? parsedResume
      : {};

  const finalResumeUrl =
    parsedResumeData.resumeUrl || resumeUrl || "";

  const user = await User.findByIdAndUpdate(
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
    { new: true }
  );

  if (!user) throw new Error("User not found");

  return user;
};