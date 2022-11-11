const express = require('express')
const router = express.Router()
const connection = require("../controllers/db")

router.get('/user-info', (req, res) => {

    let cookies = req.headers.cookie
    cookies = cookies.split('; ')
    let userSessionPW = ''
    let userID = ''
    
    if(cookies[0].split('=')[0] == "userps"){
        userSessionPW = cookies[0].split('=')[1]
        userID = cookies[1].split('=')[1]
    } else {
        userSessionPW = cookies[1].split('=')[1]
        userID = cookies[0].split('=')[1]
    }

    userSessionPW = decodeURIComponent(userSessionPW)
    if(req.headers.cookie.includes('userID')){

        connection.getConnection(function(err, poolConnection) {
            if(err) console.log('Connection error: ', err)
            else {
                poolConnection.query(`SELECT id, sessionpw FROM usuarios WHERE id = '${userID}'`, async (error, result) => {
                    if(error) throw error
                    else {
                        if(result[0].id == userID && result[0].sessionpw == userSessionPW){
                            connection.getConnection(function(err, poolConnection) {
                                if(err) console.log('Connection error: ', err)
                                else {
                                    poolConnection.query(`SELECT nome, altura, peso, nascimento, meta, sexo, refeicao_inicial FROM usuarios WHERE id = '${userID}'`, async (error, result) => {
                                        if(error) throw error
                                        else {
                                            res.send(result[0])
                                        }
                                    })
                                }
                            })
                        }
                        else {
                            res.send({Credenciais: "Inválidas"})
                        }
                    }
                })
            }
        })
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

        listaRefeicoes.push(cafe_manha)
        listaRefeicoes.push(lanche)
        listaRefeicoes.push(almoco)
        listaRefeicoes.push(lancheTarde)
        listaRefeicoes.push(janta)
        listaRefeicoes.push(ceia)
    
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

router.post('/atualiza-refeicao', (req, res) => {

    let tipo_refeicao = Object.values(req.body)

    connection.getConnection(function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else {
            poolConnection.query(`SELECT categoria FROM refeicoes GROUP BY categoria;`, async (error, categorias) => {
                connection.getConnection(function(err, poolConnection){

                    if(err) console.log('Connection error: ', err)
                    else {
                        poolConnection.query(`SELECT 
                
                        refeicoes.id AS 'id_refeicao',
                        refeicoes.nome AS 'nome_refeicao', 
                        ingredientes.nome AS 'nome_ingrediente'
                                
                        FROM refeicoes 
                            
                        INNER JOIN refeicao_ingredientes ON refeicoes.id = refeicao_ingredientes.id_refeicao
                        INNER JOIN ingredientes ON ingredientes.id = refeicao_ingredientes.id_ingrediente
                        
                        WHERE refeicoes.categoria = '${Object.values(categorias[tipo_refeicao])}'
                        
                        ORDER BY id_refeicao;`, async (error, result) => {
                            if(error) throw error
                            else {

                                const id_refeicao_sorteada =  Math.floor(Math.random() * (result[result.length - 1].id_refeicao - result[0].id_refeicao) + result[0].id_refeicao)                     
                                const refeicao_selecionada = result.filter(function(array){
                                    return array.id_refeicao == id_refeicao_sorteada
                                })

                                let obj_refeicao = {}
                                obj_refeicao['id'] = refeicao_selecionada[0].id_refeicao
                                obj_refeicao['nome_refeicao'] = refeicao_selecionada[0].nome_refeicao
                                obj_refeicao['ingredientes'] = result.filter(function(item){
                                    return item.id_refeicao == refeicao_selecionada[0].id_refeicao
                                }).map(function(item){
                                    return item.nome_ingrediente
                                })
                                res.send(obj_refeicao)        
                            }
                        })
                    }
                })  
            })
        }
    })
    
})

module.exports = router