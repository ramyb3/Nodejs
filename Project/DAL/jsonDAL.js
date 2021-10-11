const jsonfile = require('jsonfile');

exports.saveMovie = function(obj) //save movies to NewMovies file
{
    return new Promise((resolve,reject) =>
    {
        jsonfile.writeFile(__dirname + "/NewMovies.json",obj,function(err,data)
        {
            if(err)
            {   
                reject(err);
            }
            
            else
            {
                resolve(data);
            }
        })
    })
}

exports.getMovies = function() //get movies from NewMovies file
{
    return new Promise((resolve,reject) =>
    {
        jsonfile.readFile(__dirname + "/NewMovies.json",function(err,data)
        {
            if(err)
            {
                reject(err);
            }
            
            else
            {
                resolve(data);
            }
        })
    })
}

exports.getUsers = function() //get users from Users file
{
    return new Promise((resolve,reject) =>
    {
        jsonfile.readFile(__dirname + "/Users.json",function(err,data)
        {
            if(err)
            {
                reject(err);
            }
            
            else
            {
                resolve(data);
            }
        })
    })
}

exports.saveUsers = function(obj) //save users to Users file
{
    return new Promise((resolve,reject) =>
    {
        jsonfile.writeFile(__dirname + "/Users.json",obj,function(err,data)
        {
            if(err)
            {   
                reject(err);
            }
            
            else
            {
                resolve(data);
            }
        })
    })
}

exports.write = function(obj) //save banned users to session file
{
    return new Promise((resolve,reject) =>
    {
        jsonfile.writeFile(__dirname + "/session.json",obj,function(err,data)
        {
            if(err)
            {   
                reject(err);
            }
            
            else
            {
                resolve(data);
            }
        })
    })
}

exports.read = function() //get banned users from session file
{
    return new Promise((resolve,reject) =>
    {
        jsonfile.readFile(__dirname + "/session.json",function(err,data)
        {
            if(err)
            {
                reject(err);
            }
            
            else
            {
                resolve(data);
            }
        })
    })
}