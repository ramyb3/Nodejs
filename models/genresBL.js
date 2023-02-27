const moviesDAL = require("../DAL/moviesDAL");
const jsonDAL = require("../DAL/jsonDAL");

exports.genre = async function (obj, data) {
  const movie = await jsonDAL.read("NewMovies");
  const rest = await moviesDAL.getMovies();
  const restGenre = rest.map((movieData) => movieData.genres);
  const dataId = data.map((movieData) => movieData.id);
  const names = [],
    id = [];
  let movieGenre = 0; // min length of NewMovies file

  // check if file NewMovies not empty
  if (movie.length != 0) {
    movieGenre = movie.movies.map((movieData) => movieData.genres);
  }

  for (let i = 0; i < obj.length; i++) {
    const arr = [];

    if (Array.isArray(obj[i])) {
      arr.push(moviesDAL.moreThanOneGenre(true, restGenre, obj[i]));

      // check if file NewMovies not empty
      if (movie.length != 0) {
        arr.push(moviesDAL.moreThanOneGenre(false, movieGenre, obj[i]));
      }
    } else {
      arr.push(moviesDAL.oneGenre(true, restGenre, obj[i]));

      // check if file NewMovies not empty
      if (movie.length != 0) {
        arr.push(moviesDAL.oneGenre(false, movieGenre, obj[i]));
      }
    }

    id.push(arr.flat(2));
  }

  for (let i = 0; i < id.length; i++) {
    for (let j = 0; j < data.length; j++) {
      const arr = [];

      if (id[i].length > 1 && id[i].includes(dataId[j]) && i == j) {
        for (let k = 0; k < id[i].length; k++) {
          // get movies from REST API or from NewMovies file
          if (id[i][k] != dataId[j]) {
            arr.push(
              (id[i][k] < 21 ? rest : movie.movies).find(
                (movieData) => movieData.id == id[i][k]
              )
            );
          }
        }
      }
      if (arr.length > 0) {
        names.push({ id: dataId[j], data: arr });
      }
      if (id[i].length == 1 && id[i] == dataId[j]) {
        names.push({
          id: id[i][0],
          data: "There isn't another movie with the same genre!",
        });
      }
    }
  }

  return names;
};
