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

  const moreThanOneGenre = (method, array, object) => {
    let check = false; //checks if the genre exist in the movie data
    const arr = [];

    for (let j = 0; j < array.length; j++) {
      for (let i = 0; i < object.length; i++) {
        check = array[j].includes(object[i]);

        if (!check) {
          break;
        }
        if (i == object.length - 1 && check) {
          if (method) {
            //because there isn't 17th movie, I improvised a bit
            arr.push(j + (j < 16 ? 1 : 2));
          } else {
            arr.push(j + 21); // file NewMovies start with id-21
          }
        }
      }
    }

    return arr;
  };

  const oneGenre = (method, array, object) => {
    const arr = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i].includes(object)) {
        if (method) {
          //because there isn't 17th movie, I improvised a bit
          arr.push(i + (i < 16 ? 1 : 2));
        } else {
          arr.push(i + 21); // file NewMovies start with id-21
        }
      }
    }

    return arr;
  };

  // check if file NewMovies not empty
  if (movie.length != 0) {
    movieGenre = movie.movies.map((movieData) => movieData.genres);
  }

  for (let i = 0; i < obj.length; i++) {
    const arr = [];

    if (Array.isArray(obj[i])) {
      arr.push(moreThanOneGenre(true, restGenre, obj[i]));

      // check if file NewMovies not empty
      if (movie.length != 0) {
        arr.push(moreThanOneGenre(false, movieGenre, obj[i]));
      }
    } else {
      arr.push(oneGenre(true, restGenre, obj[i]));

      // check if file NewMovies not empty
      if (movie.length != 0) {
        arr.push(oneGenre(false, movieGenre, obj[i]));
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
