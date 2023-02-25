const restDAL = require("../DAL/restDAL");
const jsonDAL = require("../DAL/jsonDAL");

exports.search = async function (obj) {
  const movie = await jsonDAL.getMovies();
  const rest = await restDAL.getMovies();
  let id = [], id1, id2, id3;

  // 7 cases of search

  if (obj.name != "" && obj.lng != "" && obj.genres) {
    id1 = name(movie, rest, obj);
    id2 = language(movie, rest, obj);
    id3 = genre(movie, rest, obj);

    id = id1.filter((x) => id2.includes(x) && id3.includes(x)); // intersection between 3 searches
  } else if (obj.name != "" && obj.lng != "" && !obj.genres) {
    id1 = name(movie, rest, obj);
    id2 = language(movie, rest, obj);

    id = id1.filter((x) => id2.includes(x)); // intersection between 2 searches
  } else if (obj.name != "" && obj.lng == "" && obj.genres) {
    id1 = name(movie, rest, obj);
    id2 = genre(movie, rest, obj);

    id = id1.filter((x) => id2.includes(x)); // intersection between 2 searches
  } else if (obj.name == "" && obj.lng != "" && obj.genres) {
    id1 = language(movie, rest, obj);
    id2 = genre(movie, rest, obj);

    id = id1.filter((x) => id2.includes(x)); // intersection between 2 searches
  } else if (obj.name != "" && obj.lng == "" && !obj.genres) {
    id = name(movie, rest, obj);
  } else if (obj.name == "" && obj.lng != "" && !obj.genres) {
    id = language(movie, rest, obj);
  } else if (obj.name == "" && obj.lng == "" && obj.genres) {
    id = genre(movie, rest, obj);
  }

  return id;
};

function name(movie, rest, obj) {
  let arr = rest.map((x) => x.name);
  rest = [];

  for (let i = 0; i < arr.length; i++) {
    //check all letters
    if (arr[i].toLowerCase().includes(obj.name.toLowerCase())) {
      //because there isn't 17th movie, I improvised a bit
      rest.push(i + (i < 16 ? 1 : 2));
    }
  }

  // check if file NewMovies not empty
  if (movie.length != 0) {
    arr = movie.movies.map((x) => x.name);

    for (let i = 0; i < arr.length; i++) {
      //check all letters
      if (arr[i].toLowerCase().includes(obj.name.toLowerCase())) {
        rest.push(i + 21); // file NewMovies start with id-21
      }
    }
  }

  return rest;
}

function language(movie, rest, obj) {
  let arr = rest.filter((x) => x.language == obj.lng);
  rest = [];
  rest.push(arr.map((x) => x.id));

  // check if file newMovies not empty
  if (movie.length != 0) {
    arr = movie.movies.filter((x) => x.language == obj.lng);
    rest.push(arr.map((x) => x.id));
  }

  return rest.flat(); // puting all sub-array in the main array
}

function genre(movie, rest, obj) {
  let movieGenre = 0; // min length of NewMovies file
  const restGenre = rest.map((x) => x.genres);
  rest = [];

  // check if file NewMovies not empty
  if (movie.length != 0) {
    movieGenre = movie.movies.map((x) => x.genres);
  }

  // if there is more than one genre
  if (Array.isArray(obj.genres)) {
    let check = false; //checks if the genre exist in the movie data

    for (let j = 0; j < restGenre.length; j++) {
      for (let i = 0; i < obj.genres.length; i++) {
        check = restGenre[j].includes(obj.genres[i]);

        if (!check) {
          break;
        }

        if (i == obj.genres.length - 1 && check) {
          //because there isn't 17th movie, I improvised a bit
          rest.push(j + (j < 16 ? 1 : 2));
        }
      }
    }

    // check if file NewMovies not empty
    if (movie.length != 0) {
      for (let j = 0; j < movieGenre.length; j++) {
        for (let i = 0; i < obj.genres.length; i++) {
          check = movieGenre[j].includes(obj.genres[i]);

          if (!check) {
            break;
          }

          if (i == obj.genres.length - 1 && check) {
            rest.push(j + 21); // file NewMovies start with id-21
          }
        }
      }
    }
  } else {
    //if there is only one genre
    for (let i = 0; i < restGenre.length; i++) {
      if (restGenre[i].includes(obj.genres)) {
        //because there isn't 17th movie, I improvised a bit
        rest.push(i + (i < 16 ? 1 : 2));
      }
    }

    // check if file NewMovies not empty
    if (movie.length != 0) {
      for (let i = 0; i < movieGenre.length; i++) {
        if (movieGenre[i].includes(obj.genres)) {
          rest.push(i + 21); // file NewMovies start with id-21
        }
      }
    }
  }

  return rest;
}
