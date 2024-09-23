const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuthenticated");

const User = require("../models/User");

router.get("/idfromemail", isAuthenticated, async (req, res) => {
  if (req.headers.email !== req.decodeValue.email) {
    console.log(
      "Le token fournit ne correspond pas à l'adresse mail communiquée pour retrieve des datas"
    );
    return res.json({
      message:
        "Le token fournit ne correspond pas à l'adresse mail communiquée pour retrieve des datas",
    });
  }

  try {
    let { _id } = await User.findOne({ email: req.headers.email });
    // console.log("_id du user", _id.valueOf());
    // console.log("id de l'admin", process.env.ADMIN_ID);
    res.json({
      userMongoId: _id.valueOf(),
      isAdmin: _id.valueOf() === process.env.ADMIN_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Pas besoin de sécuriser cette route car elle sert uniquement à indiquer si les username et emails ont déjà été attribués.

router.get("/attributeduserdetails", async (req, res) => {
  // if (req.query.email !== req.decodeValue.email) {
  //   console.log(
  //     "Le token fournit ne correspond pas à l'adresse mail communiquée pour retrieve des datas"
  //   );
  //   return res.json({
  //     message:
  //       "Le token fournit ne correspond pas à l'adresse mail communiquée pour retrieve des datas",
  //   });
  // }
  try {
    // console.log(req.query.username);
    // console.log(req.query.email);
    let tab = await User.findOne({ email: req.query.email });
    let tab2 = await User.findOne({ username: req.query.username });
    let emailvalid = tab ? false : true;
    let usernamevalid = tab2 ? false : true;
    // console.log(emailvalid);
    // console.log(usernamevalid);
    res.json({ email: emailvalid, username: usernamevalid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    let { username, email } = req.body;

    let tab = await User.findOne({ email: email });
    if (tab) {
      return res
        .status(409) //statut pour le conflit
        .json({ message: "L'email est déjà associé à un compte" });
    }

    let tab2 = await User.findOne({ username: username });
    if (tab2) {
      return res
        .status(409) //statut pour le conflit
        .json({ message: "L'username a déjà été attribué" });
    }
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
    res.status(200).json({
      message: `La partie a bien été rajoutée au profil de l'utilisateur`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
