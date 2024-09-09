
const MoedaBrasil: Intl.NumberFormatOptions = { 
    style: 'currency', 
    currency: 'BRL', 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 3 
  };
  
const formatarMoeda = new Intl.NumberFormat('pt-BR', MoedaBrasil);var map: any = new Map()

for (let i = 0; i <= 200; i++) {
    let element = document.getElementById(i.toString())
    if(element){
        console.log(element)
        map.set(i, true)
        continue
    } 
    map.set(i, false)
}


document.addEventListener("DOMContentLoaded", () => {
    let valores = document.querySelectorAll(".real") as NodeListOf<HTMLElement>;
    valores.forEach(valor => {
        if (valor.textContent) {
            valor.textContent = formatarMoeda.format(parseFloat(valor.textContent));
        }
    });
});


function scrollToId() {
    let Id: string | null = (document.getElementById('searchPlu') as HTMLInputElement).value
    if(Id !== null){
    let element = document.getElementById(Id)

    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("Produto não cadastrado")
    }
    }
}

function scrollToIdByValue(value: string) {
    let element = document.getElementById(value)

    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.log("Produto não cadastrado")
    }
}

function excluir(num: string) {
    let resposta: boolean = confirm(`Certeza que deseja deletar o produto ${num}`)
    if (!resposta) {
        return
    }
    let bool: boolean = false

    let linha: Element | null = document.querySelector(`#row-${num}`)
    console.log(linha)
    if(!linha){
        return
    }
    linha.classList.add("fade-out")
    {
    let plu: number = parseInt(num)
    let dados = {
        Plu: plu
    };

    let json = JSON.stringify(dados);

    fetch('/excluir', { // Endpoint para exclusão
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json,
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            console.log('Excluído:', data);
            // Recarregar a página após a exclusão bem-sucedida
            location.reload();
        })
        .catch((error) => {
            try {
                const errorJson = JSON.parse(error.message);
                console.error('Erro ao excluir:', errorJson.message);
            } catch (e) {
                console.error('Erro ao excluir:', error.message);
            }
        });
    }
}

function toPageFile(){
    let resposta: boolean = confirm(`
A balança Clipse só cadastra produtos com códigos de 1 a 200.
Os demais produtos serão ignorados. 
Deseja continuar?`)

if(resposta){
    window.location.href = "/file"
}
}

function editar(num: string) {
    console.log(num)
    let inputName: string = ".input-plu-" + num
    let inputs: NodeListOf<HTMLElement> = document.querySelectorAll(inputName)
    for (let i = 0; i < inputs.length; i++) {
        let inp = inputs[i];
        if (inp.style.display == "none") {
            inp.style.display = "inline"
            continue
        }
        inp.style.display = "none"
    }
}

function exibeNew(){
    let element = document.getElementById("newPlu")
    if (!element) {
        return
    }
    console.log(element.style.display)
    if (element.style.display == "none") {
        element.style.display = ""
        return
    }
    element.style.display = "none"
}

interface DadosProduto {
    Plu: number;
    Descricao: string;
    Preco: number;
    Venda: number;
    Validade: number;
}

interface RespostaServidor {
    message: string;
    // Adicione outros campos conforme necessário
}

function enviarDados(dados: DadosProduto[]): Promise<RespostaServidor[]> {
    let json = JSON.stringify(dados);
    console.log(json);

    return fetch('/editar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json,
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json() as Promise<RespostaServidor[]>;
    })
    .then(data => {
        console.log('Sucesso:', data);
        location.reload();
        return data;
    })
    .catch((error) => {
        try {
            const errorJson = JSON.parse(error.message);
            console.error('Erro:', errorJson.message);
        } catch (e) {
            console.error('Erro:', error.message);
        }
        throw error; // Rejeitar a promessa com o erro
    });
}

function coletarDados(plu: string): Promise<DadosProduto> {
    return new Promise((resolve, reject) => {
        const descricaoElement = document.querySelector<HTMLInputElement>(`input[name="descricao-${plu}"]`);
        const precoElement = document.querySelector<HTMLInputElement>(`input[name="preco-${plu}"]`);
        const vendaElement = document.querySelector<HTMLSelectElement>(`select[name="venda-${plu}"]`);
        const validadeElement = document.querySelector<HTMLInputElement>(`input[name="validade-${plu}"]`);

        if (!descricaoElement || !precoElement || !vendaElement || !validadeElement) {
            console.error('Elementos de dados não encontrados.');
            alert('Erro ao coletar dados.');
            return reject(new Error('Elementos de dados não encontrados.'));
        }

        const descricao = descricaoElement.value.trim().toUpperCase();
        const preco = parseFloat(precoElement.value.trim());
        const vendaSelect = parseInt(vendaElement.value.trim(), 10);
        const validade = parseInt(validadeElement.value.trim(), 10);

        const bolean = descricao === '' || isNaN(preco) || isNaN(vendaSelect) || isNaN(validade);

        if (bolean) {
            console.log('Erro no cadastro');
            alert('Erro no cadastro');
            return reject(new Error('Erro no cadastro'));
        }

        const dados: DadosProduto = {
            Plu: parseInt(plu, 10),
            Descricao: descricao,
            Preco: preco,
            Venda: vendaSelect,
            Validade: validade,
        };

        console.log(dados);
        resolve(dados);
    });
}

