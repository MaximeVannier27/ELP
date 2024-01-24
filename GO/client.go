// client.go

package main

import (
	"fmt"
	"image"
	"image/jpeg"
	_ "image/jpeg"
	"strings"

	"io"

	"log"
	"net"
	"os"
)

func main() {
	// Se connecter au serveur sur le port 8080
	conn, err := net.Dial("tcp", "localhost:8080")
	if err != nil {
		fmt.Println("Erreur lors de la connexion au serveur:", err)
		return
	}
	defer conn.Close()

	fmt.Println("Connexion établie avec le serveur!")

	// Entrer le rayon de floutage et l'envoyer au serveur
	var rayonFloutage int
	fmt.Print("Veuillez entrer le rayon de floutage : ")
	fmt.Scanln(&rayonFloutage)
	io.WriteString(conn, fmt.Sprintf("%d\n", rayonFloutage))

	// Ouvrir le fichier de l'image à envoyer
	var chemin_fichier string
	fmt.Print("Chemin de l'image à traiter (par rapport au repertoire d'exécution) : ")
	fmt.Scanln(&chemin_fichier)

	file, err := os.Open(chemin_fichier)
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du fichier:", err)
		return
	}
	defer file.Close()

	image, _, err := image.Decode(file)
	if err != nil {
		log.Fatal(err)
	}

	err = jpeg.Encode(conn, image, nil)
	if err != nil {
		log.Fatal((err))
	}

	// RECEPTION DU RESULTAT ET RESTRUCTURATION EN JPEG

	image_finale, err := jpeg.Decode(conn)
	if err != nil {
		log.Fatal(err)
	}

	title := fmt.Sprintf("%s_floutée.jpeg ", strings.Split(chemin_fichier, ".")[0])
	fichier, err := os.Create(title)
	if err != nil {
		panic(err)
	}
	defer fichier.Close()

	err = jpeg.Encode(fichier, image_finale, nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("Image traitée sauvegardée avec succès.")
}
