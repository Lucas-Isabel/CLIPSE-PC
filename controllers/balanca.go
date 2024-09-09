package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	global "github.com/lucasbyte/go-clipse/Global"
	"github.com/lucasbyte/go-clipse/models"
)

func Import(w http.ResponseWriter, r *http.Request) {
	global.SetStatus(false)
	importData := models.BuscaEventoImport()
	temp.ExecuteTemplate(w, "Import", importData)
}

func Load(w http.ResponseWriter, r *http.Request) {
	temp.ExecuteTemplate(w, "Load", nil)
}

func Send(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		portaStr := r.FormValue("porta")
		porta, _ := strconv.Atoi(portaStr)
		// 		tipo := r.FormValue("tipo")
		velocidadeStr := r.FormValue("velocidade-select")
		velocidade, _ := strconv.Atoi(velocidadeStr)
		if velocidade != 115200 {
			velocidade = 9600
		}
		portaCOM := fmt.Sprintf("COM%d", porta)
		WriteJson(portaCOM, velocidade)
	}
	importData := models.BuscaEventoImport()
	temp.ExecuteTemplate(w, "Import", importData)
}

func WriteJson(porta string, velocidade int) {
	// Cria a configuração que você deseja gravar
	config := Config{
		Port:     porta,
		BaudRate: velocidade,
	}

	// Abre ou cria o arquivo config.json
	file, err := os.Create("config.json")
	if err != nil {
		fmt.Println("Erro ao criar o arquivo:", err)
		return
	}
	defer file.Close()

	// Cria um encoder JSON e grava a configuração no arquivo
	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ") // Opcional: para uma formatação bonita
	err = encoder.Encode(config)
	if err != nil {
		fmt.Println("Erro ao gravar o arquivo JSON:", err)
		return
	}

	fmt.Println("Arquivo config.json foi gravado com sucesso!")
}

// 		temp.ExecuteTemplate(w, "Load", nil)
// 		plus, err := models.ObterDadosProdutos()
// 		if tipo == "1" {
// 			plus, err := models.ObterCodigosFaltantes()
// 			serial.Delete(porta, velocidade, plus)
// 			if err != nil {
// 				http.Redirect(w, r, "/", http.StatusMovedPermanently)
// 			}
// 		}
// 		progress := 100 / (len(plus))
// 		portaCOM, _ := serial.Porta(porta, velocidade)
// 		defer portaCOM.Close()
// 		for _, plu := range plus {
// 			progress += serial.EnviarDado(portaCOM, plu)
// 			if err != nil {
// 				http.Redirect(w, r, "/", http.StatusMovedPermanently)
// 			}
// 		}
// 	}
// 	http.Redirect(w, r, "/", http.StatusMovedPermanently)
// }
