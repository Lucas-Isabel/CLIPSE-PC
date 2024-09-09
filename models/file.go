package models

import (
	"fmt"
	"strings"

	"github.com/lucasbyte/go-clipse/file"
)

type File struct {
	Tipo    string
	Caminho string
}

func (f File) MudaTipo(tipo string) {
	f.Tipo = tipo
}

func NewFile() File {
	caminho := file.FinderFile()
	file := File{Caminho: caminho}
	return file
}

var funcMap = map[string]func(string){
	"CSV": Csv,
}

func (f File) LerArquivoDados() {
	caminho := strings.Replace(f.Caminho, "\\", "/", -1)
	if fn, exists := funcMap[f.Tipo]; exists {
		fn(caminho)
	} else {
		fmt.Println("Tipo desconhecido:", f.Tipo)
	}
}
