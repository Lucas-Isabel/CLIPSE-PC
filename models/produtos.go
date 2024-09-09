package models

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/lucasbyte/go-clipse/db"
)

type Produto struct {
	Id        int
	Plu       int
	Descricao string
	Margem    int
	Peso      int
	CreatedAt time.Time
	UpdatedAt time.Time
	UpdatedBy string
}

func ExisteProduto(plu int) (bool, error) {
	db := db.ConectDb()
	defer db.Close()

	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM produtos WHERE plu = ?", plu).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

// retorna verdadeiro quando o produto está igual ao banco
func ComparaDB(plu int, desc string, margem, peso int) (bool, error) {
	db := db.ConectDb()
	defer db.Close()

	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM produtos WHERE plu = ? AND descricao = ? AND margem = ? AND peso = ?", plu, desc, margem, peso).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func BuscaTodosOsProdutos() []Produto {
	db := db.ConectDb()

	selectDeTodosOsProdutos, err := db.Query("select * from produtos ORDER BY plu")
	if err != nil {
		fmt.Println(err.Error())
	}

	p := Produto{}
	produtos := []Produto{}

	for selectDeTodosOsProdutos.Next() {
		var id, plu, margem, peso int
		var descricao string

		var user string

		var updatedAt time.Time
		var createdAt time.Time

		err = selectDeTodosOsProdutos.Scan(&id, &plu, &descricao, &margem, &peso, &createdAt, &updatedAt, &user)
		if err != nil {
			fmt.Println(err.Error())
		}

		p.Plu = plu
		p.Descricao = descricao
		p.Peso = peso
		p.Margem = margem
		p.CreatedAt = createdAt
		p.UpdatedAt = updatedAt
		p.UpdatedBy = user

		produtos = append(produtos, p)
	}
	defer db.Close()
	return produtos
}

func CriaNovoProduto(descricao string, peso, plu, margem int, user string) {
	db := db.ConectDb()

	if plu < 0 {
		plu = plu * -1
	}

	descricao = strings.ToUpper(descricao)
	descricao = descricaoValida(descricao)

	user = "import"

	insereDadosNoBanco, err := db.Prepare("insert into produtos(plu, descricao, margem, peso, createdAt, updatedAt, updateBy) values($1, $2, $3, $4, $5, $6, $7)")
	if err != nil {
		fmt.Println(err.Error())
	}

	result, err := insereDadosNoBanco.Exec(plu, descricao, margem, peso, time.Now(), time.Now(), user)
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println(result)
	}
	defer db.Close()

}

func EditProduct(descricao string, peso, plu, margem int, user string) {
	db := db.ConectDb()
	query := "UPDATE produtos SET descricao = ?, peso = ?, margem = ?, updatedAt = ?, updateBy = ? WHERE plu = ?"
	descricao = strings.ToUpper(descricao)
	descricao = descricaoValida(descricao)
	insereDadosNoBanco, err := db.Prepare(query)
	if err != nil {
		fmt.Println(err.Error())
	}

	inalterado, _ := ComparaDB(plu, descricao, margem, peso)
	if inalterado {
		return
	}

	insereDadosNoBanco.Exec(descricao, peso, margem, time.Now(), user, plu)
	defer db.Close()
}

func DeletProduct(plu int) {
	db := db.ConectDb()
	query := "DELETE FROM produtos WHERE plu = ?"

	insereDadosNoBanco, err := db.Prepare(query)
	if err != nil {
		fmt.Println(err.Error())
	}

	insereDadosNoBanco.Exec(plu)
	defer db.Close()
}

func ObterCodigosFaltantes() ([]string, error) {
	// Consulta os valores da coluna "plu"
	db := db.ConectDb()

	rows, err := db.Query("SELECT plu FROM produtos")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Cria um mapa para armazenar os códigos presentes na tabela
	codigos := make(map[int]bool)
	for rows.Next() {
		var codigo int
		if err := rows.Scan(&codigo); err != nil {
			return nil, err
		}
		codigos[codigo] = true
	}

	// Cria uma slice para armazenar os códigos faltantes
	var codigosFaltantes []string
	for i := 1; i <= 200; i++ {
		if !codigos[i] {
			codigo := fmt.Sprintf("%03d", i)
			codigosFaltantes = append(codigosFaltantes, codigo)
		}
	}
	return codigosFaltantes, nil
}

func ObterProduto(id int) (*Produto, error) {
	db := db.ConectDb()
	// Consulta os dados das colunas "plu", "descricao", "preco", "venda" e "validade" para um único produto com base no ID
	query := "SELECT * FROM produtos WHERE plu = ? LIMIT 1"
	row := db.QueryRow(query, id)

	var produto Produto
	// err = selectDeTodosOsProdutos.Scan(&id, &plu, &descricao, &venda, &validade, &preco, &createdAt, &updatedAt, &user)

	err := row.Scan(&produto.Id, &produto.Plu, &produto.Descricao, &produto.Margem, &produto.Peso, &produto.CreatedAt, &produto.UpdatedAt, &produto.UpdatedBy)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("produto não encontrado")
		}
		return nil, err
	}

	return &produto, nil
}

func preencherDescricao(descricao string, tamanho int) string {
	descricaoPreenchida := descricao
	if len(descricaoPreenchida) < tamanho {
		descricaoPreenchida += strings.Repeat(" ", tamanho-len(descricaoPreenchida))
	}
	return strings.ToUpper(descricaoPreenchida)
}

func descricaoValida(desc string) string {
	caracteresInvalidos := []string{"Á", "�", "Ç", "Ã", "Õ", "Ó", "Ô", "Ò", "É", "Ê", "À", "&"}
	caracteresValidos := []string{"A", "C", "C", "A", "O", "O", "O", "O", "E", "E", "A", "E"}

	for i, char := range caracteresInvalidos {
		desc = strings.ReplaceAll(desc, char, caracteresValidos[i])
	}
	return desc
}
