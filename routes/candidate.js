const express = require("express");
const router = express.Router();

const Candidate = require("../models/Candidate");

router.post("/create", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
