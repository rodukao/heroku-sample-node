var mysql = require('mysql')
require('dotenv').config()

var connection = mysql.createConnection({
  host     : process.env.host,
  user     : process.env.user,
  password : process.env.password,
  database : process.env.database
})

//EXPRESS
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'));


//connect to database
connection.connect()
connection.query('SELECT * FROM usuarios', function (error, results, fields) {
  if (error) throw error
    app.get('/', (req, res) => {
    res.send(results)
  })
})
connection.end()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

