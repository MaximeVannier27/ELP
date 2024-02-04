## Préliminaires

Ce code s'exécute sous un environnement node.js. Afin de bien le faire tourner, il est nécessaire d'installer en amont
certains modules extérieurs présents dans le fichier package.json (seulement 'prompt' à ce jour). Pour se faire, un 
simple "npm install" dans une console ouverte dans le repertoire d'exécution suffit. Une fois fait, lancer le programme
avec 'node ./main.js'.


## Déroulé du jeu

**/!\ TOUS LES MOTS A POSER/MODIFIER DOIVENT ETRE ECRIT EN MAJUSCULE ET CEUX DE CONTROLE (pioche, passer, ...) EN MINUSCULE /!\\**

Le jeu Jarnac est un jeu tour par tour de deux joueurs. Ici, les deux joueurs jouent sur la même console chacun leur tour.
Les joueurs décident eux-même en amont qui sera le joueur 1 et qui sera le joueur 2, et au lancement du programme un des 
deux joueurs est choisi aléatoirement pour commencer à jouer.
Un tour se déroule selon ce modèle:\

* Le joueur courant décide de faire un double coup de jarnac, un coup de jarnac simple ou alors rien du tout après avoir pris
connaissance de la main et du plateau de son adversaire (sauf pour le tout premier tour puisque rien n'a encore été joué)\
INPUT DEMANDEE: double , simple , rien

    * Si un coup de jarnac est choisi, le joueur doit signaler quelle ligne du plateau de son adversaire l'intéresse (indexée à partir de 0) et quel nouveau mot veut-il produire.\
    INPUT DEMANDEE: *numero de ligne* puis *mot_cible*

* Après le jarnac, on demande au joueur courant s'il souhaite piocher une lettre ou en échanger 3 de son jeu contre 3 aléatoires de la pioche. 
    * Si l'échange est choisi, le joueur doit succéssivement donner les indices (main indexée à partir de 0)\
INPUT DEMANDEE: pioche , change (puis indice de ses lettres)

* On demande maintenant au joueur ses actions. Si le joueur décide de poser un nouveau mot, il faut ensuite qu'il indique quel est ce mot et le jeu lui reposera la question tant que ce mot n'est pas faisable avec sa main. Si le joueur décide de mofidier un mot, il devra, comme pour le coup de jarnac, donner le numéro de ligne de son plateau à modifier et écrire le nouveau mot à placer. Le jeu test si ce mot est possible en fonction du mot source et de sa main. Le joueur peut aussi passer son tour et ne rien faire. Cette boucle se répète tant que le joueur ne passe pas son tour.\
INPUT DEMANDEE: nouveau (puis *mot*), modifier (puis *ligne à modifier* et *nouveau mot*) , passer 


## Fin du jeu
La partie se termine quand un des deux joueurs place un mot sur la dernière ligne de son plateau et que toutes les lignes sont pleines (8ème mot). Le score des deux joueurs est ensuite calculés en fonction du nombre et de la longueur de leurs mots et la console affiche le numéro du gagnant, ou une égalité. Le programme se ferme ensuite

## Logs

Un ficher Historique.log est créé en début de partie. Celui-ci contient l'historique de toutes les actions et input des joueurs ainsi que les informations de début et fin de partie.