import React, { useState } from "react";

const SUGGESTIONS = [
  "SDE (Software Engineer)", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Data Scientist", "ML Engineer",
  "DevOps Engineer", "Android Developer", "iOS Developer",
  "Blockchain Developer", "Cloud Architect", "Cybersecurity Analyst"
];

const MODEL_OPTIONS = [
  "gemini-2.5-flash-lite",   // fastest & most stable right now
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-3-flash",
];

export default function RoadmapPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("auto");
  const [duration, setDuration] = useState("auto");
  const [focus, setFocus] = useState("balanced");

  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [ctx, setCtx] = useState(null);

  function classifyQuery(query, level, duration, focus) {
    const q = query.toLowerCase();
    let domain = "Software Engineering";
    let detectedLevel = level === "auto" ? "beginner" : level;
    let detectedWeeks = duration === "auto" ? 12 : parseInt(duration) || 12;

    const domains = {
      frontend: ["frontend", "react", "vue", "css"],
      backend: ["backend", "node", "api"],
      "full stack": ["full stack", "mern"],
      "data science": ["data science", "pandas"],
      "machine learning": ["ml", "machine learning"],
      devops: ["devops", "docker"],
      sde: ["sde", "software engineer"],
    };

    for (const [d, kws] of Object.entries(domains)) {
      if (kws.some(k => q.includes(k))) {
        domain = d.charAt(0).toUpperCase() + d.slice(1);
        break;
      }
    }

    return { domain, level: detectedLevel, weeks: detectedWeeks, focus };
  }

  async function generateWithModel(model, attempt = 1) {
    const context = classifyQuery(query, level, duration, focus);
    setCtx(context);

    const prompt = `Create a clear ${context.weeks}-week roadmap for becoming a "${query}" at ${context.level} level.

Return ONLY valid JSON with this structure:
{
  "title": "string",
  "overview": "string",
  "weeks": [
    {
      "week": number,
      "title": "string",
      "objective": "string",
      "topics": ["array", "of", "strings"],
      "tasks": "string",
      "resources": ["array of resources"],
      "project": "string"
    }
  ]
}`;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=AIzaSyDAF35Ya0-NkCxYIX_RemsyVBbWDWLwywU`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8000,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "");
      throw new Error(`Model ${model} failed (${resp.status}): ${errorText}`);
    }

    const data = await resp.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!rawText) throw new Error("Empty response");

    // Clean and parse JSON
    let clean = rawText.replace(/```json|```/g, "").trim();
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) clean = match[0];

    return JSON.parse(clean);
  }

  async function generate() {
    if (!query.trim()) {
      setError("Please enter a role");
      return;
    }

    setLoading(true);
    setError("");
    setRoadmap(null);
    setStatus("Trying to generate roadmap...");

    let lastError = "";

    for (const model of MODEL_OPTIONS) {
      try {
        setStatus(`Trying model: ${model}...`);
        const parsed = await generateWithModel(model);
        
        if (parsed.title && Array.isArray(parsed.weeks)) {
          setRoadmap(parsed);
          setStatus("✅ Roadmap generated successfully!");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(`Failed with ${model}:`, err.message);
        lastError = err.message;
        // Wait a bit before trying next model
        await new Promise(r => setTimeout(r, 800));
      }
    }

    // All models failed
    setError(`All models failed. Last error: ${lastError}. Please wait a minute and try again.`);
    setStatus("");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">AI Roadmap Generator</h1>
        <p className="text-gray-600 mb-8">Get a structured learning roadmap for any tech role</p>

        <div className="flex gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter role (e.g. Full Stack Developer)"
            className="flex-1 h-12 px-5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={generate}
            disabled={loading || !query.trim()}
            className="px-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-2xl"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Other UI elements (filters, suggestions, etc.) remain same as previous version */}

        {status && <p className="text-indigo-600 mb-4">{status}</p>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6">{error}</div>}

        {/* Roadmap rendering code - same as my previous full code */}
        {roadmap && (
          <>
            <div className="bg-white border rounded-3xl p-8 mb-8">
              <h2 className="text-3xl font-bold">{roadmap.title}</h2>
              <p className="text-gray-600 mt-4">{roadmap.overview}</p>
            </div>

            {roadmap.weeks?.map((w) => (
              <div key={w.week} className="bg-white border rounded-3xl p-8 mb-6">
                <h3 className="text-2xl font-semibold mb-4">Week {w.week}: {w.title}</h3>
                <p className="text-gray-600 mb-4">{w.objective}</p>
                {/* topics, tasks, resources, project rendering... */}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}