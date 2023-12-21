package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	//Ouvrir le fichier
	fichier, err := os.Open("aaaaahhhh.txt")
	//Tester s'il y a une erreur
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du fichier:", err)
		return
	}
	//Fermer le fichier une fois le programme fini
	defer fichier.Close()
	//Créer un scanner pour parcourir le fichier
	scanner := bufio.NewScanner(fichier)
	for scanner.Scan() {
		ligne := scanner.Text()
		début := 0
		fin := len(ligne)

		if fin != 0 {
			for string(ligne[fin-1]) == ":" || string(ligne[fin-1]) == "!" || string(ligne[fin-1]) == "?" {
				fin = fin - 2
			}
			for string(ligne[fin-1]) == "." {
				fin--
			}
			for i := 0; i < fin; i++ {
				if string(ligne[i]) == " " {
					début = i
				}

			}
			fmt.Println(ligne[début+1 : fin])
		} else {
			fmt.Println(ligne)
		}
	}
}
