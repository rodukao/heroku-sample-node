const express = require('express')
const authController = require('../controllers/auth')
const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/configuration', authController.configuration)

module.exports = router
