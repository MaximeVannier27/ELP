function initialiserMatrice(nbLignes, nbColonnes) {
/*
Fonction d'initialisation des plateau de mots des joueurs (matrice) 
*/

    let matrice = [];
    for (let i = 0; i < nbLignes; i++) {
        matrice[i] = [];
        for (let j = 0; j < nbColonnes; j++) {
            matrice[i][j] = "";
        }
    }
    return matrice;
}

function afficherMatrice(matrice) {
/*
Fonction pour afficher correctement les plateaux des joueurs à partir de leur matrice associée 
*/
    for (let i = 0; i < matrice.length; i++) {
        let ligne = "";
        for (let j = 0; j < matrice[i].length; j++) {
            ligne += matrice[i][j] + "\t";
        }
        console.log(ligne);
    }
}

function sac(lettres) {
/*
Fonction d'initialisation de la liste de pioche en fonction du nombre d'occurence de chaque lettre dans celle-ci 
*/
    let liste = [];
    for (let [lettre, nombre] of lettres) {
        for (let i = 0; i < nombre; i++) {
            liste.push(lettre);
        }
    }
    return liste;
}

//Exportation des fonctions

module.exports.initialiserMatrice = initialiserMatrice;
module.exports.sac = sac;
module.exports.afficherMatrice = afficherMatrice;