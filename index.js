//Utilisation des variables d'environnement
require("dotenv").config();

//Utilisation des packages
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");

//Création du serveur
const app = express();

//Utilisation de middlewares globaux
app.use(cors());
app.use(express.json());

//Connexion à la database MongoDB
mongoose.connect(process.env.MONGODB_URI);

const userRouter = require("./routes/user");
const gameRouter = require("./routes/game");
const candidateRouter = require("./routes/candidate");

app.use("/user", userRouter);
app.use("/game", gameRouter);
app.use("/candidate", candidateRouter);

app.all("*", (req, res) => {
  console.log();
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Server Started Successfully on port " + (process.env.PORT || 3000)
  );
});
