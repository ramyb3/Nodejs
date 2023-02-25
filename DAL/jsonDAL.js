const jsonfile = require("jsonfile");

//save movies to NewMovies file
const saveMovie = function (obj) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(
      __dirname + "/NewMovies.json",
      obj,
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

//get movies from NewMovies file
const getMovies = function () {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(__dirname + "/NewMovies.json", function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

//get users from Users file
const getUsers = function () {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(__dirname + "/Users.json", function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

//save users to Users file
const saveUsers = function (obj) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(__dirname + "/Users.json", obj, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

//save banned users to session file
const write = function (obj) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(__dirname + "/session.json", obj, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

//get banned users from session file
const read = function () {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(__dirname + "/session.json", function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = { saveMovie, getMovies, getUsers, saveUsers, write, read };
