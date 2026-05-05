import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Copy,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const emptyAnalysis = {
  overallScore: 0,
  summary: "",
  strengths: [],
  gaps: [],
  nextSteps: [],
  questionFeedback: [],
  categoryInsight: [],
};

const apiBase = `${import.meta.env.VITE_API_BASE_URL || ""}`;

const newSessionId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const toAnswerPayload = (questions, answersById) =>
  questions.map((question) => ({
    questionId: question.id,
    answer: answersById[question.id] || "",
  }));

const scoreTone = (score) => {
  if (score >= 80) return "from-emerald-500 to-teal-500";
  if (score >= 60) return "from-amber-500 to-orange-500";
  return "from-rose-500 to-red-500";
};

export default function AIInterviewPage({ user }) {
  const [sessionId, setSessionId] = useState(() => newSessionId());
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingSession, setLoadingSession] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");

  const currentQuestion = questions[currentIndex];
  const savedAnswer = currentQuestion ? answers[currentQuestion.id] || "" : "";

  const loadInterviewSession = async ({ nextSessionId }) => {
    setLoadingSession(true);
    setError("");
    setAnalysis(null);
    setSessionId(nextSessionId);

    try {
      const response = await fetch(`${apiBase}/api/interview/session?sessionId=${encodeURIComponent(nextSessionId)}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to start interview session");
      }

      setQuestions(Array.isArray(data.questions) ? data.questions : []);
      setAnswers({});
      setCurrentIndex(0);
      setDraft("");
      setHasStarted(true);
    } catch (err) {
      setError(err.message || "Unable to load interview questions");
      setQuestions([]);
      setHasStarted(false);
    } finally {
      setLoadingSession(false);
    }
  };

  useEffect(() => {
    setHasStarted(false);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setAnalysis(null);
    setDraft("");
    setError("");
    setLoadingSession(false);
    setSessionId(newSessionId());
  }, [user?.id]);

  useEffect(() => {
    setDraft(savedAnswer);
  }, [savedAnswer, currentQuestion?.id]);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIndex + (analysis ? 1 : 0)) / questions.length) * 100);
  }, [analysis, currentIndex, questions.length]);

  const answeredCount = Object.values(answers).filter((value) => value && value.trim()).length;

  const handleSaveAnswer = (value) => {
    if (!currentQuestion) return;
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
  };

  const goNext = () => {
    handleSaveAnswer(draft);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  };

  const goBack = () => {
    handleSaveAnswer(draft);
    setCurrentIndex((previous) => Math.max(0, previous - 1));
  };

  const finishInterview = async () => {
    if (!questions.length) return;

    handleSaveAnswer(draft);

    const payload = {
      sessionId,
      questions,
      answers: toAnswerPayload(questions, {
        ...answers,
        [currentQuestion?.id]: draft,
      }),
    };

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/interview/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not analyze interview answers");
      }

      setAnalysis(data);
      toast.success("Interview analysis ready");
    } catch (err) {
      setError(err.message || "Analysis failed");
    } finally {
      setSubmitting(false);
    }
  };

  const restartInterview = () => {
    const freshSessionId = newSessionId();
    setHasStarted(true);
    loadInterviewSession({ nextSessionId: freshSessionId });
  };

  const startInterview = () => {
    loadInterviewSession({ nextSessionId: newSessionId() });
  };

  const copyAnalysis = async () => {
    if (!analysis) return;

    const text = [
      `Interview score: ${analysis.overallScore}%`,
      `Summary: ${analysis.summary}`,
      `Strengths: ${(analysis.strengths || []).join("; ")}`,
      `Gaps: ${(analysis.gaps || []).join("; ")}`,
      `Next steps: ${(analysis.nextSteps || []).join("; ")}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Analysis copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-neutral-600">
          <TimerReset className="animate-spin" size={18} />
          Preparing your first question...
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <section className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-gradient-to-br from-neutral-950 via-slate-900 to-neutral-800 px-6 py-7 text-white shadow-xl sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.16),transparent_28%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div className="space-y-4">
              <Badge className="border-white/15 bg-white/10 text-white" variant="outline">
                <BrainCircuit className="mr-1" size={12} /> Text interview mode
              </Badge>
              <div className="space-y-2">
                <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
                  AI Interview Practice
                </h1>
                <p className="max-w-2xl text-sm text-white/75 sm:text-base">
                  Click start to generate the first question instantly. You will answer one question at a time in text, then get a full breakdown of strengths, gaps, and next steps.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 text-sm text-white/80">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Generated on start</span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Personalized by profile</span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Session {sessionId.slice(0, 8)}</span>
              </div>
            </div>

            <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Flow</p>
                <div className="mt-2 text-lg font-semibold">Start to reveal question 1</div>
                <p className="mt-2 text-sm text-white/65">No extra step after starting.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Mode</p>
                <div className="mt-2 text-lg font-semibold">Text-to-text interview</div>
                <p className="mt-2 text-sm text-white/65">Concise feedback with gaps and suggestions.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.75fr]">
          <Card className="overflow-hidden border-neutral-200 shadow-sm">
            <CardHeader className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
              <CardDescription>Ready when you are</CardDescription>
              <CardTitle className="mt-1 text-2xl font-serif">Start the interview to see the first question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <p className="max-w-2xl text-sm leading-7 text-neutral-600">
                Once you click Start Interview, the app will generate a fresh set of questions and immediately open the first prompt for your answer.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={startInterview} className="gap-2 bg-neutral-950 text-white hover:bg-neutral-800">
                  <BrainCircuit size={14} /> Start Interview
                </Button>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader>
                <CardDescription>What matters here</CardDescription>
                <CardTitle className="text-xl">How the analysis reads your answer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {[
                    { icon: Sparkles, label: "Specificity", note: "Examples, scope, and real decisions" },
                    { icon: TrendingUp, label: "Impact", note: "Numbers, outcomes, and measurable change" },
                    { icon: CheckCircle2, label: "Structure", note: "Clear flow instead of rambling" },
                  ].map(({ icon: Icon, label, note }) => (
                    <div key={label} className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-neutral-950">{label}</div>
                        <div className="text-xs text-neutral-500">{note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </motion.div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800">
        <div className="flex items-center gap-3">
          <ShieldAlert size={18} />
          <div>
            <h1 className="text-lg font-semibold">Interview unavailable</h1>
            <p className="text-sm text-red-700/90">{error}</p>
          </div>
        </div>
        <Button className="mt-5" onClick={restartInterview} variant="outline">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <section className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-gradient-to-br from-neutral-950 via-slate-900 to-neutral-800 px-6 py-7 text-white shadow-xl sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.16),transparent_28%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div className="space-y-4">
            <Badge className="border-white/15 bg-white/10 text-white" variant="outline">
              <BrainCircuit className="mr-1" size={12} /> Text interview mode
            </Badge>
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
                AI Interview Practice
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-white/75">
                Answer one question at a time, keep your responses in text, and get a full breakdown of strengths, gaps, and next steps at the end.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-sm text-white/80">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">{questions.length} generated questions</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">{answeredCount} answered</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Session {sessionId.slice(0, 8)}</span>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Progress</p>
              <div className="mt-2 text-2xl font-semibold">{progress}%</div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Mode</p>
              <div className="mt-2 text-lg font-semibold">Text-to-text interview</div>
              <p className="mt-2 text-sm text-white/65">Concise feedback with gaps and suggestions.</p>
            </div>
          </div>
        </div>
      </section>

      {!analysis ? (
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.75fr]">
          <Card className="overflow-hidden border-neutral-200 shadow-sm">
            <CardHeader className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardDescription>Question {currentIndex + 1} of {questions.length}</CardDescription>
                  <CardTitle className="mt-1 text-2xl font-serif">{currentQuestion?.question}</CardTitle>
                </div>
                <Badge variant="outline" className="border-neutral-200 text-neutral-700">
                  {currentQuestion?.category || "question"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Your answer</label>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a clear, specific answer with one example and one result..."
                  className="min-h-[240px] w-full rounded-3xl border border-neutral-200 bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Target size={15} />
                  Aim for 60 to 90 seconds of explanation in writing.
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={restartInterview} className="gap-2">
                    <RefreshCcw size={14} /> New session
                  </Button>
                  <Button variant="outline" onClick={goBack} disabled={currentIndex === 0} className="gap-2">
                    <ArrowLeft size={14} /> Back
                  </Button>
                  {currentIndex < questions.length - 1 ? (
                    <Button onClick={goNext} className="gap-2 bg-neutral-950 text-white hover:bg-neutral-800">
                      Save & next <ArrowRight size={14} />
                    </Button>
                  ) : (
                    <Button onClick={finishInterview} disabled={submitting} className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-95">
                      {submitting ? "Analyzing..." : "Finish & analyze"}
                    </Button>
                  )}
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader>
                <CardDescription>What matters here</CardDescription>
                <CardTitle className="text-xl">How the analysis reads your answer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {[
                    { icon: Sparkles, label: "Specificity", note: "Examples, scope, and real decisions" },
                    { icon: TrendingUp, label: "Impact", note: "Numbers, outcomes, and measurable change" },
                    { icon: CheckCircle2, label: "Structure", note: "Clear flow instead of rambling" },
                  ].map(({ icon: Icon, label, note }) => (
                    <div key={label} className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-neutral-950">{label}</div>
                        <div className="text-xs text-neutral-500">{note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-sm">
              <CardHeader>
                <CardDescription>Answer tracker</CardDescription>
                <CardTitle className="text-xl">Question map</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {questions.map((question, index) => {
                  const isActive = index === currentIndex;
                  const hasAnswer = Boolean(answers[question.id]?.trim());

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => {
                        handleSaveAnswer(draft);
                        setCurrentIndex(index);
                      }}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        isActive ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className={`text-xs uppercase tracking-[0.24em] ${isActive ? "text-white/60" : "text-neutral-400"}`}>
                            Q{index + 1}
                          </div>
                          <div className="mt-1 text-sm font-medium line-clamp-2">{question.question}</div>
                        </div>
                        <div className={`rounded-full px-2 py-1 text-xs ${hasAnswer ? "bg-emerald-500/15 text-emerald-600" : isActive ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-500"}`}>
                          {hasAnswer ? "Done" : isActive ? "Now" : "Pending"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          <Card className="overflow-hidden border-neutral-200 shadow-sm">
            <CardHeader className="border-b border-neutral-200 bg-gradient-to-br from-white to-neutral-50">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardDescription>Final analysis</CardDescription>
                  <CardTitle className="mt-1 text-3xl font-serif">Your interview report</CardTitle>
                </div>
                <Badge className={`bg-gradient-to-r ${scoreTone(analysis.overallScore)} text-white`}>
                  {analysis.overallScore}% overall
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="max-w-3xl text-sm leading-7 text-neutral-600">{analysis.summary}</p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-neutral-200 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-neutral-400">Strengths</div>
                  <div className="mt-3 space-y-2">
                    {(analysis.strengths || []).map((item) => (
                      <div key={item} className="flex gap-3 text-sm text-neutral-700">
                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-200 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-neutral-400">Gaps</div>
                  <div className="mt-3 space-y-2">
                    {(analysis.gaps || []).map((item) => (
                      <div key={item} className="flex gap-3 text-sm text-neutral-700">
                        <ShieldAlert size={15} className="mt-0.5 text-amber-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-200 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-neutral-400">Next steps</div>
                  <div className="mt-3 space-y-2">
                    {(analysis.nextSteps || []).map((item) => (
                      <div key={item} className="flex gap-3 text-sm text-neutral-700">
                        <Sparkles size={15} className="mt-0.5 text-cyan-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={copyAnalysis} variant="outline" className="gap-2">
                  <Copy size={14} /> Copy report
                </Button>
                <Button onClick={restartInterview} className="gap-2 bg-neutral-950 text-white hover:bg-neutral-800">
                  <RefreshCcw size={14} /> Start again
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader>
                <CardDescription>Question feedback</CardDescription>
                <CardTitle className="text-xl">Per-answer breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(analysis.questionFeedback || []).map((item) => {
                  const question = questions.find((entry) => entry.id === item.id);
                  return (
                    <div key={item.id} className="rounded-3xl border border-neutral-200 px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-neutral-400">{question?.category || "answer"}</div>
                          <div className="mt-1 font-medium text-neutral-950">{question?.question}</div>
                        </div>
                        <Badge variant="outline" className="border-neutral-200 text-neutral-700">
                          {item.score}%
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        {(item.feedback || []).map((line) => (
                          <div key={line} className="text-sm text-neutral-600">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-sm">
              <CardHeader>
                <CardDescription>Category signal</CardDescription>
                <CardTitle className="text-xl">Where you were strongest</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(analysis.categoryInsight || []).map((item) => (
                  <div key={item.category} className="rounded-3xl border border-neutral-200 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium capitalize text-neutral-950">{item.category}</div>
                      <div className="text-sm font-semibold text-neutral-700">{item.score}%</div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-neutral-100">
                      <div className={`h-2 rounded-full bg-gradient-to-r ${scoreTone(item.score)}`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}

                <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-4 text-sm text-neutral-600">
                  The most useful improvement is usually in the project answer. Add one result metric and one tradeoff to make the response feel senior.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </motion.div>
  );
}