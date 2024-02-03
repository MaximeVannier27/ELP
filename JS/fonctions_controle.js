const fs = require("fs");

function estListePresenteRecursif(listePetite, listeGrande, indexPetite = 0, indexGrande = 0) {
/*
Fonction de tests vérifiant si tous les éléments d'une liste (de lettres) sont présents dans une autre liste plus grande (sans contraintes d'ordre)
*/

    // Si tous les éléments de la petite liste ont été vérifiés c'est que tous ses éléments sont bien présents dans la grande
    if (indexPetite === listePetite.length) {
      return true;
    } 
    // Parcourir la liste grande à partir de l'index actuel
    for (let i = indexGrande; i < listeGrande.length; i++) {
      // Si l'élément correspond, continuer la vérification récursive avec le prochain élément de la liste petite
      if (listeGrande[i] === listePetite[indexPetite]) {
        return estListePresenteRecursif(listePetite, listeGrande, indexPetite + 1, i + 1);
      }
    }
    // Si aucun élément correspondant n'est trouvé, la liste n'est pas présente
    return false;
}

function trouverLettresDifferentes(list_verif, mot_verif) {
/*
Fonction renvoyant la liste des lettres différentes entre une liste de lettre et un mot (chaîne de caractère)
*/
    list_temp = list_verif.slice() //copie de la liste pour éviter les problèmes d'adresses
    let lettresDifferentes = [];
    for (let lettre in mot_verif) {
        if (list_temp.includes(mot_verif[lettre])) {
            indice = list_temp.indexOf(mot_verif[lettre])
            list_temp.splice(indice,1)
        }
        else {
            lettresDifferentes.push(mot_verif[lettre])
        }
    }
    return lettresDifferentes
}

function comptage(plato) {
/*
Fonction retournant le nombre de points sur un plateau en fonction du nombre de mots dessus et de leur taille (pour la fin de partie)
*/

    let points = 0;
    for (let i = 0; i < plato.length; i++) {
        if (plato[i][0] === "") {
            continue;
        }
        let j = 0;
        let longueur_mot = 0;
        while (j < plato[i].length && plato[i][j] !== "") {
            longueur_mot++;
            j++;
        }
        if (longueur_mot > 2) {
            points += Math.pow(longueur_mot, 2);
        }
    }
    return points;
}

function gagnant(plato1, plato2) {
/*
Fonction appelée lors de la victoire d'un des joueurs, et qui examine les cores de chacun
*/
    const fichier = "Historique.log"
    fs.appendFileSync(fichier,"La partie est terminée\n")
    score_joueur1 = comptage(plato_joueur1)
    score_joueur2 = comptage(plato_joueur2)
    if (score_joueur1 > score_joueur2) {
        console.log("Vous avez gagné !")
        fs.appendFileSync(fichier,`Le joueur ${joueur} a gagné\n`)
    }
    else if (score_joueur1 === score_joueur2) {
        console.log("Il y a égalité")
        fs.appendFileSync(fichier,"Personne n'a gagné\n")
    }
    else {
        console.log("L'autre joueur a gagné !")
        fs.appendFileSync(fichier,`Le joueur ${joueur+1} a gagné\n`)
    }
}

function plato_verif(plato) {
/*
Test de fin de partie: vérification qu'un plateau est plein
*/
    let rempli = true;
    let i = 0;
    while (rempli && i < 8) {
        if (plato[i][0] !== "") {
            i++;
        } else {
            rempli = false;
        }
    }
    return rempli;
}

//Exportation des fonctions

module.exports.estListePresenteRecursif = estListePresenteRecursif;
module.exports.trouverLettresDifferentes = trouverLettresDifferentes;
module.exports.gagnant = gagnant;
module.exports.plato_verif = plato_verif;
module.exports.comptage = comptage;