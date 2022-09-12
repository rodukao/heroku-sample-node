const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const connection = require("./db")

exports.register = (req, res) => {

    const { nome, email, senha, confirm, formFila, nascimento } = req.body

    connection.getConnection(function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else{
            poolConnection.query("SELECT email FROM usuarios WHERE email = ?", [email], async (error, result) => {
                if(error){
                    console.log(error)
                }
        
                if(result.length > 0){
                    return res.render('register', {
                        message: "Email já registrado."
                    })
                }
                
                else if (senha !== confirm){
                    return res.render('register', {
                        message: "Senha e confirmação precisam ser iguais."
                    })
                }
        
                else {
                    let senhaCriptografada = await bcrypt.hash(senha, 8)
                    connection.query(`INSERT INTO usuarios (nome, email, senha, nascimento) values ('${nome}', '${email}', '${senhaCriptografada}', '${nascimento}')`, (error, result) => {
                        if(error) throw error        
                    })
                        return res.redirect('../login') 
                }   
            })
            poolConnection.release()  
        }
    })
}

exports.login = (req, res) => {

    const { id, email, senha } = req.body
    connection.getConnection(function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else{
            poolConnection.query(`SELECT id, email, senha FROM usuarios WHERE email = '${email}'`, async (error, result) => {
                if(error) throw error
                
                if(result.length == 0) {
                    return res.render('login', {
                        message: "Email não encontrado"
                    })
                } else {
        
                    const compare = await bcrypt.compare(senha, result[0].senha);
                    if(compare){
                        res.cookie('userID', result[0].id, {path: '/'}, {maxAge: 10800})
                        return res.redirect('../');
                    } else {
                        return res.render('login', {
                            message: "Senha incorreta"
                        })
                    }
                }
            })
            poolConnection.release()
        }
    })
}

exports.configuration = (req, res) => {
    const userCookie = req.headers.cookie.split('=')[1]
    const { nome, altura, peso } = req.body

    connection.getConnection(function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else{

            poolConnection.query(`UPDATE usuarios SET nome = '${nome}', altura = '${altura}', peso = '${peso}' WHERE id = ${userCookie}`, async (error, result) => {
                if(error){
                    throw error
                } else {
                    return res.redirect('../')
                }
            })
            poolConnection.release()  
        }
    })
}