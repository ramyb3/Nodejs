const restDAL = require("../DAL/restDAL");
const jsonDAL = require("../DAL/jsonDAL");

const result = async function (obj) {
  let movie = await jsonDAL.getMovies();
  let rest = await restDAL.getMovies();

  let data = [],
    genre = [];

  for (i = 0; i < rest.length && i < obj.length; i++) {
    data.push(rest.filter((x) => x.id == obj[i]));
  }

  if (movie.length != 0) {
    // check if file NewMovies not empty
    for (i = 0; i < obj.length; i++) {
      data.push(movie.movies.filter((x) => x.id == obj[i]));
    }
  }

  data = data.flat(); // puting all sub-array in the main array
  let temp = data.map((x) => x.genres);

  for (i = 0; i < temp.length; i++) {
    genre.push(temp.slice(i, i + 1));
  }

  genre = genre.flat(1); // puting all sub-array in the main array

  return [data, genre];
};

module.exports = { result };
