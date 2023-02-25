const jsonfile = require("jsonfile");

const write = function (obj, name) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(__dirname + `/${name}.json`, obj, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const read = function (name) {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(__dirname + `/${name}.json`, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = { write, read };
