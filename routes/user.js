const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const User = require("../models/User");

router.post("/signup", async (req, res) => {
  try {
    let { username, email } = req.body;
    let newUser = new User({
      email: email,
      username: username,
    });
    await newUser.save();
    console.log(newUser);
    res
      .status(200)
      .json({ message: `Le profil de ${username} a bien été crée` });
  } catch (error) {
    res.status(500).json({ messge: error.message });
  }
});

router.put("/addgametouser", async (req, res) => {
  try {
    let { user_id, game_id } = req.body;
    console.log("user_id", user_id);
    let usertochange = await User.findById(user_id);
    // console.log("usertochange", usertochange);
    usertochange.games.push(game_id);
    await usertochange.save();
    // console.log(usertochange);
    res
      .status(200)
      .json({
        message: `La partie a bien été rajoutée au profil de l'utilisateur`,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
