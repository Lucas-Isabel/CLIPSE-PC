package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/lucasbyte/go-clipse/models"
)

// Estrutura de dados para o produto
type Produto struct {
	Plu       int    `json:"Plu"`
	Descricao string `json:"Descricao"`
	Peso      int    `json:"Peso"`
	Margem    int    `json:"Margem"`
}

// Estrutura para mensagem de erro
type ErrorResponse struct {
	Message string `json:"message"`
}

// Função para lidar com requisições POST no endpoint /seu-endpoint
func HandlePost(w http.ResponseWriter, r *http.Request) {
	var produto Produto
	err := json.NewDecoder(r.Body).Decode(&produto)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: err.Error()})
		return
	}

	// Processar o produto conforme necessário
	fmt.Printf("Recebido: %+v\n", produto)

	models.EditProduct(produto.Descricao, produto.Peso, produto.Plu, produto.Margem, "user")
	// Tempo de espera para garantir que a resposta seja enviada antes do redirecionamento
	time.Sleep(time.Millisecond * 300)

	// Configurar o cabeçalho da resposta como JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Dados recebidos com sucesso!"})

}

func HandleDelete(w http.ResponseWriter, r *http.Request) {
	var produto Produto
	err := json.NewDecoder(r.Body).Decode(&produto)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: err.Error()})
		return
	}

	models.DeletProduct(produto.Plu)

	// Configurar o cabeçalho da resposta como JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Produto excluído com sucesso!"})
}

func HandleInsert(w http.ResponseWriter, r *http.Request) {
	var produto Produto
	err := json.NewDecoder(r.Body).Decode(&produto)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: err.Error()})
		return
	}

	// Processar o produto conforme necessário
	fmt.Printf("Recebido: %+v\n", produto)

	models.CriaNovoProduto(produto.Descricao, produto.Peso, produto.Plu, produto.Margem, "user")
	// Tempo de espera para garantir que a resposta seja enviada antes do redirecionamento
	time.Sleep(time.Millisecond * 300)

	// Configurar o cabeçalho da resposta como JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Dados recebidos com sucesso!"})

}
