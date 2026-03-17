import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Upload, FileText, CheckCircle2, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SKILLS = ["React", "Python", "Node.js", "TypeScript", "ML / AI", "UI/UX", "DevOps", "SQL", "Rust", "Go"];
const GOALS = [
  { id: "job", label: "Land a new role", sub: "Switch companies or change careers" },
  { id: "promote", label: "Get promoted", sub: "Level up within my current org" },
  { id: "build", label: "Build a product", sub: "Start a side project or startup" },
  { id: "learn", label: "Learn for fun", sub: "Stay sharp, follow curiosity" },
];

function DropZone({ onFile, file }) {
  const [dragging, setDragging] = useState(false);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }, [onFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${dragging ? "border-black bg-neutral-100" : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"}`}
    >
      {file ? (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle2 size={28} className="text-blue-600" />
          <p className="font-semibold text-sm">{file.name}</p>
          <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">Ready to analyse</span>
          <button onClick={() => onFile(null)} className="text-xs text-neutral-400 hover:text-red-500 transition underline mt-1">
            Remove file
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border border-neutral-200 rounded-full flex items-center justify-center bg-white">
            <Upload size={18} className="text-neutral-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">Drop your resume here</p>
            <p className="text-xs text-neutral-400 mt-0.5">PDF or DOCX, up to 5 MB</p>
          </div>
          <label className="cursor-pointer mt-1">
            <span className="text-xs border border-neutral-300 px-4 py-1.5 rounded-md text-neutral-600 hover:border-black hover:text-black transition font-medium">
              Browse files
            </span>
            <input type="file" accept=".pdf,.docx" className="hidden" onChange={e => onFile(e.target.files[0])} />
          </label>
        </div>
      )}
    </div>
  );
}

const STEPS = ["Background", "Skills", "Goal"];

export default function OnboardingPage({ user }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState("upload"); // "upload" | "form"
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ education: "", role: "", skills: [], goal: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const toggleSkill = (s) => setFormData(d => ({
    ...d,
    skills: d.skills.includes(s) ? d.skills.filter(x => x !== s) : [...d.skills, s]
  }));

  const handleDone = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    navigate("/dashboard");
  };

  const stepContent = [
    // Step 0 — Background
    <div className="space-y-4" key="0">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 block mb-1.5">
          Education
        </label>
        <input
          placeholder="e.g., B.Tech Computer Science, IIT Delhi"
          value={formData.education}
          onChange={e => setFormData({ ...formData, education: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 h-10 text-sm outline-none focus:border-black transition bg-stone-50 placeholder:text-neutral-300"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 block mb-1.5">
          Current or target role
        </label>
        <input
          placeholder="e.g., Frontend Engineer, ML Researcher"
          value={formData.role}
          onChange={e => setFormData({ ...formData, role: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 h-10 text-sm outline-none focus:border-black transition bg-stone-50 placeholder:text-neutral-300"
        />
      </div>
    </div>,

    // Step 1 — Skills
    <div key="1">
      <p className="text-xs text-neutral-400 mb-4">Select all that apply.</p>
      <div className="flex flex-wrap gap-2">
        {SKILLS.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => toggleSkill(s)}
            className={`px-4 py-1.5 rounded-full text-sm border font-medium transition ${
              formData.skills.includes(s)
                ? "bg-black text-white border-black"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>,

    // Step 2 — Goal
    <div className="space-y-3" key="2">
      {GOALS.map(g => (
        <button
          key={g.id}
          type="button"
          onClick={() => setFormData({ ...formData, goal: g.id })}
          className={`w-full text-left px-4 py-3.5 rounded-lg border transition ${
            formData.goal === g.id
              ? "border-black bg-neutral-50"
              : "border-neutral-200 hover:border-neutral-400"
          }`}
        >
          <div className="text-sm font-semibold">{g.label}</div>
          <div className="text-xs text-neutral-400 mt-0.5">{g.sub}</div>
        </button>
      ))}
    </div>
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans flex flex-col">
      <nav className="border-b border-neutral-200 h-14 flex items-center px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-sm">
          <span className="w-2 h-2 bg-blue-600 rounded-full" />
          LearnForge
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className={`w-full max-w-lg transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold mb-3">Onboarding</p>
          <h1 className="font-serif text-3xl leading-tight mb-1">
            Hey {user?.name?.split(" ")[0]}, let's build <em className="text-neutral-400 italic">your path.</em>
          </h1>
          <p className="text-sm text-neutral-500 mb-8">Tell us about yourself so our AI can personalise your curriculum.</p>

          {/* Tab toggle */}
          <div className="flex border border-neutral-200 rounded-lg p-1 bg-white mb-6 w-fit gap-1">
            {[
              { id: "upload", icon: Upload, label: "Upload resume" },
              { id: "form", icon: FileText, label: "Fill manually" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  tab === id ? "bg-black text-white" : "text-neutral-500 hover:text-black"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          <div className="border border-neutral-200 bg-white rounded-xl p-8">
            {tab === "upload" ? (
              <>
                <DropZone onFile={setFile} file={file} />
                {file && (
                  <button
                    onClick={handleDone}
                    disabled={loading}
                    className="mt-5 w-full bg-black text-white h-10 rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analysing resume…
                      </span>
                    ) : (
                      <><Sparkles size={14} /> Build my learning path</>
                    )}
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Step progress */}
                <div className="flex items-center gap-2 mb-6">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 text-xs font-semibold transition ${i === step ? "text-black" : i < step ? "text-blue-600" : "text-neutral-300"}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border transition ${
                          i < step ? "bg-blue-600 border-blue-600 text-white"
                            : i === step ? "border-black text-black"
                            : "border-neutral-200 text-neutral-300"
                        }`}>
                          {i < step ? <CheckCircle2 size={12} /> : i + 1}
                        </div>
                        {s}
                      </div>
                      {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-blue-600" : "bg-neutral-200"}`} />}
                    </div>
                  ))}
                </div>

                {stepContent[step]}

                <div className="flex justify-between mt-8 pt-6 border-t border-neutral-100">
                  <button
                    onClick={() => setStep(s => s - 1)}
                    disabled={step === 0}
                    className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>

                  {step < STEPS.length - 1 ? (
                    <button
                      onClick={() => setStep(s => s + 1)}
                      className="bg-black text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-blue-600 transition"
                    >
                      Continue <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleDone}
                      disabled={loading}
                      className="bg-black text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-blue-600 transition disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Building…
                        </span>
                      ) : (
                        <><Sparkles size={14} /> Build my path</>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}