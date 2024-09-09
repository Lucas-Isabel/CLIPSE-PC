package models

import (
	"encoding/csv"
	"fmt"
	"os"
	"strconv"
)

func Csv(caminho string) {
	//arquivo, err := os.Open("C:/Users/MAXWELL/Documents/DEV/Clipse/itensCSV.csv")
	arquivo, err := os.Open(caminho)

	if err != nil {
		fmt.Println("Erro ao abrir o arquivo:", err)
		return
	}
	defer arquivo.Close()

	reader := csv.NewReader(arquivo)
	reader.Comma = ';'

	linhas, err := reader.ReadAll()
	if err != nil {
		fmt.Println("Erro ao ler o arquivo CSV:", err)
		return
	}

	produtos := make([]Produto, 0)

	for _, linha := range linhas {
		if len(linha) != 5 {
			fmt.Println("Formato CSV inválido:", linha)
			continue
		}

		id, _ := strconv.Atoi(linha[0])
		plu, _ := strconv.Atoi(linha[0])
		peso, _ := strconv.Atoi(linha[2])
		//descricao := linha[1]
		margem, _ := strconv.Atoi(linha[3])

		produto := Produto{
			Id:        id,
			Plu:       plu,
			Descricao: linha[1],
			Margem:    margem,
			Peso:      peso,
		}

		produtos = append(produtos, produto)
	}

	for _, p := range produtos {
		//fmt.Printf("%+v\n", p)

		existe, err := ExisteProduto(p.Plu)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(existe)
		if existe {
			EditProduct(p.Descricao, p.Peso, p.Plu, p.Margem, "import")
		} else {
			fmt.Println("Teste")
			fmt.Println(p.Descricao, p.Peso, p.Plu, p.Margem)
			CriaNovoProduto(p.Descricao, p.Peso, p.Plu, p.Margem, "import")
		}
		existe, _ = ExisteProduto(p.Plu)
		fmt.Println(existe)
	}
}
