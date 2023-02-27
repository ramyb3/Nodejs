const moviesDAL = require("../DAL/moviesDAL");
const jsonDAL = require("../DAL/jsonDAL");

exports.movies = async function (obj) {
  const movie = await jsonDAL.read("NewMovies");
  let id, data;

  // in the beginning of the project need to write "[]" in NewMovies file
  if (movie.length == 0) {
    const rest = await moviesDAL.getMovies();
    id = rest.length + 2; // there isn't 17th movie - so I skipped this movie for good coding
  } else {
    const lastMovieId = movie.movies[movie.movies.length - 1].id;
    id = lastMovieId + 1;
  }

  obj = { id, name: obj.name, language: obj.lng, genres: obj.genres };

  if (movie.length == 0) {
    data = { movies: [obj] };
  } else {
    movie.movies.push(obj);
    data = { movies: movie.movies };
  }

  await jsonDAL.write(data, "NewMovies");
};
