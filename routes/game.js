const express = require("express");
const router = express.Router();

const Game = require("../models/Game");

router.post("/create", async (req, res) => {
  try {
    let { name } = req.body;
    let newGame = new Game({
      name: name,
    });
    await newGame.save();
    console.log(newGame);
    res.status(200).json({ message: `La partie ${name} a bien été créée.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
