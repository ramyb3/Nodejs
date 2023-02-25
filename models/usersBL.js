const jsonDAL = require("../DAL/jsonDAL");

// get all users from Users file
const users = async function () {
  const data = await jsonDAL.read("Users");
  return data.users;
};

// get user from Users file
const checkUser = async function (obj) {
  let data = await users();
  data = data.find((user) => user.Username == obj);
  return data;
};

// add user to Users file
const addUser = async function (obj) {
  const data = await users();

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
  const usersArr = await users();
  const data = usersArr.find((user) => user.Username == obj);
  const users = usersArr.filter((user) => user.Username != data.Username);
  await jsonDAL.write({ users }, "Users");
};

// get user's credits from Users file
const credits = async function (obj) {
  const users = await users();
  const name = users.find((user) => user.Username == obj);
  return name.NumOfTransactions;
};

// save/update user to Users file
const updateUser = async function (obj, method) {
  let usersArr = await jsonDAL.read("Users");
  const data = usersArr.users.find(
    (user) => user.Username == obj[method ? "Username" : "previous"]
  );
  const users = usersArr.users.filter((user) => user.Username != data.Username);

  const user = {
    Username: obj[method ? "Username" : "user"],
    Password: obj[method ? "Password" : "psw"],
    CreatedDate: obj[method ? "CreatedDate" : "date"],
    NumOfTransactions: obj[method ? "NumOfTransactions" : "number"],
  };

  usersArr = { users };
  usersArr.users.push(user);
  await jsonDAL.write(usersArr, "Users");
};

module.exports = {
  users,
  checkUser,
  addUser,
  deleteUser,
  credits,
  updateUser,
};