function coletarTodosDados(): Promise<void> {
    const linhas = document.querySelectorAll('tbody tr');
    const promessasDados: Promise<DadosProduto>[] = [];

    linhas.forEach(linha => {
        const pluElement = linha.querySelector('td[id]') as HTMLElement | null;

        if (pluElement) {
            const texto = (pluElement.textContent ?? "").trim();
            const dadosPLU = coletarDados(texto);
            promessasDados.push(dadosPLU);
        }
    });

    return Promise.all(promessasDados)
        .then(dadosProdutos => {
            return enviarDados(dadosProdutos);
        })
        .then(() => {
            console.log('Todos os dados foram enviados com sucesso.');
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao enviar dados.');
        });
}

function novo(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const pluHtml = document.getElementById("plu-new") as HTMLInputElement | null;
        if (!pluHtml) {
            return resolve(false);
        }

        const descricaoElement = document.getElementById("descricao-new") as HTMLInputElement | null;
        const precoElement = document.getElementById("preco-new") as HTMLInputElement | null;
        const vendaSelectElement = document.querySelector(`select[name="venda-new"]`) as HTMLSelectElement | null;
        const validadeElement = document.getElementById("validade-new") as HTMLInputElement | null;

        if (!descricaoElement || !precoElement || !vendaSelectElement || !validadeElement) {
            return resolve(false);
        }

        const descricao = descricaoElement.value.toUpperCase();
        const preco = parseFloat(precoElement.value);
        const vendaSelect = parseInt(vendaSelectElement.value.trim(), 10);
        const validade = parseInt(validadeElement.value, 10);

        console.log(pluHtml.value);
        const pluInvalido = isNaN(parseInt(pluHtml.value)) || descricao === "" || isNaN(preco) || isNaN(vendaSelect) || isNaN(validade);

        if (pluInvalido) {
            alert("Novo cadastro inválido");
            return resolve(false);
        }

        const plu = parseInt(pluHtml.value, 10);
        if (plu > 200) {
            alert("Produto só pode ser cadastrado do código 1 ao 200");
            return resolve(false);
        }
        if (validade > 200) {
            alert("Validade do produto tem limite de até 200 dias");
            return resolve(false);
        }

        const dados: DadosProduto = {
            Plu: plu,
            Descricao: descricao,
            Preco: preco,
            Venda: vendaSelect,
            Validade: validade,
        };

        enviarDadosNovoPlu(dados)
            .then(() => resolve(true))
            .catch(() => resolve(false));
    });
}

function enviarDadosNovoPlu(dados: DadosProduto): Promise<void> {
    const json = JSON.stringify(dados);
    console.log(json);

    return fetch('/novo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json,
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        console.log('Sucesso:', data);
        location.reload();
    })
    .catch(error => {
        try {
            const errorJson = JSON.parse(error.message);
            console.error('Erro:', errorJson.message);
        } catch (e) {
            console.error('Erro:', error.message);
        }
        throw error;
    });
}


