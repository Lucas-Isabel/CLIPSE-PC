package controllers

import (
	"fmt"
	"net/http"

	"github.com/lucasbyte/go-clipse/models"
)

func File(w http.ResponseWriter, r *http.Request) {
	file := models.NewFile()
	temp.ExecuteTemplate(w, "File", file)
}

func Push(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		filePath := r.FormValue("arquivo")
		tipo := r.FormValue("tipo")
		file := models.File{
			Caminho: filePath,
			Tipo:    tipo,
		}
		fmt.Println(file)
		file.LerArquivoDados()
		fmt.Println("Post file page: ")
	}
	http.Redirect(w, r, "/", http.StatusMovedPermanently)
}
