const jsonDAL = require("../DAL/jsonDAL");

exports.login = async function (obj) {
  let data = await jsonDAL.read("Users");

  //get user
  data = data.find(
    (user) => user.Username == obj.user && user.Password == obj.psw
  );

  if (data) {
    if (data.Username == "Admin") {
      // admin
      return [1, data.Username];
    }
    if (data.NumOfTransactions > 0) {
      // user with credits
      return [2, data.Username];
    }
    if (data.NumOfTransactions == 0) {
      // user without credits
      return [3, data.Username];
    }
  } else {
    // user or password incorrect
    return [0, 0];
  }
};
