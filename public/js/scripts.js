const usernameSpan = document.querySelector("#user-name");
const idadeSpan = document.querySelector("#idade");
const alturaSpan = document.querySelector("#altura");
const pesoSpan = document.querySelector("#peso");
const metaSpan = document.querySelector('#meta')
const objetivoSpan = document.querySelector("#objetivo")
const refeicao_inicialh2 = document.querySelector("#refeicao_inicial")


fetch('../../data/user-info', { method: 'GET'})
    .then(response => response.json())
    .then((userData) => {

        const idade = CalculaIdade(new Date(userData.nascimento))
        const meta = CalculaMeta(userData.peso, userData.altura, idade, userData.sexo)

        document.title = `DIETAS JÁ - ${userData.nome}`;
        usernameSpan.innerHTML = userData.nome;
        idadeSpan.innerHTML = `${idade} anos`;
        alturaSpan.innerHTML = `${userData.altura} cm`;
        pesoSpan.innerHTML = `${userData.peso} kg`;
        metaSpan.innerHTML = `${meta.toFixed(2)} kcal`;
        objetivoSpan.innerHTML = `(${userData.meta} massa)`;
        refeicao_inicialh2.innerHTML = `${userData.refeicao_inicial.split(":", 2).join(":")}`;

    })
    .then(fetch('../../data/refeicao-info', { method: 'GET'})
    .then(response => response.json())
    .then((refeicaoData) => {

        const numero_ingredientes = Object.keys(refeicaoData).length
        console.log(numero_ingredientes)
        const lista_ingredientes = document.querySelector("#lista_ingredientes")

        for(let i = 0; i < numero_ingredientes; i++){

            let ingrediente_item = document.createElement("li")
            ingrediente_item.classList.add("list-group-item")
            ingrediente_item.append(refeicaoData[i].nome_ingrediente)

            document.querySelector("#lista_ingredientes").append(ingrediente_item)
        }

        const nome_refeicaoh3 = document.querySelector("#refeicao_nome")
        nome_refeicaoh3.innerHTML = `${refeicaoData[0].nome_refeicao}`
        })
    )
    //.then(fetch('../../data/ingredientes-info', {method: 'GET'})
    //.then(response => response.json())
    /*.then((ingredientes) => {
        console.log(ingredientes)
    })

    )*/
    .catch(err => console.log(err.message));

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

function AtualizaRefeicao(){
    fetch('../../data/refeicao-info', { method: 'GET'})
    .then(response => response.json())
    .then((refeicaoData) => {

        console.log(refeicaoData)
        document.querySelector("#lista_ingredientes").innerHTML = "";

        const numero_ingredientes = Object.keys(refeicaoData).length
        console.log(numero_ingredientes)

        for(let i = 0; i < numero_ingredientes; i++){

            let ingrediente_item = document.createElement("li")
            ingrediente_item.classList.add("list-group-item")
            ingrediente_item.append(refeicaoData[i].nome_ingrediente)

            document.querySelector("#lista_ingredientes").append(ingrediente_item)
        }

        const nome_refeicaoh3 = document.querySelector("#refeicao_nome")
        nome_refeicaoh3.innerHTML = `${refeicaoData[0].nome_refeicao}`
    })
}