const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE ISSUE
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const issue = await Issue.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "Open",
      priority: req.body.priority || "Medium",
      assignedTo: req.body.assignedTo || null,
      createdBy: req.user.id,
    });

    res.status(201).json(issue);
  } catch (err) {
    console.error("ISSUE CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ NEW: READ ALL ISSUES
router.get("/", authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("assignedTo", "email")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    console.error("FETCH ISSUES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
});

// UPDATE ISSUE
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update issue" });
  }
});

// DELETE ISSUE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete issue" });
  }
});

module.exports = router;
