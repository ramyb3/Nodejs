var express = require("express");
var router = express.Router();
const loginBL = require("../models/loginBL");
const moviesBL = require("../models/moviesBL");
const searchBL = require("../models/searchBL");
const resultsBL = require("../models/resultsBL");
const genresBL = require("../models/genresBL");
const usersBL = require("../models/usersBL");
const sessionBL = require("../models/sessionBL");
const timeBL = require("../models/timeBL");
const restDAL = require("../DAL/restDAL");
const jsonDAL = require("../DAL/jsonDAL");
const usersDAL = require("../DAL/usersDAL");

function adminMessage(authenticated) {
  if (authenticated) {
    return "YOU ARE NOT ADMIN!!";
  } else {
    return "LOG IN FIRST!!";
  }
}

function creditMessage(credits) {
  let msg = "LOG IN FIRST!!";

  if (credits == 0) {
    msg = "YOU ARE OUT OF CREDITS!!";
  }

  return msg;
}

function searchMessage(authenticated, credits) {
  let msg = "";

  if (authenticated) {
    msg = "SERACH SOMETHING FIRST!!";
  } else {
    msg = "LOG IN FIRST!!";
  }

  if (credits == 0) {
    msg = "YOU ARE OUT OF CREDITS!!";
  }

  return msg;
}

/////////////////////////////////////////////////////////////

// login page
router.get("/", async function (req, res, next) {
  // check if session ended
  if (req.session.authenticated) {
    // check if this user not admin and update his credits
    if (!req.session.admin) {
      let user = await usersBL.checkUser(req.session.user);
      user.NumOfTransactions = req.session.credits;
      await usersBL.updateUser(user, true);
    }

    // check if this user ended his credits for today
    if (req.session.credits == 0) {
      const time = new Date(Date.now()); // get time when session ended
      const data = { name: req.session.user, time };
      await sessionBL.sessions(data);
    }

    //declaring all session parameters to default
    req.session.authenticated = false;
    req.session.admin = false;
    req.session.user = undefined;
    req.session.search = false;
    req.session.credits = undefined;
  }

  res.render("loginPage", { msg: req.session.msg });
});

////////////////////////////////////////////////////////// login

// menu page
router.post("/menu", async function (req, res, next) {
  const login = await loginBL.login(req.body);
  let ok = false;

  req.session.msg = undefined; // empty msg in this session
  req.session.credits = undefined; // empty credits in this session
  req.session.admin = false; // declare not admin in this session
  req.session.authenticated = false; // declare not logged in in this session
  req.session.search = false; // didn't search in this session
  req.session.user = login[1]; // get username in this session

  // check if user is admin in this session
  if (login[0] == 1) {
    req.session.admin = true;
  }

  // user with enough credit
  if (login[0] == 2) {
    req.session.credits = await usersBL.credits(login[1]);
    req.session.credits = Number(req.session.credits);
  }

  // user with no credits
  if (login[0] == 3) {
    const users = await jsonDAL.read("session");
    const banned = users.find((user) => user.name == login[1]);
    const sessioEnd = new Date(Date.parse(banned.time));
    const newSession = new Date(Date.now()); // get actual time

    //86400000 == 24 hours;  check if a full day passed
    if (newSession.valueOf() >= sessioEnd.valueOf() + 86400000) {
      let user = await usersBL.checkUser(login[1]);
      user.NumOfTransactions = 10;

      await usersBL.updateUser(user, true);
      await sessionBL.empty(login[1]); // delete banned user from session file

      req.session.credits = await usersBL.credits(login[1]);
      req.session.credits = Number(req.session.credits);
      ok = true;
    } else {
      req.session.msg = timeBL.time(newSession, sessioEnd);
      res.redirect("/");
    }
  }

  // check user authenticated in this session
  if (login[0] == 1 || login[0] == 2 || (login[0] == 3 && ok)) {
    req.session.authenticated = true;
    res.render("menuPage", { login: req.session.admin });
  }

  // this user doesn't exist
  if (login[0] == 0) {
    req.session.msg = "YOUR USERNAME OR PASSWORD IS INCORRECT!!";
    res.redirect("/");
  }
});

// menu page (if going back)
router.get("/menu", function (req, res, next) {
  // check if session started
  if (
    req.session.authenticated &&
    (req.session.credits > 0 || req.session.admin)
  ) {
    res.render("menuPage", { login: req.session.admin });
  } else {
    req.session.msg = creditMessage(req.session.credits);
    res.redirect("/");
  }
});

/////////////////////////////////////////////////////////////////////////////// admin

// list of users page
router.get("/menu/edit", async function (req, res, next) {
  // check if session started
  if (req.session.authenticated && req.session.admin) {
    const users = await usersDAL.users();
    res.render("editUsers", { users });
  } else {
    req.session.msg = adminMessage(req.session.authenticated);
    res.redirect("/");
  }
});

