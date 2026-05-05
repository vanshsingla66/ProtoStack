const ROLE_TRACKS = {
  frontend: {
    label: "Frontend Engineer",
    keywords: ["react", "javascript", "typescript", "css", "html", "tailwind", "ui"],
    depthSkill: "component architecture",
    systemSkill: "state management",
    technicalQuestions: [
      "How do you optimize React component rendering performance? Walk me through your approach to detecting and fixing unnecessary re-renders.",
      "Explain how you would structure CSS and handle responsive design in a large-scale application. What tools or methodologies do you use?",
      "Describe a situation where you had to manage complex state. What did you choose and why—Context API, Redux, Zustand, or something else?",
      "How do you approach accessibility (a11y) in your React components? Give me a concrete example from your recent work.",
      "Walk me through your debugging process when a component is slow or buggy. What tools do you reach for first?",
      "How do you handle data fetching and caching in modern React? What's your preference and why?",
    ],
  },
  backend: {
    label: "Backend Engineer",
    keywords: ["node", "express", "api", "database", "sql", "mongodb", "auth"],
    depthSkill: "API design",
    systemSkill: "service reliability",
    technicalQuestions: [
      "Design a REST or GraphQL API for a real feature you built. Walk me through the endpoint design, versioning strategy, and error handling.",
      "How do you approach database optimization? Tell me about a slow query you fixed and the steps you took to diagnose and resolve it.",
      "Explain your approach to authentication and authorization. What vulnerabilities have you protected against, and how?",
      "How do you handle asynchronous operations and concurrency in your backend? What patterns or libraries do you rely on?",
      "Describe how you would structure a scalable Node.js application for high traffic. Where would you add caching, queues, or load balancing?",
      "Walk me through a production issue you debugged. How did you trace the problem and what preventive measures did you put in place?",
    ],
  },
  data: {
    label: "Data Scientist",
    keywords: ["python", "sql", "pandas", "numpy", "statistics", "machine learning"],
    depthSkill: "experiment design",
    systemSkill: "model evaluation",
    technicalQuestions: [
      "Walk me through a data cleaning and preprocessing pipeline you built. What edge cases did you discover and how did you handle them?",
      "How do you approach feature engineering? Describe a project where feature selection or transformation made a big difference in model performance.",
      "Explain your process for splitting data, validating models, and detecting overfitting. What metrics do you prioritize and why?",
      "Tell me about a statistical test or experiment you designed. How did you set up the hypothesis, validate assumptions, and interpret results?",
      "How do you handle imbalanced datasets? What techniques have you used and when would you choose each one?",
      "Describe how you communicate findings and uncertainty to non-technical stakeholders. Give me an example of a close call you had.",
    ],
  },
  ml: {
    label: "ML Engineer",
    keywords: ["python", "pytorch", "tensorflow", "nlp", "deep learning", "mlops"],
    depthSkill: "model training",
    systemSkill: "deployment pipeline",
    technicalQuestions: [
      "Walk me through your most recent model training pipeline. How did you handle hyperparameter tuning, evaluation, and model versioning?",
      "Explain the trade-offs between different architectures for a problem you solved. Why did you choose one over the others?",
      "How do you approach debugging a model that performs well in development but poorly in production? What could cause this gap?",
      "Describe your experience with data augmentation or transfer learning. When and why did you use these techniques?",
      "Walk me through your approach to model deployment and monitoring. How do you detect model drift and decide when to retrain?",
      "Tell me about a time you balanced model complexity with interpretability or latency constraints. How did you justify your choice?",
    ],
  },
  devops: {
    label: "DevOps Engineer",
    keywords: ["docker", "kubernetes", "aws", "ci/cd", "linux", "terraform"],
    depthSkill: "pipeline reliability",
    systemSkill: "infrastructure automation",
    technicalQuestions: [
      "Walk me through a CI/CD pipeline you designed or improved. What were the bottlenecks and how did you address them?",
      "How do you approach infrastructure as code? Describe a complex deployment using Terraform, CloudFormation, or similar tools.",
      "Explain how you would design a Kubernetes cluster for a production application. What about scaling, networking, and resource management?",
      "Tell me about a production incident you responded to. How did you diagnose the issue, mitigate it, and prevent recurrence?",
      "How do you approach monitoring and alerting? What metrics matter most and how do you avoid alert fatigue?",
      "Describe your approach to disaster recovery and backup strategies. What RPO and RTO targets have you worked with?",
    ],
  },
  qa: {
    label: "QA Engineer",
    keywords: ["testing", "automation", "selenium", "cypress", "jest", "api testing"],
    depthSkill: "test strategy",
    systemSkill: "quality gates",
    technicalQuestions: [
      "Walk me through your test automation strategy for a feature. How do you decide what to automate versus test manually?",
      "Describe your experience with different testing frameworks. Why would you choose Cypress over Selenium or Jest for end-to-end tests?",
      "How do you approach API testing? Tell me about a complex scenario you tested and the tools you used.",
      "Explain how you would design a test suite for a critical user flow. How do you balance coverage, speed, and maintainability?",
      "Tell me about a bug you caught early in the development cycle. How did your testing strategy enable that?",
      "How do you approach performance and load testing? Describe a project where you identified and helped fix a bottleneck.",
    ],
  },
};

