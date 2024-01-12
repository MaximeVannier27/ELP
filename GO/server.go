package main

import (
	"fmt"
	"net"
)

func handleConnection(conn net.Conn) {
	// Traitement de la connexion ici
	fmt.Println("Nouvelle connexion établie!")

	// Fermer la connexion quand c'est terminé
	defer conn.Close()

	// Buffer pour stocker les données reçues
	buffer := make([]byte, 1024)

	for {
		// Lire les données depuis la connexion
		n, err := conn.Read(buffer)
		if err != nil {
			fmt.Println("Erreur lors de la lecture des données:", err)
			return
		}

		// Afficher les données reçues
		fmt.Printf("Message du client: %s\n", buffer[:n])

		// Répondre au client
		message := []byte("Message du serveur: Bonjour, client!")
		_, err = conn.Write(message)
		if err != nil {
			fmt.Println("Erreur lors de l'envoi de la réponse:", err)
			return
		}
	}
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
