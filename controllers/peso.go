package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/tarm/serial"
)

var (
	portaSerial *serial.Port
	mutex       sync.Mutex
	configPath  = "config.json"
	status      = true
)

const (
	stx = '\x02'
	etx = '\x03'
)

// Estrutura para mapear as configurações do arquivo JSON
type Config struct {
	Port     string `json:"port"`
	BaudRate int    `json:"baudRate"`
}

// Função para ler dados da porta serial
func lerPortaSerial() string {
	mutex.Lock()
	defer mutex.Unlock()

	buf := make([]byte, 16)
	builder := strings.Builder{}

	for {
		n, err := portaSerial.Read(buf)
		if err != nil {
			log.Printf("Erro ao ler da porta serial: %s %v", portaSerial, err)
			status = false
			return ""
		}
		status = true
		builder.Write(buf[:n])
		if strings.Contains(builder.String(), string(etx)) {
			break
		}
	}

	return builder.String()
}

// Função para processar o dado recebido e extrair o peso
func processarDados(dados string) (string, string) {
	dados = strings.TrimSpace(dados)

	if len(dados) >= 4 && dados[0] == stx && dados[len(dados)-1] == etx {
		dados = dados[1 : len(dados)-1]

		if strings.HasPrefix(dados, "NNNNN") {
			return "Peso negativo (mas estável)", ""
		} else if strings.HasPrefix(dados, "SSSSS") {
			return "Peso acima do limite permitido", ""
		}

		return dados, ""
	}

	return "", ""
}

// Função para obter o peso e a tara
func obterPesoETara() (string, string) {
	dados := lerPortaSerial()
	if dados != "" {
		return processarDados(dados)
	}
	return "", ""
}

// Handler para SSE que envia atualizações periódicas de peso e tara
func PesoUpdateHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			peso, tara := obterPesoETara()

			if peso != "" {
				response := map[string]string{
					"peso":   peso,
					"tara":   tara,
					"status": fmt.Sprint(status),
				}

				data, err := json.Marshal(response)
				if err != nil {
					log.Printf("Erro ao codificar resposta JSON: %v", err)
					continue
				}

				fmt.Fprintf(w, "data: %s\n\n", data)
				w.(http.Flusher).Flush()
			} else {
				response := map[string]string{
					"peso":   "0.000",
					"tara":   "0.000",
					"status": fmt.Sprint(status),
				}

				data, err := json.Marshal(response)
				if err != nil {
					log.Printf("Erro ao codificar resposta JSON: %v", err)
					continue
				}

				fmt.Fprintf(w, "data: %s\n\n", data)
				w.(http.Flusher).Flush()
			}
		case <-r.Context().Done():
			return
		}
	}
}

// Função para carregar configurações do arquivo JSON
func carregarConfiguracoes(filename string) (*Config, error) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var config Config
	err = json.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}

// Função para reconfigurar a porta serial
func reconfigurarPortaSerial() bool {
	config, err := carregarConfiguracoes(configPath)
	if err != nil {
		log.Printf("Erro ao carregar configurações: %v", err)
		return false
	}

	err = Initialize(config.Port, config.BaudRate)
	if err != nil {
		log.Printf("Erro ao reconfigurar a porta serial: %v", err)
		return false
	}

	return true
}

// Função de inicialização do pacote controllers
func Initialize(port string, baudRate int) error {
	config := &serial.Config{
		Name:        port,
		Baud:        baudRate,
		ReadTimeout: time.Millisecond * 100,
	}

	var err error
	portaSerial, err = serial.OpenPort(config)
	if err != nil {
		fmt.Printf("Erro ao abrir porta serial: %v \n", err)
		return err
	}
	return nil
}

func init() {
	config, err := carregarConfiguracoes(configPath)
	if err != nil {
		fmt.Printf("Erro ao carregar configurações: %v\n", err)
	}

	err = Initialize(config.Port, config.BaudRate)
	if err != nil {
		fmt.Println("Erro ao inicializar a porta serial")
	}
}
