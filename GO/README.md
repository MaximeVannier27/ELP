# Projet GO : traitement d'images

On fait du flou gaussien, sur chaque pixel de l'image qu'on récupère, en moyennant la valeur RGBA du pixel avec celles de ses voisins. On pourra choisir le rayon du moyennage. Voici le premier résultat dont nous sommes fier :
<Image non disponible, supprimée par MaximeVannier>

Le serveur réceptionne un client et le redirige vers une go routine handler afin de recupérer les données de l'image du client. Ses données ainsi que le rayon de floutage souhaité par le client sont stockés en shared memory.
Ensuite une go routine FranceTravail atribué à ce client va envoyer les numéros de ligne de l'image à traiter aux intérimaires. La pool de go routine (interimaire), récupère ces numéros de ligne et applique ensuite le traitement de flou sur chaque pixel à partir des données en shared memory. Les résultats du floutage sont envoyé au handler et qui va reconstituer l'image flouté et la retransmettre au client.

## Utilisation

Lancer server.go dans une terminal, puis dans d'autres terminaux, lancer client.go et donner l'URL de l'image que vous souhaitez flouter et dans un second temps le rayon de floutage que vous souhaitez appliquer sur l'image