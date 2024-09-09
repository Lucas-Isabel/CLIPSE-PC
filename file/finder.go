package file

import (
	"fmt"
	"sync"

	"github.com/sqweek/dialog"
)

var (
	dialogOpen bool
	mutex      sync.Mutex
)

func FinderFile() string {
	// mutex.Lock()
	// defer mutex.Unlock()

	// // Verifica se já existe uma janela de diálogo aberta
	// if dialogOpen {
	// 	fmt.Println("Janela de diálogo já está aberta.")
	// 	return ""
	// }

	// Marca que a janela de diálogo está aberta
	dialogOpen = true

	filePath := ""
	// Exibe a janela de diálogo para selecionar um arquivo
	filePath, err := dialog.File().Title("Selecione um arquivo").Load()
	if err != nil {
		fmt.Println("erro: ", err)
		// mutex.Lock()
		dialogOpen = false
		// mutex.Unlock()
		return ""
	}

	// Verifica se o usuário cancelou a seleção
	// if filePath == "" {
	// 	fmt.Println("Seleção de arquivo cancelada pelo usuário.")
	// 	mutex.Lock()
	// 	dialogOpen = false
	// 	mutex.Unlock()
	// 	return ""
	// }

	// Imprime o caminho do arquivo selecionado
	fmt.Printf("Caminho do arquivo selecionado: %s\n", filePath)

	// Marca que a janela de diálogo foi fechada
	// mutex.Lock()
	// dialogOpen = false
	// mutex.Unlock()

	return filePath
}
