# ELM

## Préliminaire

Vous devez avoir elm d'installer sur votre ordinateur, puis dans un terminal écrivez les commande suivante :

```bash
login@hostname:~$ elm init
login@hostname:~$ elm install elm/http
login@hostname:~$ elm install elm/random
login@hostname:~$ elm install elm/json
```

## Initialisation

Une fois toutes les librairies téléchargées, vous pouvez compiler le fichier main.elm en faisant :

```bash
login@hostname:~$ elm make ./src/Main.elm
```

Celà va générer un fichier index.html que vous pourrez lancer sur votre navigateur.
