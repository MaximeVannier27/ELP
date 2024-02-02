function initialiserMatrice(nbLignes, nbColonnes) {
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
    for (let i = 0; i < matrice.length; i++) {
        let ligne = "";
        for (let j = 0; j < matrice[i].length; j++) {
            ligne += matrice[i][j] + "\t";
        }
        console.log(ligne);
    }
}

function sac(lettres) {
    let liste = [];
    for (let [lettre, nombre] of lettres) {
        for (let i = 0; i < nombre; i++) {
            liste.push(lettre);
        }
    }
    return liste;
}


module.exports.initialiserMatrice = initialiserMatrice;
module.exports.sac = sac;
module.exports.afficherMatrice = afficherMatrice;