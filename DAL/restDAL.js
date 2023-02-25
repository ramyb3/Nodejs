const axios = require("axios");

exports.getMovies = async function () {
  const resp = await axios.get("https://api.tvmaze.com/shows");
  return resp.data.filter((movie) => movie.id < 21); // 20 first movies from 250
};
