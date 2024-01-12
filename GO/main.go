package main

import ( //"encoding/base64"
	//"strings"
	// Package image/jpeg is not used explicitly in the code below,
	// but is imported for its initialization side-effect, which allows
	// image.Decode to understand JPEG formatted images. Uncomment these
	// two lines to also understand GIF and PNG images:
	// _ "image/gif"
	"fmt"
	"image"
	"image/color"
	_ "image/jpeg"
	"image/png"
	"log"
	"os"
	"time"
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

func uint32ToUint8(value uint32) uint8 {
	scaledValue := float64(value) * (255.0 / 0xffff)
	return uint8(scaledValue)
}

func initImage(addresse_image string) Image {

	reader, err := os.Open(addresse_image)

	if err != nil {
		log.Fatal(err)
	}
	defer reader.Close()

	image, _, err := image.Decode(reader)

	if err != nil {
		log.Fatal(err)
	}
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

func interimaire(im_in Image, jobs <-chan int, res chan<- [6]uint32) {
	r := im_in.Radius
	var y_im int
	var red_avg, green_avg, blue_avg, alpha_avg, comp uint32
	var envoi [6]uint32
	for y_im = range jobs {
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
	return
}

func franceTravail(jobs chan<- int, height int) {
	for i := 0; i < height; i++ {
		jobs <- i
	}
	return
}

func main() {

	// RECONSTRUCTION IMAGE

	image_source := initImage("golden-retriever.jpg")

	// INITIALISATION VARIABLES//

	var pixel [6]uint32
	im_out := image.NewRGBA(image.Rect(0, 0, image_source.Width, image_source.Height))
	c := 0
	var numGoroutines int
	fmt.Print("Nombre de Go routines en simultanée: ")
	fmt.Scanln(&numGoroutines)

	//MESURE TEMPS//
	startTime := time.Now()

	// PARALLELISME//
	ch_travail := make(chan int)
	ch_res := make(chan [6]uint32)

	go franceTravail(ch_travail, image_source.Height)
	for i := 0; i < numGoroutines; i++ {
		go interimaire(image_source, ch_travail, ch_res)
	}

	for c < image_source.Height*image_source.Width {
		pixel = <-ch_res
		im_out.Set(int(pixel[0]), int(pixel[1]), color.RGBA{uint32ToUint8(pixel[2]), uint32ToUint8(pixel[3]), uint32ToUint8(pixel[4]), uint32ToUint8(pixel[5])})
		c++
	}

	file, err := os.Create("golden-retriever_FLOU.png")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	err = png.Encode(file, im_out)
	if err != nil {
		panic(err)
	}

	close(ch_travail)
	close(ch_res)
	endTime := time.Now()
	fmt.Printf("Durée pour %d Go routines: %s", numGoroutines, endTime.Sub(startTime))
}
