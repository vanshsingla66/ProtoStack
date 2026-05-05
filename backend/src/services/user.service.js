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

export const updateProfileService = async (currentUserId, data) => {
  if (!currentUserId) {
    throw new Error("User id is required");
  }

  const user = await User.findById(currentUserId);

  if (!user) {
    throw new Error("User not found");
  }

  const {
    name,
    bio,
    role,
    education,
    goal,
    skills,
    location,
    nativeLanguage,
    learningLanguage,
    settings,
    parsedResume,
    resumeUrl,
  } = data;

  if (typeof name === "string") {
    user.fullName = name.trim() || user.fullName;
  }

  if (typeof bio === "string") {
    user.bio = bio;
  }

  if (typeof location === "string") {
    user.location = location;
  }

  if (typeof nativeLanguage === "string") {
    user.nativeLanguage = nativeLanguage;
  }

  if (typeof learningLanguage === "string") {
    user.learningLanguage = learningLanguage;
  }

  if (parsedResume && typeof parsedResume === "object") {
    const mergedParsedResume = {
      ...(user.parsedResume || {}),
      ...parsedResume,
    };

    const finalResumeUrl =
      parsedResume.resumeUrl || resumeUrl || user.parsedResume?.resumeUrl || "";

    user.parsedResume = {
      ...mergedParsedResume,
      resumeUrl: finalResumeUrl,
    };

    if (!name && typeof parsedResume.name === "string" && parsedResume.name.trim()) {
      user.fullName = parsedResume.name.trim();
    }

    const existingOnboarding = user.onboardingData || {};
    const parsedSkills = Array.isArray(parsedResume.skills)
      ? normalizeSkills(parsedResume.skills)
      : existingOnboarding.skills || [];

    const parsedEducation = Array.isArray(parsedResume.education) && parsedResume.education.length
      ? parsedResume.education[0]
      : existingOnboarding.education || "";

    user.onboardingData = {
      ...existingOnboarding,
      education: typeof education === "string" ? education : parsedEducation,
      role: typeof role === "string" ? role : existingOnboarding.role || "",
      skills: Array.isArray(skills) ? normalizeSkills(skills) : parsedSkills,
      goal: typeof goal === "string" ? goal : existingOnboarding.goal || "",
    };
  }

  // Settings (optional)
  if (settings && typeof settings === "object") {
    user.settings = {
      ...(user.settings || {}),
      ...(typeof settings.theme === "string" ? { theme: settings.theme } : {}),
      ...(typeof settings.emailNotifications === "boolean" ? { emailNotifications: settings.emailNotifications } : {}),
      ...(typeof settings.profileVisibility === "string" ? { profileVisibility: settings.profileVisibility } : {}),
    };
  }

  user.onboardingData = {
    ...user.onboardingData,
    education: typeof education === "string" ? education : user.onboardingData?.education || "",
    role: typeof role === "string" ? role : user.onboardingData?.role || "",
    skills: Array.isArray(skills) ? normalizeSkills(skills) : user.onboardingData?.skills || [],
    goal: typeof goal === "string" ? goal : user.onboardingData?.goal || "",
  };

  user.isOnboarded = true;

  await user.save();

  return user;
};