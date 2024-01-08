package main

import ( //"encoding/base64"
	//"strings"
	// Package image/jpeg is not used explicitly in the code below,
	// but is imported for its initialization side-effect, which allows
	// image.Decode to understand JPEG formatted images. Uncomment these
	// two lines to also understand GIF and PNG images:
	// _ "image/gif"
	// _ "image/png"
	"fmt"
	"image"
	_ "image/jpeg"
	"log"
	"os"
)

type Pixel struct {
	Red      int
	Green    int
	Blue     int
	Alpha    int
	Coord    [2]int // {x,y}
	Adjacent [][]Pixel
}

type Image struct {
	Width  int
	Height int
	Radius int
	Matrix [][]Pixel
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
			p := Pixel{int(r), int(g), int(b), int(a), [2]int{x, y}, [][]Pixel{}}
			tmp = append(tmp, p)
		}
		retour.Matrix = append(retour.Matrix, tmp)
	}
	return retour
}

func main() {

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
	p1 = Pixel{120, 120, 120, 120, [2]int{2, 1}, [][]Pixel{}}
	im.Matrix[0] = append(im.Matrix[0], p1)
	fmt.Println(im.Matrix[0][0].Coord)

	// Decode the JPEG data. If reading from file, create a reader with
	//
	reader, err := os.Open("CGR.jpg")
	if err != nil {
		log.Fatal(err)
	}
	defer reader.Close()
	//reader = base64.NewDecoder(base64.StdEncoding, strings.NewReader(data))
	m, _, err := image.Decode(reader)
	if err != nil {
		log.Fatal(err)
	}
	bounds := m.Bounds()

	// Calculate a 16-bin histogram for m's red, green, blue and alpha components.
	//
	// An image's bounds do not necessarily start at (0, 0), so the two loops start
	// at bounds.Min.Y and bounds.Min.X. Looping over Y first and X second is more
	// likely to result in better memory access patterns than X first and Y second.
	var histogram [16][4]int
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, a := m.At(x, y).RGBA()
			// A color's RGBA method returns values in the range [0, 65535].
			// Shifting by 12 reduces this to the range [0, 15].
			histogram[r>>12][0]++
			histogram[g>>12][1]++
			histogram[b>>12][2]++
			histogram[a>>12][3]++
		}
	}

	// Print the results.
	fmt.Printf("%-14s %6s %6s %6s %6s\n", "bin", "red", "green", "blue", "alpha")
	for i, x := range histogram {
		fmt.Printf("0x%04x-0x%04x: %6d %6d %6d %6d\n", i<<12, (i+1)<<12-1, x[0], x[1], x[2], x[3])
	} */

}
