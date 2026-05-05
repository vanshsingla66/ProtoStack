import { useMemo, useState } from "react";
import {
  Send,
  Play,
  BookOpen,
  Globe,
  Code,
  Copy,
} from "lucide-react";

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
    "All Frontend Basics",
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
    { title: "Build Responsive Layouts (YouTube)", url: "https://www.youtube.com/results?search_query=responsive+web+design+tutorial" },
  ],
  "JavaScript (ES6+)": [
    { title: "You Don't Know JS (book)", url: "https://github.com/getify/You-Dont-Know-JS" },
    { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    { title: "JS YouTube Tutorials", url: "https://www.youtube.com/results?search_query=javascript+tutorial+beginner" },
  ],
  "React & State Management": [
    { title: "Official React Docs", url: "https://react.dev/" },
    { title: "React YouTube Tutorials", url: "https://www.youtube.com/results?search_query=react+tutorial+beginner" },
    { title: "freeCodeCamp React", url: "https://www.freecodecamp.org/learn/front-end-libraries/react/" },
  ],
  "Testing & Tooling": [
    { title: "Jest Docs", url: "https://jestjs.io/" },
    { title: "Testing Library Guide", url: "https://testing-library.com/" },
  ],
  "Performance & Accessibility": [
    { title: "Web.dev Performance", url: "https://web.dev/" },
    { title: "A11y Project", url: "https://www.a11yproject.com/" },
  ],
  "Databases (SQL/NoSQL)": [
    { title: "Postgres Docs", url: "https://www.postgresql.org/docs/" },
    { title: "MongoDB Manual", url: "https://www.mongodb.com/docs/" },
    { title: "GeeksforGeeks SQL", url: "https://www.geeksforgeeks.org/sql-tutorial/" },
  ],
  "Algorithms & Data Structures": [
    { title: "GFG Algorithms", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/" },
    { title: "Sedgewick (book)", url: "https://algs4.cs.princeton.edu/" },
    { title: "Algorithms YouTube", url: "https://www.youtube.com/results?search_query=algorithms+tutorial" },
  ],
  // fallback
};

function getResourcesFor(topic) {
  return RESOURCE_MAP[topic] || [
    { title: "Search on YouTube", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}` },
    { title: "Search on Google", url: `https://www.google.com/search?q=${encodeURIComponent(topic)}` },
    { title: "GeeksforGeeks", url: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topic)}` },
  ];
}

export default function RoadmapPage() {
  const [role, setRole] = useState("Frontend Developer");
  const [level, setLevel] = useState("Beginner");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);

  const availableTopics = useMemo(() => ROLE_TEMPLATES[role] || [], [role]);

  function toggleTopic(t) {
    setSelectedTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function generate() {
    const topics = selectedTopics.length ? selectedTopics : availableTopics;
    const plan = topics.map((t, idx) => ({
      title: t,
      steps: [
        `Learn fundamentals of ${t}`,
        `Build a small project focusing on ${t}`,
        `Practice problems and read docs for ${t}`,
      ],
      resources: getResourcesFor(t),
      order: idx + 1,
    }));

    setRoadmap({ role, level, generatedAt: new Date().toISOString(), plan });
  }

  function toggleWeak(topic) {
    setWeakTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
  }

  function copyRoadmap() {
    if (!roadmap) return;
    const text = [`Roadmap - ${roadmap.role} (${roadmap.level})`, "\n"].concat(
      roadmap.plan.map((p) => `#${p.order} ${p.title}\n- ${p.steps.join('\n- ')}`)
    ).join('\n\n');
    navigator.clipboard?.writeText(text);
    alert("Roadmap copied to clipboard");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Controls */}
        <div className="md:w-1/3 bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3">Generate Roadmap</h2>
          <p className="text-sm text-gray-600 mb-4">Choose a role, difficulty level, and topics to focus on. We'll generate a step-by-step roadmap with resources.</p>

          <label className="block text-sm font-medium mt-2">Role</label>
          <select value={role} onChange={(e) => { setRole(e.target.value); setSelectedTopics([]); setRoadmap(null); setWeakTopics([]); }} className="mt-2 w-full border rounded-md px-3 py-2">
            {Object.keys(ROLE_TEMPLATES).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          <label className="block text-sm font-medium mt-4">Level</label>
          <div className="mt-2 flex gap-2">
            {['Beginner','Intermediate','Advanced'].map(l => (
              <button key={l} onClick={() => setLevel(l)} className={`px-3 py-1 rounded-md text-sm ${level===l? 'bg-black text-white':'bg-gray-50'}`}>{l}</button>
            ))}
          </div>

          <label className="block text-sm font-medium mt-4">Topics (optional)</label>
          <div className="mt-2 max-h-40 overflow-auto border rounded-md p-2 space-y-2">
            {availableTopics.map((t) => (
              <div key={t} className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selectedTopics.includes(t)} onChange={() => toggleTopic(t)} />
                  <span>{t}</span>
                </label>
                <button onClick={() => toggleWeak(t)} className={`text-xs px-2 py-1 rounded ${weakTopics.includes(t)? 'bg-red-100 text-red-700':'bg-gray-100'}`}>{weakTopics.includes(t)? 'Weak ✔':'Mark weak'}</button>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <button onClick={generate} className="flex-1 bg-black text-white px-4 py-2 rounded-md inline-flex items-center justify-center gap-2">
              <Send size={14} /> Generate
            </button>
            <button onClick={() => { setSelectedTopics([]); setRoadmap(null); setWeakTopics([]); }} className="px-4 py-2 border rounded-md">Reset</button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="md:w-2/3">
          {!roadmap && (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <h3 className="text-lg font-semibold">No roadmap yet</h3>
              <p className="text-sm text-gray-600 mt-2">Pick a role and press Generate to view a tailored roadmap.</p>
            </div>
          )}

          {roadmap && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{roadmap.role} — {roadmap.level}</h3>
                  <p className="text-sm text-gray-500">Generated: {new Date(roadmap.generatedAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={copyRoadmap} className="flex items-center gap-2 px-3 py-2 border rounded-md"><Copy size={14}/> Copy</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {roadmap.plan.map((p) => (
                  <div key={p.title} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Step {p.order}</div>
                        <h4 className="text-lg font-semibold mt-1">{p.title}</h4>
                      </div>
                      <div className="text-sm text-gray-400">{p.steps.length} tasks</div>
                    </div>

                    <ol className="mt-3 list-decimal list-inside text-sm text-gray-700 space-y-1">
                      {p.steps.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ol>

                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-2">Resources</div>
                      <ul className="space-y-2">
                        {p.resources.slice(0,4).map((r, i) => (
                          <li key={i} className="text-sm">
                            <a href={r.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-2">
                              <Play size={14} /> {r.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weak-topic resources */}
              {weakTopics.length > 0 && (
                <div className="border rounded-lg p-4 bg-white">
                  <h4 className="font-semibold">Targeted resources for weak topics</h4>
                  <p className="text-sm text-gray-500">We found these resources based on what you marked as weak.</p>

                  <div className="mt-3 grid md:grid-cols-2 gap-3">
                    {weakTopics.map((wt) => (
                      <div key={wt} className="p-3 border rounded-md">
                        <div className="font-medium mb-2">{wt}</div>
                        <ul className="text-sm space-y-2">
                          {getResourcesFor(wt).map((r, idx) => (
                            <li key={idx}>
                              <a href={r.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-2"><BookOpen size={14}/> {r.title}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}