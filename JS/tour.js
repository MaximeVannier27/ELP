const prompt = require("prompt");
const fs = require("fs");
prompt.start();



function trouverLettresDifferentes(mot1, mot2) {
    let lettresDifferentes = [];
  
    // Itérer sur la longueur du mot le plus court
    let longueurMinimale = Math.min(mot1.length, mot2.length);
  
    for (let i = 0; i < longueurMinimale; i++) {
      // Comparer les caractères correspondants
      if (mot1[i] !== mot2[i]) {
        lettresDifferentes.push(mot1[i]);
      }
    }
  
    // Ajouter les caractères restants du mot le plus long
    if (mot1.length > longueurMinimale) {
      lettresDifferentes = lettresDifferentes.concat(mot1.substring(longueurMinimale));
    } else if (mot2.length > longueurMinimale) {
      lettresDifferentes = lettresDifferentes.concat(mot2.substring(longueurMinimale));
    }
  
    return lettresDifferentes;
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

function jarnac(main_adverse,tapis_adverse,tapis_perso) {
    console.log("Main adverse:\n" + main_adverse)
    console.log("Tapis adverse:\n" + tapis_adverse)
    console.log("Double Jarnac, Jarnac ou rien ? (d/j/r)\n")
    prompt.get(["Jarnac"], function(_,resultat_jarnac) {
        if (resultat_jarnac.Jarnac === "d") {
            c = 0;
            while (c<2) {
                console.log("Quel mot voulez vous remplacer et par quoi ?");
                prompt.get(["Mot_source","Mot_cible"], function(_,resultat_mot) {
                if (!(resultat_mot.Mot_source in tapis_adverse)) {
                    console.log("Mot source invalide: non présent sur le tapis.");
                }
                else if (estListePresenteRecursif(trouverLettresDifferentes(resultat_mot.Mot_source,resultat_mot.Mot_cible),main_adverse)) {
                    console.log("Bien joué ! Vous volez le mot de votre adversaire.");
                    c++
                    index = tapis_adverse.indexOf(resultat_mot.Mot_source);
                    tapis_adverse[index] = resultat_mot.Mot_cible 
                    for (let i=0;i<tapis_perso.length;i++) {
                        if (tapis_perso[i] == []) {
                            tapis_perso[i] = main_adverse.splice(index,1);
                        }
                    }
                }
                else {
                    console.log("Erreur: le mot cible n'est pas faisable à partir de la main adverse")
                }
                });
            }
        }
        else if(resultat_jarnac.Jarnac === "j") {
            console.log("Quel mot voulez vous remplacer et par quoi ?");
            prompt.get(["Mot_source","Mot_cible"], function(_,resultat_mot) {
            if (!(resultat_mot.Mot_source in tapis_adverse)) {
                console.log("Mot source invalide: non présent sur le tapis.");
            }
            else if (estListePresenteRecursif(trouverLettresDifferentes(resultat_mot.Mot_source,resultat_mot.Mot_cible),main_adverse)) {
                console.log("Bien joué ! Vous volez le mot de votre adversaire.");
                c++
                index = tapis_adverse.indexOf(resultat_mot.Mot_source);
                tapis_adverse[index] = resultat_mot.Mot_cible 
                for (let i=0;i<tapis_perso.length;i++) {
                    if (tapis_perso[i] == []) {
                        tapis_perso[i] = tapis_adverse.splice(index,1);
                    }
                }
            }
            else {
                console.log("Erreur: le mot cible n'est pas faisable à partir de la main adverse")
            }
            });
        }
        else {
            console.log("Pas de Jarnac")
        }
    })
}


function tour(main,main_adverse,tapis_perso,tapis_adverse,sac) {
    console.log("Votre tour !");
    jarnac(main_adverse,tapis_adverse,tapis_perso);
    prompt.get(['Choix'], function (err,result_choix) {
        if (result_choix.Choix === "pioche") {
            console.log('Vous avez choisi de piocher une lettre');
            main += pioche(1,sac)

        } else if (result_choix.Choix === "change") {
            console.log("Vous avez choisi d'échanger 3 de vos lettres");
            console.log("Voici votre main:");
            console.log(main);
            main += pioche(3,sac);
            prompt.get(["Lettre_1","Lettre_2","Lettre_3"], function (_,result_lettre) {
                sac += [,] + main.splice(result_lettre.Lettre_1,1);
                sac += [,] + main.splice(result_lettre.Lettre_2,1);
                sac += [,] + main.splice(result_lettre.Lettre_3,1);
            });
            console.log("Votre nouvelle main:\n" + main)
            
        } else{
            console.log(err);
        }
    });
    console.log("suite du tour")

}
