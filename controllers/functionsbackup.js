const connection = require('./db')

module.exports = {
    ValidaCookies: function(req){

        console.log("Passagem 01: A função foi chamada."); 

        //Checa se tem cookies e se contém a substring 'UserID'
        if(req.headers.cookie && req.headers.cookie.includes("userID")) {

            console.log("Passagem 02: Existe um cookie que contém a substring 'UserID'");
            
            const cookies = req.headers.cookie;
            const cookiesList = cookies.split(';').map(item => item.trim());
            let userID = '';
            let userPW = '';
    
            for(let i = 0; i < cookiesList.length; i++){
                if(cookiesList[i].split('=')[0] == 'userID'){
                    userID = cookiesList[i].split('=')[1];
                }
            }

            for(let i = 0; i < cookiesList.length; i++){
                if(cookiesList[i].split('=')[0] == 'userps'){
                    userPW = cookiesList[i].split('=')[1];
                }
            }

            //Descriptografa a senha da sessão e cria objeto com userID e userPW
            userPW = decodeURIComponent(userPW);
            let credenciais = {
                UserID: `${userID}`, 
                UserPW: `${userPW}`
            };

            connection.getConnection(function ConectaBD(err, poolConnection) {

                if(err) console.log('Connection error: ', err);
                else {

                    console.log("Passagem 03: Conexão no banco de dados feita com sucesso.");

                    poolConnection.query(`SELECT id, sessionpw FROM usuarios WHERE id = '${credenciais.UserID}'`, function SelectUsuarioByID (error, result) {
                        if(error) throw error;
                        else {
                            
                            console.log("Passagem 04: Query realizada com sucesso, resultado: " , result.length, result)

                            if(result.length > 0){
                                console.log("Passagem 05: O número de resultados é maior que 1.")
                                return "Achou";
                            } else { 
                                return "Não achou";
                            }
                        }
                    })
                }
            })

        } else {
            console.log("Não existe cookie ou não existe cookie com o nome 'userID'")
            return false; 
        }
    }
}

function ChecaCredenciais(credenciais){
    
}