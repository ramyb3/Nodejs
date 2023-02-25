const restDAL = require("../DAL/restDAL");
const jsonDAL = require("../DAL/jsonDAL");

exports.genre = async function (obj, data) {
  const movie = await jsonDAL.getMovies();
  const rest = await restDAL.getMovies();
  const restGenre = rest.map((x) => x.genres);
  let id = [],
    names = [],
    temp;

  let check; //boolean paramter that returns true/false if the genre exist in the movie data
  let movieGenre = 0; // min length of NewMovies file

  // check if file NewMovies not empty
  if (movie.length != 0) {
    movieGenre = movie.movies.map((x) => x.genres);
  }

  for (k = 0; k < obj.length; k++) {
    temp = [];

    if (Array.isArray(obj[k])) {
      // if there is more than one genre
      for (j = 0; j < restGenre.length; j++) {
        check = false;

        for (i = 0; i < obj[k].length; i++) {
          check = restGenre[j].includes(obj[k][i]);

          if (check == false) break;

          if (i == obj[k].length - 1 && check == true) {
            //because there isn't 17th movie, i improvised a little

            if (j < 16) {
              temp.push(j + 1);
            }

            if (j >= 16) {
              temp.push(j + 2);
            }
          }
        }
      }

      if (movie.length != 0) {
        // check if file NewMovies not empty
        for (j = 0; j < movieGenre.length; j++) {
          check = false;

          for (i = 0; i < obj[k].length; i++) {
            check = movieGenre[j].includes(obj[k][i]);

            if (check == false) break;

            if (i == obj[k].length - 1 && check == true) {
              temp.push(j + 21); // file NewMovies start with id-21
            }
          }
        }
      }
    } //if there is only one genre
    else {
      for (i = 0; i < restGenre.length; i++) {
        if (restGenre[i].includes(obj[k])) {
          //because there isn't 17th movie, i improvised a little

          if (i < 16) {
            temp.push(i + 1);
          }

          if (i >= 16) {
            temp.push(i + 2);
          }
        }
      }

      if (movie.length != 0) {
        // check if file NewMovies not empty
        for (i = 0; i < movieGenre.length; i++) {
          if (movieGenre[i].includes(obj[k])) {
            temp.push(i + 21); // file NewMovies start with id-21
          }
        }
      }
    }

    id.push(temp);
  }

  let dataId = data.map((x) => x.id);

  for (i = 0; i < id.length; i++) {
    for (j = 0; j < data.length; j++) {
      temp = [];

      if (id[i].length > 1 && id[i].includes(dataId[j]) && i == j) {
        for (k = 0; k < id[i].length; k++) {
          if (id[i][k] != dataId[j]) {
            if (id[i][k] < 21) {
              // get movies from REST API
              temp.push(rest.find((x) => x.id == id[i][k]));
            }

            if (id[i][k] > 20) {
              // get movies from NewMovies file
              temp.push(movie.movies.find((x) => x.id == id[i][k]));
            }
          }
        }
      }

      if (temp.length != 0) {
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
