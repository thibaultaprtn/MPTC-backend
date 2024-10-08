const mongoose = require("mongoose");

const Game = mongoose.model("Game", {
  game_name: String,
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  //   rank: Number,
  // user_team_number: Number,
  nb_teams: Number,
  nb_candidates_team: { type: Number, default: 4 },
  round: { type: Number, default: 1 },
  launchable: { type: Boolean, default: false },
  launched: { type: Boolean, default: false },
  available_candidates: [
    // {
    //   candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
    //   //   A voir si on accède aux données dans le front via un populate
    //   //   candidate_name: String,
    //   //   candidate_pic: String,
    // },
  ],
  team: [
    {
      team_number: Number,
      team_name: String,
      rank: Number,
      full: Boolean, //Stock si la brigade est au complet
      users: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        //   A voir si on accède aux données dans le front via un populate
        //   user_name: String,
        //   user_pic: String,
      ],
      points: { type: Number, default: 0 },
      candidates: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Candidate",

          //   A voir si on accède aux données dans le front via un populate
          //   candidate_name: String,
          //   candidate_pic: String,
          //   candidate_points: { type: Number, default: 0 },
        },
      ],
      actions: { type: Array, default: [] },
      draft: Boolean, //Stock si des enchères ont été placées
      bet: { type: Array, default: [] },
      // [
      //   {
      //     candidate_id: {
      //       type: mongoose.Schema.Types.ObjectId,
      //       ref: "Candidate",
      //     },
      //     value: Number,
      //   },
      // ],
    },
  ],
  details: { type: Array, default: [] },
  additionnal_1: { type: Array, default: [] },
  additionnal_2: { type: Array, default: [] },
  additionnal_3: { type: Array, default: [] },
});

module.exports = Game;
