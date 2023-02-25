const jsonDAL = require("../DAL/jsonDAL");

const sessions = async function (
  obj //add banned user to session file
) {
  let session = await jsonDAL.read();

  if (session.length == 0) {
    // in the beginning of the project need to write "[]" in session file
    await jsonDAL.write([obj]);
  } else {
    session.push(obj);

    await jsonDAL.write(session);
  }
};

const empty = async function (
  name //delete banned user from session file
) {
  let session = await jsonDAL.read();

  let data;

  if (session.length == 1) {
    data = session.find((x) => x.name == name);

    if (data != undefined) {
      await jsonDAL.write([]);
    }
  } else {
    data = session.find((x) => x.name == name);

    if (data != undefined) {
      let array = session.filter((x) => x.name != data.name);

      await jsonDAL.write(array);
    }
  }
};

const update = async function (
  obj //update banned user in session file
) {
  let session = await jsonDAL.read();

  let data;
  let func = false; // check cases
  let time = new Date(Date.now());

  if (obj.previous == obj.user && Number(obj.number) == 0) {
    // check if need to update credits to 0 or not
    data = session.find((x) => x.name == obj.user);

    if (data == undefined) {
      // update credits to 0
      sessions({ name: obj.user, time: time });
    }

    func = true;
  }

  if (obj.previous == obj.user && Number(obj.number) > 0 && func == false) {
    // only update credits
    empty(obj.user);

    func = true;
  }

  if (obj.previous != obj.user && Number(obj.number) == 0 && func == false) {
    // only update name
    if (session.length == 1) {
      data = session.find((x) => x.name == obj.previous);

      if (data != undefined) {
        await jsonDAL.write([{ name: obj.user, time: data.time }]);
      } else {
        sessions({ name: obj.user, time: time });
      }
    } else {
      data = session.find((x) => x.name == obj.previous);

      if (data != undefined) {
        let array = session.filter((x) => x.name != data.name);
        data.name = obj.user;
        array.push(data);

        await jsonDAL.write(array);
      } else {
        sessions({ name: obj.user, time: time });
      }
    }

    func = true;
  }

  if (obj.previous != obj.user && Number(obj.number) > 0 && func == false) {
    // update credits & name
    empty(obj.previous);
  }
};

module.exports = { sessions, empty, update };
