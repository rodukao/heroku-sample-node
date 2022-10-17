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
    
        refeicoes.forEach((item, index) => {
            if(refeicoes[index].categoria == "Café da manhã"){
                cafe_manha.push(item)
            }
    
            if(refeicoes[index].categoria == "Lanche"){
                lanche.push(item)
            }
        })
        SorteiaRefeicao(cafe_manha, lanche, categorias)
    }
    
    function SorteiaRefeicao(cafe, lanche, categorias){
        cafe_selecionado = cafe[Math.floor(Math.random() * cafe.length)]
        lanche_selecionado = lanche[Math.floor(Math.random() * lanche.length)]

        const resultado = {categorias, cafe_selecionado, lanche_selecionado}
    
        res.send(resultado)
    }
})

router.post('/ingredientes', (req, res) =>{

    console.log(req.body)
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
                
            WHERE refeicoes.id = 1`, async (error, result) => {
                if(error) throw error
                else {
                    res.send(req.body)
                }
            })
        }
    })
})



    /*let categoria_refeicao;
    var data;

    connection.getConnection(function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else {
            poolConnection.query(`SELECT categoria FROM refeicoes GROUP BY categoria;`, async (error, result) => {

                data = result
                categoria_refeicao = result;

                for(let i = 0; i < categoria_refeicao.length; i++){

                    function SelecionaIngredientes(){

                        let arrayRefeicoes = [];
                        
                        poolConnection.query(`SELECT * FROM refeicoes WHERE categoria = '${categoria_refeicao[i].categoria}';`, async(error, result) => {
                            if(error) throw error
                            else {
        
                                const numero_refeicoes = Object.keys(result).length
                                let refeicao_aleatoria = Math.floor(Math.random() * numero_refeicoes)
                                if(refeicao_aleatoria == 0) refeicao_aleatoria = 1
    
                                poolConnection.query(`SELECT 
    
                                            refeicoes.id AS 'id_refeicao',
                                            refeicoes.nome AS 'nome_refeicao', 
                                            ingredientes.nome AS 'nome_ingrediente'
                                                    
                                            FROM refeicoes 
                                                
                                            INNER JOIN refeicao_ingredientes ON refeicoes.id = refeicao_ingredientes.id_refeicao
                                            INNER JOIN ingredientes ON ingredientes.id = refeicao_ingredientes.id_ingrediente 
                                                
                                            WHERE refeicoes.id = ${refeicao_aleatoria}`, async (error, result) => {
    
                                if(error) throw error
                                    else {
                                            data = {...data, result}
                                            //console.log(data)
                                            const refeicao_info = {categoria_refeicao, result}
                                            arrayRefeicoes.push(result)
                                            //res.send(refeicao_info)
                                            return "alou"
                                        }
                                    }
                                )
                                
                                
                            }
                            
                        })
                    }
                    
                }
                
            })
        }
    })*/

module.exports = router