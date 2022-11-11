const bcrypt = require("bcryptjs")
const express = require('express')
const router = express.Router()
const connection = require("../controllers/db")
const functions = require('../controllers/functions')

router.get('/', (req, res) => {

    if(functions.ChecaCookies(req)){

        res.render('index');

    } else {

        res.render('login');

    }

})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/configuration', (req, res) => {

    if(req.headers.cookie.includes('userID') && req.headers.cookie.includes('userps')){

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

        connection.getConnection(function(err, poolConnection) {
            if(err) console.log('Connection error: ', err)
            else {
                poolConnection.query(`SELECT id, sessionpw FROM usuarios WHERE id = '${userID}'`, async (error, result) => {
                    if(error) throw error
                    else {
                        if(result.length > 0){
                            if(result[0].id == userID && result[0].sessionpw == userSessionPW){
                                connection.getConnection(function(err, poolConnection) {
                                    if(err) console.log('Connection error: ', err)
                                    else {
                                        poolConnection.query(`SELECT nome, altura, peso, meta FROM usuarios WHERE id = '${userID}'`, async (error, result) => {
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
                            } else {
                                res.clearCookie('userID')
                                res.clearCookie('userps')
                                res.render('login')
                            }
                        }    
                        else {
                            res.clearCookie('userID')
                            res.clearCookie('userps')
                            res.render('login')
                        }
                    } 
                })
            }
        })
    } else {
        res.render('login')
    }
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

    const cookiesKeys = functions.ListaCookiesKeys(req);
    
    for(let i = 0; i < cookiesKeys.length; i++){
        res.clearCookie(`${cookiesKeys[i]}`);
    }
    
    res.render('login');

})

module.exports = router