const GENERATION_BLUEPRINTS = [
  {
    category: "opening",
    templates: [
      "Walk me through your background and why {roleLabel} is the next step you want to take.",
      "Give me the short version of your story and the kind of role you are aiming for now.",
      "What has shaped your interest in {roleLabel}, and what do you want to prove in this interview?",
    ],
    focus: ["motivation", "career direction", "communication"],
  },
  {
    category: "project",
    templates: [
      "Pick one project where you used {primarySkill}. What was your role, what problem were you solving, and what was the outcome?",
      "Tell me about a recent project that best shows your strength in {primarySkill}. I want the tradeoffs, not just the stack.",
      "Describe a build you are proud of. Why did you choose {primarySkill}, and how did you validate the result?",
    ],
    focus: ["projects", "ownership", "impact"],
  },
  {
    category: "technical",
    templates: [
      "Explain how you would approach {depthSkill} for a real product, including the main risks you would watch for.",
      "If I asked you to improve {systemSkill} on a live system, what would you look at first and why?",
      "Talk me through the tradeoffs between speed and correctness when you work on {depthSkill}.",
    ],
    focus: ["technical depth", "tradeoffs", "problem solving"],
  },
  {
    category: "technical-deep-dive",
    templates: [
      "Pick one core system or feature from your recent work and explain the architecture, the bottleneck, and the fix you would make next.",
      "If you had to redesign one part of your stack for scale, what would you change first and how would you validate it?",
      "Walk me through how you would debug a production issue that only appears under load.",
    ],
    focus: ["debugging", "architecture", "performance"],
  },
  {
    category: "behavioral",
    templates: [
      "Tell me about a time you had to align with a teammate who disagreed with your approach. How did you handle it?",
      "Describe a situation where a deadline was at risk. What did you do, and what did you learn?",
      "Share one example where feedback changed the way you work. What changed after that conversation?",
    ],
    focus: ["teamwork", "communication", "adaptability"],
  },
  {
    category: "scenario",
    templates: [
      "Imagine the team reports a critical bug after release. How would you triage it, communicate, and decide next steps?",
      "Suppose your solution is too slow for production. How would you diagnose the bottleneck and improve it?",
      "If you inherited a messy codebase or pipeline, what would your first 48 hours look like?",
    ],
    focus: ["debugging", "prioritization", "ownership"],
  },
  {
    category: "reflection",
    templates: [
      "What is one skill gap you know you still need to close, and what is your plan to fix it?",
      "If you had three weeks to become sharper for this role, what would you study and how would you practice?",
      "What question do you hope I ask next, because it would let you show your strongest work?",
    ],
    focus: ["self-awareness", "growth", "closing"],
  },
];

const toArray = (value) => (Array.isArray(value) ? value : []);

const cleanText = (value) => String(value || "").replace(/\s+/g, " ").trim();

