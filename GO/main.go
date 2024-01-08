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
	_ "image/color"
	_ "image/jpeg"
	"image/png"
	"log"
	"os"
)

type Pixel struct {
	Red      uint8
	Green    uint8
	Blue     uint8
	Alpha    uint8
	Coord    [2]int // {x,y}
	Adjacent [][]Pixel
}

type Image struct {
	Width  int
	Height int
	Radius int
	Matrix [][]Pixel
}

func uint32ToUint8(value uint32) uint8 {
	scaledValue := float64(value) * (255.0 / 4294967295.0)
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

	fmt.Print("Rayon de flouttage: ")
	fmt.Scanln(&rayon)
	retour := Image{bordures.Max.X, bordures.Max.Y, rayon, [][]Pixel{}}
	for y := bordures.Min.Y; y < bordures.Max.Y; y++ {
		tmp = nil
		for x := bordures.Min.X; x < bordures.Max.X; x++ {

			r, g, b, a := image.At(x, y).RGBA()

			p := Pixel{uint32ToUint8(r), uint32ToUint8(g), uint32ToUint8(b), uint32ToUint8(a), [2]int{x, y}, [][]Pixel{}}
			tmp = append(tmp, p)
		}
		retour.Matrix = append(retour.Matrix, tmp)
	}
	return retour
}

func main() {

	// RECONSTRUCTION IMAGE

	file, err := os.Create("FLOU.png")

	if err != nil {
		panic(err)
	}
	defer file.Close()

	err = png.Encode(file /*IMAGE*/)
	if err != nil {
		panic(err)
	}
}
