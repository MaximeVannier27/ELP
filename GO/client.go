// client.go

package main

import (
	"bytes"
	//"encoding/gob"
	"fmt"
	"image"
	"image/jpeg"
	_ "image/jpeg"
	"io"
	"log"
	"net"
	"os"
)

/*type ImageData struct {
	EncodedData *image.Image
}*/

func main() {
	// Se connecter au serveur sur le port 8080
	conn, err := net.Dial("tcp", "localhost:8080")
	if err != nil {
		fmt.Println("Erreur lors de la connexion au serveur:", err)
		return
	}
	defer conn.Close()

	fmt.Println("Connexion établie avec le serveur!")

	// Ouvrir le fichier de l'image à envoyer
	file, err := os.Open("CGR.jpg")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du fichier:", err)
		return
	}
	defer file.Close()

	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		fmt.Println("Erreur lors du déplacement du curseur du fichier source:", err)
		return
	}

	image, _, err := image.Decode(file)
	if err != nil {
		log.Fatal(err)
	}

	var buffer bytes.Buffer
	err = jpeg.Encode(&buffer, image, nil)
	if err != nil {
		log.Fatal((err))
	}
	// Créer un tampon de mémoire pour stocker les données sérialisées
	//var buffer bytes.Buffer

	// Créer un encodeur Gob qui écrira dans le tampon
	//encoder := gob.NewEncoder(&buffer)

	// Encoder la structure Os_file dans le tampon
	//err = encoder.Encode(imgdata)

	io.Copy(conn, &buffer)

}
