const restDAL = require("../DAL/restDAL");
const jsonDAL = require("../DAL/jsonDAL");

exports.search = async function (obj) {
  const movie = await jsonDAL.read("NewMovies");
  const rest = await restDAL.getMovies();
  const arr1 = name(movie, rest, obj);
  const arr2 = language(movie, rest, obj);
  const arr3 = genre(movie, rest, obj);
  let arr = [];

  // there are 7 cases of search
  if (obj.name != "" && obj.lng != "" && obj.genres) {
    arr = removeDuplicates(removeDuplicates(arr1, arr2), arr3);
  } else if (obj.name != "" && obj.lng != "" && !obj.genres) {
    arr = removeDuplicates(arr1, arr2);
  } else if (obj.name != "" && obj.lng == "" && obj.genres) {
    arr = removeDuplicates(arr1, arr3);
  } else if (obj.name == "" && obj.lng != "" && obj.genres) {
    arr = removeDuplicates(arr2, arr3);
  } else if (obj.name != "" && obj.lng == "" && !obj.genres) {
    arr = arr1;
  } else if (obj.name == "" && obj.lng != "" && !obj.genres) {
    arr = arr2;
  } else if (obj.name == "" && obj.lng == "" && obj.genres) {
    arr = arr3;
  }

  return arr;
};

function removeDuplicates(arr1, arr2) {
  return arr1.filter((data) => arr2.includes(data));
}

function name(movie, rest, obj) {
  let arr = rest.map((data) => data.name);
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
    arr = movie.movies.map((data) => data.name);

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
  let arr = rest.filter((data) => data.language == obj.lng);
  rest = [];
  rest.push(arr.map((data) => data.id));

  // check if file newMovies not empty
  if (movie.length != 0) {
    arr = movie.movies.filter((data) => data.language == obj.lng);
    rest.push(arr.map((data) => data.id));
  }

  return rest.flat(); // puting all sub-array in the main array
}

function genre(movie, rest, obj) {
  let movieGenre = 0; // min length of NewMovies file
  const restGenre = rest.map((data) => data.genres);
  rest = [];

  // check if file NewMovies not empty
  if (movie.length != 0) {
    movieGenre = movie.movies.map((data) => data.genres);
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
