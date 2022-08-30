const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const connection = require("./db")

exports.register = (req, res) => {

    const { nome, email, senha, confirm, formFila, objetivo } = req.body

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
                    connection.query(`INSERT INTO usuarios (nome, email, senha, meta) values ('${nome}', '${email}', '${senhaCriptografada}', '${objetivo}')`, (error, result) => {
                        if(error) throw error        
                    })
                        return res.render('./', {
                            message : "Usuário cadastrado com sucesso."
                    }) 
                }   
            })
            poolConnection.release()  
        }
    })
}

exports.login = (req, res) => {

    const { email, senha } = req.body
    connection.getConnection(function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else{
            poolConnection.query(`SELECT email, senha FROM usuarios WHERE email = '${email}'`, async (error, result) => {
                if(error) throw error
                
                if(result.length == 0) {
                    return res.render('login', {
                        message: "Email não encontrado"
                    })
                } else {
        
                    const compare = await bcrypt.compare(senha, result[0].senha);
                    if(compare){
                        return res.render('./', {
                            message: "Logado com sucesso"
                        })
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












    /*pool.getConnection(function(err, poolConnection) {
        if (err)
            console.log('Connection error: ', err);
        else{
            connection.query(`SELECT email, senha FROM usuarios WHERE email = '${email}'`, async (error, result) => {
                if(error) throw error
                
                if(result.length == 0) {
                    return res.render('login', {
                        message: "Email não encontrado"
                    })
                } else {
        
                    const compare = await bcrypt.compare(senha, result[0].senha);
                    if(compare){
                        return res.render('./', {
                            message: "Logado com sucesso"
                        })
                    } else {
                        return res.render('login', {
                            message: "Senha incorreta"
                        })
                    }
                }
            })
        }

        connection.release();
    });
    
}*/