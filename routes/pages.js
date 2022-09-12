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
                    poolConnection.query(`SELECT nome, altura, peso, nascimento, meta, refeicao_inicial FROM usuarios WHERE id = '${userCookie}'`, async (error, result) => {
                    
                        if(error) throw error
                        else {
                            let idade = Math.abs(new Date(Date.now() - result[0].nascimento.getTime()).getUTCFullYear() - 1970)
                            let meta = (((13.75 * result[0].peso) + (5 * result[0].altura) - (6.76 * idade) + 66.5) * 1.55).toFixed(2)

                            res.render('index', {
                                post: {
                                    nome: result[0].nome,
                                    nascimento: idade,
                                    altura: result[0].altura,
                                    peso : result[0].peso,
                                    meta: meta
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
            poolConnection.query(`SELECT nome, altura, peso FROM usuarios WHERE id = '${userCookie}'`, async (error, result) => {
                if(error) throw error
                else {
                    res.render('configuration', {
                        post: {
                            nome: result[0].nome,
                            altura: result[0].altura,
                            peso: result[0].peso
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
