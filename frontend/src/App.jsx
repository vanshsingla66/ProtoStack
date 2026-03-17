import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage onAuth={setUser} />} />
        <Route path="/register" element={<RegisterPage onAuth={setUser} />} />
        <Route
          path="/onboarding"
          element={user ? <OnboardingPage user={user} /> : <Navigate to="/register" />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage user={user} onSignOut={() => setUser(null)} /> : <Navigate to="/signin" />}
        />
      </Routes>
    </BrowserRouter>
  );
}