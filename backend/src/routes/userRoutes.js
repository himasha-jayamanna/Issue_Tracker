const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// GET all users (for assigning issues)
router.get("/", authMiddleware, async (req, res) => {
  const users = await User.find().select("_id email");
  res.json(users);
});

module.exports = router;
