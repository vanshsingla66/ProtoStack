import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, CheckCircle2, FileText, Map, Sparkles, Target, User } from "lucide-react";

export default function ProfilePage({ user, onUserUpdate }) {
  const navigate = useNavigate();
  const profile = user?.profileData || {};
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    role: profile.role || user?.role || "Student",
    education: profile.education || "",
    goal: profile.goal || "",
    skills: skills.join(", "),
    location: user?.location || "",
    nativeLanguage: user?.nativeLanguage || "",
    learningLanguage: user?.learningLanguage || "",
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      role: profile.role || user?.role || "Student",
      education: profile.education || "",
      goal: profile.goal || "",
      skills: skills.join(", "),
      location: user?.location || "",
      nativeLanguage: user?.nativeLanguage || "",
      learningLanguage: user?.learningLanguage || "",
    });
  }, [profile.education, profile.goal, profile.role, skills, user]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Profile source",
        value: user?.source === "resume" ? "Resume-backed" : "Form-backed",
        note: user?.source === "resume"
          ? "Your dashboard can use parsed resume data."
          : "Add a resume to enrich your profile.",
        icon: FileText,
      },
      {
        label: "Onboarding",
        value: user?.isOnboarded ? "Completed" : "Not finished",
        note: user?.isOnboarded
          ? "Your onboarding data is already stored in the database."
          : "Finish onboarding to persist education, role, skills, and goal.",
        icon: CheckCircle2,
      },
      {
        label: "Primary goal",
        value: profile.goal || "Not set",
        note: profile.goal ? "Used to personalize your roadmap." : "Set a goal to make recommendations sharper.",
        icon: Target,
      },
    ],
    [profile.goal, user?.isOnboarded, user?.source]
  );

  const quickActions = [
    {
      label: "Resume Analyser",
      description: "Check your resume against the skills in your profile.",
      path: "/resume-analyser",
      icon: Sparkles,
    },
    {
      label: "Roadmap",
      description: "Generate a roadmap based on your current goal.",
      path: "/roadmap",
      icon: Map,
    },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setStatus("");
    setSaving(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          bio: form.bio,
          role: form.role,
          education: form.education,
          goal: form.goal,
          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          location: form.location,
          nativeLanguage: form.nativeLanguage,
          learningLanguage: form.learningLanguage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      onUserUpdate?.(data.user);
      setStatus("Saved to database");
    } catch (error) {
      setStatus(error.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 p-6 text-white shadow-lg sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
              <User size={12} /> Profile
            </div>
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
                {form.name || "Your profile"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/75">
                    Keep your identity, saved learning data, and next steps in one place.
                  </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/resume-analyser")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition hover:scale-[1.02]"
              >
                Open resume analyser <ArrowUpRight size={16} />
              </button>
              <button
                onClick={() => navigate("/roadmap")}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Build roadmap <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {summaryCards.map(({ label, value, note, icon: Icon }) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">{label}</p>
                    <h2 className="mt-2 text-lg font-semibold">{value}</h2>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <Icon size={16} />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-400 font-semibold">Account status</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-950">Active</p>
              <p className="text-sm text-neutral-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-400 font-semibold">Saved skills</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-serif">{skills.length}</p>
              <p className="text-sm text-neutral-500">Stored in onboarding data</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white">
              <Sparkles size={18} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-400 font-semibold">Current role</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-2xl font-serif">{form.role || user?.role || "Student"}</p>
              <p className="text-sm text-neutral-500">Role saved in profile data</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Target size={18} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="bg-white border rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-400 font-semibold">Skills</p>
              <h2 className="font-serif text-2xl mt-1">What the backend already knows</h2>
            </div>
            <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
              {user?.source === "resume" ? "From resume" : "From form"}
            </div>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-500">
              No saved skills yet. Add them during onboarding or analyze a resume to populate this section.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 font-semibold">Education</p>
              <p className="mt-2 text-sm text-neutral-700">{profile.education || "Not added yet"}</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 font-semibold">Goal</p>
              <p className="mt-2 text-sm text-neutral-700">{profile.goal || "Not added yet"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45 font-semibold">Quick actions</p>
          <h2 className="font-serif text-2xl mt-1">Useful shortcuts</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">
            These actions keep the profile page practical instead of just informational.
          </p>

          <div className="mt-6 space-y-3">
            {quickActions.map(({ label, description, path, icon: Icon }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Icon size={14} /> {label}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/70">{description}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-white/60" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            Bio is still editable below, but if you want it saved to the database later, this form can be connected to a backend update endpoint.
          </div>
        </div>
      </section>

      {/* Profile Card */}
      <div className="bg-white border rounded-xl p-6 flex items-center gap-5">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-black text-white text-lg font-bold">
            {form.name?.[0] || "M"}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-lg font-semibold">{form.name}</h2>
          <p className="text-sm text-neutral-500">{form.email}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border rounded-xl p-6 space-y-5">

        {/* Name */}
        <div>
              <label className="text-sm font-medium">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Role */}
        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          >
            <option>Student</option>
            <option>Developer</option>
            <option>Designer</option>
          </select>
        </div>

        {/* Education */}
        <div>
          <label className="text-sm font-medium">Education</label>
          <input
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="e.g., B.Tech Computer Science"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="text-sm font-medium">Goal</label>
          <input
            name="goal"
            value={form.goal}
            onChange={handleChange}
            placeholder="e.g., job, promote, build, learn"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="text-sm font-medium">Skills</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node.js, SQL"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="City, Country"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Languages */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Native language</label>
            <input
              name="nativeLanguage"
              value={form.nativeLanguage}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Learning language</label>
            <input
              name="learningLanguage"
              value={form.learningLanguage}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="3"
            placeholder="Write something about yourself..."
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-neutral-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {status && <p className="text-sm text-neutral-500">{status}</p>}
      </div>

    </div>
  );
}