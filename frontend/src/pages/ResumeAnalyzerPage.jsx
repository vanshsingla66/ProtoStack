import { useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, CheckCircle2, FileText, Sparkles, Target } from "lucide-react";

const DEFAULT_SUGGESTIONS = [
  "Add a short summary tailored to the target role.",
  "Include measurable outcomes under each project.",
  "Use 5 to 7 keywords that match the job description.",
];

const ROLE_SKILL_PROFILES = {
  sde: {
    label: "Software Engineer",
    skills: [
      "javascript",
      "python",
      "react",
      "node",
      "express",
      "mongodb",
      "sql",
      "git",
      "rest api",
      "typescript",
      "docker",
      "aws",
      "ci/cd",
      "system design",
    ],
  },
  ml: {
    label: "ML Engineer",
    skills: [
      "python",
      "machine learning",
      "tensorflow",
      "pytorch",
      "scikit-learn",
      "sql",
      "deep learning",
      "nlp",
      "computer vision",
      "pandas",
      "numpy",
      "jupyter",
      "aws",
      "statistics",
    ],
  },
  data: {
    label: "Data Scientist",
    skills: [
      "python",
      "sql",
      "tableau",
      "power bi",
      "excel",
      "statistics",
      "pandas",
      "numpy",
      "machine learning",
      "r",
      "git",
      "aws",
      "spark",
      "analytics",
    ],
  },
  devops: {
    label: "DevOps Engineer",
    skills: [
      "docker",
      "kubernetes",
      "aws",
      "azure",
      "gcp",
      "ci/cd",
      "linux",
      "terraform",
      "jenkins",
      "git",
      "monitoring",
      "bash",
      "python",
      "infrastructure",
    ],
  },
  frontend: {
    label: "Frontend Engineer",
    skills: [
      "react",
      "javascript",
      "typescript",
      "html",
      "css",
      "tailwind",
      "vue",
      "angular",
      "redux",
      "jest",
      "webpack",
      "rest api",
      "responsive design",
      "figma",
    ],
  },
  qa: {
    label: "QA Engineer",
    skills: [
      "selenium",
      "java",
      "python",
      "sql",
      "jenkins",
      "jira",
      "test automation",
      "cypress",
      "jest",
      "git",
      "linux",
      "api testing",
      "performance testing",
      "debugging",
    ],
  },
};

const asArray = (value) => (Array.isArray(value) ? value : []);
const cleanLower = (value) => String(value || "").trim().toLowerCase();

