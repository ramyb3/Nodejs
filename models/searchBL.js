const restDAL = require("../DAL/restDAL");
const jsonDAL = require("../DAL/jsonDAL");

const search = async function (obj) {
  let movie = await jsonDAL.getMovies();
  let rest = await restDAL.getMovies();

  let func = false; // check cases
  let id = [];
  let id1, id2, id3;

  // 7 cases of search

  if (obj.name != "" && obj.lng != "" && obj.genres != undefined) {
    func = true;

    id1 = name(movie, rest, obj, id);
    id = [];

    id2 = language(movie, rest, obj, id);
    id = [];

    id3 = genre(movie, rest, obj, id);
    id = [];

    id = id1.filter((x) => id2.includes(x) && id3.includes(x)); // intersection between 3 searches
  }

  if (
    obj.name != "" &&
    obj.lng != "" &&
    obj.genres == undefined &&
    func == false
  ) {
    func = true;

    id1 = name(movie, rest, obj, id);
    id = [];

    id2 = language(movie, rest, obj, id);
    id = [];

    id = id1.filter((x) => id2.includes(x)); // intersection between 2 searches
  }

  if (
    obj.name != "" &&
    obj.lng == "" &&
    obj.genres != undefined &&
    func == false
  ) {
    func = true;

    id1 = name(movie, rest, obj, id);
    id = [];

    id2 = genre(movie, rest, obj, id);
    id = [];

    id = id1.filter((x) => id2.includes(x)); // intersection between 2 searches
  }

  if (
    obj.name == "" &&
    obj.lng != "" &&
    obj.genres != undefined &&
    func == false
  ) {
    func = true;

    id1 = language(movie, rest, obj, id);
    id = [];

    id2 = genre(movie, rest, obj, id);
    id = [];

    id = id1.filter((x) => id2.includes(x)); // intersection between 2 searches
  }

  if (
    obj.name != "" &&
    obj.lng == "" &&
    obj.genres == undefined &&
    func == false
  ) {
    func = true;

    id = name(movie, rest, obj, id);
  }

  if (
    obj.name == "" &&
    obj.lng != "" &&
    obj.genres == undefined &&
    func == false
  ) {
    func = true;

    id = language(movie, rest, obj, id);
  }

  if (
    obj.name == "" &&
    obj.lng == "" &&
    obj.genres != undefined &&
    func == false
  ) {
    id = genre(movie, rest, obj, id);
  }

  return id;
};

function name(movie, rest, obj, id) {
  let restNames = rest.map((x) => x.name);

  for (i = 0; i < restNames.length; i++) {
    if (restNames[i].toLowerCase().includes(obj.name.toLowerCase())) {
      //check all letters
      //because there isn't 17th movie, i improvised a little

      if (i < 16) {
        id.push(i + 1);
      }

      if (i >= 16) {
        id.push(i + 2);
      }
    }
  }

  if (movie.length != 0) {
    // check if file NewMovies not empty
    let movieNames = movie.movies.map((x) => x.name);

    for (i = 0; i < movieNames.length; i++) {
      if (movieNames[i].toLowerCase().includes(obj.name.toLowerCase())) {
        //check all letters
        id.push(i + 21); // file NewMovies start with id-21
      }
    }
  }

  return id;
}

function language(movie, rest, obj, id) {
  let restLng = rest.filter((x) => x.language == obj.lng);
  let restId = restLng.map((x) => x.id);

  id.push(restId);

  if (movie.length != 0) {
    // check if file newMovies not empty
    let movieLng = movie.movies.filter((x) => x.language == obj.lng);
    let movieId = movieLng.map((x) => x.id);

    id.push(movieId);
  }

  id = id.flat(); // puting all sub-array in the main array

  return id;
}

function genre(movie, rest, obj, id) {
  let movieGenre = 0; // min length of NewMovies file
  let restGenre = rest.map((x) => x.genres);

  if (movie.length != 0) {
    // check if file NewMovies not empty
    movieGenre = movie.movies.map((x) => x.genres);
  }

  if (Array.isArray(obj.genres)) {
    // if there is more than one genre
    let check; //boolean paramter that returns true/false if the genre exist in the movie data

    for (j = 0; j < restGenre.length; j++) {
      check = false;

      for (i = 0; i < obj.genres.length; i++) {
        check = restGenre[j].includes(obj.genres[i]);

        if (check == false) break;

        if (i == obj.genres.length - 1 && check == true) {
          //because there isn't 17th movie, i improvised a little

          if (j < 16) {
            id.push(j + 1);
          }

          if (j >= 16) {
            id.push(j + 2);
          }
        }
      }
    }

    if (movie.length != 0) {
      // check if file NewMovies not empty
      for (j = 0; j < movieGenre.length; j++) {
        check = false;

        for (i = 0; i < obj.genres.length; i++) {
          check = movieGenre[j].includes(obj.genres[i]);

          if (check == false) break;

          if (i == obj.genres.length - 1 && check == true) {
            id.push(j + 21); // file NewMovies start with id-21
          }
        }
      }
    }
  } //if there is only one genre
  else {
    for (i = 0; i < restGenre.length; i++) {
      if (restGenre[i].includes(obj.genres)) {
        //because there isn't 17th movie, i improvised a little

        if (i < 16) {
          id.push(i + 1);
        }

        if (i >= 16) {
          id.push(i + 2);
        }
      }
    }

    if (movie.length != 0) {
      // check if file NewMovies not empty
      for (i = 0; i < movieGenre.length; i++) {
        if (movieGenre[i].includes(obj.genres)) {
          id.push(i + 21); // file NewMovies start with id-21
        }
      }
    }
  }

  return id;
}

module.exports = { search };