async function startImport(event: Event) {
    reiniciarCronometro()
    iniciarCronometro()
    event.preventDefault(); // Prevent default form submission
    const form = document.getElementById('importForm');
    if(!form){
    return
    }
    const campos: NodeListOf<HTMLInputElement> = form.querySelectorAll('input[required]');
    let todosPreenchidos = true;
    campos.forEach(campo => {
        if (!campo.value.trim()) {
            todosPreenchidos = false;
        }
    });

    if (!todosPreenchidos) {
        const aviso = 'Por favor, preencha todos os campos obrigatórios.';
        alert(aviso)
        return;
    }

    var progressElement = document.getElementById("progress");
    var statusElement = document.getElementById("status");
    var ellipsisElement: HTMLElement | null  = document.getElementById("ellipsis");
    var progressBar: HTMLElement | null = document.querySelector(".progress-bar");
    if(progressElement){
    // Reset progress bar and status
        progressElement.style.width = '0%';
        progressElement.textContent = '0%';
    }
    if(statusElement){
        statusElement.textContent = 'Importando...';
    }
    if(progressBar){
        progressBar.style.display = 'block';
    }
    var ellipsisCounter = 0;

   

    var ellipsisInterval = setInterval(function () {
        if(!ellipsisElement) {
            return;
        }
        ellipsisElement.textContent = '.'.repeat((ellipsisCounter % 4) + 1);
        ellipsisCounter++;
    }, 500); // Change ellipsis every 500ms

    var pulsateInterval = setInterval(function () {
        if(!statusElement) {
            return;
        }
        statusElement.style.fontSize = '1.01em';
        setTimeout(function () {
            if(!statusElement) {
                return;
            }
            statusElement.style.fontSize = '1em';
        }, 250);
    }, 500); // Pulsate every 500ms

    let formulario: HTMLFormElement | null =  (document.getElementById("importForm") as HTMLFormElement)
    if(!formulario){
        return
    }
    var formData = new FormData(formulario);
    

    var request = new XMLHttpRequest();
    request.open("POST", "/importarteste", true);
    request.setRequestHeader("Accept", "text/event-stream");

    request.onreadystatechange = function () {
        if (request.readyState === 3 || request.readyState === 4) { 
            var lines = request.responseText.split("\n\n");
            lines.forEach(function (line) {
                if (line.startsWith("data: ")) {
                    var data = line.replace("data: ", "").trim();
                    if (data) {
                        try {
                            var jsonData = JSON.parse(data);
                            if (jsonData.hasOwnProperty("progress")) {
                                var progressValue = jsonData.progress;
                                if(!progressElement){
                                    return
                                }
                                progressElement.style.width = progressValue + '%';
                                progressElement.textContent = Math.round(progressValue) + '%';
                            }
                            if (jsonData.hasOwnProperty("complete")) {
                                clearInterval(ellipsisInterval); // Stop ellipsis animation
                                clearInterval(pulsateInterval); // Stop pulsate animation
                                if(!ellipsisElement || !statusElement){
                                    return
                                }
                                ellipsisElement.textContent = ''; // Clear ellipsis
                                statusElement.textContent = 'Finalizado';
                                reiniciarCronometro()
                            }
                        } catch (e) {
                            // Handle non-JSON data
                            console.error("Error parsing JSON data:", e);
                        }
                    }
                }
            });
        }
        if (request.readyState === 4 && request.status !== 200) {
            if(ellipsisElement && statusElement){
                statusElement.textContent = 'Erro ao completar a tarefa.';    
                ellipsisElement.textContent = ''; // Clear ellipsis
            }
            reiniciarCronometro()
            clearInterval(ellipsisInterval); // Stop ellipsis animation
            clearInterval(pulsateInterval); // Stop pulsate animation
            
        }
    };
    request.send(formData);
}
 
let importForm = document.getElementById("importForm")
if (importForm) {
importForm.addEventListener("submit", startImport);
}
function formatarData(eventDate: string){
    var parts = eventDate.split(" "); 
    // Divide a string na primeira ocorrência de espaço
    var complete_time = parts[1];
    var data_particionada = parts[0].split("-");
    var ano = data_particionada[0]
    var mes = data_particionada[1]
    var dia = data_particionada[2]

    var data = `${dia}/${mes}/${ano}`
    
    var time = complete_time.split(".")[0];
    // Agora parts[0] contém "2024-06-25"
    var dataFormatada =`Dia: ${data} às: ${time}`;
    
    return dataFormatada
}

let tempoSegundos = 0;
let cronometroAtivo = false;
let intervalo: number;

function formatarTempo(segundos: number) {
    const horas = String(Math.floor(segundos / 3600)).padStart(2, '0');
    const minutos = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
    const seg = String(segundos % 60).padStart(2, '0');
    return `${horas}:${minutos}:${seg}`;
}

function atualizarDisplay() {
    (document.getElementById('tempo') as HTMLElement).innerText = formatarTempo(tempoSegundos);
}

async function iniciarCronometro() {
    if (cronometroAtivo) return;
    cronometroAtivo = true;
    intervalo = setInterval(() => {
        tempoSegundos++;
        atualizarDisplay();
    }, 1000);
}

function pausarCronometro() {
    cronometroAtivo = false;
    clearInterval(intervalo);
}

function reiniciarCronometro() {
    pausarCronometro();
    tempoSegundos = 0;
    atualizarDisplay();
}

var campoFiltro = (document.getElementById("searchPluDescription") as HTMLInputElement)

if (campoFiltro) {
campoFiltro.addEventListener("input", function(){
    console.log(this.value);
    var produtos = document.querySelectorAll(".descricao-todos-produtos");
    produtos.forEach(produto => {
        let expressao = new RegExp(this.value,"i")

        let id = produto.id
        let descricao_codigo = id.split("-")
        let codigo = descricao_codigo[1]
        let descricao = produto.textContent
        let idLinhaTabela = `row-${codigo}`
        let linha = document.getElementById(idLinhaTabela)
        if(linha && descricao) {
        if (!expressao.test(descricao)){
            linha.classList.add("invisivel")
        } else {
            linha.classList.remove("invisivel")
        }
    }
    });
})
}