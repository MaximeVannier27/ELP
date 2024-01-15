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

type Pixel struct {
	Red   uint32
	Green uint32
	Blue  uint32
	Alpha uint32
	Coord [2]int // {x,y}
}

type Image struct {
	Width  int
	Height int
	Radius int
	Matrix [][]Pixel
}

func initImage(image image.Image) Image {

	bordures := image.Bounds()

	var rayon int
	var tmp []Pixel

	fmt.Print("Rayon de floutage: ")
	fmt.Scanln(&rayon)
	retour := Image{bordures.Max.X, bordures.Max.Y, rayon, [][]Pixel{}}
	for y := bordures.Min.Y; y < bordures.Max.Y; y++ {
		tmp = nil
		for x := bordures.Min.X; x < bordures.Max.X; x++ {

			r, g, b, a := image.At(x, y).RGBA()
			p := Pixel{r, g, b, a, [2]int{x, y}}
			tmp = append(tmp, p)
		}
		retour.Matrix = append(retour.Matrix, tmp)
	}
	return retour
}

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
	im := initImage(image)
	fmt.Println(im)
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
