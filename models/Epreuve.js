const mongoose = require("mongoose");

const Epreuve = mongoose.model("Epreuve", {
  epreuve_name: String,
  description: String,
  performances: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      victory_type: String,
      points: Number,
      week: Number,
    },
  ],
});

module.exports = Epreuve;
