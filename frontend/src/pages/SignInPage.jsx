import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SignInPage({ onAuth }) {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError("Please fill in all fields.");
    }

    setError("");
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
        throw new Error(data.message || "Login failed");
      }

      // ✅ IMPORTANT: use backend formatted user
      onAuth(data.user);

      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-neutral-200 h-14 flex items-center px-8 gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-black transition"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <span className="text-neutral-200 text-sm">|</span>

        <Link to="/" className="flex items-center gap-2 font-bold text-sm">
          <span className="w-2 h-2 bg-blue-600 rounded-full" />
          LearnForge
        </Link>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div
          className={`w-full max-w-sm transition-all duration-500 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold mb-3">
            Welcome back
          </p>

          <h1 className="font-serif text-3xl leading-tight mb-1">
            Sign in to LearnForge
          </h1>

          <p className="text-sm text-neutral-500 mb-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-black font-medium underline underline-offset-2 hover:text-blue-600 transition"
            >
              Create one free
            </Link>
          </p>

          {/* Form */}
          <div className="border border-neutral-200 bg-white rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 block mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-neutral-200 rounded-md px-3 h-10 text-sm outline-none focus:border-black transition bg-stone-50 placeholder:text-neutral-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 block mb-1.5">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-neutral-200 rounded-md px-3 pr-10 h-10 text-sm outline-none focus:border-black transition bg-stone-50 placeholder:text-neutral-300"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white h-10 rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <>
                    Continue <ArrowRight size={14} />
                  </>
                )}
              </button>

            </form>

            <Separator className="my-6" />

            <p className="text-center text-xs text-neutral-400">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-black">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-black">
                Privacy Policy
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}