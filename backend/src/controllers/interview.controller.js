import { analyzeInterview, generateInterviewSession } from "../services/interview.service.js";

export const createInterviewSession = async (req, res) => {
  try {
    const sessionId = req.query?.sessionId || req.body?.sessionId || "";
    const session = await generateInterviewSession({ profile: req.user, sessionId });

    res.json({
      success: true,
      ...session,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const submitInterview = async (req, res) => {
  try {
    const { questions = [], answers = [], sessionId = "" } = req.body || {};
    const analysis = await analyzeInterview({
      profile: req.user,
      questions,
      answers,
      sessionId,
    });

    res.json({
      success: true,
      ...analysis,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};