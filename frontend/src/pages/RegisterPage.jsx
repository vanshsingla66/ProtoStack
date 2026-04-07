import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  BadgeCheck,
  Users,
  Sparkles,
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.includes("@")) e.email = "Valid email required.";
    if (form.password.length < 8) e.password = "Minimum 8 characters.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          password: form.password,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not create account.");
      }

      setSuccessMessage(data.message || "Account created. Check your email to verify your account.");
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      setApiError(error?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-neutral-900 font-sans bg-[radial-gradient(circle_at_14%_11%,#dbeafe_0%,transparent_36%),radial-gradient(circle_at_90%_18%,#fde68a_0%,transparent_30%),linear-gradient(180deg,#f8fbff_0%,#f9fafb_100%)] relative overflow-hidden">
      <motion.div
        className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 w-[32rem] h-[16rem] rounded-full bg-blue-200/25 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -12, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-amber-200/35 blur-3xl"
        animate={{ x: [0, -18, 0], y: [0, 16, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.nav
        className="h-16 border-b border-sky-100/80 backdrop-blur-sm bg-white/65 px-6 md:px-10 flex items-center justify-between relative z-10"
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
        <Link to="/signin" className="text-sm text-neutral-600 hover:text-black transition">
          Already have an account?
        </Link>
      </motion.nav>

      <div className="relative z-10 px-4 py-10 md:py-14">
        <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-10 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <motion.div
            className="rounded-3xl border border-neutral-200/80 bg-white/85 backdrop-blur-md shadow-xl shadow-neutral-900/5 p-6 sm:p-8 md:p-10 order-2 lg:order-1"
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          >
            <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold mb-3">Get started</p>
            <h1 className="font-serif text-3xl leading-tight mb-1">Create your account</h1>
            <p className="text-sm text-neutral-500 mb-8">
              Already have one?{" "}
              <Link to="/signin" className="text-blue-700 font-medium underline underline-offset-2 hover:text-blue-600 transition">
                Sign in
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
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 block mb-1.5">Full name</label>
                <input
                  type="text"
                  placeholder="Mayank Sharma"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full border rounded-xl px-4 h-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-neutral-50 placeholder:text-neutral-300 ${errors.name ? "border-red-400" : "border-neutral-200"}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </motion.div>

              <motion.div variants={fieldFade}>
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 block mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full border rounded-xl px-4 h-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-neutral-50 placeholder:text-neutral-300 ${errors.email ? "border-red-400" : "border-neutral-200"}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </motion.div>

              <motion.div variants={fieldFade}>
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full border rounded-xl px-4 pr-10 h-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-neutral-50 placeholder:text-neutral-300 ${errors.password ? "border-red-400" : "border-neutral-200"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                {apiError && <p className="text-xs text-red-500 mt-1">{apiError}</p>}
                {successMessage && <p className="text-xs text-green-600 mt-1">{successMessage}</p>}
              </motion.div>

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
                    Creating account...
                  </span>
                ) : (
                  <>
                    Create account
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

            {successMessage && (
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="mt-4 w-full h-10 rounded-xl text-sm font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 transition"
              >
                Go to Sign in
              </button>
            )}

            <Separator className="my-6" />
            <p className="text-center text-xs text-neutral-400">
              By creating an account you agree to our <a href="#" className="underline hover:text-black">Terms</a> and <a href="#" className="underline hover:text-black">Privacy Policy</a>.
            </p>
          </motion.div>

          <motion.div
            className="hidden lg:flex order-1 lg:order-2 flex-col justify-between rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-10 shadow-2xl shadow-slate-900/25"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
          >
            <div>
              <p className="uppercase text-[11px] tracking-[0.2em] text-sky-100/90">LearnForge</p>
              <h2 className="font-serif text-4xl leading-tight mt-3">Join the builders who ship.</h2>
              <p className="text-slate-200/80 mt-4 text-sm leading-relaxed max-w-md">
                Set up your account and start a guided curriculum built for practical outcomes, not passive watching.
              </p>
            </div>

            <div className="space-y-4">
              {[{ icon: BadgeCheck, text: "Structured paths from beginner to advanced" }, { icon: Users, text: "Community-backed learning and peer reviews" }, { icon: Sparkles, text: "AI-powered weekly roadmap adjustments" }].map((item) => (
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
        </div>
      </div>
    </div>
  );
}