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

        let senhaCriptografada = await bcrypt.hash(senha, 8)
        console.log(senhaCriptografada)
        
    })
    
}