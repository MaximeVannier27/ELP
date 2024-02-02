const fs = require("fs");

function estListePresenteRecursif(listePetite, listeGrande, indexPetite = 0, indexGrande = 0) {
    // Si tous les éléments de la liste petite ont été vérifiés, la liste est présente
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
    list_temp = list_verif.slice()
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

function gagnant(plato1, plato2) {
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


module.exports.estListePresenteRecursif = estListePresenteRecursif;
module.exports.trouverLettresDifferentes = trouverLettresDifferentes;
module.exports.gagnant = gagnant;
module.exports.plato_verif = plato_verif;