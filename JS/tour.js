const prompt = require("prompt")(); // Utilisation de prompt-sync pour la saisie synchrone

function genererNombreSecret() {
  return Math.floor(Math.random() * 100) + 1; // Génère un nombre aléatoire entre 1 et 100
}

function devinerNombreJoueur(joueur) {
  const proposition = prompt(`Joueur ${joueur}, veuillez deviner le nombre :`);
  return Number(proposition);
}

function jouer() {
  const nombreSecret = genererNombreSecret();
  let tourJoueur = 1;

  while (true) {
    const propositionJoueur1 = devinerNombreJoueur(1);
    if (propositionJoueur1 === nombreSecret) {
      console.log(`Félicitations Joueur 1 ! Vous avez trouvé le nombre secret.`);
      break;
    } else {
      console.log(`Joueur 1: Mauvaise proposition. Essayez encore.`);
    }

    const propositionJoueur2 = devinerNombreJoueur(2);
    if (propositionJoueur2 === nombreSecret) {
      console.log(`Félicitations Joueur 2 ! Vous avez trouvé le nombre secret.`);
      break;
    } else {
      console.log(`Joueur 2: Mauvaise proposition. Essayez encore.`);
    }

    tourJoueur++;
  }

  console.log(`Le nombre secret était ${nombreSecret}. La partie a pris fin après ${tourJoueur} tours.`);
}

jouer();
