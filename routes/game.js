const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const candidateAttribution = require("../middlewares/candidateAttribution");

const Game = require("../models/Game");
const User = require("../models/User");
const Candidate = require("../models/Candidate");

router.get("/dashboard", isAuthenticated, async (req, res) => {
  // console.log(req);
  try {
    if (!req.query.game_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ message: "L'Id communiqué n'est pas au bon format" });
    }
    const game = await Game.findById(req.query.game_id).populate([
      {
        path: "team",
        populate: {
          path: "users",
          model: "User",
        },
      },
      {
        path: "team",
        populate: {
          path: "candidates",
          model: "Candidate",
        },
      },
    ]);
    if (game) {
      if (!game.launchable) {
        let tabtemp = [];
        for (let i = 0; i < game.nb_teams; i++) {
          // console.log(i);
          // console.log(game.team[i].users.length);
          if (game.team[i].users.length >= 1) {
            // console.log("on est dans la boucle !");
            for (let j = 0; j < game.team[i].users.length; j++) {
              // console.log("on est dans la deuxième boucle !");
              // console.log(game.team[i].users[j]._id.toString());
              if (game.team[i].users[j]._id.toString() === req.query.user_id) {
                // console.log("l'égalité est remplie");
                tabtemp = game.team[i];
                // console.log("tabtemp", tabtemp);
              }
            }
          }
          // if (game.team[i].users.includes(req.query.user_id)) {
          //   let tabtemp = game.team[i];
          //   game.team = [];
          //   game.team.push(tabtemp);
          //   console.log(game);
          // }
        }
        game.team = [];
        game.team.push(tabtemp);
        // console.log(game);
        // await game.populate([
        //   {
        //     path: "team",
        //     populate: {
        //       path: "users",
        //       model: "User",
        //     },
        //   },
        //   {
        //     path: "team",
        //     populate: {
        //       path: "candidates",
        //       model: "Candidate",
        //     },
        //   },
        // ]);
        res.status(200).json(game);
      } else {
        // await game.populate([
        //   {
        //     path: "team",
        //     populate: {
        //       path: "users",
        //       model: "User",
        //     },
        //   },
        //   {
        //     path: "team",
        //     populate: {
        //       path: "candidates",
        //       model: "Candidate",
        //     },
        //   },
        // ]);
        res.status(200).json(game);
      }
    } else {
      res.status(400).json({ message: "l'Id ne correspond à aucune partie" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Route permettant à un utilisateur de récupérer les infos d'une partie dans l'optique de la rejoindre. Une deuxième requête sera nécessaire pour rejoindre définitevement la partie.
router.get("/joinable", isAuthenticated, async (req, res) => {
  try {
    if (!req.query.game_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ message: "L'Id communiqué n'est pas au bon format" });
    }

    const user = await User.findById(req.query.user_id);
    if (user) {
      if (user.games.includes(req.query.game_id)) {
        return res
          .status(400)
          .json({ message: "L'utilisateur a déjà rejoint la partie" });
      }
    }
    // console.log(req);
    const game = await Game.findById(req.query.game_id).populate({
      path: "team",
      populate: {
        path: "users",
        model: "User",
      },
    });

    // console.log(game);
    if (game) {
      res.status(200).json(game);
    } else {
      res.status(400).json({
        message: "L'id communiqué ne correspond à aucune partie joignable",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Route permettant de récupérer la liste détaillée des parties d'un utilisateur ainsi que le numéro de son équipe pour chacune de ces parties
router.get("/list", isAuthenticated, async (req, res) => {
  // console.log(req.query.user_id);
  const user = await User.findById(req.query.user_id);
  // console.log("user dans la requête list", user);
  // console.log("gamelist user", user.games);
  let gameslist = [];
  let user_team_number = {};
  if (user.games.length >= 1) {
    for (let i = 0; i < user.games.length; i++) {
      const response = await Game.findById(user.games[i].toString()).populate([
        {
          path: "team",
          populate: {
            path: "users",
            model: "User",
          },
        },
        {
          path: "team",
          populate: {
            path: "candidates",
            model: "Candidate",
          },
        },
      ]);

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
            if (
              response.team[j].users[k]._id.toString() === req.query.user_id
            ) {
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
  }
  // console.log(tab2);
  res.json({ gameslist, user_team_number });
});

//Route permettant de rejoindre une équipe
router.put("/join", isAuthenticated, async (req, res) => {
  // console.log("utilisateur bien authentifié avant de rejoindre une partie");
  try {
    // console.log(req.headers);
    // console.log(req.body);
    const { game_id, team_number, user_id } = req.body;
    const game = await Game.findById(game_id);
    const user = await User.findById(user_id);
    // console.log(game);
    console.log(user);
    user.games.push(game_id);
    await user.save();
    game.team[team_number - 1].users.push(user_id);
    await game.save();
    res.status(200).json({
      message: `L'utilisateur a bien été rajouté à l'équipe ${team_number} de la partie ${game.game_name}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(
  "/placebet",
  isAuthenticated,
  async (req, res, next) => {
    try {
      // console.log(req.body);
      //req.body.bets / req.body.user_id / req.body.game_id
      // console.log(req.body.bets);
      const game = await Game.findById(req.body.game_id);
      // console.log(game.team[1]);
      let team_index = null;
      for (let i = 0; i < game.team.length; i++) {
        // console.log(i, game);
        const goodteam = game.team[i].users.find(
          (elem) => elem.toString() === req.body.user_id
        );
        if (goodteam) {
          team_index = Number(i);
        }
      }
      console.log("team_index", team_index);
      if (team_index || team_index === 0) {
        game.team[team_index].bet.push(req.body.bets);
        game.team[team_index].draft = true;
        // console.log(game);
      }
      await game.save();
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  candidateAttribution
);

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

module.exports = router;
