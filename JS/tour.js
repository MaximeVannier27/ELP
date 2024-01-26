const prompt = require("prompt");
const fs = require("fs");
prompt.start();



function tour(num_joueur,main,sac) {
    console.log("Votre tour !");
    prompt.get(['Choix'], function (err,result_choix) {
        if (result_choix.Choix === "pioche") {
            console.log('Vous avez choisi de piocher une lettre');
            pioche(1,sac)

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
}

tour(1)