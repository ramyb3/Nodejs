const jsonDAL = require("../DAL/jsonDAL");
const usersDAL = require("../DAL/usersDAL");

// get user from Users file
const checkUser = async function (obj) {
  let data = await usersDAL.users();
  data = data.find((user) => user.Username == obj);
  return data;
};

// add user to Users file
const addUser = async function (obj) {
  const data = await usersDAL.users();

  const user = {
    Username: obj.user,
    Password: obj.psw,
    CreatedDate: obj.date,
    NumOfTransactions: obj.number,
  };

  data.push(user);
  await jsonDAL.write(data, "Users");
};

// delete user from Users file
const deleteUser = async function (obj) {
  const usersArr = await usersDAL.users();
  const data = usersArr.find((user) => user.Username == obj);
  const users = usersArr.filter((user) => user.Username != data.Username);
  await jsonDAL.write({ users }, "Users");
};

// get user's credits from Users file
const credits = async function (obj) {
  const users = await usersDAL.users();
  const name = users.find((user) => user.Username == obj);
  return name.NumOfTransactions;
};

// save/update user to Users file
const updateUser = async function (obj, method) {
  let users = await usersDAL.users();
  const data = users.find(
    (user) => user.Username == obj[method ? "Username" : "previous"]
  );
  users = users.filter((user) => user.Username != data.Username);

  const user = {
    Username: obj[method ? "Username" : "user"],
    Password: obj[method ? "Password" : "psw"],
    CreatedDate: obj[method ? "CreatedDate" : "date"],
    NumOfTransactions: obj[method ? "NumOfTransactions" : "number"],
  };

  users.push(user);
  await jsonDAL.write(users, "Users");
};

module.exports = {
  checkUser,
  addUser,
  deleteUser,
  credits,
  updateUser,
};
