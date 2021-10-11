const restDAL = require('../DAL/restDAL');
const jsonDAL = require('../DAL/jsonDAL');

const movies = async function(obj)
{   
    let movie= await jsonDAL.getMovies();
    
    let id, data;

    if (movie.length==0) // in the beginning of the project need to write "[]" in NewMovies file
    {
        let rest = await restDAL.getMovies();

        id= rest.length+2; // there isn't 17th movie - so i skipped this movie for good coding   
    }
    
    else
    {
        let lastMovieId= movie.movies[movie.movies.length-1].id;
        id= lastMovieId+1;
    }
    
    let name= obj.name;
    let language= obj.lng;
    let genres= obj.genres;
    let temp={id: id, name: name, language: language, genres: genres};

    if (movie.length==0)
    {
        data={movies: [temp]};
        
        await jsonDAL.saveMovie(data);
    }

    else
    {
        movie.movies.push(temp);
        data={movies: movie.movies};

        await jsonDAL.saveMovie(data);
    }  
}

module.exports = {movies};