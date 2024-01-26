
function initialiserMatrice(nbLignes, nbColonnes, valeurParDefaut = 0) {
    let matrice = [];

    for (let i = 0; i < nbLignes; i++) {
        matrice[i] = [];
        for (let j = 0; j < nbColonnes; j++) {
            matrice[i][j] = valeurParDefaut;
        }
    }

    return matrice;
}

let plato_joueur1 = initialiserMatrice(8, 9);
let plato_joueur2 = initialiserMatrice(8, 9);

function afficherMatrice(matrice) {
    for (let i = 0; i < matrice.length; i++) {
        let ligne = "";
        for (let j = 0; j < matrice[i].length; j++) {
            ligne += matrice[i][j] + "\t";
        }
        console.log(ligne);
    }
}

console.log("Matrice du joueur 1:");
afficherMatrice(plato_joueur1);

console.log("\nMatrice du joueur 2:");
afficherMatrice(plato_joueur2);

lettres = [["A", 14], ["B", 4], ["C", 7], ["D", 5], ["E", 19]
["F", 2], ["G", 4], ["H", 2], ["I", 11], ["J", 1], ["K", 1],
["L", 6], ["M", 5], ["N", 9], ["O", 8], ["P", 4], ["Q", 1],
["R", 10], ["S", 7], ["T", 9], ["U", 8], ["V", 2], ["W, 1"],
["X", 1], ["Y",1], ["Z", 2]]

function sac(lettres) {
    liste = []
    for lettre in lettres :
        for nombre in range(listre[1]-1):
            
}

function pioche(nombre,sac){
    if (nombre == 0) {
        return []
    }
    else {
        return [, sac.slice(Math.floor(Math.random() * (sac.length)), 1)[0]] + pioche(nombre-1, sac)
    }
}