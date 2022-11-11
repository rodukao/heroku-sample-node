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
            
            return ConectaDB(credenciais);
            
        } else {
            console.log("Não existe cookie ou não existe cookie com o nome 'userID'")
            return false; 
        }
    },

    ChecaCookies: function(req){
        return (req.headers.cookie && req.headers.cookie.includes("userID"));
    },

    ListaCookiesKeys: function(req){
        if(req.headers.cookie){

            let cookies = req.headers.cookie;
            let cookiesList = cookies.split(';').map(item => item.trim());
            let cookiesKeys = []

            for(let i = 0; i < cookiesList.length; i++){
                cookiesKeys.push(cookiesList[i].split('=')[0]);
            }

            return cookiesKeys;

        } else {
            return;
        }
    }
}