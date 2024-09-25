const Game = require("../models/Game");

const candidateAttribution = async (req, res, next) => {
  try {
    const game = await Game.findById(req.body.game_id);
    // console.log(game);
    let hastobeupdated = true;
    for (let i = 0; i < game.team.length; i++) {
      if (game.team[i].bet.length < game.round) {
        hastobeupdated = false;
      }
    }
    console.log(hastobeupdated);

    //Done - Il faut faire un betting proportionnel au nombre de candidats à choisir encore (10points par candidats à choisir)
    //Il faut limiter le nombre de candidats sur lesquels on peut miser (typiquement 4 ou 5) Plus tard

    //Algo

    //Si jamais il est présent dans plusieurs équipes, on le rajoute à l'équipe ayant le plus grand bet
    //Si jamais les bets sont égaux, on choisit l'équipe qui a placé son bet le plus tôt, il faut donc un time stamp dans l'objet bet
    //A la fin de l'attribution, il se peut que l'on ait plus que le nombre limite de candidats au sein d'une équipe. On enlève par nombre décroissant de mise jusqu'à ce que l'équipe ne fasse que quatre
    //On peut rajouter ces joueurs dans un nouveau tableau, et les reattribuer si jamais ils avaient eu un bet par une autre équipe.

    //A la fin de ce deuxième tour, on retire de la liste des candidats disponibles l'ensemble des candidats présents dans les différentes équipes

    //Si une équipe est pleine on passe le full à true,

    //On push un objet vide dans le bet correspondant afin de bypass les bets suivants
    //Si l'équipe n'est pas pleine on passe son draft à false
    //On vérifie si la value full est true pour toutes les équipes
    //Si c'est le cas on passe launchable à true

    if (hastobeupdated) {
      console.log("il faut faire une répartition des joueurs");
      if (game.available_candidates.length >= 0) {
        //Le if ci-dessus permet d'éviter le cas de figure (peu probable) ou tous les joueurs ont déjà été attribués
        for (let i = 0; i < game.available_candidates.length; i++) {
          console.log("boucle sur les candidats", i);
          //On parcourt la liste des availables candidates
          //Pour chacun, soit aucun bet n'a été placé sur lui, soit un bet est présent dans au moins une des équipes
          //Les trois variables ci-dessous stockent l'index de la team avec le highest bid, le highest bid et l'id du candidat sur lequel le bid a été placé
          let teammax = null;
          let maxbet = 0;
          let id = game.available_candidates[i]._id.toString();

          //On parcourt les différentes équipes pour voir si des bids ont été placés sur les joueurs
          for (let j = 0; j < game.team.length; j++) {
            console.log("boucle sur les équipes", j);
            //On execute une action si jamais l'id du candidat est présent dans le l'objet du tableau bet de l'équipe et de round questionné
            if (game.team[j].bet[game.round - 1][id]) {
              console.log(
                "bet de la team sondée",
                game.team[j].bet[game.round - 1][id]
              );
              console.log("maxbet", maxbet);
              //Si le bid que l'on rencontre est plus élevé que le bid actuel on actualise le maxbet et on attribue le teammax a l'équipe sondée
              if (game.team[j].bet[game.round - 1][id] > maxbet) {
                maxbet = game.team[j].bet[game.round - 1][id];
                teammax = Number(j);
                console.log(teammax);
              } else if (game.team[j].bet[game.round - 1][id] === maxbet) {
                console.log("on est dans une configuration d'égalité");
                console.log(game.team[j].bet[game.round - 1].time);
                console.log(game.team[teammax].bet[game.round - 1].time);
                if (
                  game.team[j].bet[game.round - 1].time <
                  game.team[teammax].bet[game.round - 1].time
                ) {
                  console.log(
                    "on est dans l'execution de la condition d'égalité"
                  );
                  teammax = Number(j);
                }
              }
            }
          }
          if (teammax || teammax === 0) {
            let candidatetoadd = game.available_candidates[i];
            game.team[teammax].candidates.push(candidatetoadd);
          }
        }
        await game.save();
      }
    } else {
      console.log(
        "des équipes doivent encore placer leurs bets avant de faire une répartition des candidats"
      );
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = candidateAttribution;
