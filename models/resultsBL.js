const moviesDAL = require("../DAL/moviesDAL");
const jsonDAL = require("../DAL/jsonDAL");

exports.result = async function (obj) {
  const movie = await jsonDAL.read("NewMovies");
  let rest = await moviesDAL.getMovies();
  let data = [],
    genre = [];

  for (let i = 0; i < rest.length && i < obj.length; i++) {
    data.push(rest.filter((movieData) => movieData.id == obj[i]));
  }

  // check if file NewMovies not empty
  if (movie.length != 0) {
    for (let i = 0; i < obj.length; i++) {
      data.push(movie.movies.filter((movieData) => movieData.id == obj[i]));
    }
  }

  data = data.flat(); // puting all sub-array in the main array
  rest = data.map((movieData) => movieData.genres);

  for (let i = 0; i < rest.length; i++) {
    genre.push(rest.slice(i, i + 1));
  }

  genre = genre.flat(1); // puting all sub-array in the main array

  return [data, genre];
};
