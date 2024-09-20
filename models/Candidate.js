const mongoose = require("mongoose");

const Candidate = mongoose.model("Candidate", {
  can_name: String,
  can_pic: String,
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
  total_points: Number,
});

module.exports = Candidate;
