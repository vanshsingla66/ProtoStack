import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Public Pages
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";

// Dashboard Pages
import DashboardPage from "./pages/DashboardPage";
import RoadmapPage from "./pages/RoadmapPage";
import AIInterviewPage from "./pages/AIInterviewPage";
import ProfilePage from "./pages/ProfilePage";
import ResumeAnalyzerPage from "./pages/ResumeAnalyzerPage";
import SettingsPage from "./pages/SettingsPage";

// Layout
import DashboardLayout from "./pages/page_components/DashboardLayout";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ NEW

  // ================= AUTO LOGIN (/me) =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/me`,
          {
            credentials: "include", // ✅ VERY IMPORTANT
          }
        );

        const data = await res.json();

        if (res.ok) {
          setUser(data.user); // ✅ set user from backend
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auto login failed:", err);
        setUser(null);
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };

    fetchUser();
  }, []);

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-neutral-500">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        <Route
          path="/signin"
          element={<SignInPage onAuth={setUser} />}
        />

        <Route
          path="/register"
          element={<RegisterPage onAuth={setUser} />}
        />

        <Route
          path="/onboarding"
          element={
            user ? (
              <OnboardingPage user={user} />
            ) : (
              <Navigate to="/register" />
            )
          }
        />

        {/* Protected Routes with Layout */}
        <Route
          element={
            user ? (
              <DashboardLayout
                user={user}
                onSignOut={() => setUser(null)}
              />
            ) : (
              <Navigate to="/signin" />
            )
          }
        >
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/roadmap" element={<RoadmapPage user={user} />} />
          <Route path="/resume-analyser" element={<ResumeAnalyzerPage user={user} onUserUpdate={setUser} />} />
          <Route path="/ai-interview" element={<AIInterviewPage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} onUserUpdate={setUser} />} />
          <Route path="/settings" element={<SettingsPage user={user} onUserUpdate={setUser} />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}