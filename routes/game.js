const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

const Game = require("../models/Game");
const User = require("../models/User");
const Candidate = require("../models/Candidate");

router.post("/create", isAuthenticated, async (req, res) => {
  try {
    console.log(req.body, req.headers);
    let { game_name, admin_id, nb_teams, nb_candidates_team } = req.body;
    // console.log(typeof nb_teams, typeof nb_candidates_team);

    const candidates = await Candidate.find();

    let newGame = new Game({
      game_name: game_name,
      admin_id: admin_id,
      nb_teams: Number(nb_teams),
      nb_candidates_team: Number(nb_candidates_team),
      available_candidates: candidates,
    });

    for (let i = 1; i <= nb_teams; i++) {
      newGame.team.push({
        team_number: Number(i),
        team_name: "",
        rank: 1,
        full: false,
        users: [],
        points: 0,
        candidates: [],
        actions: {},
        draft: false,
        bet: [],
      });
    }

    newGame.team[0].users.push(admin_id);
    //Il faut créer les différentes team
    //Il faut importer les candidats disponibles

    await newGame.save();
    // console.log("Newgame details", newGame);
    const user = await User.findById(admin_id);
    user.games.push(newGame._id);
    await user.save();
    // console.log("user details", user);
    res
      .status(200)
      .json({ message: `La partie ${game_name} a bien été créée.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/list", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.query.user_id);

  // console.log("gamelist user", user.games);
  let tab = [];
  for (let i = 0; i < user.games.length; i++) {
    const response = await Game.findById(user.games[i].toString());
    // console.log(response);
    tab.push(response);
  }
  res.json(tab);
});

module.exports = router;
