const path = require('path')

//EXPRESS
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

//DOTENV
require('dotenv').config()

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.set('view engine', 'hbs')
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

//connect to database
/*connection.connect()
connection.query('SELECT * FROM usuarios', function (error, results, fields) {
  if (error) throw error
    app.get('/', (req, res) => {
    res.send(results)
  })
})
connection.end()*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

