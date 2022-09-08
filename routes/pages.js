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
                            res.render('index', {
                                post: {
                                    nome: result[0].nome,
                                    nascimento: result[0].nascimento,
                                    altura: result[0].altura,
                                    peso : result[0].peso
                                }
                            })
                        }
                    })
                }
            })            

        } else {
            res.render('register')
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
            poolConnection.query(`SELECT nome, nascimento, altura, peso FROM usuarios WHERE id = '${userCookie}'`, async (error, result) => {
                if(error) throw error
                else {
                    res.render('configuration', {
                        post: {
                            nome: result[0].nome,
                            nascimento: result[0].nascimento,
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
            res.render('index')
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

function CalcIdade(ano){
    let month_diff = Date.now() - month_diff.getTime();
    let age_dt = new Date(month_diff);
    let year = age_dt.getUTCFullYear();
    let age = Math.abs(year - 1970);
    return age
}
