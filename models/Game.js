const mongoose = require("mongoose");

const Game = mongoose.model("Game", {
  game_name: String,
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  //   rank: Number,
  nb_teams: Number,
  nb_candidates_team: { type: Number, default: 4 },
  round: Number,
  launchable: { type: Boolean, default: false },
  launched: { type: Boolean, default: false },
  available_candidates: [
    {
      candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
      //   A voir si on accède aux données dans le front via un populate
      //   candidate_name: String,
      //   candidate_pic: String,
    },
  ],
  team: [
    {
      team_number: Number,
      team_name: String,
      rank: Number,
      full: Boolean, //Stock si la brigade est au complet
      users: [
        {
          user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          //   A voir si on accède aux données dans le front via un populate
          //   user_name: String,
          //   user_pic: String,
        },
      ],
      points: { type: Number, default: 0 },
      candidates: [
        {
          candidate_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
          },
          //   A voir si on accède aux données dans le front via un populate
          //   candidate_name: String,
          //   candidate_pic: String,
          //   candidate_points: { type: Number, default: 0 },
        },
      ],
      actions: { type: Array, default: [] },
      draft: Boolean, //Stock si des enchères ont été placées
      bet: [
        {
          candidate_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
          },
          value: Number,
        },
      ],
    },
  ],
});

module.exports = Game;
