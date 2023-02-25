const jsonDAL = require("../DAL/jsonDAL");

//add banned user to session file
const sessions = async function (obj) {
  const session = await jsonDAL.read("session");

  // in the beginning of the project need to write "[]" in session file
  if (session.length == 0) {
    await jsonDAL.write([obj], "session");
  } else {
    session.push(obj);
    await jsonDAL.write(session, "session");
  }
};

//delete banned user from session file
const empty = async function (name) {
  const session = await jsonDAL.read("session");
  let data;

  if (session.length == 1) {
    data = session.find((user) => user.name == name);

    if (data) {
      await jsonDAL.write([], "session");
    }
  } else {
    data = session.find((user) => user.name == name);

    if (data) {
      let array = session.filter((user) => user.name != data.name);
      await jsonDAL.write(array, "session");
    }
  }
};

//update banned user in session file
const update = async function (obj) {
  const session = await jsonDAL.read("session");
  const time = new Date(Date.now());
  let data;

  if (obj.previous == obj.user && Number(obj.number) == 0) {
    // check if need to update credits to 0 or not
    data = session.find((user) => user.name == obj.user);

    // update credits to 0
    if (!data) {
      sessions({ name: obj.user, time });
    }
  } else if (obj.previous == obj.user && Number(obj.number) > 0) {
    // only update credits
    empty(obj.user);
  } else if (obj.previous != obj.user && Number(obj.number) == 0) {
    // only update name
    if (session.length == 1) {
      data = session.find((user) => user.name == obj.previous);

      if (data) {
        await jsonDAL.write([{ name: obj.user, time: data.time }], "session");
      } else {
        sessions({ name: obj.user, time });
      }
    } else {
      data = session.find((user) => user.name == obj.previous);

      if (data) {
        let array = session.filter((user) => user.name != data.name);
        data.name = obj.user;
        array.push(data);

        await jsonDAL.write(array, "session");
      } else {
        sessions({ name: obj.user, time });
      }
    }
  } else if (obj.previous != obj.user && Number(obj.number) > 0) {
    // update credits & name
    empty(obj.previous);
  }
};

module.exports = { sessions, empty, update };
