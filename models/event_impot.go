package models

import (
	"fmt"
	"time"

	"github.com/lucasbyte/go-clipse/db"
)

type Import_event struct {
	ID        int       // `id` INTEGER PRIMARY KEY AUTOINCREMENT
	Descricao string    // `descricao` TEXT CHECK(length(descricao) <= 30)
	EventDate time.Time // `event_date` DATE
}

func ExisteEvento(descricao string) (bool, error) {
	db := db.ConectDb()
	defer db.Close()

	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM balancas WHERE descricao = ?", descricao).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func NovoEvento(name string, date time.Time) error {
	var err error
	var existe bool
	db := db.ConectDb()
	defer db.Close()

	if existe, err = ExisteEvento(name); existe {
		return fmt.Errorf("existe o evento")
	}
	if err != nil {
		return err
	}

	_, err = db.Exec("INSERT INTO balancas (descricao, event_date) VALUES (?, ?)", name, date)
	if err != nil {
		return err
	}
	return nil
}

func UpdateEvento(name string, date time.Time) {
	db := db.ConectDb()

	query := "UPDATE balancas SET event_date = ? WHERE descricao = ?"
	insereDadosNoBanco, err := db.Prepare(query)
	if err != nil {
		fmt.Println(err.Error())
	}
	insereDadosNoBanco.Exec(date, name)
	defer db.Close()
}

func BuscaEventoImport() Import_event {
	db := db.ConectDb()
	defer db.Close()
	event_name := "import"
	event_now := time.Date(1999, time.January, 01, 10, 0, 0, 0, time.UTC)
	existe, _ := ExisteEvento(event_name)
	if !existe {
		NovoEvento(event_name, event_now)
	}
	event := Import_event{}
	err := db.QueryRow("SELECT id, descricao, event_date FROM balancas WHERE descricao = ?", event_name).Scan(&event.ID, &event.Descricao, &event.EventDate)
	if err != nil {
		fmt.Println("Erro ao executar a consulta:", err)
		return Import_event{}
	}
	return event
}
