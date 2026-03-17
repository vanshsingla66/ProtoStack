import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, ArrowLeft} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SignInPage({ onAuth }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onAuth({ name: "Mayank Sharma", email: form.email });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans flex flex-col">
      <nav className="border-b border-neutral-200 h-14 flex items-center px-8 gap-3">
        <Link to="/"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-black transition"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <span className="text-neutral-200 text-sm">|</span>
        <Link to="/" className="flex items-center gap-2 font-bold text-sm">
          <span className="w-2 h-2 bg-blue-600 rounded-full" />
          LearnForge
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className={`w-full max-w-sm transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold mb-3">Welcome back</p>
          <h1 className="font-serif text-3xl leading-tight mb-1">Sign in to LearnForge</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-black font-medium underline underline-offset-2 hover:text-blue-600 transition">
              Create one free
            </Link>
          </p>

          <div className="border border-neutral-200 bg-white rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 block mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
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
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-md px-3 pr-10 h-10 text-sm outline-none focus:border-black transition bg-stone-50 placeholder:text-neutral-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <a href="#" className="text-xs text-neutral-400 hover:text-black transition mt-1.5 block text-right">
                  Forgot password?
                </a>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

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
                  <>Continue <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            <Separator className="my-6" />
            <p className="text-center text-xs text-neutral-400">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-black transition">Terms</a> and{" "}
              <a href="#" className="underline hover:text-black transition">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}