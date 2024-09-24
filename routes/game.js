const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

const Game = require("../models/Game");
const User = require("../models/User");
const Candidate = require("../models/Candidate");

//Route permettant de créer une partie
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

//Route permettant à un utilisateur de récupérer les infos d'une partie dans l'optique de la rejoindre. Une deuxième requête sera nécessaire pour rejoindre définitevement la partie.
router.get("/joinable", isAuthenticated, async (req, res) => {
  try {
    // console.log(req);
    const game = await Game.findById(req.query.game_id);
    // console.log(game);
    if (game) {
      res
        .status(200)
        .json({ message: "Vous pouvez rejoindre la partie", game: game });
    } else {
      res
        .status(400)
        .json({
          message: "L'id communiqué ne correspond à aucune partie joignable",
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Route permettant de récupérer la liste détaillée des parties d'un utilisateur ainsi que le numéro de son équipe pour chacune de ces parties
router.get("/list", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.query.user_id);

  // console.log("gamelist user", user.games);
  let gameslist = [];
  let user_team_number = {};
  for (let i = 0; i < user.games.length; i++) {
    const response = await Game.findById(user.games[i].toString());
    // console.log(typeof response);
    // const response2 = { ...response };
    // const response3 = response2._doc;
    // console.log(response3);
    for (let j = 0; j < response.team.length; j++) {
      // console.log("j", j);
      // console.log(response.team[j].users.length);
      if (response.team[j].users.length >= 1) {
        // console.log(response.team[j].users);
        for (let k = 0; k < response.team[j].users.length; k++) {
          // console.log(response.team[j].users[k]._id);
          // console.log(
          //   response.team[j].users[k]._id.toString() === req.query.user_id,
          //   j
          // );
          if (response.team[j].users[k]._id.toString() === req.query.user_id) {
            //response.user_team_number = j + 1;
            user_team_number[response._id] = j + 1;
            // console.log(response);
          }
        }
      }
    }
    // console.log(response);
    // console.log(response);
    gameslist.push(response);
  }
  // console.log(tab2);
  res.json({ gameslist, user_team_number });
});

module.exports = router;
