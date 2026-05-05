import Roadmap from "../models/Roadmap.js";

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

function buildResources(topic) {
  return [
    { title: "YouTube Search", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}` },
    { title: "Documentation Search", url: `https://www.google.com/search?q=${encodeURIComponent(topic + " documentation")}` },
    { title: "GeeksforGeeks", url: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topic)}` },
  ];
}

function buildRoadmapPayload({ role, level, topics, weakTopics }) {
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

export const generateRoadmap = async (req, res) => {
  try {
    const { role, level, topics = [], weakTopics = [] } = req.body;

    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ message: "Topics are required" });
    }

    const payload = buildRoadmapPayload({ role, level, topics, weakTopics });

    const created = await Roadmap.create({ user: req.user._id, ...payload });

    return res.status(201).json({ roadmap: created });
  } catch (error) {
    console.error("generateRoadmap error", error);
    return res.status(500).json({ message: "Failed to generate roadmap" });
  }
};

export const listRoadmaps = async (req, res) => {
  try {
    const items = await Roadmap.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    return res.json({ roadmaps: items });
  } catch (error) {
    console.error("listRoadmaps error", error);
    return res.status(500).json({ message: "Failed to list roadmaps" });
  }
};

export const getRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Roadmap.findOne({ _id: id, user: req.user._id }).lean();
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json({ roadmap: item });
  } catch (error) {
    console.error("getRoadmap error", error);
    return res.status(500).json({ message: "Failed to get roadmap" });
  }
};

export const deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Roadmap.findOneAndDelete({ _id: id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Not found or not authorized" });
    return res.json({ success: true });
  } catch (error) {
    console.error("deleteRoadmap error", error);
    return res.status(500).json({ message: "Failed to delete roadmap" });
  }
};
