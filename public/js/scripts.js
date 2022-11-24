//DADOS USUÁRIO
const usernameSpan = document.querySelector("#user-name");
const idadeSpan = document.querySelector("#idade");
const alturaSpan = document.querySelector("#altura");
const pesoSpan = document.querySelector("#peso");
const metaSpan = document.querySelector('#meta')
const objetivoSpan = document.querySelector("#objetivo")
const refeicao_inicialh2 = document.querySelector("#refeicao_inicial")
var refeicao_inicial;

fetch('../../data/user-info', {method: 'GET'})
.then(response => response.json()).then((userData) => {
    
    if(userData.Credenciais == "Inválidas"){
        alert("Credenciais inválidas. Por favor, refaça o login.")
        document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "userps=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
    }

    const idade = CalculaIdade(new Date(userData.nascimento))
    const meta = CalculaMeta(userData.peso, userData.altura, idade, userData.sexo)

    document.title = `DIETAS JÁ - ${userData.nome}`;
    usernameSpan.innerHTML = userData.nome;
    idadeSpan.innerHTML = `${idade} anos`;
    alturaSpan.innerHTML = `${userData.altura} cm`;
    pesoSpan.innerHTML = `${userData.peso} kg`;
    metaSpan.innerHTML = `${meta.toFixed(2)} kcal`;
    objetivoSpan.innerHTML = `(${userData.meta} massa)`;
    refeicao_inicial = `${userData.refeicao_inicial.split(":", 2).join(":")}`;
})

//DADOS REFEIÇÕES
fetch('../../data/refeicao-info', { method: 'GET'})
    .then(response => response.json())
    .then((refeicaoData) => {

        const refeicoesSorteadas = refeicaoData.ingredientes;
        console.log(refeicoesSorteadas)
        
        const containerRefeicoes = document.querySelector("#container-refeicoes")

        for(let i = 0; i < refeicoesSorteadas.length; i++){
            containerRefeicoes.innerHTML += `
            <div class="refeicao row col-fluid">
                <div id="card-${i}" class="imagem-comida col-3">
                    <button class="botaoAtualizaRefeicao" onclick="AtualizaRefeicao(${i})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 20">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg>
                </button>
            </div>

            <div class="info-refeicao col-4 accordion">
                <h2 id="refeicao_inicial">${parseInt(refeicao_inicial.split(":")[0]) + (i * 3) + ":00"}</h2>
                <h3 id="refeicao-${i}">Refeição</h3>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading${i}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                            Ingredientes
                        </button>
                        </h2>
                        <div id="collapse${i}" class="accordion-collapse collapse" aria-labelledby="heading${i}" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                        <ul class="list-group ingredientes" id="lista_ingredientes${i}"></ul>
                            </div>
                        </div>
                    </div>                        
                </div>    
            </div>
            `   
        }

        for(let i = 0; i < refeicoesSorteadas.length; i++){
            const nome_refeicao_h3 = document.querySelector(`#refeicao-${i}`)
            nome_refeicao_h3.innerHTML = refeicoesSorteadas[i].nome_refeicao
            const numero_ingredientes = refeicoesSorteadas[i].ingredientes.length
            const lista_ingredientes = document.querySelector(`#lista_ingredientes${i}`)
    
            for(let v = 0; v < numero_ingredientes; v++){
                let ingrediente_item = document.createElement("li")
                ingrediente_item.classList.add("list-group-item")
                ingrediente_item.append(refeicoesSorteadas[i].ingredientes[v])
                document.querySelector(`#lista_ingredientes${i}`).append(ingrediente_item)
            }
    
        const card_refeicao = document.querySelector(`#card-${i}`);
        card_refeicao.style.backgroundImage = `url('/img/${refeicoesSorteadas[i].id}.jpg')`
    
        }
})

function CalculaIdade(nascimento){
    return Math.abs(new Date(Date.now() - nascimento.getTime()).getUTCFullYear() - 1970);
}

function CalculaMeta(peso, altura, idade, sexo){
    if(sexo == "feminino"){
        return (((9.56 * peso) + (1.85 * altura) - (4.68 * idade) + 665) * 1.55)
    } else {
        return (((13.75 * peso) + (5 * altura) - (6.76 * idade) + 66.5) * 1.55)
    }
}

function AtualizaRefeicao(refeicao){
    fetch('../../data/atualiza-refeicao', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"Refeição": refeicao})
    })
    .then(response => response.json())
    .then((refeicaoData) => {

        document.querySelector(`#lista_ingredientes${refeicao}`).innerHTML = "";

        const numero_ingredientes = Object.keys(refeicaoData.ingredientes).length
        console.log(numero_ingredientes, refeicao, refeicaoData)

        for(let i = 0; i < numero_ingredientes; i++){

            let ingrediente_item = document.createElement("li")
            ingrediente_item.classList.add("list-group-item")
            ingrediente_item.append(refeicaoData.ingredientes[i])
            document.querySelector(`#lista_ingredientes${refeicao}`).append(ingrediente_item)
        }

        const nome_refeicaoh3 = document.querySelector(`#refeicao-${refeicao}`)
        nome_refeicaoh3.innerHTML = `${refeicaoData.nome_refeicao}`

        const card_refeicao = document.querySelector(`#card-${refeicao}`);
        card_refeicao.style.backgroundImage = `url('/img/${refeicaoData.id}.jpg')`
    })
}

function GeraNumeroRefeicoes(){
    
}