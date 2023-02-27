const moviesDAL = require("../DAL/moviesDAL");
const jsonDAL = require("../DAL/jsonDAL");

exports.search = async function (obj) {
  const movie = await jsonDAL.read("NewMovies");
  const rest = await moviesDAL.getMovies();
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

  rest.push(checkLetters(true, arr, obj));

  // check if file NewMovies not empty
  if (movie.length != 0) {
    arr = movie.movies.map((data) => data.name);
    rest.push(checkLetters(false, arr, obj));
  }

  return rest.flat(2);
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

  if (Array.isArray(obj.genres)) {
    rest.push(moviesDAL.moreThanOneGenre(true, restGenre, obj.genres));

    // check if file NewMovies not empty
    if (movie.length != 0) {
      rest.push(moviesDAL.moreThanOneGenre(false, movieGenre, obj.genres));
    }
  } else {
    rest.push(moviesDAL.oneGenre(true, restGenre, obj.genres));

    // check if file NewMovies not empty
    if (movie.length != 0) {
      rest.push(moviesDAL.oneGenre(false, movieGenre, obj.genres));
    }
  }

  return rest.flat(2);
}

function checkLetters(method, arr, obj) {
  const array = [];

  for (let i = 0; i < arr.length; i++) {
    //check all letters
    if (arr[i].toLowerCase().includes(obj.name.toLowerCase())) {
      if (method) {
        //because there isn't 17th movie, I improvised a bit
        array.push(i + (i < 16 ? 1 : 2));
      } else {
        array.push(i + 21); // file NewMovies start with id-21
      }
    }
  }

  return array;
}
