const express = require('express')
const router = express.Router()
const connection = require("../controllers/db")

var array = []

router.get('/user-info', (req, res) => {

    if(req.headers.cookie){
        const cookie = req.headers.cookie.split('=')[0]
        const userCookie = req.headers.cookie.split('=')[1]
        
        if(cookie == "userID"){

            connection.getConnection(function(err, poolConnection) {
                if(err) console.log('Connection error: ', err)
                else {
                    poolConnection.query(`SELECT nome, altura, peso, nascimento, meta, sexo, refeicao_inicial FROM usuarios WHERE id = '${userCookie}'`, async (error, result) => {
                        if(error) throw error
                        else {
                            res.send(result[0])
                        }
                    })
                }
            })
        }
    }
})

router.get('/refeicao-info', async (req, res) => {

    SelecionaCategorias()
    function SelecionaCategorias(){
    
        connection.getConnection(function(err, poolConnection) {
            if(err) console.log('Connection error: ', err)
            else {
                poolConnection.query(`SELECT categoria FROM refeicoes GROUP BY categoria;`, async (error, categorias) => {
                    SelecionaRefeicoes(categorias)
                })
            }
        })
    }
    
    async function SelecionaRefeicoes(categorias){
        connection.getConnection(function(err, poolConnection) {
            if(err) console.log('Connection error: ', err)
            else {
                poolConnection.query(`SELECT * FROM refeicoes;`, async (error, refeicoes) => {
                    SeparaRefeicoesPorCategorias(categorias, refeicoes)
                })
            }
        })
    }
    
    function SeparaRefeicoesPorCategorias(categorias, refeicoes){
    
        let cafe_manha = []
        let lanche = []
        let almoco = []
        let lancheTarde = []
        let janta = []

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
        })
        listaRefeicoes.push(cafe_manha)
        listaRefeicoes.push(lanche)
        listaRefeicoes.push(almoco)
        listaRefeicoes.push(lancheTarde)
        listaRefeicoes.push(janta)
    
        SorteiaRefeicao(listaRefeicoes, categorias)
    }

    function SorteiaRefeicao(listaRefeicoes, categorias){
        let refeicoes_selecionadas = []
        for(let i = 0; i < listaRefeicoes.length; i++){
            refeicoes_selecionadas.push(listaRefeicoes[i][Math.floor(Math.random() * listaRefeicoes[i].length)])
        }
        const resultado = {categorias, refeicoes_selecionadas}
        res.send(resultado)
    }
})

router.post('/ingredientes', (req, res) => {

    let refeicoes_selecionadas = Object.values(req.body)

    connection.getConnection(function(err, poolConnection){

        if(err) console.log('Connection error: ', err)
        else {
            poolConnection.query(`SELECT 
    
            refeicoes.id AS 'id_refeicao',
            refeicoes.nome AS 'nome_refeicao', 
            ingredientes.nome AS 'nome_ingrediente'
                    
            FROM refeicoes 
                
            INNER JOIN refeicao_ingredientes ON refeicoes.id = refeicao_ingredientes.id_refeicao
            INNER JOIN ingredientes ON ingredientes.id = refeicao_ingredientes.id_ingrediente;`, async (error, result) => {
                if(error) throw error
                else {

                    let arrayRefeicoes = []

                    for(i = 0; i < Object.keys(refeicoes_selecionadas).length; i++){

                        let objetoRefeicao = {}
                        const refeicao = result.filter(function(arrayItem){
                            return arrayItem.id_refeicao == refeicoes_selecionadas[i]
                        })

                        objetoRefeicao["id"] = refeicoes_selecionadas[i]
                        objetoRefeicao["nome_refeicao"] = refeicao[0].nome_refeicao
                        objetoRefeicao["ingredientes"] = result.filter(function (id_refeicao){
                            return id_refeicao.id_refeicao == Object.values(req.body)[i]
                        }).map(function(id_refeicao){
                            return id_refeicao.nome_ingrediente
                        })

                        arrayRefeicoes.push(objetoRefeicao)
                    }
                    res.send(arrayRefeicoes)                    
                }
            })
        }
    })
})

module.exports = router