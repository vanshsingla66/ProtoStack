import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  LayoutDashboard,
  Map,
  Sparkles,
  Target,
} from "lucide-react";

const ACTIVITY = [
  { emoji: "✅", label: "Completed: React Hooks & Context lecture", time: "2h ago" },
  { emoji: "▶️", label: "Started: TypeScript Generics — Chapter 3", time: "Yesterday" },
  { emoji: "🏆", label: "Earned badge: Quick Learner (5 days streak)", time: "2 days ago" },
  { emoji: "👥", label: "Joined community: System Design Circle", time: "3 days ago" },
];

const GOAL_LABELS = {
  job: "Land a new role",
  promote: "Get promoted",
  build: "Build a product",
  learn: "Learn for fun",
};

export default function DashboardPage({ user }) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const profile = user?.profileData || {};
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const skillPreview = skills.slice(0, 3).join(" · ") || "Add skills in onboarding";
  const roleLabel = profile.role || user?.role || "Student";
  const educationLabel = profile.education || "Not added yet";
  const goalKey = profile.goal || "learn";
  const goalLabel = GOAL_LABELS[goalKey] || "Set a goal";
  const sourceLabel = user?.source === "resume" ? "Resume-backed profile" : "Form-backed profile";

  const profileInsights = [
    { label: "Role", value: roleLabel, icon: Target },
    { label: "Education", value: educationLabel, icon: FileText },
    { label: "Goal", value: goalLabel, icon: Sparkles },
    { label: "Skills saved", value: `${skills.length}`, icon: CheckCircle2 },
  ];

  const actions = [
    {
      title: "Resume Analyser",
      description: skills.length
        ? `Compare your ${skills.length} saved skills against a live resume scan.`
        : "Upload a resume to pull skills from the backend and compare them with your profile.",
      path: "/resume-analyser",
      icon: FileText,
      accent: "from-emerald-500/15 to-lime-500/10",
      tag: sourceLabel,
    },
    {
      title: "Learning Roadmap",
      description: `Generate a step-by-step plan for ${goalLabel.toLowerCase()}.`,
      path: "/roadmap",
      icon: Map,
      accent: "from-sky-500/15 to-cyan-500/10",
      tag: roleLabel,
    },
    {
      title: "Profile",
      description: `Update your ${roleLabel.toLowerCase()} profile and keep your saved onboarding data current.`,
      path: "/profile",
      icon: LayoutDashboard,
      accent: "from-amber-500/15 to-orange-500/10",
      tag: `${skills.length} skills`,
    },
    {
      title: "AI Interview",
      description: skills[0]
        ? `Practice interviews focused on ${skillPreview}.`
        : "Practice interview prompts tailored to your target role.",
      path: "/ai-interview",
      icon: Sparkles,
      accent: "from-violet-500/15 to-fuchsia-500/10",
      tag: "Practice",
    },
  ];

  const roadmapModules = [
    {
      id: 1,
      title: `${roleLabel} fundamentals`,
      sub: skillPreview,
      duration: `${skills.length || 1} saved skills`,
      rating: sourceLabel,
      level: user?.isOnboarded ? "Saved" : "Draft",
      progress: Math.min(90, 35 + skills.length * 10),
    },
    {
      id: 2,
      title: `${goalLabel} roadmap`,
      sub: educationLabel,
      duration: "Account active",
      rating: user?.isOnboarded ? "Ready" : "Needs onboarding",
      level: "Next step",
      progress: user?.isOnboarded ? 70 : 25,
    },
    {
      id: 3,
      title: "Resume improvement loop",
      sub: skills.length ? `${skills[0]} and related keywords` : "Use your profile data to personalise",
      duration: user?.source === "resume" ? "From parsed resume" : "Manual profile",
      rating: skills.length > 2 ? "Strong" : "Building",
      level: "Resume",
      progress: skills.length > 2 ? 78 : 42,
    },
  ];

  const activityFeed = [
    {
      emoji: user?.isOnboarded ? "✅" : "🟡",
      label: user?.isOnboarded
        ? `Onboarding saved to the database for ${roleLabel}.`
        : "Finish onboarding to persist role, education, and skills.",
      time: user?.isOnboarded ? "From MongoDB" : "Pending",
    },
    {
      emoji: "🎯",
      label: `Goal set to ${goalLabel}.`,
      time: sourceLabel,
    },
    {
      emoji: "🧠",
      label: skills.length
        ? `Top saved skill: ${skills[0]}`
        : "No saved skills yet.",
      time: `${skills.length} skills`,
    },
    {
      emoji: "📄",
      label: user?.source === "resume"
        ? "Profile is being driven by parsed resume data."
        : "Switch to resume analysis to enrich the profile with parsed data.",
      time: "Backend data",
    },
  ];

  const highlightChips = skills.length
    ? skills.slice(0, 6)
    : ["Resume analysis", "Target role", "Skill gaps", "ATS readiness"];

  const smartCards = [
    {
      title: "Profile status",
      value: user?.isOnboarded ? "Saved in MongoDB" : "Needs onboarding",
      note: user?.isOnboarded
        ? "Your role, skills, and goal are already persisted."
        : "Complete onboarding to unlock personalized suggestions.",
      icon: CheckCircle2,
      tone: "from-emerald-500/15 to-lime-500/10",
    },
    {
      title: "Resume source",
      value: user?.source === "resume" ? "Parsed resume" : "Manual profile",
      note: user?.source === "resume"
        ? "The dashboard can lean on parsed resume data for smarter recommendations."
        : "Upload a resume to enrich the profile with parsed data.",
      icon: FileText,
      tone: "from-cyan-500/15 to-sky-500/10",
    },
    {
      title: "Next focus",
      value: goalLabel,
      note: skills.length
        ? `Prioritize ${skills[0]} and related skills next.`
        : "Add skills first so the dashboard can tailor your next steps.",
      icon: Sparkles,
      tone: "from-violet-500/15 to-fuchsia-500/10",
    },
  ];

  return (
    <motion.div
      className={`space-y-10 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 px-6 py-7 text-white shadow-lg sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(163,230,53,0.18),transparent_35%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <p className="uppercase text-xs tracking-[0.3em] text-white/55 font-semibold">
              Dashboard
            </p>
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
                Welcome back, {firstName}.
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-white/75">
                Keep moving from profile setup to practice with one workspace.
                Resume analysis, roadmap generation, and interview prep are one click away.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate("/resume-analyser")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition hover:scale-[1.02]"
              >
                Analyse resume <ArrowUpRight size={16} />
              </button>
              <button
                onClick={() => navigate("/roadmap")}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Build roadmap <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              {profileInsights.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/50">{label}</p>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
                      <Icon size={15} />
                    </div>
                  </div>
                  <div className="mt-2 text-base font-semibold leading-6">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="uppercase text-xs text-neutral-400 font-semibold">
              Quick actions
            </p>
            <h2 className="font-serif text-2xl mt-1">
              Jump to the right workspace
            </h2>
          </div>

          <button
            onClick={() => navigate("/roadmap")}
            className="hidden sm:inline-flex border px-4 py-2 rounded-full text-sm items-center gap-2 hover:border-black transition"
          >
            View roadmap <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actions.map(({ title, description, path, icon: Icon, accent, tag }) => (
            <motion.button
              key={title}
              type="button"
              onClick={() => navigate(path)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`group text-left rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/10 bg-gradient-to-br ${accent}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-sm transition group-hover:-rotate-6 group-hover:scale-105">
                  <Icon size={18} />
                </div>
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  {tag}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-lg font-semibold text-neutral-950">{title}</h3>
                <p className="text-sm leading-6 text-neutral-600">{description}</p>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm font-medium text-neutral-950">
                <span>Open page</span>
                <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="uppercase text-xs text-neutral-400 font-semibold">
                Profile intelligence
              </p>
              <h2 className="font-serif text-2xl mt-1">
                Data from your account
              </h2>
            </div>
            <button
              onClick={() => navigate("/resume-analyser")}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:border-black transition"
            >
              Update via resume <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {smartCards.map(({ title, value, note, icon: Icon, tone }) => (
              <div key={title} className={`rounded-3xl border border-neutral-200 bg-gradient-to-br ${tone} p-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-400 font-semibold">{title}</p>
                    <h3 className="mt-2 text-lg font-semibold text-neutral-950">{value}</h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-neutral-950 shadow-sm">
                    <Icon size={16} />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-neutral-600">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm">
          <p className="uppercase text-xs text-white/45 font-semibold mb-4">
            Suggested focus
          </p>
          <h2 className="font-serif text-2xl">Looks cooler when it feels personal</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">
            These chips are pulled from your saved profile, so the dashboard feels responsive to your own data instead of generic content.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {highlightChips.map((chip) => (
              <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/85">
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45 font-semibold">Recent activity</p>
            <div className="mt-4 space-y-3">
              {activityFeed.slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span>{item.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white/85">{item.label}</p>
                    <p className="text-xs text-white/45 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="uppercase text-xs text-neutral-400 font-semibold">
              Recent Activity
            </p>
            <h2 className="font-serif text-2xl mt-1">
              Live backend-backed updates
            </h2>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="border px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:border-black transition"
          >
            Open profile <ChevronRight size={13} />
          </button>
        </div>

        <div className="border rounded-3xl bg-white divide-y overflow-hidden">
          {activityFeed.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50">
              <span>{item.emoji}</span>
              <p className="flex-1 text-sm">{item.label}</p>
              <span className="text-xs text-neutral-400">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}