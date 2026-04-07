export const formatUser = (user) => {
  const isResumeBased = user.parsedResume && user.parsedResume.resumeUrl;

  return {
    id: user._id,
    _id: user._id,
    name: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    role: user.onboardingData?.role || "Student",
    isOnboarded: user.isOnboarded,
    isEmailVerified: Boolean(user.isEmailVerified),

    // ✅ Only ONE source
    profileData: isResumeBased
      ? user.parsedResume
      : user.onboardingData,

    // Optional (debug only)
    source: isResumeBased ? "resume" : "form",
  };
};