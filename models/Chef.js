const mongoose = require("mongoose");

const Chef = mongoose.model("Chef", {
  name: String,
  description: String,
  brigade: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
});

module.exports = Chef;
