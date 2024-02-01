const prompt = require("prompt");
const fs = require("fs");
prompt.start();

function action_tour(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Voulez vous jouer ou passer ? : (jouer/passer)")
    prompt.get(["Choix"], function(_,resultat_choix) {
        if (resultat_choix.Choix === "jouer") {
            jouer(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        }
    })

}

function trouverLettresDifferentes(list_verif, mot_verif) {
    list_temp = list_verif
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

function simple(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Quelle ligne voulez vous remplacer et par quoi ?");
    prompt.get(["Ligne_source","Mot_cible"], function(_,resultat_mot) {
        list_source = tapis_adverse[resultat_mot.Ligne_source]
        if (estListePresenteRecursif(trouverLettresDifferentes(list_source,resultat_mot.Mot_cible),main_adverse)) {
            console.log("Bien joué ! Vous volez le mot de votre adversaire.");
            index = tapis_adverse.indexOf(resultat_mot.Mot_source);
            tapis_adverse[index] = resultat_mot.Mot_cible 
            for (let i=0;i<tapis_perso.length;i++) {
                if (tapis_perso[i] == []) {
                    tapis_perso[i] = main_adverse.splice(index,1);
                }
            }
            action_pioche(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        }
        else {
            console.log("Erreur: le mot cible n'est pas faisable à partir de la main adverse")
            jarnac(main_perso,main_adverse,tapis_adverse,tapis_perso)
        }
        });
}

function double(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Quel mot voulez vous remplacer et par quoi ?");
    prompt.get(["Ligne_source","Mot_cible"], function(_,resultat_mot) {
        list_source = tapis_adverse[resultat_mot.Ligne_source]
        if (estListePresenteRecursif(trouverLettresDifferentes(list_source,resultat_mot.Mot_cible),main_adverse)) {
            console.log("Bien joué ! Vous volez le mot de votre adversaire.");
            c++
            index = tapis_adverse.indexOf(resultat_mot.Mot_source);
            tapis_adverse[index] = resultat_mot.Mot_cible 
            for (let i=0;i<tapis_perso.length;i++) {
                if (tapis_perso[i] == []) {
                    tapis_perso[i] = main_adverse.splice(index,1);
                }
            }

            simple(main_perso,main_adverse,tapis_adverse,tapis_perso,sac)
        }
        else {
            console.log("Erreur: le mot cible n'est pas faisable à partir de la main adverse")
            jarnac(main_perso,main_adverse,tapis_adverse,tapis_perso)
        }
        });
}

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

function jarnac(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Main adverse:\n" + main_adverse);
    console.log("Tapis adverse:");
    afficherMatrice(tapis_adverse)
    console.log("Double Jarnac, Jarnac ou rien ? (d/j/r)\n");
    prompt.get(["Jarnac"], function(_,resultat_jarnac) {
        if (resultat_jarnac.Jarnac === "d") {
           double(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        } 
        else if(resultat_jarnac.Jarnac === "j") {
            simple(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        } 
        else {
            console.log("Pas de Jarnac");
            action_pioche(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        }
    })
}

function action_pioche(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Votre tour !");
    console.log("Votre main:\n" + main_perso);
    console.log("Votre tapis:");
    afficherMatrice(tapis_perso)
    console.log("Voulez vous piocher ou échanger 3 cartes: (pioche/change");
    prompt.get(['Choix'], function (err,result_choix) {
        if (result_choix.Choix === "pioche") {
            console.log('Vous avez choisi de piocher une lettre');
            main_perso.concat(pioche(1,sac));
        } 
        else if (result_choix.Choix === "change") {
            console.log("Vous avez choisi d'échanger 3 de vos lettres");
            console.log("Voici votre main:");
            console.log(main_perso);
            prompt.get(["Lettre_1","Lettre_2","Lettre_3"], function (_,result_lettre) {
                sac.concat(main_perso.splice(result_lettre.Lettre_1,1));
                sac.concat(main_perso.splice(result_lettre.Lettre_2,1));
                sac.concat(main_perso.splice(result_lettre.Lettre_3,1));
                main_perso.concat(pioche(3,sac));
                console.log("Votre nouvelle main:\n" + main_perso);
            });  
        } 
        else {
            console.log(err);
        }
    });

}





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

plato_joueur1 = [["A","B","C","D","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""]
            ]

console.log("Matrice du joueur 1:");
afficherMatrice(plato_joueur1);

console.log("\nMatrice du joueur 2:");
afficherMatrice(plato_joueur2);

lettres_jeu = [["A", 14], ["B", 4], ["C", 7], ["D", 5], ["E", 19],
["F", 2], ["G", 4], ["H", 2], ["I", 11], ["J", 1], ["K", 1],
["L", 6], ["M", 5], ["N", 9], ["O", 8], ["P", 4], ["Q", 1],
["R", 10], ["S", 7], ["T", 9], ["U", 8], ["V", 2], ["W", 1], 
["X", 1], ["Y",1], ["Z", 2]]

function sac(lettres) {
    let liste = [];
    for (let [lettre, nombre] of lettres) {
        for (let i = 0; i < nombre; i++) {
            liste.push(lettre);
        }
    }
    return liste;
}

function pioche(nombre, sac) {
    if (nombre === 0) {
        return [];
    } 
    else {
        let cartePiochee = sac[Math.floor(Math.random() * sac.length)];
        return [cartePiochee].concat(pioche(nombre - 1, sac));
    }
}

let main_joueur1 = [];
let main_joueur2 = [];
let valise = sac(lettres_jeu);

main_joueur1 = main_joueur1.concat(pioche(6, valise));
main_joueur2 = main_joueur2.concat(pioche(6, valise));
main_joueur2 += [,"S"]

console.log(main_joueur1);
console.log(main_joueur2);

function fin(plato) {
    points = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 2; j < 9; j++) {
            if (plato[i][j] !== "")
                {
                    points += Math.pow(j+1, 2) 
                }
            }    
    }
    return points
}

console.log(fin(plato_joueur1))
plato_joueur2[0] = ["C","A","R","I","E","S","",""]


jarnac(main_joueur1,main_joueur2,plato_joueur1,plato_joueur2,valise)


//console.log(fin(plato_joueur1))