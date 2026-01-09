const Issue = require("../models/Issue");

// Create Issue
exports.createIssue = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const issue = await Issue.create({
      title,
      description,
      status,
      priority,
      createdBy: req.user.id, // comes from auth middleware
    });
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all issues
exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single issue
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update issue
exports.updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete issue
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
