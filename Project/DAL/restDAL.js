const axios = require('axios');

exports.getMovies = async function()
{
    let resp = await axios.get("https://api.tvmaze.com/shows");
    
    let movies= resp.data.filter(x=> x.id<21 ); // 20 first movies from 250 

    return movies;
}