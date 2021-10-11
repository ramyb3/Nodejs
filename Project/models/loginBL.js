const jsonDAL = require('../DAL/jsonDAL');

const login = async function(obj)
{
    let user= await jsonDAL.getUsers();

    let data= user.users.find(x=> x.Username==obj.user && x.Password==obj.psw); //get user
    
    if(data==undefined) // user or password incorrect
    return [0, 0];

    if(data.Username=="Admin") // admin
    return [1, data.Username];

    if(data!=undefined)
    {
        if(data.NumOfTransactions>0) // user with credits
        return [2, data.Username]; 

        if(data.NumOfTransactions==0) // user without credits
        return [3, data.Username]; 
    }
}

module.exports = {login};