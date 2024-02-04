// APPEL DES MODULES EXTERIEURS
const {action_tour} = require('./fonctions_actions')
const {initialiserMatrice, sac} = require('./fonctions_init');
const {pioche} = require('./fonctions_actions')

const fs = require("fs");

//INITIALISATION DE CONSTANTES

const lettres_jeu = [["A", 14], ["B", 4], ["C", 7], ["D", 5], ["E", 19],
["F", 2], ["G", 4], ["H", 2], ["I", 11], ["J", 1], ["K", 1],
["L", 6], ["M", 5], ["N", 9], ["O", 8], ["P", 4], ["Q", 1],
["R", 10], ["S", 7], ["T", 9], ["U", 8], ["V", 2], ["W", 1], 
["X", 1], ["Y",1], ["Z", 2]]

let joueur = 1

const fichier = "Historique.log"

let plato_joueur1 = initialiserMatrice(8, 9);
let plato_joueur2 = initialiserMatrice(8, 9);

let main_joueur1 = [];
let main_joueur2 = [];
let valise = sac(lettres_jeu);

main_joueur1 = main_joueur1.concat(pioche(6, valise));
main_joueur2 = main_joueur2.concat(pioche(6, valise));

premier_joueur = Math.floor(Math.random() * 2) //décider aléatoirement du premier joueur à jouer

//Lancement de la partie
if (premier_joueur == 0) {
    console.log("Le premier joueur commence !")
    fs.writeFileSync(fichier,"Le premier joueur commence\n")
    joueur = 1
    action_tour(main_joueur1,main_joueur2,plato_joueur1,plato_joueur2,valise)
}
else {
    console.log("Le deuxième joueur commence !")
    fs.writeFileSync(fichier,"Le deuxième joueur commence\n")
    joueur = 2
    action_tour(main_joueur2,main_joueur1,plato_joueur2,plato_joueur1,valise)
}