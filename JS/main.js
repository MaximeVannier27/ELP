const prompt = require("prompt");
const fs = require("fs");
prompt.start();

const lettres_jeu = [["A", 14], ["B", 4], ["C", 7], ["D", 5], ["E", 19],
["F", 2], ["G", 4], ["H", 2], ["I", 11], ["J", 1], ["K", 1],
["L", 6], ["M", 5], ["N", 9], ["O", 8], ["P", 4], ["Q", 1],
["R", 10], ["S", 7], ["T", 9], ["U", 8], ["V", 2], ["W", 1], 
["X", 1], ["Y",1], ["Z", 2]]

let joueur = 1

const fichier = "Historique.log"

function comptage(plato) {
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

function gagnant(plato1, plato2) {
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

function pioche(nombre, sac) {
    if (nombre === 0) {
        return [];
    } 
    else {
        let cartePiochee = sac[Math.floor(Math.random() * sac.length)];
        return [cartePiochee].concat(pioche(nombre - 1, sac));
    }
}

function nouveau(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Quel mot veux-tu poser ?")
    prompt.get(["Mot"], function (_,resultat_nouveau) {
        liste_diff = trouverLettresDifferentes(main_perso,resultat_nouveau.Mot)
        if (liste_diff.length < 1 && resultat_nouveau.Mot.length > 2 && resultat_nouveau.Mot.length < 10) {
            for (let i=0;i<tapis_perso.length;i++) {
                if (tapis_perso[i].every((element,index) => element === "")) {
                    for (let j=0;j<resultat_nouveau.Mot.length;j++) {
                        tapis_perso[i][j] = resultat_nouveau.Mot[j]
                    }
                    for (let k=0;k<resultat_nouveau.Mot.length;k++) {
                        index = main_perso.indexOf(resultat_nouveau.Mot[k])
                        main_perso.splice(index,1)
                    }
                    console.log("Bien joué ! Vous avez posé un nouveau mot");
                    fs.appendFileSync(fichier,`Le joueur ${joueur} a posé le mot ${resultat_nouveau.Mot}\n`)
                    main_perso = main_perso.concat(pioche(1,sac))
                    break
                }
            }
            if (plato_verif(tapis_perso)) {
                console.log(`Vous avez fini !\nVous avez ${comptage(tapis_perso)} points et votre adversaire ${comptage(tapis_adverse)} points`)
                gagnant(tapis_perso,tapis_adverse)
            }
            else {
                action_tour(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
            }
        } else {
            console.log("Ce mot n'est pas jouable.")
            action_tour(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        }
    })
}

function modifier(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Quel mot voulez vous modifier (numero de ligne)")
    console.log("Quel est le mot cible ?")
    prompt.get(["Ligne","Cible"], function (_,resultat_modif) {
        list_source = tapis_perso[resultat_modif.Ligne]
        list_diff = trouverLettresDifferentes(list_source,resultat_modif.Cible)
        if (estListePresenteRecursif(list_diff,main_perso) && list_diff.length > 0 && resultat_modif.Cible.length < 10) {
            for (let j=0;j<resultat_modif.Cible.length;j++) {
                tapis_perso[resultat_modif.Ligne][j] = resultat_modif.Cible[j]
            }
            for (let k=0;k<list_diff.length;k++) {
                index = main_perso.indexOf(list_diff[k])
                main_perso.splice(index,1)
            }
            console.log("Bien joué ! Vous avez modifié votre mot.");
            fs.appendFileSync(fichier,`Le joueur ${joueur} a modifié sa ligne n°${resultat_modif.Ligne} avec ${resultat_modif.Cible}\n`)
            main_perso = main_perso = main_perso.concat(pioche(1,sac))
            action_tour(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        } else {
            console.log("Ce mot n'est pas modifiable")
            action_tour(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        }
    })
}

function action_tour(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Votre main:\n" + main_perso);
    console.log("Votre tapis:");
    afficherMatrice(tapis_perso)
    console.log("Voulez vous jouer ou passer ? : (nouveau/modifier/passer)")
    prompt.get(["Choix"], function (_,resultat_choix) {
        if (resultat_choix.Choix === "nouveau") {
            nouveau(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        } else if (resultat_choix.Choix === "modifier") {
            modifier(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        } else if (resultat_choix.Choix === "passer") {
            console.log("Tour suivant, On change de joueur !")
            fs.appendFileSync(fichier,`Le joueur ${joueur} passe son tour\n`)
            joueur = (joueur%2)+1
            jarnac(main_adverse,main_perso,tapis_adverse,tapis_perso,sac)
        }
    })
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

function simple(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Quelle ligne voulez vous remplacer et par quoi ?");
    prompt.get(["Ligne_source","Mot_cible"], function(_,resultat_mot) {
        list_source = tapis_adverse[resultat_mot.Ligne_source]
        list_diff = trouverLettresDifferentes(list_source,resultat_mot.Mot_cible)
        if (estListePresenteRecursif(list_diff,main_adverse) && list_diff.length > 0 && resultat_mot.Mot_cible.length > 2 && resultat_mot.Mot_cible.length < 10) {
            for (let i=0;i<tapis_perso.length;i++) {
                if (tapis_perso[i].every((element,index) => element === "")) {
                    for (let j=0;j<resultat_mot.Mot_cible.length;j++) {
                        tapis_perso[i][j] = resultat_mot.Mot_cible[j]
                    }
                    for (let k=0;k<list_diff.length;k++) {
                        index = main_adverse.indexOf(list_diff[k])
                        main_adverse.splice(index,1)
                    }
                    console.log("Bien joué ! Vous volez le mot de votre adversaire.");
                    fs.appendFileSync(fichier,`Le joueur ${joueur} a Jarnac le mot ${resultat_mot.Mot_cible}\n`)
                    tapis_adverse[resultat_mot.Ligne_source] = ["","","","","","","","",""]
                    break
                }
            }
            if (plato_verif(tapis_perso)) {
                console.log("Vous avez fini !\nVous avez ${comptage(tapis_perso)} points et votre adversaire ${comptage(tapis_adverse)} points")
                gagnant(tapis_perso,tapis_adverse)
            }
            else {
                action_pioche(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
            }
        }
        else {
            console.log("Erreur: le mot cible n'est pas faisable à partir de la main adverse")
            jarnac(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        }
        });
}

function double(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Quel mot voulez vous remplacer et par quoi ?");
    prompt.get(["Ligne_source","Mot_cible"], function(_,resultat_mot) {
        list_source = tapis_adverse[resultat_mot.Ligne_source]
        list_diff = trouverLettresDifferentes(list_source,resultat_mot.Mot_cible)
        if (estListePresenteRecursif(list_diff,main_adverse) && list_diff.length > 0 && resultat_mot.Mot_cible.length > 2 && resultat_mot.Mot_cible.length < 10) {
            for (let i=0;i<tapis_perso.length;i++) {
                if (tapis_perso[i].every((element,index) => element === "")) {
                    for (let j=0;j<resultat_mot.Mot_cible.length;j++) {
                        tapis_perso[i][j] = resultat_mot.Mot_cible[j]
                    }
                    for (let k=0;k<list_diff.length;k++) {
                        index = main_adverse.indexOf(list_diff[k])
                        main_adverse.splice(index,1)
                    }
                    console.log("Bien joué ! Vous volez le mot de votre adversaire.");
                    fs.appendFileSync(fichier,`Le joueur ${joueur} a Double Jarnac le mot ${resultat_mot.Mot_cible}\n`)
                    tapis_adverse[resultat_mot.Ligne_source] = ["","","","","","","","",""]
                    break
                }
            }
            if (plato_verif(tapis_perso)) {
                console.log("Vous avez fini !\nVous avez ${comptage(tapis_perso)} points et votre adversaire ${comptage(tapis_adverse)} points")
                gagnant(tapis_perso,tapis_adverse)
            }
            else {
                simple(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
            }
        }
        else {
            console.log("Erreur: le mot cible n'est pas faisable à partir de la main adverse")
            jarnac(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
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
    console.log("Double Jarnac, Simple Jarnac ou rien ? (double/simple/rien)");
    prompt.get(["Jarnac"], function(_,resultat_jarnac) {
        if (resultat_jarnac.Jarnac === "double") {
           double(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        } 
        else if(resultat_jarnac.Jarnac === "simple") {
            simple(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        } 
        else {
            console.log("Pas de Jarnac");
            fs.appendFileSync(fichier,`Le joueur ${joueur} ne Jarnac pas\n`)
            action_pioche(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        }
    })
}

function action_pioche(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Votre main:\n" + main_perso);
    console.log("Votre tapis:");
    afficherMatrice(tapis_perso)
    console.log("Voulez vous piocher ou échanger 3 cartes: (pioche/change)");
    prompt.get(['Choix'], function (err,result_choix) {
        if (result_choix.Choix === "pioche") {
            console.log('Vous avez choisi de piocher une lettre');
            main_perso = main_perso.concat(pioche(1,sac));
            console.log("Votre nouvelle main:\n" + main_perso);
            fs.appendFileSync(fichier,`Le joueur ${joueur} a pioché\n`)
            action_tour(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        } 
        else if (result_choix.Choix === "change") {
            console.log("Vous avez choisi d'échanger 3 de vos lettres");
            console.log("Voici votre main:");
            console.log(main_perso);
            prompt.get(["Lettre_1","Lettre_2","Lettre_3"], function (_,result_lettre) {
                sac = sac.concat(main_perso.splice(result_lettre.Lettre_1,1));
                if (result_lettre.Lettre_1 === main_perso.length) {
                    main_perso.push(pioche(1,sac)[0])
                }
                else {
                    main_perso.splice(result_lettre.Lettre_1,0,pioche(1,sac)[0]);
                }
                sac = sac.concat(main_perso.splice(result_lettre.Lettre_2,1));
                if (result_lettre.Lettre_2 === main_perso.length) {
                    main_perso.push(pioche(1,sac)[0])
                }
                else {
                    main_perso.splice(result_lettre.Lettre_2,0,pioche(1,sac)[0]);
                }
                sac = sac.concat(main_perso.splice(result_lettre.Lettre_3,1));
                if (result_lettre.Lettre_3 === main_perso.length) {
                    main_perso.push(pioche(1,sac)[0])
                }
                else {
                    main_perso.splice(result_lettre.Lettre_3,0,pioche(1,sac)[0]);
                }
                fs.appendFileSync(fichier,`Le joueur ${joueur} a échangé 3 lettres de sa main\n`)
                action_tour(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
            });  
        } 
        else {
            console.log(err);
        }
    });
}

let plato_joueur1 = initialiserMatrice(8, 9);
let plato_joueur2 = initialiserMatrice(8, 9);

let main_joueur1 = [];
let main_joueur2 = [];
let valise = sac(lettres_jeu);

main_joueur1 = main_joueur1.concat(pioche(6, valise));
main_joueur2 = main_joueur2.concat(pioche(6, valise));

premier_joueur = Math.floor(Math.random() * 2)

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



