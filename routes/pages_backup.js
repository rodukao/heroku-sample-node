const express = require('express')
const router = express.Router()
const connection = require("../controllers/db")

router.get('/', (req, res) => {

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

                            let nomeUsuario = result[0].nome;
                            let idadeUsuario = Math.abs(new Date(Date.now() - result[0].nascimento.getTime()).getUTCFullYear() - 1970);
                            let alturaUsuario = result[0].altura;
                            let pesoUsuario = result[0].peso;
                            let objetivoUsuario = result[0].meta
                            let meta = 0;

                            if(result[0].sexo == "feminino"){
                                meta = (((9.56 * result[0].peso) + (1.85 * result[0].altura) - (4.68 * idadeUsuario) + 665) * 1.55)
                            } else {
                                meta = (((13.75 * result[0].peso) + (5 * result[0].altura) - (6.76 * idadeUsuario) + 66.5) * 1.55)
                            }
                            
                            result[0].meta == "ganhar" ? meta += 500 : meta = meta - 500;

                            poolConnection.query(`SELECT nome FROM refeicoes WHERE id = '1'`, async (error, result) => {
                                if(error) throw error
                                else {

                                    let nomeRefeicao = result[0].nome

                                    res.render('index', {
                                        post: {
                                            nome: nomeUsuario,
                                            nascimento: idadeUsuario,
                                            altura: alturaUsuario,
                                            peso : pesoUsuario,
                                            objetivo: objetivoUsuario,
                                            meta: meta.toFixed(2),
                                            nomeRefeicao: nomeRefeicao
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })

        } else {
            res.render('login')
        }
    } else {
        res.render('login')
    }
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/configuration', (req, res) => {
    const userCookie = req.headers.cookie.split('=')[1]
    connection.getConnection(function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else {
            poolConnection.query(`SELECT nome, altura, peso, meta FROM usuarios WHERE id = '${userCookie}'`, async (error, result) => {
                if(error) throw error
                else {
                    res.render('configuration', {
                        post: {
                            nome: result[0].nome,
                            altura: result[0].altura,
                            peso: result[0].peso,
                            meta: result[0].meta
                        }
                    })
                }
            })
        }
    })
})

router.get('/login', (req, res) => {
    if(req.headers.cookie){
        const cookie = req.headers.cookie.split('=')[0]
        if(cookie == "userID"){
            res.redirect('./')
        } else {       
            res.render('login')
        }
    }
    res.render('login')
})

router.get('/logout', (req, res) => {
    res.clearCookie('userID')
    res.render('login')
})

module.exports = router
