const jsonDAL = require("../DAL/jsonDAL");

const users = async function () // get all users from Users file
{
  let user = await jsonDAL.getUsers();

  return user.users;
};

const checkUser = async function (
  obj // get user from Users file
) {
  let user = await jsonDAL.getUsers();

  let data = user.users.find((x) => x.Username == obj);

  return data;
};

const addUser = async function (
  obj // add user to Users file
) {
  let user = await jsonDAL.getUsers();

  let name = obj.user;
  let psw = obj.psw;
  let date = obj.date;
  let num = obj.number;

  let temp = {
    Username: name,
    Password: psw,
    CreatedDate: date,
    NumOfTransactions: num,
  };

  user.users.push(temp);

  await jsonDAL.saveUsers(user);
};

const updateUser = async function (
  obj // update user in Users file
) {
  let user = await jsonDAL.getUsers();

  let data = user.users.find((x) => x.Username == obj.previous);

  let name = obj.user;
  let psw = obj.psw;
  let date = obj.date;
  let num = obj.number;

  let temp = {
    Username: name,
    Password: psw,
    CreatedDate: date,
    NumOfTransactions: num,
  };

  let array = user.users.filter((x) => x.Username != data.Username);

  user = { users: array };

  user.users.push(temp);

  await jsonDAL.saveUsers(user);
};

const deleteUser = async function (
  obj // delete user from Users file
) {
  let user = await jsonDAL.getUsers();

  let data = user.users.find((x) => x.Username == obj);

  let array = user.users.filter((x) => x.Username != data.Username);

  await jsonDAL.saveUsers({ users: array });
};

const credits = async function (
  obj // get user's credits from Users file
) {
  let temp = await users();

  let name = temp.find((x) => x.Username == obj);

  return name.NumOfTransactions;
};

const sessionUser = async function (
  obj // save user to Users file
) {
  let user = await jsonDAL.getUsers();

  let data = user.users.find((x) => x.Username == obj.Username);

  let name = obj.Username;
  let psw = obj.Password;
  let date = obj.CreatedDate;
  let num = obj.NumOfTransactions;

  let temp = {
    Username: name,
    Password: psw,
    CreatedDate: date,
    NumOfTransactions: num,
  };

  let array = user.users.filter((x) => x.Username != data.Username);

  user = { users: array };

  user.users.push(temp);

  await jsonDAL.saveUsers(user);
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
