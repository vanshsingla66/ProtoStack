export const formatUser = (user) => {
  const isResumeBased = user.parsedResume && user.parsedResume.resumeUrl;

  return {
    id: user._id,
    _id: user._id,
    name: user.fullName,
    email: user.email,
    bio: user.bio || "",
    location: user.location || "",
    nativeLanguage: user.nativeLanguage || "",
    learningLanguage: user.learningLanguage || "",
    profilePic: user.profilePic,
    role: user.onboardingData?.role || "Student",
    isOnboarded: user.isOnboarded,
    isEmailVerified: true,

    // ✅ Only ONE source
    profileData: isResumeBased
      ? user.parsedResume
      : user.onboardingData,

    // Optional (debug only)
    source: isResumeBased ? "resume" : "form",
    settings: user.settings || { theme: "system", emailNotifications: true, profileVisibility: "public" },
  };
};