import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Rocket,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const formStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const fieldFade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function SignInPage({ onAuth }) {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);

    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get("verifyToken");

    if (!verifyToken) {
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/verify-email?token=${verifyToken}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to verify email");
        }

        setInfo(data.message || "Email verified. You can login now.");
      } catch (verifyError) {
        setError(verifyError.message || "Unable to verify email");
      } finally {
        window.history.replaceState({}, "", "/signin");
      }
    };

    verifyEmail();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResendVerification = async () => {
    if (!form.email) {
      setError("Please enter your email address first.");
      return;
    }

    setError("");
    setInfo("");
    setResendLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: form.email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to resend verification email");
      }

      setInfo(data.message || "Verification email sent. Please check your inbox.");
    } catch (resendError) {
      setError(resendError.message || "Unable to resend verification email");
    } finally {
      setResendLoading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError("Please fill in all fields.");
    }

    setError("");
    setErrorCode("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ VERY IMPORTANT (cookies)
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data); // 🔥 debug

      if (!res.ok) {
        const loginError = new Error(data.message || "Login failed");
        loginError.code = data.code;
        throw loginError;
      }

      // ✅ IMPORTANT: use backend formatted user
      onAuth(data.user);

      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setErrorCode(err.code || "");
      setError(err.message || "Unable to login");
      setInfo("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-neutral-900 font-sans bg-[radial-gradient(circle_at_12%_8%,#dbeafe_0%,transparent_36%),radial-gradient(circle_at_88%_18%,#fde68a_0%,transparent_30%),linear-gradient(180deg,#fffdf7_0%,#f8fafc_100%)] relative overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-300/25 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 16, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-amber-200/35 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -14, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.nav
        className="h-16 border-b border-sky-100/80 backdrop-blur-sm bg-white/60 px-6 md:px-10 flex items-center justify-between relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black transition"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-neutral-300">|</span>
          <Link to="/" className="flex items-center gap-2 font-bold text-sm">
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            LearnForge
          </Link>
        </div>
        <Link to="/register" className="text-sm text-neutral-600 hover:text-black transition">
          New here? Create account
        </Link>
      </motion.nav>

      <div className="relative z-10 px-4 py-10 md:py-14">
        <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-10 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <motion.div
            className="hidden lg:flex flex-col justify-between rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-10 shadow-2xl shadow-slate-900/25"
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          >
            <div>
              <p className="uppercase text-[11px] tracking-[0.2em] text-sky-200">Welcome back</p>
              <h2 className="font-serif text-4xl leading-tight mt-3">Continue your learning momentum.</h2>
              <p className="text-slate-200/80 mt-4 text-sm leading-relaxed max-w-md">
                Pick up where you left off with personalized paths, project checkpoints, and mentor feedback.
              </p>
            </div>

            <div className="space-y-4">
              {[{ icon: Rocket, text: "Weekly project-based milestones" }, { icon: ShieldCheck, text: "Secure session and progress history" }, { icon: Sparkles, text: "AI roadmap updated after every module" }].map((item) => (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/10 px-4 py-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <item.icon size={16} className="text-sky-200" />
                  <span className="text-sm text-slate-100">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-neutral-200/80 bg-white/85 backdrop-blur-md shadow-xl shadow-neutral-900/5 p-6 sm:p-8 md:p-10"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
          >
            <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold mb-3">Sign in</p>
            <h1 className="font-serif text-3xl leading-tight mb-1">Welcome to LearnForge</h1>
            <p className="text-sm text-neutral-500 mb-8">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-blue-700 font-medium underline underline-offset-2 hover:text-blue-600 transition">
                Create one free
              </Link>
            </p>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              variants={formStagger}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fieldFade}>
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 block mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-neutral-200 rounded-xl px-4 h-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-neutral-50 placeholder:text-neutral-300"
                />
              </motion.div>

              <motion.div variants={fieldFade}>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Password</label>
                  <a href="#" className="text-xs text-neutral-400 hover:text-neutral-700 transition">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-neutral-200 rounded-xl px-4 pr-10 h-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-neutral-50 placeholder:text-neutral-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.p
                  className="text-xs text-red-500"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: [0, -5, 4, -3, 0] }}
                  transition={{ duration: 0.35 }}
                >
                  {error}
                </motion.p>
              )}

              {errorCode === "EMAIL_NOT_VERIFIED" && (
                <motion.button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="w-full h-10 rounded-xl text-sm font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 transition disabled:opacity-60"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.985 }}
                >
                  {resendLoading ? "Sending verification email..." : "Resend verification email"}
                </motion.button>
              )}

              {info && (
                <motion.p
                  className="text-xs text-emerald-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {info}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white bg-gradient-to-r from-slate-900 to-blue-800 hover:from-slate-800 hover:to-blue-700 transition disabled:opacity-60"
                variants={fieldFade}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Continue
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight size={14} />
                    </motion.span>
                  </>
                )}
              </motion.button>
            </motion.form>

            <Separator className="my-6" />
            <p className="text-center text-xs text-neutral-400">
              By continuing, you agree to our <a href="#" className="underline hover:text-black">Terms</a> and <a href="#" className="underline hover:text-black">Privacy Policy</a>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}