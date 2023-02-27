const jsonDAL = require("./jsonDAL");

// get all users from Users file
exports.users = async function () {
  const data = await jsonDAL.read("Users");
  return data;
};