const hashString = (value) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const createSeededRandom = (seed) => {
  let state = hashString(seed || "protostack-interview") || 1;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const pickFrom = (items, random) => items[Math.floor(random() * items.length) % items.length];

const pickUnique = (items, count, random) => {
  const pool = [...items];
  const chosen = [];

  while (pool.length && chosen.length < count) {
    const index = Math.floor(random() * pool.length);
    chosen.push(pool.splice(index, 1)[0]);
  }

  return chosen;
};

const normalizeSkills = (skills) =>
  toArray(skills)
    .map((skill) => cleanText(skill).toLowerCase())
    .filter(Boolean);

const inferTrack = (profile = {}) => {
  const skills = normalizeSkills(profile.skills);
  const role = cleanText(profile.role || profile.onboardingData?.role);
  const sourceText = `${role} ${skills.join(" ")}`.toLowerCase();

  const scoredTracks = Object.entries(ROLE_TRACKS).map(([trackKey, track]) => {
    const keywordHits = track.keywords.reduce((hits, keyword) => {
      return hits + (sourceText.includes(keyword) ? 1 : 0);
    }, 0);

    return { trackKey, track, score: keywordHits };
  });

  scoredTracks.sort((left, right) => right.score - left.score);

  return scoredTracks[0]?.track || ROLE_TRACKS.backend;
};

const buildProfileSnapshot = (profile = {}) => {
  const skills = normalizeSkills(profile.skills || profile.onboardingData?.skills);
  const resume = profile.parsedResume || profile.profileData || {};
  const role = cleanText(profile.role || profile.onboardingData?.role || resume.title || "");
  const education = cleanText(profile.education || profile.onboardingData?.education || resume.education?.[0] || "");
  const goal = cleanText(profile.goal || profile.onboardingData?.goal || "");

  return {
    role: role || "Student",
    goal: goal || "Grow into the target role",
    education: education || "Not specified",
    source: profile.source || (resume.resumeUrl ? "resume" : "form"),
    skills,
    resumeSummary: cleanText(resume.summary || resume.about || resume.headline || ""),
  };
};

const renderTemplate = (template, replacements) =>
  template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] || "");

const buildQuestion = (blueprint, replacements, random, index, track) => {
  let template;
  let focus;
  let idealSignals;

  if ((blueprint.category === "technical" || blueprint.category === "technical-deep-dive") && track?.technicalQuestions) {
    template = pickFrom(track.technicalQuestions, random);
    focus = blueprint.focus;
    idealSignals = ["technical depth", "real-world example", "tradeoffs"].filter(Boolean);
  } else {
    template = pickFrom(blueprint.templates, random);
    focus = blueprint.focus;
    idealSignals = [
      `mentions ${replacements.primarySkill}`,
      blueprint.focus[0],
      blueprint.focus[1],
    ].filter(Boolean);
  }

  return {
    id: `q-${index + 1}-${blueprint.category}`,
    order: index + 1,
    category: blueprint.category,
    question: template.includes("{") ? renderTemplate(template, replacements) : template,
    focus,
    idealSignals,
  };
};

const callAiChatCompletion = async ({ system, user, responseSchema }) => {
  const apiKey = process.env.INTERVIEW_AI_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.INTERVIEW_AI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.INTERVIEW_AI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return null;
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: `${user}\n\nReturn JSON only that matches: ${responseSchema}` },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "";
};

const parseJsonContent = (value) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i);
  const payload = fenced?.[1] || trimmed;

  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

