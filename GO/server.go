// server.go

package main

import (
	"bytes"
	"encoding/gob"
	"fmt"
	"image"
	_ "image/jpeg"
	"io"
	"net"
)

type ImageData struct {
	EncodedData image.Image
}

func handleConnection(conn net.Conn) {
	// Traitement de la connexion ici
	fmt.Println("Nouvelle connexion établie!")

	// Fermer la connexion quand c'est terminé
	defer conn.Close()

	var buffer bytes.Buffer

	io.Copy(&buffer, conn)

	// Créer un décodeur Gob pour lire à partir du tampon
	decoder := gob.NewDecoder(&buffer)

	// Décoder les données du tampon dans une nouvelle structure Person
	var decodedfile ImageData
	err := decoder.Decode(&decodedfile)
	if err != nil {
		fmt.Println("Erreur lors du décodage:", err)
		return
	}
	fmt.Println(decodedfile.EncodedData)

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
