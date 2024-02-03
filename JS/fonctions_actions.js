const {estListePresenteRecursif, trouverLettresDifferentes, comptage, gagnant, plato_verif} = require('./fonctions_controle');
const { afficherMatrice } = require('./fonctions_init');

const prompt = require("prompt");
const fs = require("fs");
prompt.start();

let joueur = 1 

const fichier = "Historique.log"

function pioche(nombre, sac) {
/*
Fonction retournant le nombre de lettre à ajouter à la main courante à partir de la pioche (sac) 
*/
    if (nombre === 0) {
        return [];
    } 
    else {
        let cartePiochee = sac[Math.floor(Math.random() * sac.length)];
        return [cartePiochee].concat(pioche(nombre - 1, sac));
    }
}

function nouveau(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
/*
Fonction gérant la pose d'un nouveau mot d'un joueur lors de son tour
*/
    console.log("Quel mot veux-tu poser ?")
    prompt.get(["Mot"], function (_,resultat_nouveau) {
        liste_diff = trouverLettresDifferentes(main_perso,resultat_nouveau.Mot) 
        if (liste_diff.length < 1 && resultat_nouveau.Mot.length > 2 && resultat_nouveau.Mot.length < 10) { //vérification de la jouabilité du mot (lettres du mot présentes dans la main et mot de taille cohérente)
            for (let i=0;i<tapis_perso.length;i++) {
                if (tapis_perso[i].every((element,index) => element === "")) { //recherche de la ligne où poser le mot (première ligne vide du plateau)
                    for (let j=0;j<resultat_nouveau.Mot.length;j++) {
                        tapis_perso[i][j] = resultat_nouveau.Mot[j]
                    }
                    for (let k=0;k<resultat_nouveau.Mot.length;k++) { //suppression des lettres utilisées pour le mot dans la main du joueur
                        index = main_perso.indexOf(resultat_nouveau.Mot[k])
                        main_perso.splice(index,1)
                    }
                    console.log("Bien joué ! Vous avez posé un nouveau mot");
                    fs.appendFileSync(fichier,`Le joueur ${joueur} a posé le mot ${resultat_nouveau.Mot}\n`)
                    main_perso = main_perso.concat(pioche(1,sac)) //pioche après avoir posé un nouveau mot
                    break
                }
            }
            if (plato_verif(tapis_perso)) { //test de fin de partie: si le joueur place ce mot sur la dernière case de son plateau
                console.log(`Vous avez fini !\nVous avez ${comptage(tapis_perso)} points et votre adversaire ${comptage(tapis_adverse)} points`)
                gagnant(tapis_perso,tapis_adverse)
            }
            else {
                action_tour(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) //si la partie n'est pas finie, le joueur courant continue de choisir ce qu'il fait
            }
        } else {
            console.log("Ce mot n'est pas jouable.")
            action_tour(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        }
    })
}

function modifier(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
/*
Fonction gérant la modification d'un mot du plateau du joueur avec sa main actuelle
*/
    console.log("Quel mot voulez vous modifier (numero de ligne)")
    console.log("Quel est le mot cible ?")
    prompt.get(["Ligne","Cible"], function (_,resultat_modif) {
        list_source = tapis_perso[resultat_modif.Ligne]
        list_diff = trouverLettresDifferentes(list_source,resultat_modif.Cible)
        if (estListePresenteRecursif(list_diff,main_perso) && list_diff.length > 0 && resultat_modif.Cible.length < 10) { //test de possiblité de modification (lettres différentes entre mot à changer et mot cible présentes dans la main)
            for (let j=0;j<resultat_modif.Cible.length;j++) {
                tapis_perso[resultat_modif.Ligne][j] = resultat_modif.Cible[j] //modification du mot
            }
            for (let k=0;k<list_diff.length;k++) { //suppression des lettres utilisées de la main du joueur
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
/*
Fonction de gestion d'un tour
*/ 

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
            fs.appendFileSync(fichier,`Le joueur ${joueur} passe son tour\n`)
            joueur = (joueur%2)+1
            console.log(`C'est au joueur ${joueur} de jouer`)
            jarnac(main_adverse,main_perso,tapis_adverse,tapis_perso,sac) // si le joueur courant passe, lancement du tour suivant avec le jeu de l'autre joueur qui commence par le test de Jarnac
        }
    })
}

function simple(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
/*
Fonction gérant un coup de Jarnac simple
*/
    console.log("Quelle ligne voulez vous remplacer et par quoi ?");
    prompt.get(["Ligne_source","Mot_cible"], function(_,resultat_mot) {
        list_source = tapis_adverse[resultat_mot.Ligne_source]
        list_diff = trouverLettresDifferentes(list_source,resultat_mot.Mot_cible)
        if (estListePresenteRecursif(list_diff,main_adverse) && list_diff.length > 0 && resultat_mot.Mot_cible.length > 2 && resultat_mot.Mot_cible.length < 10) { //test de la validité du jarnac
            for (let i=0;i<tapis_perso.length;i++) {
                if (tapis_perso[i].every((element,index) => element === "")) {
                    for (let j=0;j<resultat_mot.Mot_cible.length;j++) { // ajout du mot volé sur la première ligne vide du plateau du joueur courant
                        tapis_perso[i][j] = resultat_mot.Mot_cible[j]
                    }
                    for (let k=0;k<list_diff.length;k++) { //suppression des lettres utilisées de la main de l'adversaire
                        index = main_adverse.indexOf(list_diff[k])
                        main_adverse.splice(index,1)
                    }
                    console.log("Bien joué ! Vous volez le mot de votre adversaire.");
                    fs.appendFileSync(fichier,`Le joueur ${joueur} a Jarnac le mot ${resultat_mot.Mot_cible}\n`)
                    tapis_adverse[resultat_mot.Ligne_source] = ["","","","","","","","",""] // suppression du mot volé de la main adverse
                    break
                }
            }
            if (plato_verif(tapis_perso)) { //test de fin de partie
                console.log("Vous avez fini !\nVous avez ${comptage(tapis_perso)} points et votre adversaire ${comptage(tapis_adverse)} points")
                gagnant(tapis_perso,tapis_adverse)
            }
            else {
                action_pioche(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) //lance la suite du tour
            }
        }
        else {
            console.log("Erreur: le mot cible n'est pas faisable à partir de la main adverse")
            jarnac(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        }
        });
}

function double(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
/*
Fonction gérant le double coup de Jarnac (similaire au simple)
*/

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
                simple(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) //appel un coup de jarnac simple après le premier coup
            }
        }
        else {
            console.log("Erreur: le mot cible n'est pas faisable à partir de la main adverse")
            jarnac(main_perso,main_adverse,tapis_perso,tapis_adverse,sac)
        }
        });
}

function jarnac(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
/*
Première fonction exécutée au lancement d'un tour, demandant au joueur s'il souhaite faire un coup de Jarnac sur le jeu adverse 
*/
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
            action_pioche(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) //si pas de jarnac, lancement classique d'un tour
        }
    })
}

function action_pioche(main_perso,main_adverse,tapis_perso,tapis_adverse,sac) {
/*
Fonction gérant les différentes pioches possibles au début du tour d'un joueur
*/
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




//Exportation des fonctions

module.exports.pioche = pioche;
module.exports.action_tour = action_tour