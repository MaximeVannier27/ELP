package main

import (
	"fmt"
	"net"
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

	// Envoyer un message au serveur
	message := []byte("Bonjour, serveur!")
	_, err = conn.Write(message)
	if err != nil {
		fmt.Println("Erreur lors de l'envoi du message:", err)
		return
	}

	// Attendre une réponse du serveur
	buffer := make([]byte, 1024)
	n, err := conn.Read(buffer)
	if err != nil {
		fmt.Println("Erreur lors de la lecture de la réponse du serveur:", err)
		return
	}

	// Afficher la réponse du serveur
	fmt.Printf("Réponse du serveur: %s\n", buffer[:n])
}
