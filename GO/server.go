// server.go

package main

import (
	//"bytes"
	"fmt"
	"image"
	_ "image/jpeg"

	//"io"
	"log"
	"net"
)

func handleConnection(conn net.Conn) {
	// Traitement de la connexion ici
	fmt.Println("Nouvelle connexion établie!")

	// Fermer la connexion quand c'est terminé
	defer conn.Close()

	// Créer un buffer pour recevoir l'image en bytes
	//var buffer bytes.Buffer
	//io.Copy(&buffer, conn)

	// Retransformer l'image depuis le buffer
	image, _, err := image.Decode(conn)
	if err != nil {
		log.Fatal(err)
	}
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(image)
}

func main() {
	// Écoute sur le port 8080
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		fmt.Println("Erreur lors de l'écoute:", err)
		return
	}
	defer listener.Close()

	fmt.Println("Serveur en attente de connexions sur le port 8080...")

	for {
		// Attendre une nouvelle connexion
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Erreur lors de l'acceptation de la connexion:", err)
			return
		}

		// Gérer la connexion dans une goroutine pour permettre la gestion de plusieurs connexions simultanées
		go handleConnection(conn)
	}
}
