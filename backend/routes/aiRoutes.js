const express = require("express");
const Task = require("../models/Task");
const { auth } = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.post("/assist", async (req, res) => {
  const { action, taskId } = req.body;
  if (!["plan", "suggestions", "breakdown"].includes(action)) {
    return res.status(400).json({ message: "Choose a valid assistant action." });
  }
  if (!process.env.AI_API_KEY) {
    return res.status(503).json({ message: "AI assistant is not configured. Add AI_API_KEY to backend/.env." });
  }
  try {
    const tasks = action === "breakdown"
      ? [await Task.findOne({ _id: taskId, user: req.user.id, completed: false }).select("title description subject priority dueDate completed")].filter(Boolean)
      : await Task.find({ user: req.user.id, completed: false }).select("title description subject priority dueDate completed").sort({ dueDate: 1, priority: -1 });
    if (action === "breakdown" && !tasks.length) return res.status(404).json({ message: "Pending task not found." });
    if (!tasks.length) return res.status(400).json({ message: "Add a pending task before asking for study help." });

    const instructions = {
      plan: "Create a realistic study plan for today from these pending tasks. List task, suggested minutes, and a brief reason using deadlines and priority. End with a short practical tip.",
      suggestions: "Give concise study suggestions based on the pending tasks. Prioritize overdue and near deadlines, then priority. Explain briefly and do not invent task details.",
      breakdown: "Break this task into 4 to 7 concrete, ordered subtasks. Include a short reason or study tip. Do not claim the tasks were added to the planner."
    };
    const apiResponse = await fetch(process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.AI_API_KEY}` },
      body: JSON.stringify({ model: process.env.AI_MODEL || "gpt-4o-mini", temperature: 0.4, messages: [
        { role: "system", content: "You are a practical study planning assistant. Use only the supplied task data. Suggestions must not change user data. If dates are missing, say so." },
        { role: "user", content: `${instructions[action]}\n\nPending task data (JSON):\n${JSON.stringify(tasks)}` }
      ] })
    });
    const result = await apiResponse.json().catch(() => ({}));
    if (!apiResponse.ok) {
      console.error("AI provider request failed:", apiResponse.status, result.error?.message || "Provider error");
      return res.status(502).json({ message: "The AI service is unavailable right now. Please try again shortly." });
    }
    const text = result.choices?.[0]?.message?.content?.trim();
    if (!text) return res.status(502).json({ message: "The AI service returned an empty response. Please try again." });
    return res.json({ text });
  } catch (error) {
    console.error("AI assistant error:", error.message);
    return res.status(500).json({ message: "Unable to generate study help right now." });
  }
});

module.exports = router;
