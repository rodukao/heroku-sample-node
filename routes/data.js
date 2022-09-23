const express = require('express')
const router = express.Router()
const connection = require("../controllers/db")

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

    connection.getConnection(function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else {

            poolConnection.query(`SELECT * FROM refeicoes;`, async (error, result) => {
                if(error) throw error
                    else {
                        const numero_refeicoes = Object.keys(result).length

                        poolConnection.query(`SELECT 

                        refeicoes.nome AS 'nome_refeicao', 
                        ingredientes.nome AS 'nome_ingrediente'
                                
                        FROM refeicoes 
                            
                        INNER JOIN refeicao_ingredientes ON refeicoes.id = refeicao_ingredientes.id_refeicao
                        INNER JOIN ingredientes ON ingredientes.id = refeicao_ingredientes.id_ingrediente 
                            
                        WHERE refeicoes.id = ${Math.floor(Math.random() * numero_refeicoes)}`, async (error, result) => {
                            if(error) throw error
                                else {
                                    res.send(result)
                                    }
                            }
                        )
                    }
                }
            )
        }
    })
})

module.exports = router