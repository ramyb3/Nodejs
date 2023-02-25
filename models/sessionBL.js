const jsonDAL = require("../DAL/jsonDAL");

//add banned user to session file
const sessions = async function (obj) {
  const session = await jsonDAL.read();

  // in the beginning of the project need to write "[]" in session file
  if (session.length == 0) {
    await jsonDAL.write([obj]);
  } else {
    session.push(obj);
    await jsonDAL.write(session);
  }
};

//delete banned user from session file
const empty = async function (name) {
  const session = await jsonDAL.read();
  let data;

  if (session.length == 1) {
    data = session.find((x) => x.name == name);

    if (data) {
      await jsonDAL.write([]);
    }
  } else {
    data = session.find((x) => x.name == name);

    if (data) {
      let array = session.filter((x) => x.name != data.name);
      await jsonDAL.write(array);
    }
  }
};

//update banned user in session file
const update = async function (obj) {
  const session = await jsonDAL.read();
  const time = new Date(Date.now());
  let data;

  if (obj.previous == obj.user && Number(obj.number) == 0) {
    // check if need to update credits to 0 or not
    data = session.find((x) => x.name == obj.user);

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
      data = session.find((x) => x.name == obj.previous);

      if (data) {
        await jsonDAL.write([{ name: obj.user, time: data.time }]);
      } else {
        sessions({ name: obj.user, time });
      }
    } else {
      data = session.find((x) => x.name == obj.previous);

      if (data) {
        let array = session.filter((x) => x.name != data.name);
        data.name = obj.user;
        array.push(data);

        await jsonDAL.write(array);
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
