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
    connection.getConnection(async function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else{
            let sessionpw = await bcrypt.hash(Math.random().toString(36).slice(-8), 8)
            poolConnection.query(`UPDATE usuarios SET sessionpw = '${sessionpw}' WHERE email = '${email}'`, async (error, result) => {
                if(error) throw error
                else {
                    poolConnection.query(`SELECT id, email, senha, sessionpw FROM usuarios WHERE email = '${email}'`, async (error, result) => {
                        if(error) throw error
                        
                        if(result.length == 0) {
                            return res.render('login', {
                                message: "Email não encontrado"
                            })
                        } else {
                            console.log(result[0])
                            const compare = await bcrypt.compare(senha, result[0].senha);
                            if(compare){
                                res.cookie('userID', result[0].id, {path: '/'}, {maxAge: 10800})
                                res.cookie('userps', sessionpw, {path: '/'}, {maxAge: 10800})
                                return res.redirect('../');
                            } else {
                                return res.render('login', {
                                    message: "Senha incorreta"
                                })
                            }
                        }
                    })
                }
            })   
            poolConnection.release()
        }
    })
}

exports.configuration = (req, res) => {

    let cookies = req.headers.cookie
    cookies = cookies.split('; ')
    
    if(cookies[0].split('=')[0] == "userps"){
        userSessionPW = cookies[0].split('=')[1]
        userCookie = cookies[1].split('=')[1]
    } else {
        userSessionPW = cookies[1].split('=')[1]
        userCookie = cookies[0].split('=')[1]
    }

    const { nome, altura, peso, meta, sexo } = req.body

    connection.getConnection(function(err, poolConnection) {
        if(err) console.log('Connection error: ', err)
        else{

            poolConnection.query(`UPDATE usuarios SET nome = '${nome}', altura = '${altura}', peso = '${peso}', meta = '${meta}', sexo = '${sexo}' WHERE id = ${userCookie}`, async (error, result) => {
                if(error){
                    throw error
                } else {
                    console.log(meta)
                    return res.redirect('../')
                }
            })
            poolConnection.release()  
        }
    })
}