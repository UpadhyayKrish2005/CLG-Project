const express = require("express");
const Task = require("../models/Task");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get user tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1, createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
});

// Create task
router.post("/", async (req, res) => {
  try {
    const { title, description, subject, priority, dueDate, completed } = req.body;
    const newTask = await Task.create({
      title,
      description,
      subject,
      priority,
      dueDate: dueDate || null,
      completed: Boolean(completed),
      user: req.user.id,
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: "Failed to create task", error: error.message });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, subject, priority, dueDate, completed } = req.body;
    const taskData = { title, description, subject, priority, dueDate: dueDate || null };
    if (typeof completed === "boolean") taskData.completed = completed;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      taskData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Failed to update task", error: error.message });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
});

module.exports = router;

