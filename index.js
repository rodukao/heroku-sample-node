const path = require('path');
const publicDirectory = path.join(__dirname, './public')

//DOTENV
require('dotenv').config()

//EXPRESS
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//HandleBars
app.set('view engine', 'hbs')

app.use(express.static(publicDirectory))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Definindo rotas
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))
app.use('/data', require('./routes/data'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

