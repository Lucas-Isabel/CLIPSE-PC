
const options = { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 3 }
const formatNumber = new Intl.NumberFormat('pt-BR', options)
var map = new Map()

var globalPesoEsperado = 0;

function addTableRow(text, value, id, peso) {
    // Seleciona o tbody dentro da tabela
    var tbody = document.querySelector('#produtos');

    // Cria um novo elemento tr
    var newRow = document.createElement('tr');

    // Adiciona o conteúdo à nova linha (td com colspan="2")
    newRow.innerHTML = `<td colspan="2" style="display: flex;"> ${text} <span id="peso-span-${id}"> &nbsp; ${(peso).toFixed(3)} &nbsp;  </span> <input id="input-quant-${id}" class="input-quant" style="width: 30%;" type="number" value="${value}"></td>`;
    // Adiciona a nova linha ao final do tbody
    tbody.appendChild(newRow);
    var campoQuant = document.getElementById(`input-quant-${id}`)
    console.log(campoQuant)
    if(campoQuant){
    campoQuant.addEventListener("input", function()
    {
        console.log(this.value);
        calc();
    })
}
}

function calc(){
    const camposQuant = document.getElementsByClassName(`input-quant`)
    let total = 0
    for (let i = 0; i < camposQuant.length; i++) {
        const element = camposQuant[i];
        const id = (element.id).replace("input-quant-", "")
        const peso = Number(document.getElementById(`peso-span-${id}`).textContent)
        const quant = Number(element.value)
        const totalLinha = (peso * quant)
        total += totalLinha
    }
    mudarPesoEsperado(total)
}

function mudarPesoEsperado(value){
    document.getElementById(`PesoEsperado`).textContent = (value).toFixed(3)
    const PesoEsperadoElem = document.getElementById(`PesoEsperado`);
    if (Number(document.getElementById(`peso`).textContent) > Number(document.getElementById(`PesoEsperado`).textContent)) {
        PesoEsperadoElem.classList.add("text-danger");
    } else if (Number(document.getElementById(`peso`).textContent) < Number(document.getElementById(`PesoEsperado`).textContent)) {
        PesoEsperadoElem.classList.add("text-warning");
    } else {
        PesoEsperadoElem.classList.add("text-success");
    }
}

//descricao-{{.Plu}} peso-{{.Plu}} margem-{{.Plu}}
function showRowInfo(row) {
    const rowId = row.id;
    const id = rowId.replace("row-", "")
    const descricao = document.getElementById(`descricao-${id}`).textContent
    const peso = Number(document.getElementById(`peso-${id}`).textContent)
    const margem = Number(document.getElementById(`margem-${id}`).textContent)
    let quant = (prompt(`Qual a quantidade do produto ${descricao}?`))
    while(!quant || isNaN(quant)){
        quant = (prompt(`Quantidade invalida digite novamente ${descricao}?`))    
    }

    addTableRow(`${id} ${descricao} `, quant , id, peso);
    calc()
    // const PesoEsperado = Number(document.getElementById(`PesoEsperado`).textContent) 
    // const PesoProduto = peso * Number(quant)
    // console.log(PesoProduto)
    // document.getElementById(`PesoEsperado`).textContent = (PesoEsperado + PesoProduto).toFixed(3)
}

//salvar todos os códigos da tabela
for (let i = 0; i <= 200; i++) {
    let element = document.getElementById(i)
    if(element){
        console.log(element)
        map.set(i, true)
        continue
    } 
    map.set(i, false)
}


addEventListener("DOMContentLoaded", () => {
    valores = document.querySelectorAll(".decimal")
    valores.forEach(valor => {
        console.log()
        num = valor.textContent
        valor.textContent = (num/1000).toFixed(3) 
    });
})

function scrollToId() {
    let Id = document.getElementById('searchPlu').value

    let element = document.getElementById(Id)

    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("Produto não cadastrado")
    }
}

