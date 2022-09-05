const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if(req.headers.cookie){
        const cookie = req.headers.cookie.split('=')[0]
        if(cookie == "userID"){
            res.render('index')
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

router.get('/login', (req, res) => {
    /*if(req.headers.cookie){
        const cookie = req.headers.cookie.split('=')[0]
        if(cookie == "userID"){
            res.render('index')
        } else {
            res.render('login')
        }
    }*/
    res.render('login')
})

router.get('/logout', (req, res) => {
    res.clearCookie('userID')
    res.render('login')
})

module.exports = router
