export const formatUser = (user) => {
  return {
    id: user._id,
    name: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    role: user.onboardingData?.role || "Student",
  };
};