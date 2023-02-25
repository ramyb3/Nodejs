const restDAL = require("../DAL/restDAL");
const jsonDAL = require("../DAL/jsonDAL");

exports.genre = async function (obj, data) {
  const movie = await jsonDAL.getMovies();
  const rest = await restDAL.getMovies();
  const restGenre = rest.map((x) => x.genres);
  const dataId = data.map((x) => x.id);
  const names = [];
  const id = [];
  let temp;

  let check; //boolean paramter that returns true/false if the genre exist in the movie data
  let movieGenre = 0; // min length of NewMovies file

  // check if file NewMovies not empty
  if (movie.length != 0) {
    movieGenre = movie.movies.map((x) => x.genres);
  }

  for (let k = 0; k < obj.length; k++) {
    temp = [];

    // if there is more than one genre
    if (Array.isArray(obj[k])) {
      for (let j = 0; j < restGenre.length; j++) {
        check = false;

        for (let i = 0; i < obj[k].length; i++) {
          check = restGenre[j].includes(obj[k][i]);

          if (!check) {
            break;
          }

          //because there isn't 17th movie, I improvised a bit
          if (i == obj[k].length - 1 && check) {
            temp.push(j + (j < 16 ? 1 : 2));
          }
        }
      }

      // check if file NewMovies not empty
      if (movie.length != 0) {
        for (let j = 0; j < movieGenre.length; j++) {
          check = false;

          for (i = 0; i < obj[k].length; i++) {
            check = movieGenre[j].includes(obj[k][i]);

            if (!check) {
              break;
            }

            if (i == obj[k].length - 1 && check) {
              temp.push(j + 21); // file NewMovies start with id-21
            }
          }
        }
      }
    } else {
      //if there is only one genre
      for (let i = 0; i < restGenre.length; i++) {
        //because there isn't 17th movie, I improvised a bit
        if (restGenre[i].includes(obj[k])) {
          temp.push(i + (i < 16 ? 1 : 2));
        }
      }

      // check if file NewMovies not empty
      if (movie.length != 0) {
        for (let i = 0; i < movieGenre.length; i++) {
          if (movieGenre[i].includes(obj[k])) {
            temp.push(i + 21); // file NewMovies start with id-21
          }
        }
      }
    }

    id.push(temp);
  }

  for (let i = 0; i < id.length; i++) {
    for (let j = 0; j < data.length; j++) {
      temp = [];

      if (id[i].length > 1 && id[i].includes(dataId[j]) && i == j) {
        for (let k = 0; k < id[i].length; k++) {
          // get movies from REST API or from NewMovies file
          if (id[i][k] != dataId[j]) {
            temp.push(
              (id[i][k] < 21 ? rest : movie.movies).find(
                (x) => x.id == id[i][k]
              )
            );
          }
        }
      }
      if (temp.length > 0) {
        names.push({ id: dataId[j], data: temp });
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
