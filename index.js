var mysql = require('mysql');
const db_connection = require('./database-connection')
const connection = mysql.createConnection(db_connection)

//EXPRESS
const express = require('express')
const app = express()
const port = process.env.PORT || 3000


//connect to database
connection.connect();
connection.query('SELECT * FROM usuarios', function (error, results, fields) {
  if (error) throw error;
  app.get('/', (req, res) => {
    res.send(results[0])
  })
});
connection.end();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

