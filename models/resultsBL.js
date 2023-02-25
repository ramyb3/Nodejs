const restDAL = require("../DAL/restDAL");
const jsonDAL = require("../DAL/jsonDAL");

exports.result = async function (obj) {
  const movie = await jsonDAL.getMovies();
  const rest = await restDAL.getMovies();
  let data = [],
    genre = [];

  for (let i = 0; i < rest.length && i < obj.length; i++) {
    data.push(rest.filter((x) => x.id == obj[i]));
  }

  // check if file NewMovies not empty
  if (movie.length != 0) {
    for (let i = 0; i < obj.length; i++) {
      data.push(movie.movies.filter((x) => x.id == obj[i]));
    }
  }

  data = data.flat(); // puting all sub-array in the main array
  let arr = data.map((x) => x.genres);

  for (let i = 0; i < arr.length; i++) {
    genre.push(arr.slice(i, i + 1));
  }

  genre = genre.flat(1); // puting all sub-array in the main array

  return [data, genre];
};
