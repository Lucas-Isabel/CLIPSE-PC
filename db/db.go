package db

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

func createDatabaseIfNotExists(db *sql.DB) error {
	// Verifica se o arquivo do banco de dados já existe
	_, err := os.Stat(".db")
	if os.IsNotExist(err) {
		// Se o arquivo não existir, cria o banco de dados e a tabela
		_, err := db.Exec(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
				plu INTEGER UNIQUE CHECK(plu >= 0),
            	descricao TEXT CHECK(length(descricao) <= 40),
                margem INTEGER CHECK(margem >= 0 AND margem <= 200),
				peso DOUBLE CHECK(peso >= 0 AND peso < 1000),
				createdAt DATE,
				updatedAt DATE,
				updateBy TEXT CHECK(length(descricao) <= 30)
            );
        `)
		if err != nil {
			return err
		}
	} else if err != nil {
		// Em caso de erro ao verificar a existência do arquivo
		return err
	}
	err = createTableBal(db)
	if err != nil {
		return err
	}
	fmt.Println("Banco de dados e tabela criados com sucesso.")
	return nil
}

func createTableBal(db *sql.DB) error {
	_, err := db.Exec(`
            CREATE TABLE IF NOT EXISTS balancas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
            	descricao TEXT CHECK(length(descricao) <= 30),
				event_date DATE
            );
        `)
	if err != nil {
		return err
	}
	eventName := "Go Workshop"
	eventDate := time.Now()
	_, err = db.Exec("INSERT INTO balancas (descricao, event_date) VALUES (?, ?)", eventName, eventDate)
	fmt.Println(err)
	return nil
}

func init() {
	// Abre a conexão com o banco de dados
	db, err := sql.Open("sqlite3", "andine.db")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer db.Close()

	// Chama a função para criar o banco se não existir
	err = createDatabaseIfNotExists(db)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Resto do código...
}

func ConectDb() *sql.DB {
	db, err := sql.Open("sqlite3", "andine.db")
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return db
}
