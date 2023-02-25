const jsonDAL = require("../DAL/jsonDAL");

// get all users from Users file
const users = async function () {
  const data = await jsonDAL.getUsers();
  return data.users;
};

// get user from Users file
const checkUser = async function (obj) {
  let data = await jsonDAL.getUsers();
  data = data.users.find((x) => x.Username == obj);
  return data;
};

// add user to Users file
const addUser = async function (obj) {
  const data = await jsonDAL.getUsers();

  const user = {
    Username: obj.user,
    Password: obj.psw,
    CreatedDate: obj.date,
    NumOfTransactions: obj.number,
  };

  data.users.push(user);
  await jsonDAL.saveUsers(data);
};

// update user in Users file
const updateUser = async function (obj) {
  let usersArr = await jsonDAL.getUsers();
  const data = usersArr.users.find((x) => x.Username == obj.previous);
  const users = usersArr.users.filter((x) => x.Username != data.Username);

  const user = {
    Username: obj.user,
    Password: obj.psw,
    CreatedDate: obj.date,
    NumOfTransactions: obj.number,
  };

  usersArr = { users };
  usersArr.users.push(user);
  await jsonDAL.saveUsers(usersArr);
};

// delete user from Users file
const deleteUser = async function (obj) {
  const usersArr = await jsonDAL.getUsers();
  const data = usersArr.users.find((x) => x.Username == obj);
  const users = usersArr.users.filter((x) => x.Username != data.Username);
  await jsonDAL.saveUsers({ users });
};

// get user's credits from Users file
const credits = async function (obj) {
  const users = await users();
  const name = users.find((x) => x.Username == obj);
  return name.NumOfTransactions;
};

// save user to Users file
const sessionUser = async function (obj) {
  let usersArr = await jsonDAL.getUsers();
  const data = usersArr.users.find((x) => x.Username == obj.Username);
  const users = usersArr.users.filter((x) => x.Username != data.Username);

  const user = {
    Username: obj.Username,
    Password: obj.Password,
    CreatedDate: obj.CreatedDate,
    NumOfTransactions: obj.NumOfTransactions,
  };

  usersArr = { users };
  usersArr.users.push(user);
  await jsonDAL.saveUsers(usersArr);
};

module.exports = {
  users,
  checkUser,
  addUser,
  updateUser,
  deleteUser,
  credits,
  sessionUser,
};