export default function ResumeAnalyzerPage({ user, onUserUpdate }) {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [result, setResult] = useState(null);
  const [selectedRole, setSelectedRole] = useState("sde");

  const fileName = file?.name || "No resume uploaded yet";

  const suggestions = useMemo(() => {
    if (!result) return DEFAULT_SUGGESTIONS;

    const items = [];

    if ((result.resume_score || 0) < 65) {
      items.push("Increase skill density and add stronger project outcomes to raise resume score.");
    }

    if ((result.job_match_score || 0) < 60) {
      items.push("Add keywords that map to the target role requirements for better ATS matching.");
    }

    if (!Array.isArray(result.experience) || result.experience.length === 0) {
      items.push("Add at least one experience section with clear, quantified impact.");
    }

    if (!Array.isArray(result.projects) || result.projects.length === 0) {
      items.push("Add 1-2 projects with stack, role, and measurable results.");
    }

    return items.length ? items : DEFAULT_SUGGESTIONS;
  }, [result]);

  const scoreCards = useMemo(() => {
    if (!result) {
      return [
        { title: "Resume score", score: "-", description: "Upload resume to get an AI score." },
        { title: "Job match", score: "-", description: "Matched skills will appear after parsing." },
        { title: "Skills found", score: "-", description: "Detected technical skills will show here." },
      ];
    }

    return [
      {
        title: "Resume score",
        score: `${Math.round(result.resume_score || 0)}%`,
        description: "Overall score based on skills, education, and experience sections.",
      },
      {
        title: "Job match",
        score: `${Math.round(result.job_match_score || 0)}%`,
        description: "Skill overlap with baseline role requirements.",
      },
      {
        title: "Skills found",
        score: `${Array.isArray(result.skills) ? result.skills.length : 0}`,
        description: "Unique skills detected from your resume content.",
      },
    ];
  }, [result]);

  const keywords = useMemo(() => {
    if (!result) return [];
    if (Array.isArray(result.matched_skills) && result.matched_skills.length) {
      return result.matched_skills;
    }
    return Array.isArray(result.skills) ? result.skills.slice(0, 16) : [];
  }, [result]);

  const analysis = useMemo(() => {
    const roleBaseline = ROLE_SKILL_PROFILES[selectedRole]?.skills || ROLE_SKILL_PROFILES.sde.skills;
    if (!result) {
      return {
        completenessScore: 0,
        sectionHealth: [],
        strengths: ["Upload a resume to generate deep insights."],
        gaps: ["No parsed data yet."],
        atsSignals: [],
        actionSprint: [],
        market: {
          baselineHits: [],
          missingBaseline: roleBaseline,
          marketGapScore: 0,
        },
      };
    }

    const skills = asArray(result.skills);
    const matchedSkills = asArray(result.matched_skills);
    const experience = asArray(result.experience);
    const projects = asArray(result.projects);
    const education = asArray(result.education);
    const certifications = asArray(result.certifications);
    const achievements = asArray(result.achievements);

    const normalizedSkills = skills.map(cleanLower).filter(Boolean);
    const baselineHits = roleBaseline.filter((item) => normalizedSkills.includes(item));

    const sectionHealth = [
      {
        key: "skills",
        label: "Skills",
        score: Math.min(100, skills.length * 10),
        detail: `${skills.length} detected`,
      },
      {
        key: "experience",
        label: "Experience",
        score: experience.length ? Math.min(100, 40 + experience.length * 20) : 0,
        detail: `${experience.length} entries`,
      },
      {
        key: "projects",
        label: "Projects",
        score: projects.length ? Math.min(100, 35 + projects.length * 25) : 0,
        detail: `${projects.length} entries`,
      },
      {
        key: "education",
        label: "Education",
        score: education.length ? 100 : 0,
        detail: education.length ? "Present" : "Missing",
      },
      {
        key: "proof",
        label: "Certs & achievements",
        score: Math.min(100, certifications.length * 30 + achievements.length * 20),
        detail: `${certifications.length + achievements.length} highlights`,
      },
    ];

    const sectionCoverage = sectionHealth.filter((item) => item.score > 0).length;
    const completenessScore = Math.round((sectionCoverage / sectionHealth.length) * 100);

    const narrative = [...experience, ...projects].join(" ").toLowerCase();
    const hasImpactSignals = /\d+%|\$\d+|\d+\+|improved|reduced|increased|led|built|optimized/.test(narrative);

    const strengths = [];
    if ((result.resume_score || 0) >= 70) strengths.push("Strong overall structure detected by the parser.");
    if (skills.length >= 8) strengths.push("Skill coverage is broad enough for mid-level screening.");
    if (matchedSkills.length >= 5) strengths.push("Good ATS keyword alignment from matched skills.");
    if (hasImpactSignals) strengths.push("Impact-oriented language and measurable outcomes detected.");
    if (!strengths.length) strengths.push("Your resume has a solid starting structure.");

    const gaps = [];
    if ((result.resume_score || 0) < 65) gaps.push("Resume score is below ideal; strengthen headline and outcomes.");
    if ((result.job_match_score || 0) < 60) gaps.push("Job match is low; mirror role-specific keywords more directly.");
    if (!experience.length) gaps.push("Experience section is missing; add role, context, and impact bullets.");
    if (!projects.length) gaps.push("Projects are missing; include 2 projects with stack and measurable result.");
    if (!education.length) gaps.push("Education section is missing or not detected.");
    if (!hasImpactSignals) gaps.push("Bullets appear low-impact; add numbers, percentages, or concrete outcomes.");

    const atsSignals = [
      {
        label: "Contact details",
        status: result.email || result.phone ? "good" : "risk",
        note: result.email || result.phone ? "Basic contact data found." : "No clear email/phone detected.",
      },
      {
        label: "Keyword coverage",
        status: matchedSkills.length >= 4 ? "good" : "risk",
        note:
          matchedSkills.length >= 4
            ? `${matchedSkills.length} matched skills detected.`
            : "Few matched keywords; align terms with your target role.",
      },
      {
        label: "Core baseline skills",
        status: baselineHits.length >= 4 ? "good" : "risk",
        note: `${baselineHits.length}/${roleBaseline.length} baseline skills found.`,
      },
      {
        label: "Impact language",
        status: hasImpactSignals ? "good" : "risk",
        note: hasImpactSignals
          ? "Quantified achievements or action verbs detected."
          : "Add metrics like % improvement, revenue, users, or delivery speed.",
      },
    ];

    const actionSprint = [
      !projects.length && "Add 2 high-quality projects with stack, role, and one outcome metric each.",
      !experience.length && "Add experience entries in STAR format (situation, task, action, result).",
      (result.job_match_score || 0) < 60 && "Customize a skills/summary section for each target job description.",
      !hasImpactSignals && "Rewrite bullets to include numbers (%, users, cost/time saved).",
      matchedSkills.length < 4 && "Add missing role keywords naturally in projects and experience bullets.",
    ].filter(Boolean).slice(0, 4);

    const missingBaseline = roleBaseline.filter((item) => !normalizedSkills.includes(item));
    const marketGapScore = Math.round((baselineHits.length / roleBaseline.length) * 100);

    return {
      completenessScore,
      sectionHealth,
      strengths,
      gaps: gaps.length ? gaps : ["No major gaps found. Keep tailoring per job description."],
      atsSignals,
      actionSprint: actionSprint.length ? actionSprint : ["Resume looks healthy. Tailor for each application."],
      market: {
        baselineHits,
        missingBaseline,
        marketGapScore,
      },
    };
  }, [result, selectedRole]);

  // --- Job description compare & suggestions ---
  const [jobDesc, setJobDesc] = useState("");
  const [jdMatchScore, setJdMatchScore] = useState(null);
  const [missingFromResume, setMissingFromResume] = useState([]);
  const [experienceHints, setExperienceHints] = useState([]);

  const extractKeywordsFromText = (text) => {
    if (!text) return [];

    const stopwords = new Set([
      "the",
      "and",
      "for",
      "with",
      "that",
      "this",
      "are",
      "you",
      "your",
      "will",
      "from",
      "have",
      "has",
      "our",
      "be",
    ]);

    const cleaned = text
      .toLowerCase()
      .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
      .replace(/[^a-z0-9\s\-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopwords.has(w));

    // build ngrams (uni/bi/tri) to catch multi-word skills
    const ngrams = new Map();
    for (let i = 0; i < cleaned.length; i++) {
      for (let n = 1; n <= 3 && i + n <= cleaned.length; n++) {
        const token = cleaned.slice(i, i + n).join(" ");
        if (token.length > 2) ngrams.set(token, (ngrams.get(token) || 0) + 1);
      }
    }

    // Known skill candidates come from parsed resume and baseline
    const knownSet = new Set([...(result?.skills || []).map(cleanLower), ...(ROLE_SKILL_PROFILES[selectedRole]?.skills || ROLE_SKILL_PROFILES.sde.skills).map(cleanLower)]);

    // score candidates: known skill matches get priority, frequency adds weight
    const scored = [];
    for (const [token, freq] of ngrams.entries()) {
      const tokenKey = token.toLowerCase();
      let score = freq;
      if (knownSet.has(tokenKey)) score += 5;
      if (tokenKey.split(" ").length > 1) score += 1; // multi-word favor
      if (tokenKey.length <= 3) score = 0;
      if (score > 0) scored.push({ token: tokenKey, score });
    }

    scored.sort((a, b) => b.score - a.score);

    // return top tokens, dedup
    const found = [];
    for (const s of scored) {
      if (!found.includes(s.token)) found.push(s.token);
      if (found.length >= 40) break;
    }
    return found;
  };

  const handleCompareJD = () => {
    if (!result) return;

    const jdText = (jobDesc || "").trim();
    const resumeSkills = (result.skills || []).map(cleanLower);

    // Extract keywords and prioritize
    const jdKeywords = extractKeywordsFromText(jdText);
    const matched = jdKeywords.filter((s) => resumeSkills.includes(s));
    const score = jdKeywords.length ? Math.round((matched.length / jdKeywords.length) * 100) : 0;
    setJdMatchScore(score);

    const missing = jdKeywords.filter((s) => !resumeSkills.includes(s));
    setMissingFromResume(missing);

    // Detect required vs preferred blocks by simple keywords
    const lines = jdText.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const requiredLines = lines.filter((l) => /required|must have|required qualifications|requirements/i.test(l));
    const preferredLines = lines.filter((l) => /preferred|nice to have|desired|preferred qualifications/i.test(l));

    const requiredSkills = new Set();
    const preferredSkills = new Set();

    requiredLines.forEach((l) => extractKeywordsFromText(l).forEach((k) => requiredSkills.add(k)));
    preferredLines.forEach((l) => extractKeywordsFromText(l).forEach((k) => preferredSkills.add(k)));

    // Prioritize missing skills: required > preferred > baseline
    const missingPriority = missing.map((m) => {
      const priority = requiredSkills.has(m) ? 3 : preferredSkills.has(m) ? 2 : 1;
      return { skill: m, priority };
    });

    missingPriority.sort((a, b) => b.priority - a.priority);

    // Suggested bullets for top missing skills
    const topMissing = missingPriority.map((m) => m.skill).slice(0, 6);
    const bullets = topMissing.map((skill) => {
      return `Added experience using ${skill}: "Led implementation of ${skill} in a project, improving performance or delivery by X%"`;
    });

    // Experience hints
    const ex = Array.isArray(result.experience) ? result.experience : [];
    const hints = ex.map((line) => {
      const hasNumber = /\d/.test(line);
      if (hasNumber) return null;
      // try to extract a verb and object
      const words = line.split(/\s+/);
      const verb = words[0] || "Improved";
      return `Rewrite: Start with an action verb and add a measurable outcome. Example: \"${verb}ed ... increased X by Y%\"`;
    }).filter(Boolean).slice(0, 6);

    setExperienceHints(hints);

    // prioritize missing skills list for UI
    setMissingFromResume(missingPriority.map((m) => m.skill));
  };

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    setFile(nextFile);
    setError("");
    setSuccess("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a PDF or DOCX file first.");
      return;
    }

    setParsing(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/parse-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Resume parsing failed.");
      }

      setResult(data.parsed || null);
      setSuccess("Resume analyzed successfully.");
    } catch (err) {
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setParsing(false);
    }
  };

  const handleSaveToProfile = async () => {
    if (!result) {
      setError("Analyze a resume first, then save it to your profile.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parsedResume: result,
          resumeUrl: result.resumeUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save parsed resume.");
      }

      if (onUserUpdate && typeof onUserUpdate === "function") {
        onUserUpdate(data.user);
      }

      setSuccess("Parsed resume saved to your profile.");
    } catch (err) {
      setError(err.message || "Failed to save parsed resume.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="grid gap-6 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 px-6 py-7 text-white lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-4">
            <p className="uppercase text-xs tracking-[0.3em] text-white/55 font-semibold">
              Resume analyser
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
              Turn a resume into a stronger shortlist match.
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-white/75">
              Upload a PDF or DOCX, inspect keyword coverage, and get focused edits before applying.
            </p>

            <div className="mt-4">
              <label className="block text-xs uppercase tracking-[0.24em] text-white/60 font-semibold mb-2">
                Target Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-white/20 rounded-lg bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm"
              >
                {Object.entries(ROLE_SKILL_PROFILES).map(([key, profile]) => (
                  <option key={key} value={key} className="bg-neutral-950">
                    {profile.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-sm text-white/80">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">ATS scan</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Keyword gaps</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Impact feedback</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-neutral-950">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Current file</p>
                <p className="mt-1 text-sm font-semibold">{fileName}</p>
              </div>
            </div>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/20 bg-black/10 px-4 py-10 text-center transition hover:bg-black/20">
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-neutral-950">
                <ArrowUpRight size={20} />
              </div>
              <div>
                <p className="text-sm font-medium">Drop a resume here</p>
                <p className="mt-1 text-xs text-white/60">PDF, DOC, or DOCX up to 10 MB</p>
              </div>
            </label>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={parsing}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 disabled:opacity-60"
              >
                {parsing ? "Analyzing..." : "Analyze resume"}
              </button>

              <button
                type="button"
                onClick={handleSaveToProfile}
                disabled={saving || !result || !user}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save to profile"}
              </button>
            </div>

            {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
            {success && <p className="mt-3 text-xs text-emerald-300">{success}</p>}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {scoreCards.map((item) => (
          <div key={item.title} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400 font-semibold">{item.title}</p>
                <h2 className="mt-2 text-3xl font-serif">{item.score}</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <Target size={16} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-600">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="uppercase text-xs text-neutral-400 font-semibold">Recommendations</p>
              <h2 className="font-serif text-2xl mt-1">What to improve next</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {suggestions.map((suggestion) => (
              <div key={suggestion} className="flex gap-3 rounded-2xl border border-neutral-200 px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-black" />
                <p className="text-sm leading-6 text-neutral-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="uppercase text-xs text-white/45 font-semibold">Matched skills</p>
              <h2 className="font-serif text-2xl mt-1">Relevant keywords</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
              <Sparkles size={18} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {keywords.length === 0 && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/65">
                Analyze a resume to see matched keywords
              </span>
            )}

            {keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/85">
                {keyword}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45 font-semibold">Compare & optimize</p>
                <h3 className="font-serif text-xl mt-1 text-white">Job description match</h3>
              </div>
            </div>
            <p className="text-sm text-white/75 mb-4">Paste a job description to compute tailored skill match and missing keywords.</p>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full min-h-[120px] resize-none rounded-2xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-blue-400 focus:outline-none backdrop-blur-sm"
            />

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleCompareJD}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 transition"
                disabled={!result}
              >
                Compare to resume
              </button>

              {jdMatchScore !== null && (
                <div className="text-sm font-semibold text-white">
                  JD match: <span className={jdMatchScore >= 70 ? "text-emerald-400" : jdMatchScore >= 50 ? "text-amber-400" : "text-rose-400"}>{jdMatchScore}%</span>
                </div>
              )}
            </div>

            {missingFromResume.length > 0 && (
              <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold text-amber-300">Missing keywords from resume:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {missingFromResume.map((m) => (
                    <span key={m} className="rounded-full border border-amber-500/50 bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-200">{m}</span>
                  ))}
                </div>
              </div>
            )}

            {experienceHints.length > 0 && (
              <div className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold text-blue-300">Suggested bullet improvements</p>
                <ul className="mt-3 space-y-2">
                  {experienceHints.map((h, i) => (
                    <li key={i} className="text-sm text-white/80 flex gap-3">
                      <span className="flex-shrink-0 text-blue-400 font-bold">{i + 1}.</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45 font-semibold">Next action</p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Paste a job description on the next iteration and compare it directly against the resume.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="uppercase text-xs text-neutral-400 font-semibold">Deep analysis</p>
              <h2 className="font-serif text-2xl mt-1">Section health</h2>
            </div>
            <div className="rounded-full border border-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-700">
              {analysis.completenessScore}% complete
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {analysis.sectionHealth.map((item) => (
              <div key={item.key}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <p className="font-medium text-neutral-800">{item.label}</p>
                  <p className="text-neutral-500">{item.detail}</p>
                </div>
                <div className="h-2 rounded-full bg-neutral-100">
                  <div className="h-2 rounded-full bg-neutral-900" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="uppercase text-xs text-neutral-400 font-semibold">ATS signals</p>
              <h2 className="font-serif text-2xl mt-1">Risk scan</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <AlertTriangle size={18} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {analysis.atsSignals.map((signal) => (
              <div
                key={signal.label}
                className={`rounded-2xl border px-4 py-3 ${
                  signal.status === "good"
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-amber-200 bg-amber-50/50"
                }`}
              >
                <p className="text-sm font-semibold text-neutral-800">{signal.label}</p>
                <p className="mt-1 text-sm text-neutral-600">{signal.note}</p>
              </div>
            ))}

            {/* Market gap summary */}
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/40 px-4 py-3">
              <p className="text-sm font-semibold text-neutral-800">Market gap</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-sm text-neutral-600">Baseline skill coverage</p>
                <div className="text-sm font-semibold">{analysis.market.marketGapScore}%</div>
              </div>

              {analysis.market.missingBaseline && analysis.market.missingBaseline.length > 0 ? (
                <div className="mt-3 text-sm text-neutral-700">
                  <p className="font-medium">Missing common market skills</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysis.market.missingBaseline.slice(0, 8).map((m) => (
                      <span key={m} className="rounded-full border px-2 py-1 text-xs">{m}</span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">Tip: Add 2-3 missing baseline skills into projects or the skills section.</p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-neutral-700">Good coverage of common market skills.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="uppercase text-xs text-neutral-400 font-semibold">What is working</p>
          <h2 className="font-serif text-2xl mt-1">Strengths</h2>
          <div className="mt-5 space-y-3">
            {analysis.strengths.map((item) => (
              <div key={item} className="rounded-2xl border border-neutral-200 px-4 py-3">
                <p className="text-sm text-neutral-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="uppercase text-xs text-neutral-400 font-semibold">What to fix first</p>
          <h2 className="font-serif text-2xl mt-1">Gaps</h2>
          <div className="mt-5 space-y-3">
            {analysis.gaps.map((item) => (
              <div key={item} className="rounded-2xl border border-neutral-200 px-4 py-3">
                <p className="text-sm text-neutral-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm">
        <p className="uppercase text-xs text-white/45 font-semibold">Prioritized plan</p>
        <h2 className="font-serif text-2xl mt-1">7-day action sprint</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {analysis.actionSprint.map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Step {index + 1}</p>
              <p className="mt-2 text-sm text-white/85 leading-6">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}