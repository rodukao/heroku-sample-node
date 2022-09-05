const path = require('path');

//EXPRESS
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//EXPRESS SESSION
const session = require('express-session');

//PASSPORT
var passport = require('passport');

//DOTENV
require('dotenv').config()

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.set('view engine', 'hbs')
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

