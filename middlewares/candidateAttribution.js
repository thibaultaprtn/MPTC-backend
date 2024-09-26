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

    //A la fin de ce deuxième tour, on retire de la liste des candidats disponibles l'ensemble des candidats présents dans les différentes équipes

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
                //Si jamais il est présent dans plusieurs équipes, on le rajoute à l'équipe ayant le plus grand bet
                maxbet = game.team[j].bet[game.round - 1][id];
                teammax = Number(j);
                console.log(teammax);
              } else if (game.team[j].bet[game.round - 1][id] === maxbet) {
                //Si jamais les bets sont égaux, on choisit l'équipe qui a placé son bet le plus tôt, il faut donc un time stamp dans l'objet bet
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
            // candidatetoadd.bet = maxbet;
            // candidatetoadd.round = game.round;
            game.team[teammax].candidates.push(candidatetoadd);
          }
        }
        //A la fin de l'attribution, il se peut que l'on ait plus que le nombre limite de candidats au sein d'une équipe. On enlève par nombre décroissant de mise jusqu'à ce que l'équipe ne fasse que quatre.
        //On peut rajouter ces joueurs dans un nouveau tableau, et les reattribuer si jamais ils avaient eu un bet par une autre équipe.
        //On ne le fera pas ici, trop compliqué pour trop peu d'intérêt, ce qui n'a pas été obtenu à un round est remis en jeu dans le round suivant
        let fullteams = true;
        for (let i = 0; i < game.team.length; i++) {
          console.log("on rentre dans la boucle à tester");

          //On effectue une vérification sur le nombre de candidats par équipe pour chacune des équipes
          if (game.team[i].candidates.length > game.nb_candidates_team) {
            //On rentre dans la boucle si jamais le nombre de candidats dans l'équipe est plus grand que ce que l'on s'était fixé
            let n = game.team[i].candidates.length - game.nb_candidates_team;
            console.log(n);
            //On définit n le nombre de candidats à supprimer au sein de la brigade de l'équipe
            let betvalues = Object.values(
              game.team[i].bet[game.round - 1]
            ).sort(function (a, b) {
              return a - b;
            });
            console.log("betvalues", betvalues);
            //On récupère un tableau avec les mises qui ont été faites lors du dernier round que l'on trie par ordre croissant
            let betkeys = Object.keys(game.team[i].bet[game.round - 1]);
            console.log("betkeys", betkeys);
            //On récupère un tableau avec l'ensemble des id des candidats pour lesquels une mise a été faite au dernier round
            for (let j = 1; j <= n; j++) {
              //Pour les n candidats à supprimer, on cherche l'id tel que le bet qui a été placé corresponde à la nième plus petite valeur de bet
              let idtodelete = betkeys.find(
                (elem) =>
                  game.team[i].bet[game.round - 1][elem] === betvalues[j - 1]
              );
              console.log("idtodelete", idtodelete);
              const found = game.team[i].candidates.find(
                (element) => element.toString() === idtodelete
              );
              console.log("found", typeof found);
              if (found) {
                const index = game.team[i].candidates.indexOf(found);
                console.log("index", index);
                game.team[i].candidates.splice(index, 1);
              }
            }
            //On récupère la valeur du plus petit bet placé
            //On trouve l'id du candidat pour lequel on a placé ce bet
            //On trouve l'index
            //On le supprime de la liste

            //Il faut faire une boucle pour supprimer les candidats de la liste des candidats disponibles
            for (let k = 0; k < game.team[i].candidates.length; k++) {
              console.log(
                "boucle de suppression des availables candidates pour >"
              );
              const found = game.available_candidates.find(
                (elem) => elem._id === game.team[i].candidates[k]
              );
              console.log("found", typeof found);
              if (found) {
                const index = game.available_candidates.indexOf(found);
                console.log(index);
                game.available_candidates.splice(index, 1);
              }
            }

            game.team[i].full = true;
            game.team[i].bet.push({});
            game.team[i].draft = true;
          } else if (
            game.team[i].candidates.length === game.nb_candidates_team
          ) {
            for (let k = 0; k < game.team[i].candidates.length; k++) {
              console.log(
                "boucle de suppression des availables candidates pour ="
              );
              const found = game.available_candidates.find(
                (elem) => elem._id === game.team[i].candidates[k]
              );
              console.log("found", typeof found);
              if (found) {
                const index = game.available_candidates.indexOf(found);
                console.log("index", index);

                game.available_candidates.splice(index, 1);
              }
            }

            game.team[i].full = true;
            game.team[i].bet.push({});
            game.team[i].draft = true;
          } else if (game.team[i].candidates.length < game.nb_candidates_team) {
            if (game.team[i].candidates.length > 1) {
              for (let k = 0; k < game.team[i].candidates.length; k++) {
                console.log(
                  "boucle de suppression des availables candidates pour <"
                );
                const found = game.available_candidates.find(
                  (elem) => elem._id === game.team[i].candidates[k]
                );
                if (found) {
                  console.log("found");
                  const index = game.available_candidates.indexOf(found);
                  console.log("index", index);

                  game.available_candidates.splice(index, 1);
                }
              }
            }
            game.team[i].draft = false;
            fullteams = false;
          }
        }
        game.round += 1;
        if (fullteams) {
          game.launchable = true;
        }
        //On parcourt les équipes et si elles sont pleines on met full à true
        //Si c'est true on met un bet vide avant de bypass les bets suivants
        //On met draft à true

        //Si l'équipe n'est pas pleine on repasse la draft à false.
        //On regarde si toutes les équipes on full===true
        //Si c'est le cas on passe launchable à true

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
