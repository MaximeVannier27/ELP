// server.go

package main

import (
	"bufio"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"log"
	"net"
	"strconv"
	"strings"
	"sync"
)

type Pixel struct {
	Red   uint32
	Green uint32
	Blue  uint32
	Alpha uint32
	Coord [2]int // {x,y}
}

type Image struct {
	Width   int
	Height  int
	Radius  int
	Matrix  [][]Pixel
	Channel chan [6]uint32
}

type Safemap struct {
	dict  map[int]Image
	mutex sync.Mutex
}

func uint32ToUint8(value uint32) uint8 {
	scaledValue := float64(value) * (255.0 / 0xffff)
	return uint8(scaledValue)
}

func initImage(image image.Image, r_floutage int, ch_res chan [6]uint32) Image {

	bordures := image.Bounds()

	var rayon int
	var tmp []Pixel
	var channel chan [6]uint32
	rayon = r_floutage
	channel = ch_res

	retour := Image{bordures.Max.X, bordures.Max.Y, rayon, [][]Pixel{}, channel}
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

func franceTravail(jobs chan<- [2]int, height int, num_image int) {
	for i := 0; i < height; i++ {
		jobs <- [2]int{i, num_image}
	}
	return
}

func interimaire(jobs <-chan [2]int, dict_images *Safemap) {
	var im_in Image
	var r int
	var red_avg, green_avg, blue_avg, alpha_avg, comp uint32
	var envoi [6]uint32
	for {
		for contenu := range jobs {
			y_im := contenu[0]
			num_im := contenu[1]
			im_in = dict_images.dict[num_im]
			res := im_in.Channel
			r = im_in.Radius
			for x_im := 0; x_im < im_in.Width; x_im++ {
				red_avg, green_avg, blue_avg, alpha_avg, comp = 0, 0, 0, 0, 0
				for y_pix := 0; y_pix < 2*r+1; y_pix++ {
					for x_pix := 0; x_pix < 2*r+1; x_pix++ {
						if y_im+y_pix-r >= 0 && y_im+y_pix-r < im_in.Height && x_im+x_pix-r >= 0 && x_im+x_pix-r < im_in.Width {
							red_avg += (im_in.Matrix[y_pix+y_im-r][x_im+x_pix-r]).Red
							green_avg += (im_in.Matrix[y_pix+y_im-r][x_im+x_pix-r]).Green
							blue_avg += (im_in.Matrix[y_pix+y_im-r][x_im+x_pix-r]).Blue
							alpha_avg += (im_in.Matrix[y_pix+y_im-r][x_im+x_pix-r]).Alpha
							comp++
						}
					}
				}
				envoi[0] = uint32(x_im)
				envoi[1] = uint32(y_im)
				envoi[2] = red_avg / comp
				envoi[3] = green_avg / comp
				envoi[4] = blue_avg / comp
				envoi[5] = alpha_avg / comp
				res <- envoi
			}
		}
	}
}

func handleConnection(conn net.Conn, dict_images *Safemap, ch_travail chan [2]int) {
	// Traitement de la connexion ici
	fmt.Println("Nouvelle connexion établie!")

	// Demander au client le rayon de floutage souhaité, recevoir la réponse dans un buffer
	reader := bufio.NewReader(conn)
	str_rayonFloutage, err := reader.ReadString('\n')
	if err != nil {
		fmt.Println("Error reading rayon floutage:", err)
		return
	}
	str_rayonFloutage = strings.TrimSuffix(str_rayonFloutage, "\n")
	rayonFloutage, err := strconv.Atoi(str_rayonFloutage)

	fmt.Println("Rayon floutage reçu :", rayonFloutage)

	// Fermer la connexion quand c'est terminé
	defer conn.Close()

	im_source, _, err := image.Decode(conn)
	if err != nil {
		log.Fatal(err)
	}
	if err != nil {
		log.Fatal(err)
	}

	// Creation de l'objet image

	ch_res := make(chan [6]uint32)
	im := initImage(im_source, rayonFloutage, ch_res)
	c := 0
	var pixel [6]uint32
	im_out := image.NewRGBA(image.Rect(0, 0, im.Width, im.Height))
	i := 0
	dict_images.mutex.Lock()
	for {
		if _, exists := dict_images.dict[i]; exists {
			i++
		} else {
			break
		}
	}
	dict_images.dict[i] = im
	dict_images.mutex.Unlock()

	go franceTravail(ch_travail, im.Height, i)

	for c < im.Height*im.Width {
		pixel = <-ch_res
		im_out.Set(int(pixel[0]), int(pixel[1]), color.RGBA{uint32ToUint8(pixel[2]), uint32ToUint8(pixel[3]), uint32ToUint8(pixel[4]), uint32ToUint8(pixel[5])})
		c++
	}

	image_retour := image.Image(im_out)

	err = jpeg.Encode(conn, image_retour, nil)
	if err != nil {
		panic(err)
	}

	delete(dict_images.dict, i)
	close(ch_res)

}

func main() {

	dict_images := Safemap{make(map[int]Image), sync.Mutex{}}
	ch_travail := make(chan [2]int)

	var nbre_GoRoutines int
	fmt.Print("Nombre de Go routines à lancer par le serveur : ")
	fmt.Scanln(&nbre_GoRoutines)

	for i := 0; i < nbre_GoRoutines; i++ {
		go interimaire(ch_travail, &dict_images)
	}

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
		go handleConnection(conn, &dict_images, ch_travail)
	}
}
