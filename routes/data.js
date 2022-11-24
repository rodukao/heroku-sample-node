const express = require('express')
const router = express.Router()
const connection = require("../controllers/db")
const functions = require("../controllers/functions")

router.get('/user-info', (req, res) => {
    const cookies = functions.RetornaCookies(req);
    if(cookies){
        connection.getConnection(function(err, poolConnection){
            if(err) console.log(err);
            else {
                poolConnection.query(`SELECT id, sessionpw, nome, altura, peso, nascimento, meta, sexo, refeicao_inicial FROM usuarios WHERE id = '${cookies.UserID}';`, (error, result) => {
                    if(error) throw error;
                    else {
                        if(result.length > 0){
                            if(result[0].sessionpw == cookies.UserPW){
                                res.send(result[0])
                            } else {
                                res.send({Credenciais: "Inválidas"})
                            }
                        } else {
                            res.send({Credenciais: "Inválidas"})
                        }
                    }
                })
            }
        })
    }
})

router.get('/refeicao-info', async (req, res) => {

    connection.getConnection(function(err, poolConnection){

        if(err) console.log('Connection error: ', err)
        else {
            poolConnection.query(`SELECT 
            
            refeicoes.categoria AS 'categoria',
            refeicoes.id AS 'id_refeicao',
            refeicoes.nome AS 'nome_refeicao', 
            ingredientes.nome AS 'nome_ingrediente'
                    
            FROM refeicoes 
                
            INNER JOIN refeicao_ingredientes ON refeicoes.id = refeicao_ingredientes.id_refeicao
            INNER JOIN ingredientes ON ingredientes.id = refeicao_ingredientes.id_ingrediente;`, async (error, result) => {
                if(error) throw error
                else {

                    const refeicoes = functions.SeparaRefeicoes(result);
                    const refeicoesSorteadas = functions.SorteiaRefeicoes(refeicoes);
                    const ingredientes = functions.RetornaIngredientes(refeicoesSorteadas, result);
                    res.send({ingredientes});

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