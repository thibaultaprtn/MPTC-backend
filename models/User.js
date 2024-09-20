const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  username: String,
  pic: String,
  //   token: String,
  //   hash: String,
  //   salt: String,
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
});

module.exports = User;
