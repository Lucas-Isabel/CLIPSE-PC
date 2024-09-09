package routes

import (
	"embed"
	"fmt"
	"html/template"
	"net/http"

	"github.com/lucasbyte/go-clipse/controllers"
)

func CarregaRotas(fs embed.FS) {
	// Carregar e compilar templates embutidos
	tmpl, err := template.ParseFS(fs, "templates/*.html")
	if err != nil {
		fmt.Printf("failed to parse templates: %v\n", err)
		return
	}

	// Passar os templates compilados para os controladores
	controllers.SetTemplates(tmpl)

	http.HandleFunc("/", controllers.Index)
	http.HandleFunc("/plus", controllers.Plus)
	http.HandleFunc("/new", controllers.New)
	http.HandleFunc("/insert", controllers.Insert)
	http.HandleFunc("/edit", controllers.Edit)
	http.HandleFunc("/update", controllers.Update)
	http.HandleFunc("/delete", controllers.Delete)
	http.HandleFunc("/drop", controllers.Drop)
	http.HandleFunc("/file", controllers.File)
	http.HandleFunc("/push", controllers.Push)
	http.HandleFunc("/import", controllers.Import)
	// http.HandleFunc("/importarteste", controllers.Importeste)
	http.HandleFunc("/send", controllers.Send)
	http.HandleFunc("/loading", controllers.Load)
	http.HandleFunc("/editar", controllers.HandlePost)
	http.HandleFunc("/excluir", controllers.HandleDelete)
	http.HandleFunc("/novo", controllers.HandleInsert)
	http.HandleFunc("/pesoupdate", controllers.PesoUpdateHandler)

	content := http.FileServer(http.FS(fs))
	http.HandleFunc("/static/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("Serving static file: %s\n", r.URL.Path)
		http.StripPrefix("/static", content).ServeHTTP(w, r)
	})
}
