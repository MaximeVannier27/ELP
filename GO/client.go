// client.go

package main

import (
	//"bytes"
	"fmt"
	"image"
	"image/jpeg"
	_ "image/jpeg"

	//"io"
	"bufio"
	"log"
	"net"
	"os"
	"strconv"
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

	message, err := bufio.NewReader(conn).ReadString('\n')
	if err != nil {
		fmt.Println("Erreur lors de la lecture de la demande du serveur :", err)
		return
	}
	fmt.Print(message)

	// Lire le rayon de floutage du client
	var rayonFloutage int
	fmt.Scanln(&rayonFloutage)

	// Convertir le rayon de floutage en chaîne pour l'envoi
	rayonFloutageStr := strconv.Itoa(rayonFloutage)

	// Envoyer le rayon de floutage au serveur
	fmt.Fprintf(conn, rayonFloutageStr+"\n")

	fmt.Println("Rayon de floutage envoyé au serveur.")

	// Ouvrir le fichier de l'image à envoyer
	file, err := os.Open("CGR.jpg")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du fichier:", err)
		return
	}
	defer file.Close()

	image, _, err := image.Decode(file)
	if err != nil {
		log.Fatal(err)
	}

	//var buffer bytes.Buffer
	err = jpeg.Encode(conn, image, nil)
	if err != nil {
		log.Fatal((err))
	}

	// RECEPTION DU RESULTAT ET RESTRUCTURATION EN JPEG

	image_finale, err := jpeg.Decode(conn)
	if err != nil {
		log.Fatal(err)
	}

	fichier, err := os.Create("FLOU_client.jpeg")
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