function scrollToIdByValue(value) {
    let element = document.getElementById(value)

    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.log("Produto não cadastrado")
    }
}

function excluir(num) {
    resposta = confirm(`Certeza que deseja deletar o produto ${num}`)
    if (!resposta) {
        return
    }
    bool = false

    linha = document.querySelector(`#row-${num}`)
    console.log(linha)
    linha.classList.add("fade-out")
    {
    plu = parseInt(num)
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
    resposta = confirm(`
Mensagem de aviso`)

if(resposta){
    window.location.href = "/file"
}
}

function editar(num) {
    console.log(num)
    inputName = ".input-plu-" + num
    inputs = document.querySelectorAll(inputName)
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
    element = document.getElementById("newPlu")
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

function exibeFullVision(){
    element = document.getElementById("lista-produtos") 
    balanca = document.getElementById("balanca")
    buttonView =  document.getElementById("buttonView")
    if (!element || !balanca)  { 
        return
    }
    console.log(element.style.display)
    
    if (buttonView.style.display == "none") {
        buttonView.style.display = ""
    } else {
        buttonView.style.display = "none"    
    }
    if (balanca.classList.contains('col-lg-5')) {
        // Remove a classe 'colm-8'
        balanca.classList.remove('col-lg-5');
        // Adiciona a classe 'colm-10'
        balanca.classList.add('col-lg-11');
    }
    else if (balanca.classList.contains('col-lg-11')) {
        // Remove a classe 'colm-8'
        balanca.classList.remove('col-lg-11');
        // Adiciona a classe 'colm-10'
        balanca.classList.add('col-lg-5');
    }

    if (element.style.display == "none") {
        element.style.display = ""
        return
    }
    element.style.display = "none"
}

function enviarDados(dados) {
    let json = JSON.stringify(dados);
    console.log(json)
    fetch('/editar', {
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
        .catch((error) => {
            try {
                const errorJson = JSON.parse(error.message);
                console.error('Erro:', errorJson.message);
            } catch (e) {
                console.error('Erro:', error.message);
            }
        });
}

function coletarDados(plu) {
    let descricao = document.querySelector(`input[name="descricao-${plu}"]`).value.trim();
    descricao = descricao.toUpperCase()
    let peso = parseFloat(document.querySelector(`input[name="peso-${plu}"]`).value.trim());
    let margem = parseInt(document.querySelector(`input[name="margem-${plu}"]`).value.trim());



    bolean = descricao == "" || isNaN(peso) || isNaN(margem)

    if (bolean) {
        console.log("erro cadastro")
        alert("erro cadastro")
        return
    }
    plu = parseInt(plu)


    if(peso < 0){
        peso = peso * -1
    }
    if(margem < 0){
        validade = validade * -1
    }
    if(plu < 0){
        plu = plu * -1
    }
    let dados = {
        Plu: plu,
        Descricao: descricao,
        Peso: peso,
        Margem: margem,
    };


    console.log(dados)
    return enviarDados(dados);
}

function coletarTodosDados() {
    let linhas = document.querySelectorAll('tbody tr');
    let dados = [];

    linhas.forEach(linha => {
        let plu = linha.querySelector('td[id]').textContent.trim();
        let dadosPLU = coletarDados(plu);
        dados.push(dadosPLU);
    });

    return enviarDados(dados);
}

function novo() {
    let pluHtml = document.getElementById("plu-new")
    if (!pluHtml) {
        return false
    }

    let descricao = (document.getElementById("descricao-new").value).toUpperCase()
    let peso = parseFloat(document.getElementById("peso-new").value)
    let margem = parseInt(document.getElementById("margem-new").value)

    console.log(pluHtml.value)
    let pluInvalido = isNaN(pluHtml.value) || descricao == "" || isNaN(peso) || isNaN(margem) 
    
    if (pluInvalido) {
        alert("Novo cadastro invalido")
        return false
    }



    let plu = parseInt(pluHtml.value) 

    if(plu < 0 ){
        plu = plu *-1
    }

    if(map.get(plu)) {
        alert("Plu já cadastrado")
        scrollToIdByValue(plu)
        return false
    }

    let dados = {
        Plu: plu,
        Descricao: descricao,
        Peso: peso,
        Margem: margem,
    };

    return enviarDadosNovoPlu(dados)
}


function enviarDadosNovoPlu(dados) {
    let json = JSON.stringify(dados);
    console.log(json)
    fetch('/novo', {
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
        .catch((error) => {
            try {
                const errorJson = JSON.parse(error.message);
                console.error('Erro:', errorJson.message);
            } catch (e) {
                console.error('Erro:', error.message);
            }
        });
}


importForm = document.getElementById("importForm")
if (importForm) {
importForm.addEventListener("submit", startImport);
}
function formatarData(eventDate){
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
let intervalo;

function formatarTempo(segundos) {
    const horas = String(Math.floor(segundos / 3600)).padStart(2, '0');
    const minutos = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
    const seg = String(segundos % 60).padStart(2, '0');
    return `${horas}:${minutos}:${seg}`;
}

function atualizarDisplay() {
    document.getElementById('tempo').innerText = formatarTempo(tempoSegundos);
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

var campoFiltro = document.getElementById("searchPluDescription")

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
        if(linha) {
        if (!expressao.test(descricao)){
            linha.classList.add("invisivel")
        } else {
            linha.classList.remove("invisivel")
        }
    }
    });
})
}

function iniciarSSE() {
    const source = new EventSource('/pesoupdate');
    
    // Cache os elementos que serão manipulados frequentemente
    const pesoElem = document.getElementById("peso");
    const taraElem = document.getElementById("tara");
    const status = document.getElementById("status");
    const erro = document.getElementById("erro-status");
    const PesoEsperadoElem = document.getElementById("PesoEsperado");

    // Variáveis para armazenar os valores anteriores e evitar processamento desnecessário
    let pesoAnterior = null;
    let taraAnterior = null;

    source.onmessage = function (event) {
        try {
            const jsonData = JSON.parse(event.data);

            // Atualiza apenas se os valores mudaram
            if (jsonData.peso !== pesoAnterior || jsonData.tara !== taraAnterior) {
                pesoElem.textContent = jsonData.peso;
                if(jsonData.status == "false"){
                    status.classList.remove("green");
                    status.classList.add("red");
                    erro.textContent = "Erro ao conectar configure e verifique a porta e reinicie a aplicação" 

                } else {
                    status.classList.remove("red");
                    status.classList.add("green");
                };
                if(!isNaN(jsonData.peso)){
                    pesoElem.textContent = (Number(jsonData.peso)/1000).toFixed(3)
                } 
                taraElem.textContent = jsonData.tara;

                const pesoValue = parseFloat(jsonData.peso.replace(",", "."))/1000;
                const PesoEsperadoValue = parseFloat(PesoEsperadoElem.textContent.replace(",", "."));

                PesoEsperadoElem.classList.remove("text-warning", "text-success", "text-danger");

                if (pesoValue > PesoEsperadoValue) {
                    PesoEsperadoElem.classList.add("text-danger");
                } else if (pesoValue < PesoEsperadoValue) {
                    PesoEsperadoElem.classList.add("text-warning");
                } else {
                    PesoEsperadoElem.classList.add("text-success");
                }

                console.log(pesoValue, PesoEsperadoValue);

                // Atualiza os valores anteriores
                pesoAnterior = jsonData.peso;
                taraAnterior = jsonData.tara;
            }
        } catch (e) {
            console.error("Erro ao analisar os dados JSON:", e);
        }
    };

    source.onerror = function (event) {
        console.error("Erro no SSE", event);
    };
}

// Inicia o SSE quando a página carregar
window.onload = iniciarSSE;