// add user
router.get("/menu/edit/userData/add", function (req, res, next) {
  // check if session started
  if (req.session.authenticated && req.session.admin) {
    res.render("userData", { option: 1 });
  } else {
    req.session.msg = adminMessage(req.session.authenticated);
    res.redirect("/");
  }
});

// update user
router.get("/menu/edit/userData/update/:name", async function (req, res, next) {
  // check if session started
  if (req.session.authenticated && req.session.admin) {
    const user = await usersBL.checkUser(req.params.name);
    res.render("userData", { option: 2, data: user });
  } else {
    req.session.msg = adminMessage(req.session.authenticated);
    res.redirect("/");
  }
});

// delete user
router.get("/menu/edit/userData/delete/:name", async function (req, res, next) {
  // check if session started
  if (req.session.authenticated && req.session.admin) {
    await usersBL.deleteUser(req.params.name);
    await sessionBL.empty(req.params.name); // delete user from session file
    res.redirect("/menu");
  } else {
    req.session.msg = adminMessage(req.session.authenticated);
    res.redirect("/");
  }
});

// save users data
router.post("/menu/edit/userData", async function (req, res, next) {
  // check if session started
  if (req.session.authenticated && req.session.admin) {
    if (req.body.do == 2) {
      // update
      await usersBL.updateUser(req.body, false);
      await sessionBL.update(req.body); // update user in session file
    }
    if (req.body.do == 1) {
      // add
      await usersBL.addUser(req.body);
    }

    res.redirect("/menu");
  } else {
    res.redirect("/");
  }
});

///////////////////////////////////////////////////////////////////////// search

// search page
router.get("/menu/search", function (req, res, next) {
  // check if session started
  if (
    req.session.authenticated &&
    (req.session.credits > 0 || req.session.admin)
  ) {
    res.render("search", {});
  } else {
    req.session.msg = creditMessage(req.session.credits);
    res.redirect("/");
  }
});

let jsonMovie, restMovie; // getting movies from all sources
let result, names;

// serach results page
router.post("/menu/search/results", async function (req, res, next) {
  // check if session started
  if (
    req.session.authenticated &&
    (req.session.credits > 0 || req.session.admin)
  ) {
    const data = await searchBL.search(req.body);

    if (data.length == 0) {
      // if there isn't results to the search
      result = [];
      result[0] = [];
    } else {
      // if there's results to the search
      jsonMovie = await jsonDAL.read("NewMovies");
      restMovie = await restDAL.getMovies();
      result = await resultsBL.result(data);
      names = await genresBL.genre(result[1], result[0]);
      req.session.search = true;
    }

    req.session.credits--;

    res.render("searchResults", { movies: result[0], genre: names });
  } else {
    res.redirect("/");
  }
});

// serach results page (if going back)
router.get("/menu/search/results", function (req, res, next) {
  // check if session started
  if (
    req.session.authenticated &&
    req.session.search &&
    (req.session.credits > 0 || req.session.admin)
  ) {
    res.render("searchResults", { movies: result[0], genre: names });
  } else {
    req.session.msg = searchMessage(
      req.session.authenticated,
      req.session.credits
    );
    res.redirect("/");
  }
});

// movie page
router.get("/menu/search/results/movie/:id", function (req, res, next) {
  // check if session started
  if (
    req.session.authenticated &&
    req.session.search &&
    (req.session.credits > 0 || req.session.admin)
  ) {
    const id = req.params.id;
    let image = "";
    let movie;

    if (id > 20) {
      //file NewMovies start with id-21
      movie = jsonMovie.movies.find((movieData) => movieData.id == id);
    } else {
      //REST API ends with id-20
      movie = restMovie.find((movieData) => movieData.id == id);
    }

    //if there's image to the movie
    if (movie.image) {
      image = movie.image.medium;
    }

    req.session.credits--;

    res.render("movieData", { movie, image });
  } else {
    req.session.msg = searchMessage(
      req.session.authenticated,
      req.session.credits
    );
    res.redirect("/");
  }
});

///////////////////////////////////////////////////////////////////////// create

// create movies page
router.post("/menu/createMovies", async function (req, res, next) {
  // check if session started
  if (
    req.session.authenticated &&
    (req.session.credits > 0 || req.session.admin)
  ) {
    await moviesBL.movies(req.body);
    req.session.credits--;
    res.redirect("/menu");
  } else {
    res.redirect("/");
  }
});

router.get("/menu/createMovie", function (req, res, next) {
  // check if session started
  if (
    req.session.authenticated &&
    (req.session.credits > 0 || req.session.admin)
  ) {
    res.render("createMovies", {});
  } else {
    req.session.msg = creditMessage(req.session.credits);
    res.redirect("/");
  }
});

////////////////////////////////////////////////

module.exports = router;