export const generateInterviewSession = async ({ profile = {}, sessionId = "" }) => {
  const snapshot = buildProfileSnapshot(profile);
  const track = inferTrack(profile);
  const random = createSeededRandom(`${sessionId}:${snapshot.role}:${snapshot.skills.join("|")}`);
  const primarySkill = snapshot.skills[0] || track.keywords[0] || track.depthSkill;
  const missingSkill = track.keywords.find((keyword) => !snapshot.skills.includes(keyword)) || track.depthSkill;

  const replacements = {
    roleLabel: track.label,
    primarySkill,
    depthSkill: track.depthSkill,
    systemSkill: track.systemSkill,
  };

  const systemPrompt = [
    "You are an interview designer for a text-only mock interview.",
    "Generate concise, non-repetitive questions that feel human and specific to the candidate profile.",
    "Balance technical depth, project exploration, behavioral judgment, and reflection.",
    "Always include at least two technical questions when possible.",
    "Avoid repeating the same wording across sessions.",
  ].join(" ");

  const aiPayload = await callAiChatCompletion({
    system: systemPrompt,
    user: JSON.stringify({ profile: snapshot, sessionId, roleTrack: track.label, targetGap: missingSkill }),
    responseSchema: '{"questions":[{"id":"string","order":1,"category":"technical","question":"string","focus":["string"],"idealSignals":["string"]}] }',
  }).catch(() => null);

  const parsedAi = parseJsonContent(aiPayload);
  const aiQuestions = toArray(parsedAi?.questions)
    .filter((item) => item && typeof item.question === "string")
    .slice(0, 6)
    .map((item, index) => ({
      id: item.id || `q-${index + 1}-${item.category || "ai"}`,
      order: typeof item.order === "number" ? item.order : index + 1,
      category: item.category || "technical",
      question: item.question,
      focus: toArray(item.focus),
      idealSignals: toArray(item.idealSignals),
    }));
  const technicalBlueprints = GENERATION_BLUEPRINTS.filter((blueprint) => blueprint.category === "technical" || blueprint.category === "technical-deep-dive");
  const aiTechnicalCount = aiQuestions.filter((question) => question.category === "technical" || question.category === "technical-deep-dive").length;
  const supplementalTechnicalQuestions = aiTechnicalCount >= 2
    ? []
    : technicalBlueprints
        .slice(0, Math.max(0, 2 - aiTechnicalCount))
        .map((blueprint, index) => buildQuestion(blueprint, replacements, random, aiQuestions.length + index, track));

  if (aiQuestions.length >= 5) {
    return {
      profile: snapshot,
      track: track.label,
      sessionId,
      questions: [...supplementalTechnicalQuestions, ...aiQuestions].slice(0, 6),
      source: "ai",
    };
  }

  const selectedBlueprints = pickUnique(GENERATION_BLUEPRINTS, 6, random);
  const questions = selectedBlueprints.map((blueprint, index) =>
    buildQuestion(blueprint, replacements, random, index, track),
  );

  if (questions.length < 6) {
    questions.push({
      id: `q-${questions.length + 1}-followup`,
      order: questions.length + 1,
      category: "follow-up",
      question: `What is the most important thing I should know about your experience with ${missingSkill}?`,
      focus: [missingSkill, "self-awareness"],
      idealSignals: ["specific example", "learning", "ownership"],
    });
  }

  return {
    profile: snapshot,
    track: track.label,
    sessionId,
    questions,
    source: "fallback",
  };
};

const scoreAnswer = ({ question, answer, profile }) => {
  const text = cleanText(answer).toLowerCase();
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const skillHits = profile.skills.filter((skill) => skill && text.includes(skill)).length;
  const metricHits = (text.match(/\d+%|\$\d+|\d+\+|\d+\s+(users|hours|days|weeks|requests|tests)/g) || []).length;
  const exampleHits = /(for example|for instance|project|built|designed|led|improved|reduced|increased|debugged|shipped)/i.test(text) ? 1 : 0;
  const structureHits = /(first|then|after that|finally|because|so that|result)/i.test(text) ? 1 : 0;
  const brevityPenalty = words.length < 35 ? 12 : words.length < 70 ? 4 : 0;

  let score = 22 + skillHits * 8 + metricHits * 10 + exampleHits * 14 + structureHits * 6;
  score -= brevityPenalty;
  score = Math.max(0, Math.min(100, score));

  const feedback = [];
  if (words.length < 35) {
    feedback.push("This answer is too brief. Add context, action, and result.");
  }
  if (!metricHits) {
    feedback.push("Include a measurable outcome such as percentage, time saved, users, or scale.");
  }
  if (!exampleHits) {
    feedback.push("Anchor the answer in one concrete project or situation.");
  }
  if (!skillHits && profile.skills.length) {
    feedback.push(`Use more direct language around ${profile.skills[0] || "your core skills"}.`);
  }
  if (question.category === "technical" && score < 55) {
    feedback.push("Show the tradeoff you considered, not only the final answer.");
  }

  if (!feedback.length) {
    feedback.push("Strong answer. Keep the same level of specificity in the next response.");
  }

  return {
    score,
    feedback,
    metrics: {
      words: words.length,
      skillHits,
      metricHits,
      exampleHits,
      structureHits,
    },
  };
};

