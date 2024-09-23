const mongoose = require("mongoose");

const Candidate = mongoose.model("Candidate", {
  can_name: String,
  can_pics: { type: Array, default: [] },
  can_description: String,
  eliminated: { type: Boolean, default: false },
  performances: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "epreuve",
      victory_type: String,
      points: Number,
      week: Number,
    },
  ],
  total_points: { type: Number, default: 0 },
  details: { type: Array, default: [] },
  additionnal_1: { type: Array, default: [] },
  additionnal_2: { type: Array, default: [] },
  additionnal_3: { type: Array, default: [] },
});

module.exports = Candidate;
