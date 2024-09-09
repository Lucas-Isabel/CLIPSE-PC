package global

import (
	"sync"
)

// Definindo uma variável global para o status da aplicação
var (
	importStatus bool
	mutex        sync.Mutex
)

// Função para definir o status da aplicação
func SetStatus(status bool) {
	mutex.Lock()
	defer mutex.Unlock()
	importStatus = status
}

// Função para obter o status da aplicação
func GetStatus() bool {
	mutex.Lock()
	defer mutex.Unlock()
	return importStatus
}