export const analyzeInterview = async ({ profile = {}, questions = [], answers = [], sessionId = "" }) => {
  const snapshot = buildProfileSnapshot(profile);
  const questionList = toArray(questions);
  const answerList = toArray(answers);
  const track = inferTrack(profile);

  const paired = questionList.map((question, index) => {
    const answerItem = answerList.find((item) => item?.questionId === question.id || item?.id === question.id) || answerList[index] || {};
    const answer = cleanText(answerItem.answer || answerItem.text || "");
    const analysis = scoreAnswer({ question, answer, profile: snapshot });

    return {
      id: question.id,
      order: question.order || index + 1,
      category: question.category,
      question: question.question,
      answer,
      score: analysis.score,
      feedback: analysis.feedback,
      metrics: analysis.metrics,
    };
  });

  const overallScore = paired.length
    ? Math.round(paired.reduce((sum, item) => sum + item.score, 0) / paired.length)
    : 0;

  const strengths = [];
  if (paired.some((item) => item.metrics.metricHits > 0)) {
    strengths.push("You reference outcomes with enough detail to make your experience believable.");
  }
  if (paired.some((item) => item.metrics.exampleHits > 0)) {
    strengths.push("You are using concrete project examples instead of abstract claims.");
  }
  if (paired.some((item) => item.metrics.skillHits >= 2)) {
    strengths.push(`Your answers connect back to core ${track.label.toLowerCase()} skills.`);
  }
  if (!strengths.length) {
    strengths.push("You showed a baseline understanding of the role and stayed engaged.");
  }

  const gaps = [];
  if (overallScore < 70) {
    gaps.push("Answers need more structure, depth, and evidence.");
  }
  if (paired.some((item) => item.metrics.words < 35)) {
    gaps.push("Several responses are too short to evaluate confidently.");
  }
  if (paired.every((item) => item.metrics.metricHits === 0)) {
    gaps.push("No measurable outcomes were mentioned. Add numbers and scale.");
  }
  if (paired.every((item) => item.metrics.exampleHits === 0)) {
    gaps.push("No concrete project example was used. Anchor answers in one real situation.");
  }
  if (!gaps.length) {
    gaps.push("The main gap is polishing specificity and tightening the narrative.");
  }

  const categorySummary = paired.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item.score);
    return acc;
  }, {});

  const categoryInsight = Object.entries(categorySummary).map(([category, scores]) => ({
    category,
    score: Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length),
  }));

  const nextSteps = [
    "Rewrite one project story using the STAR format.",
    "Add one measurable result to each answer.",
    "Practice speaking for 60 to 90 seconds per question.",
    `Review the weakest ${track.label.toLowerCase()} concept from the interview and drill it once more.`,
  ];

  const aiPayload = await callAiChatCompletion({
    system: [
      "You are an interview coach that gives direct, practical feedback.",
      "Focus on gaps, strengths, and concrete next steps.",
      "Do not be generic. Keep the tone concise and specific.",
    ].join(" "),
    user: JSON.stringify({ profile: snapshot, sessionId, track: track.label, questions: paired }),
    responseSchema: '{"overallScore":0,"summary":"string","strengths":["string"],"gaps":["string"],"nextSteps":["string"],"questionFeedback":[{"id":"string","score":0,"feedback":["string"]}]}',
  }).catch(() => null);

  const parsedAi = parseJsonContent(aiPayload);

  if (parsedAi && typeof parsedAi === "object") {
    const aiQuestionFeedback = toArray(parsedAi.questionFeedback)
      .filter((item) => item && typeof item.id === "string")
      .map((item) => ({
        id: item.id,
        score: Number(item.score) || 0,
        feedback: toArray(item.feedback).filter((value) => typeof value === "string"),
      }));

    return {
      profile: snapshot,
      track: track.label,
      sessionId,
      overallScore: Number(parsedAi.overallScore) || overallScore,
      summary: cleanText(parsedAi.summary) || `You showed ${track.label.toLowerCase()} potential with clear room to sharpen specificity.`,
      strengths: toArray(parsedAi.strengths).filter((value) => typeof value === "string"),
      gaps: toArray(parsedAi.gaps).filter((value) => typeof value === "string"),
      nextSteps: toArray(parsedAi.nextSteps).filter((value) => typeof value === "string"),
      categoryInsight,
      questionFeedback: aiQuestionFeedback.length ? aiQuestionFeedback : paired.map((item) => ({ id: item.id, score: item.score, feedback: item.feedback })),
    };
  }

  return {
    profile: snapshot,
    track: track.label,
    sessionId,
    overallScore,
    summary: overallScore >= 75
      ? `You are close to being interview-ready for ${track.label.toLowerCase()}; focus on sharpening examples and metrics.`
      : `You have a workable base for ${track.label.toLowerCase()}, but the answers need more structure and evidence.`,
    strengths,
    gaps,
    nextSteps,
    categoryInsight,
    questionFeedback: paired.map((item) => ({
      id: item.id,
      score: item.score,
      feedback: item.feedback,
    })),
  };
};