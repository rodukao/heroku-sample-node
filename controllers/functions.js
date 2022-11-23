const connection = require('./db')

module.exports = {
    RetornaCookies: function(req){

        //Checa se tem cookies e se contém a substring 'UserID'
        if(req.headers.cookie && req.headers.cookie.includes("userID")) {
            
            const cookies = req.headers.cookie;
            const cookiesList = cookies.split(';').map(item => item.trim());
            let userID = '';
            let userPW = '';
    
            for(let i = 0; i < cookiesList.length; i++){
                if(cookiesList[i].split('=')[0] == 'userID'){
                    userID = cookiesList[i].split('=')[1];
                }
            }

            for(let i = 0; i < cookiesList.length; i++){
                if(cookiesList[i].split('=')[0] == 'userps'){
                    userPW = cookiesList[i].split('=')[1];
                }
            }

            //Descriptografa a senha da sessão e cria objeto com userID e userPW
            userPW = decodeURIComponent(userPW);
            let credenciais = {
                UserID: `${userID}`, 
                UserPW: `${userPW}`
            };
            
            return credenciais;
            
        } else {
            console.log("Não existe cookie ou não existe cookie com o nome 'userID'")
            return false; 
        }
    },

    ChecaCookies: function(req){
        return (req.headers.cookie && req.headers.cookie.includes("userID"));
    },

    ListaCookiesKeys: function(req){
        if(req.headers.cookie){

            let cookies = req.headers.cookie;
            let cookiesList = cookies.split(';').map(item => item.trim());
            let cookiesKeys = []

            for(let i = 0; i < cookiesList.length; i++){
                cookiesKeys.push(cookiesList[i].split('=')[0]);
            }

            return cookiesKeys;

        } else {
            return;
        }
    },

    CategoriasRefeicoes: function(result){
        return result.map(item => item.categoria).filter((value, index, self) => self.indexOf(value) === index);
    },
    
    SeparaRefeicoes: function(refeicoes){

        let cafe_manha = []
        let lanche = []
        let almoco = []
        let lancheTarde = []
        let janta = []
        let ceia = []

        let listaRefeicoes = []
        refeicoes.forEach((item, index) => {

            if(refeicoes[index].categoria == "Café da manhã"){
                cafe_manha.push(item)
            }
    
            if(refeicoes[index].categoria == "Lanche"){
                lanche.push(item)
            }

            if(refeicoes[index].categoria == "Almoço"){
                almoco.push(item)
            }

            if(refeicoes[index].categoria == "Lanche da tarde"){
                lancheTarde.push(item)
            }

            if(refeicoes[index].categoria == "Janta"){
                janta.push(item)
            }

            if(refeicoes[index].categoria == "Ceia"){
                ceia.push(item)
            }

        })

        listaRefeicoes.push(cafe_manha);
        listaRefeicoes.push(lanche);
        listaRefeicoes.push(almoco);
        listaRefeicoes.push(lancheTarde);
        listaRefeicoes.push(janta);
        listaRefeicoes.push(ceia);

        return listaRefeicoes;
        //return result.map(item => item.nome_refeicao).filter((value, index, self) => self.indexOf(value) === index);
    },

    SorteiaRefeicoes(refeicoes){
        let refeicoes_selecionadas = []
        for(let i = 0; i < refeicoes.length; i++){
            refeicoes_selecionadas.push(refeicoes[i][Math.floor(Math.random() * refeicoes[i].length)])
        }
        return refeicoes_selecionadas;
    },

    RetornaIngredientes(refeicoes_selecionadas, result){
        let arrayRefeicoes = []
        for(i = 0; i < Object.keys(refeicoes_selecionadas).length; i++){

            let objetoRefeicao = {}
            
            refeicao = result.filter(function(arrayItem){
                return arrayItem.id_refeicao == refeicoes_selecionadas[i].id_refeicao
            })

            objetoRefeicao["id"] = refeicoes_selecionadas[i].id_refeicao;
            objetoRefeicao["nome_refeicao"] = refeicao[0].nome_refeicao;
            objetoRefeicao["ingredientes"] = result.filter(function (item){
                    return item.id_refeicao == result[i].id_refeicao
                }).map(function(id_refeicao){
                        return id_refeicao.nome_ingrediente
                    })

            arrayRefeicoes.push(objetoRefeicao);   

        }
        console.log(arrayRefeicoes)
    }
}