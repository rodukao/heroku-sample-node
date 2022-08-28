const connection = require("./db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.register = (req, res) => {

    const { nome, email, senha, confirm, formFila, objetivo } = req.body
    
    connection.query("SELECT email FROM usuarios WHERE email = ?", [email], async (error, result) => {
        if(error){
            //connection.end()
            console.log(error)
        }

        if(result.length > 0){
            //connection.end()
            return res.render('register', {
                message: "Email já registrado."
            })
        }
        else if (senha !== confirm){
            //connection.end()
            return res.render('register', {
                message: "Senha e confirmação precisam ser iguais."
            })
        }

        else{
            
            let senhaCriptografada = await bcrypt.hash(senha, 8)
            connection.query(`INSERT INTO usuarios (nome, email, senha, meta) values ('${nome}', '${email}', '${senhaCriptografada}', '${objetivo}')`, (error, result) => {
                if(error) {
                    throw error
                }
                console.log(result)
                })
                connection.end()
                return res.render('./', {
                    message : "Usuário cadastrado com sucesso."
            }) 
        }   
    })
}

exports.login = (req, res) => {
    const { email, senha } = req.body
    connection.query(`SELECT email, senha FROM usuarios WHERE email = '${email}'`, (error, result) => {
        if(error) throw error
        
        if(result.length == 0) {
            return res.render('login', {
                message: "Email não encontrado"
            })
        } else {
            console.log(`${result[0]}`)
            connection.end()
            return res.render('register', {
                message: "LALALALA"
            })
        }
    }) 
}