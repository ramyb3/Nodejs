const restDAL = require("../DAL/restDAL");
const jsonDAL = require("../DAL/jsonDAL");

exports.genre = async function (obj, data) {
  const movie = await jsonDAL.read("NewMovies");
  const rest = await restDAL.getMovies();
  const restGenre = rest.map((movieData) => movieData.genres);
  const dataId = data.map((movieData) => movieData.id);
  const names = [],
    id = [];
  let movieGenre = 0; // min length of NewMovies file

  // check if file NewMovies not empty
  if (movie.length != 0) {
    movieGenre = movie.movies.map((movieData) => movieData.genres);
  }

  for (let k = 0; k < obj.length; k++) {
    let check = false; //checks if the genre exist in the movie data
    const arr = [];

    // if there is more than one genre
    if (Array.isArray(obj[k])) {
      for (let j = 0; j < restGenre.length; j++) {
        for (let i = 0; i < obj[k].length; i++) {
          check = restGenre[j].includes(obj[k][i]);

          if (!check) {
            break;
          }

          //because there isn't 17th movie, I improvised a bit
          if (i == obj[k].length - 1 && check) {
            arr.push(j + (j < 16 ? 1 : 2));
          }
        }
      }

      // check if file NewMovies not empty
      if (movie.length != 0) {
        for (let j = 0; j < movieGenre.length; j++) {
          for (i = 0; i < obj[k].length; i++) {
            check = movieGenre[j].includes(obj[k][i]);

            if (!check) {
              break;
            }
            if (i == obj[k].length - 1 && check) {
              arr.push(j + 21); // file NewMovies start with id-21
            }
          }
        }
      }
    } else {
      //if there is only one genre
      for (let i = 0; i < restGenre.length; i++) {
        //because there isn't 17th movie, I improvised a bit
        if (restGenre[i].includes(obj[k])) {
          arr.push(i + (i < 16 ? 1 : 2));
        }
      }

      // check if file NewMovies not empty
      if (movie.length != 0) {
        for (let i = 0; i < movieGenre.length; i++) {
          if (movieGenre[i].includes(obj[k])) {
            arr.push(i + 21); // file NewMovies start with id-21
          }
        }
      }
    }

    id.push(arr);
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
