import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Code,
  Globe,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  Trash2,
  Play,
  Layers3,
  FileText,
} from "lucide-react";

const STORAGE_KEY = "protostack-roadmap-history-v2";

const ROLE_TEMPLATES = {
  "Frontend Developer": [
    "HTML & CSS",
    "JavaScript (ES6+)",
    "React & State Management",
    "Testing & Tooling",
    "Performance & Accessibility",
  ],
  "Backend Developer": [
    "Programming Language (Node/Python/Java)",
    "HTTP & REST APIs",
    "Databases (SQL/NoSQL)",
    "Authentication & Security",
    "Scalability & DevOps",
  ],
  "Data Scientist": [
    "Python & Libraries (NumPy/Pandas)",
    "Statistics & Probability",
    "Machine Learning Basics",
    "Modeling & Evaluation",
    "Deployment & MLOps",
  ],
  "DevOps / Cloud": [
    "Linux & Networking",
    "Containers (Docker)",
    "Kubernetes & Orchestration",
    "CI/CD Pipelines",
    "Monitoring & Cost Optimization",
  ],
  "Full-Stack": [
    "Frontend Foundations",
    "Backend Fundamentals",
    "Databases",
    "Deployment",
    "End-to-end Projects",
  ],
};

const RESOURCE_MAP = {
  "HTML & CSS": [
    { title: "MDN HTML Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { title: "CSS-Tricks", url: "https://css-tricks.com/" },
    { title: "Responsive Design YouTube", url: "https://www.youtube.com/results?search_query=responsive+web+design+tutorial" },
  ],
  "JavaScript (ES6+)": [
    { title: "You Don't Know JS", url: "https://github.com/getify/You-Dont-Know-JS" },
    { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    { title: "JavaScript YouTube", url: "https://www.youtube.com/results?search_query=javascript+tutorial+beginner" },
  ],
  "React & State Management": [
    { title: "Official React Docs", url: "https://react.dev/" },
    { title: "React YouTube", url: "https://www.youtube.com/results?search_query=react+tutorial+beginner" },
    { title: "freeCodeCamp React", url: "https://www.freecodecamp.org/learn/front-end-libraries/react/" },
  ],
  "Testing & Tooling": [
    { title: "Jest Docs", url: "https://jestjs.io/" },
    { title: "Testing Library", url: "https://testing-library.com/" },
  ],
  "Performance & Accessibility": [
    { title: "web.dev Performance", url: "https://web.dev/" },
    { title: "A11y Project", url: "https://www.a11yproject.com/" },
  ],
  "Databases (SQL/NoSQL)": [
    { title: "Postgres Docs", url: "https://www.postgresql.org/docs/" },
    { title: "MongoDB Docs", url: "https://www.mongodb.com/docs/" },
    { title: "GeeksforGeeks SQL", url: "https://www.geeksforgeeks.org/sql-tutorial/" },
  ],
  "Algorithms & Data Structures": [
    { title: "GFG Algorithms", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/" },
    { title: "Princeton Algorithms", url: "https://algs4.cs.princeton.edu/" },
    { title: "Algorithms YouTube", url: "https://www.youtube.com/results?search_query=algorithms+tutorial" },
  ],
};

function loadSavedRoadmaps(key = STORAGE_KEY) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildResources(topic) {
  return RESOURCE_MAP[topic] || [
    { title: "YouTube Search", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}` },
    { title: "Documentation Search", url: `https://www.google.com/search?q=${encodeURIComponent(topic + " documentation")}` },
    { title: "GeeksforGeeks", url: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topic)}` },
  ];
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatRange(start, end) {
  const format = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  return `${format.format(start)} - ${format.format(end)}`;
}

function slugTopic(topic) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildRoadmap({ role, level, topics, weakTopics }) {
  const levelMap = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  const weeksPerTopic = levelMap[level] || 1;
  const startDate = new Date();
  const calendar = [];

  topics.forEach((topic) => {
    for (let weekIndex = 0; weekIndex < weeksPerTopic; weekIndex += 1) {
      const globalWeek = calendar.length + 1;
      const weekStart = addDays(startDate, (globalWeek - 1) * 7);
      const weekEnd = addDays(weekStart, 6);
      const isFirstWeek = weekIndex === 0;

      calendar.push({
        week: globalWeek,
        topic,
        phase: isFirstWeek ? "Foundation" : weekIndex === weeksPerTopic - 1 ? "Project & review" : "Practice & build",
        dateRange: formatRange(weekStart, weekEnd),
        sessions: [
          { day: "Mon", task: `Learn ${topic} fundamentals`, type: "Study" },
          { day: "Tue", task: `Follow a guided lesson on ${topic}`, type: "Video" },
          { day: "Wed", task: `Work through docs and examples`, type: "Docs" },
          { day: "Thu", task: `Solve practice tasks for ${topic}`, type: "Practice" },
          { day: "Fri", task: `Build a mini project using ${topic}`, type: "Build" },
          { day: "Sat", task: `Review weak points and make notes`, type: "Review" },
          { day: "Sun", task: `Rest and plan next week`, type: "Reset" },
        ],
        deliverable: isFirstWeek ? `Core notes and flashcards for ${topic}` : `Project update and checklist for ${topic}`,
      });
    }
  });

  const modules = topics.map((topic, index) => ({
    id: `${slugTopic(topic)}-${index + 1}`,
    topic,
    order: index + 1,
    durationWeeks: weeksPerTopic,
    overview: `A full course module to master ${topic}.`,
    lessons: [
      `Core concepts of ${topic}`,
      `Hands-on implementation of ${topic}`,
      `One project and one assessment for ${topic}`,
    ],
    outcomes: [
      `Understand the building blocks of ${topic}`,
      `Complete at least one practical mini-project`,
      `Prepare a revision checklist for future reference`,
    ],
    resources: buildResources(topic),
  }));

  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    title: `${role} Course Plan`,
    role,
    level,
    topics,
    weakTopics,
    createdAt: new Date().toISOString(),
    totalWeeks: calendar.length,
    calendar,
    modules,
  };
}

export default function RoadmapPage({ user }) {
  const [role, setRole] = useState("Frontend Developer");
  const [level, setLevel] = useState("Beginner");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [customTopics, setCustomTopics] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [roadmapHistory, setRoadmapHistory] = useState([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState(null);

  const storageKey = `${STORAGE_KEY}-${user?.id ?? "guest"}`;

  // Load saved roadmaps: prefer server when authenticated, else localStorage
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      // If user is authenticated, try fetching from API
      if (user) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/roadmaps`, {
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            if (!mounted) return;
            setRoadmapHistory(Array.isArray(data.roadmaps) ? data.roadmaps : []);
            setActiveRoadmapId((data.roadmaps && data.roadmaps[0]?.id) || (data.roadmaps && data.roadmaps[0]?._id) || null);
            // also persist local copy keyed by user
            try { window.localStorage.setItem(storageKey, JSON.stringify(data.roadmaps)); } catch (e) { console.error("localStorage save failed", e); }
            return;
          }
        } catch (err) {
          console.error("Failed to fetch roadmaps from API, falling back to localStorage", err);
        }
      }

      // fallback to localStorage
      try {
        const local = loadSavedRoadmaps(storageKey);
        if (!mounted) return;
        setRoadmapHistory(local || []);
        setActiveRoadmapId(local?.[0]?.id ?? local?.[0]?._id ?? null);
      } catch (err) {
        console.error("Failed to load local roadmaps", err);
      }
    };

    load();

    return () => { mounted = false; };
  }, [user, storageKey]);

  const availableTopics = useMemo(() => ROLE_TEMPLATES[role] || [], [role]);
  const activeRoadmap = useMemo(
    () => roadmapHistory.find((item) => item.id === activeRoadmapId) || null,
    [roadmapHistory, activeRoadmapId],
  );
  const topicPool = useMemo(() => [...availableTopics, ...customTopics], [availableTopics, customTopics]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(roadmapHistory));
    } catch {
      // Ignore localStorage failures.
    }
  }, [roadmapHistory, storageKey]);

  function deleteRoadmap(id) {
    // If authenticated, delete on server first
    if (user) {
      fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/roadmaps/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then((res) => {
        if (!res.ok) console.error("Failed to delete roadmap on server");
        setRoadmapHistory((prev) => prev.filter((item) => (item.id || item._id) !== id));
        setActiveRoadmapId((currentId) => (currentId === id ? null : currentId));
      }).catch((err) => {
        console.error("Delete request failed", err);
      });
      return;
    }

    // Local-only deletion
    setRoadmapHistory((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next;
    });

    setActiveRoadmapId((currentId) => {
      if (currentId !== id) return currentId;
      const remaining = roadmapHistory.filter((item) => item.id !== id);
      return remaining[0]?.id ?? null;
    });
  }

  function resetBuilder() {
    setSelectedTopics([]);
    setCustomTopicInput("");
    setCustomTopics([]);
    setWeakTopics([]);
    setActiveRoadmapId(null);
  }

  function toggleTopic(topic) {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic]));
  }

  function addCustomTopic() {
    const nextTopic = customTopicInput.trim();
    if (!nextTopic) return;

    setCustomTopics((prev) => (prev.includes(nextTopic) ? prev : [...prev, nextTopic]));
    setSelectedTopics((prev) => (prev.includes(nextTopic) ? prev : [...prev, nextTopic]));
    setCustomTopicInput("");
  }

  function toggleWeak(topic) {
    setWeakTopics((prev) => (prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic]));
  }

  function generateRoadmap() {
    const finalTopics = selectedTopics.length ? selectedTopics : topicPool;
    const uniqueTopics = [...new Set(finalTopics.map((topic) => topic.trim()).filter(Boolean))];
    if (!uniqueTopics.length) return;

    // If authenticated, request server to generate and save roadmap
    if (user) {
      (async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/roadmaps/generate`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role, level, topics: uniqueTopics, weakTopics }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error("Server error generating roadmap", err);
            return;
          }

          const data = await res.json();
          const roadmap = data.roadmap;
          // normalize id field
          const id = roadmap.id || roadmap._id || roadmap._doc?._id;
          const normalized = { ...roadmap, id: id };

          setRoadmapHistory((prev) => [normalized, ...prev.filter((item) => (item.id || item._id) !== id)]);
          setActiveRoadmapId(id);
        } catch (err) {
          console.error("Failed to generate roadmap on server", err);
        }
      })();
      return;
    }

    // Fallback: client-side generation
    const nextRoadmap = buildRoadmap({ role, level, topics: uniqueTopics, weakTopics });
    setRoadmapHistory((prev) => [nextRoadmap, ...prev.filter((item) => item.id !== nextRoadmap.id)]);
    setActiveRoadmapId(nextRoadmap.id);
  }

  function copyRoadmap() {
    if (!activeRoadmap) return;

    const text = [
      `${activeRoadmap.role} Course Plan (${activeRoadmap.level})`,
      `Topics: ${activeRoadmap.topics.join(", ")}`,
      `Weeks: ${activeRoadmap.totalWeeks}`,
      "",
      ...activeRoadmap.modules.map((module) => [
        `Module ${module.order}: ${module.topic}`,
        ...module.lessons.map((lesson) => `- ${lesson}`),
      ].join("\n")),
    ].join("\n");

    navigator.clipboard?.writeText(text);
  }

  function createNewRoadmap() {
    resetBuilder();
    setRole("Frontend Developer");
    setLevel("Beginner");
  }

  const weakTopicResources = weakTopics.map((topic) => ({
    topic,
    resources: buildResources(topic),
  }));

  return (
    <div className="relative isolate min-h-screen bg-white text-black">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.07),transparent_40%),linear-gradient(180deg,#ffffff_0%,#f7f7f7_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-6 rounded-3xl border border-black/10 bg-white/90 backdrop-blur px-5 sm:px-7 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                <Code size={12} /> learning roadmap studio
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
                Plan a full course, timeline, and resources in one place
              </h1>
              <p className="mt-2 max-w-3xl text-sm sm:text-base text-black/60 leading-relaxed">
                Build a roadmap, save it for later, reopen it anytime, and remove older courses when you no longer need them.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm text-black/70">
                <div className="text-xs uppercase tracking-[0.2em] text-black/45">Saved roadmaps</div>
                <div className="mt-1 font-semibold text-black">{roadmapHistory.length}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-black px-4 py-3 text-sm font-semibold text-white">
                <Globe size={14} className="inline-block mr-2" /> Dynamic timeline
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[360px_1fr] gap-6">
          <aside className="bg-white/90 backdrop-blur border border-black/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-5 sm:p-6 h-fit sticky top-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black/70">
                  <Sparkles size={12} /> roadmap generator
                </div>
                <h2 className="mt-3 text-2xl font-black tracking-tight">Build a course that fits your goal</h2>
                <p className="mt-2 text-sm text-black/65 leading-relaxed">
                  Pick a role, choose topics, and generate a timeline with resources, tasks, and a complete course plan.
                </p>
              </div>
            </div>

            <label className="block text-sm font-semibold mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setSelectedTopics([]);
                setWeakTopics([]);
                setActiveRoadmapId(null);
              }}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            >
              {Object.keys(ROLE_TEMPLATES).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <label className="block text-sm font-semibold mb-2 mt-4">Level</label>
            <div className="grid grid-cols-3 gap-2">
              {["Beginner", "Intermediate", "Advanced"].map((item) => (
                <button
                  key={item}
                  onClick={() => setLevel(item)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${level === item ? "bg-black text-white" : "bg-black/5 text-black/70 hover:bg-black/10"}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-black/3 p-4">
              <label className="block text-sm font-semibold mb-2">Add custom topic</label>
              <div className="flex gap-2">
                <input
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTopic()}
                  placeholder="e.g. Node.js, SQL, ML"
                  className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
                <button onClick={addCustomTopic} className="rounded-xl bg-black px-3 py-2 text-white">
                  <Plus size={16} />
                </button>
              </div>
              {customTopics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {customTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${selectedTopics.includes(topic) ? "bg-black text-white border-black" : "bg-white border-black/10 text-black/70 hover:border-black/25"}`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Choose topics</label>
                <span className="text-xs text-black/50">{selectedTopics.length || topicPool.length} available</span>
              </div>
              <div className="max-h-65 overflow-auto space-y-2 pr-1">
                {topicPool.map((topic) => (
                  <div key={topic} className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-3 py-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic)}
                        onChange={() => toggleTopic(topic)}
                        className="accent-black"
                      />
                      <span>{topic}</span>
                    </label>
                    <button
                      onClick={() => toggleWeak(topic)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${weakTopics.includes(topic) ? "bg-black text-white" : "bg-black/5 text-black/60"}`}
                    >
                      weak
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={generateRoadmap}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                <Send size={15} /> Generate
              </button>
              <button
                onClick={createNewRoadmap}
                className="rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            <div className="mt-5 border-t border-black/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">Saved roadmaps</h2>
                <span className="text-xs text-black/45">{roadmapHistory.length}</span>
              </div>
              <div className="space-y-2 max-h-65 overflow-auto pr-1">
                {roadmapHistory.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-black/10 p-4 text-sm text-black/50">
                    Generate a roadmap to save it here.
                  </div>
                ) : (
                  roadmapHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveRoadmapId(item.id)}
                      className={`w-full text-left rounded-2xl border px-4 py-3 transition-colors ${activeRoadmapId === item.id ? "border-black bg-black text-white" : "border-black/10 bg-white hover:border-black/25"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{item.role}</div>
                          <div className={`text-xs mt-1 ${activeRoadmapId === item.id ? "text-white/70" : "text-black/50"}`}>
                            {item.level} · {item.topics.length} topics
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteRoadmap(item.id);
                            }}
                            className={`rounded-full p-2 transition-colors ${activeRoadmapId === item.id ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/5 text-black/55 hover:bg-black/10"}`}
                            aria-label={`Delete ${item.role} roadmap`}
                          >
                            <Trash2 size={13} />
                          </button>
                          <ChevronRight size={15} className={activeRoadmapId === item.id ? "text-white" : "text-black/35"} />
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            {!activeRoadmap ? (
              <section className="min-h-[60vh] rounded-3xl border border-dashed border-black/15 bg-white/80 backdrop-blur p-8 sm:p-12 flex items-center justify-center text-center">
                <div className="max-w-xl">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
                    <Target size={22} />
                  </div>
                  <h2 className="mt-6 text-3xl font-black tracking-tight">Generate your roadmap</h2>
                  <p className="mt-3 text-black/65 leading-relaxed">
                    Choose topics, press generate, and get a full course with a calendar timeline, weak-topic resources, and saved history.
                  </p>
                </div>
              </section>
            ) : (
              <>
                <section className="rounded-3xl border border-black/10 bg-white/90 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                        <BookOpen size={12} /> full course generator
                      </div>
                      <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">{activeRoadmap.role}</h2>
                      <p className="mt-3 max-w-2xl text-sm sm:text-base text-black/65 leading-relaxed">
                        {activeRoadmap.level} · {activeRoadmap.topics.length} topics · {activeRoadmap.totalWeeks} weeks · saved on {new Date(activeRoadmap.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={copyRoadmap} className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold hover:bg-black/5">
                        <Copy size={15} /> Copy plan
                      </button>
                      <button
                        onClick={() => activeRoadmap && deleteRoadmap(activeRoadmap.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
                      >
                        <Trash2 size={15} /> Delete course
                      </button>
                      <button onClick={generateRoadmap} className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white">
                        <Sparkles size={15} /> Generate new
                      </button>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-3xl border border-black/10 bg-white p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-black/45">Total weeks</div>
                    <div className="mt-3 text-3xl font-black">{activeRoadmap.totalWeeks}</div>
                    <div className="mt-2 text-sm text-black/60">Timeline generated dynamically from your selected topics.</div>
                  </div>
                  <div className="rounded-3xl border border-black/10 bg-white p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-black/45">Topics</div>
                    <div className="mt-3 text-3xl font-black">{activeRoadmap.topics.length}</div>
                    <div className="mt-2 text-sm text-black/60">Each topic becomes a full module with lessons and outcomes.</div>
                  </div>
                  <div className="rounded-3xl border border-black/10 bg-white p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-black/45">Weak topics</div>
                    <div className="mt-3 text-3xl font-black">{activeRoadmap.weakTopics.length}</div>
                    <div className="mt-2 text-sm text-black/60">Extra documentation, YouTube, and GFG links appear here.</div>
                  </div>
                  <div className="rounded-3xl border border-black/10 bg-black text-white p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/55">Course format</div>
                    <div className="mt-3 text-3xl font-black">Course + calendar</div>
                    <div className="mt-2 text-sm text-white/70">Study, practice, build, and revise in one view.</div>
                  </div>
                </section>

                <section className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6">
                  <div className="rounded-3xl border border-black/10 bg-white/90 backdrop-blur p-6">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div>
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/45">
                          <Layers3 size={12} /> Full course modules
                        </div>
                        <h3 className="mt-2 text-2xl font-black">Topics you can revisit later</h3>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 text-xs text-black/55">
                        <CheckCircle2 size={14} /> saved locally
                      </div>
                    </div>

                    <div className="space-y-4">
                      {activeRoadmap.modules.map((module) => (
                        <div key={module.id} className="rounded-2xl border border-black/10 p-5 bg-black/2">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                              <div className="text-xs uppercase tracking-[0.2em] text-black/45">Module {module.order}</div>
                              <h4 className="mt-2 text-xl font-bold">{module.topic}</h4>
                              <p className="mt-2 text-sm text-black/60 leading-relaxed">{module.overview}</p>
                            </div>
                            <div className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white self-start">
                              {module.durationWeeks} week course
                            </div>
                          </div>

                          <div className="mt-4 grid md:grid-cols-3 gap-3">
                            {module.lessons.map((lesson) => (
                              <div key={lesson} className="rounded-xl bg-white border border-black/10 p-3 text-sm text-black/75">
                                {lesson}
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 grid md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Outcomes</div>
                              <ul className="mt-2 space-y-2 text-sm text-black/70">
                                {module.outcomes.map((item) => (
                                  <li key={item} className="flex gap-2">
                                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Resources</div>
                              <div className="mt-2 space-y-2">
                                {module.resources.map((resource) => (
                                  <a
                                    key={resource.url}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black/75 hover:border-black/25 hover:text-black"
                                  >
                                    <Play size={14} />
                                    <span>{resource.title}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-3xl border border-black/10 bg-white/90 backdrop-blur p-6">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/45">
                        <CalendarDays size={12} /> Timeline calendar
                      </div>
                      <h3 className="mt-2 text-2xl font-black">Weekly study calendar</h3>
                      <div className="mt-4 space-y-3 max-h-195 overflow-auto pr-1">
                        {activeRoadmap.calendar.map((week) => (
                          <div key={`${week.topic}-${week.week}`} className="rounded-2xl border border-black/10 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-xs uppercase tracking-[0.2em] text-black/45">Week {week.week}</div>
                                <div className="mt-1 font-bold text-black">{week.topic}</div>
                                <div className="mt-1 text-xs text-black/50">{week.phase} · {week.dateRange}</div>
                              </div>
                              <Clock3 size={14} className="text-black/45" />
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                              {week.sessions.map((session) => (
                                <div key={`${week.week}-${session.day}`} className="rounded-xl bg-black/4 px-3 py-2 text-black/70">
                                  <div className="font-semibold text-black">{session.day}</div>
                                  <div className="mt-1 leading-relaxed">{session.task}</div>
                                  <div className="mt-1 text-black/45 uppercase tracking-[0.18em]">{session.type}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-black/55">
                              <FileText size={12} /> Deliverable: {week.deliverable}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {weakTopicResources.length > 0 && (
                      <div className="rounded-3xl border border-black/10 bg-white/90 backdrop-blur p-6">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/45">
                          <Target size={12} /> weak-topic support
                        </div>
                        <h3 className="mt-2 text-2xl font-black">Extra help for weak topics</h3>
                        <div className="mt-4 space-y-4">
                          {weakTopicResources.map((entry) => (
                            <div key={entry.topic} className="rounded-2xl border border-black/10 p-4">
                              <div className="font-semibold">{entry.topic}</div>
                              <div className="mt-3 space-y-2">
                                {entry.resources.map((resource) => (
                                  <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="block text-sm text-black/70 hover:text-black hover:underline">
                                    {resource.title}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="rounded-3xl border border-black/10 bg-black text-white p-6">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Regenerate anytime</div>
                      <h3 className="mt-2 text-2xl font-black">Create a new roadmap when your goal changes</h3>
                      <p className="mt-3 text-sm text-white/70 leading-relaxed">
                        Your saved roadmaps stay in the sidebar, so you can revisit old courses later and generate a new one whenever you want.
                      </p>
                      <button onClick={createNewRoadmap} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">
                        <Sparkles size={15} /> Start a new roadmap
                      </button>
                    </div>
                  </div>
                </section>
              </>
            )}
          </main>
        </div>

        <footer className="mt-8 rounded-3xl border border-black/10 bg-black text-white px-6 sm:px-8 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                <BookOpen size={12} /> learning platform
              </div>
              <p className="mt-2 text-sm text-white/75 max-w-2xl">
                Roadmaps stay saved locally, so students can reopen courses, track timelines, and generate new plans whenever their goals change.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <a href="#" className="rounded-full border border-white/15 px-4 py-2 text-white/75 hover:text-white hover:border-white/30">Privacy</a>
              <a href="#" className="rounded-full border border-white/15 px-4 py-2 text-white/75 hover:text-white hover:border-white/30">Terms</a>
              <a href="#" className="rounded-full border border-white/15 px-4 py-2 text-white/75 hover:text-white hover:border-white/30">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}