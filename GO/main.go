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

func floutage(im_in Image) *image.RGBA {
	r := im_in.Radius
	im_out := image.NewRGBA(image.Rect(0, 0, im_in.Width, im_in.Height))
	for y_im := 0; y_im < im_in.Height; y_im++ {
		for x_im := 0; x_im < im_in.Width; x_im++ {
			var red_avg, green_avg, blue_avg, alpha_avg, comp uint32 = 0, 0, 0, 0, 0
			for y_pix := 0; y_pix < 2*r+1; y_pix++ {
				for x_pix := 0; x_pix < 2*r+1; x_pix++ {
					if y_im+y_pix-r >= 0 && y_im+y_pix-r < im_in.Height && x_im+x_pix-r >= 0 && x_im+x_pix-r < im_in.Width {
						red_avg += (im_in.Matrix[y_im+y_pix-r][x_im+x_pix-r]).Red
						green_avg += (im_in.Matrix[y_im+y_pix-r][x_im+x_pix-r]).Green
						blue_avg += (im_in.Matrix[y_im+y_pix-r][x_im+x_pix-r]).Blue
						alpha_avg += (im_in.Matrix[y_im+y_pix-r][x_im+x_pix-r]).Alpha
						comp++
					}
				}
			}
			im_out.Set(x_im, y_im, color.RGBA{uint32ToUint8(red_avg / comp), uint32ToUint8(green_avg / comp), uint32ToUint8(blue_avg / comp), uint32ToUint8(alpha_avg / comp)})
		}
	}
	return im_out
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

func main() {

	// RECONSTRUCTION IMAGE

	test := initImage("CGR.jpg")
	//fmt.Println(test.Matrix)
	res := floutage(test)

	file, err := os.Create("FLOU.png")

	if err != nil {
		panic(err)
	}
	defer file.Close()

	err = png.Encode(file, res)
	if err != nil {
		panic(err)

	}
}

/* test de la classe Pixel
p1 := Pixel{2, 3, 4, 78, [2]int{1, 1}, [][]Pixel{}}
fmt.Println(p1)

// test de la classe Image
im := Image{1080, 1920, 1, [][]Pixel{}}
fmt.Println(im)

// test de fonctionnement de append avec les matrices
im.Matrix = append(im.Matrix, []Pixel{})
im.Matrix[0] = append(im.Matrix[0], p1)
fmt.Println(im)
p1 = Pixel{120, 120, 120, 120, [2]int{2, 1}, [][]*Pixel{}}
im.Matrix[0] = append(im.Matrix[0], p1)

fmt.Println(im.Matrix[0][0].Coord) */
