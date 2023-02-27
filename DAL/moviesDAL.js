const axios = require("axios");

async function getMovies() {
  const resp = await axios.get("https://api.tvmaze.com/shows");
  return resp.data.filter((movie) => movie.id < 21); // 20 first movies from 250
}

function moreThanOneGenre(method, array, obj) {
  let check = false; //checks if the genre exist in the movie data
  const arr = [];

  for (let j = 0; j < array.length; j++) {
    for (let i = 0; i < obj.length; i++) {
      check = array[j].includes(obj[i]);

      if (!check) {
        break;
      }
      if (i == obj.length - 1 && check) {
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
}

function oneGenre(method, array, obj) {
  const arr = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i].includes(obj)) {
      if (method) {
        //because there isn't 17th movie, I improvised a bit
        arr.push(i + (i < 16 ? 1 : 2));
      } else {
        arr.push(i + 21); // file NewMovies start with id-21
      }
    }
  }

  return arr;
}

module.exports = { getMovies, moreThanOneGenre, oneGenre };
