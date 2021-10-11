var express = require('express');
var router = express.Router();

const loginBL = require('../models/loginBL');
const moviesBL = require('../models/moviesBL');
const searchBL = require('../models/searchBL');
const resultsBL = require('../models/resultsBL');
const genresBL = require('../models/genresBL');
const usersBL = require('../models/usersBL');
const sessionBL = require('../models/sessionBL');
const timeBL = require('../models/timeBL');

const restDAL = require('../DAL/restDAL');
const jsonDAL = require('../DAL/jsonDAL');

///////////////////////////////////////////////////////////// 

router.get('/',async function(req, res, next) { // login page
  
  if(req.session.authenticated==true) // check if session ended
  {
    if(req.session.admin==false) // check if this user not admin and update his credits
    {
      let user = await usersBL.checkUser(req.session.user);

      user.NumOfTransactions=req.session.credits;
        
      await usersBL.sessionUser(user);
    }

    if(req.session.credits==0) // check if this user ended his credits for today
    {      
      let time = new Date(Date.now()); // get time when session ended
      let data={name: req.session.user, time: time};

      await sessionBL.sessions(data);
    }
    
    //declaring all session parameters to default
    req.session.authenticated= false;
    req.session.admin= false;
    req.session.user= undefined;
    req.session.search = false;
    req.session.credits=undefined;
  }

  res.render('loginPage',{msg: req.session.msg});
});

////////////////////////////////////////////////////////// login 

router.post('/menu', async function(req, res, next) { // menu page

  let login= await loginBL.login(req.body);

  req.session.msg=undefined; // empty msg in this session
  req.session.credits=undefined; // empty credits in this session
  req.session.admin= false; // declare not admin in this session
  req.session.authenticated= false; // declare not logged in in this session
  req.session.search = false; // didn't search in this session
  req.session.user= login[1]; // get username in this session

  if(login[0]==1)
  {
    req.session.admin= true; // check if user is admin in this session
  }

  if(login[0]==2) // user with enough credit
  {
    req.session.credits= await usersBL.credits(login[1]);

    req.session.credits= Number(req.session.credits);
  }

  let ok=false;

  if(login[0]==3) // user with no credits
  {
    let users= await jsonDAL.read();

    let banned=users.find(x=> x.name==login[1]);
    let sessioEnd= new Date(Date.parse(banned.time));
    let newSession = new Date(Date.now()); // get actual time

    //86400000== 24 hours 
    if(newSession.valueOf()>=sessioEnd.valueOf()+86400000) //check if a full day passed
    {
      let user = await usersBL.checkUser(login[1]);

      user.NumOfTransactions=10;
          
      await usersBL.sessionUser(user);
      await sessionBL.empty(login[1]); // delete banned user from session file 

      req.session.credits= await usersBL.credits(login[1]);

      req.session.credits= Number(req.session.credits);
      ok=true;
    }

    else
    {
      req.session.msg= timeBL.time(newSession,sessioEnd);

      res.redirect("http://localhost:3000/login");
    }  
  }

  if(login[0]==1 || login[0]==2 || (login[0]==3 && ok==true))
  {
    req.session.authenticated= true; // check user authenticated in this session
   
    res.render('menuPage',{login: req.session.admin});
  }

  if(login[0]==0) // this user doesn't exist
  {
    req.session.msg="YOUR USERNAME OR PASSWORD IS INCORRECT!!";

    res.redirect("http://localhost:3000/login");
  } 
});

router.get('/menu',function(req, res, next) { // menu page (if going back)

  if(req.session.authenticated==true && (req.session.credits>0 || req.session.admin==true)) // check if session started
  {
    res.render('menuPage',{login: req.session.admin});
  }

  else
  {
    req.session.msg="LOG IN FIRST!!";

    if(req.session.credits==0)
    {
      req.session.msg="YOU ARE OUT OF CREDITS!!";
    }

    res.redirect("http://localhost:3000/login");
  }
});

/////////////////////////////////////////////////////////////////////////////// admin 

router.get('/menu/edit',async function(req, res, next) {  // list of users page

  if(req.session.authenticated==true && req.session.admin==true) // check if session started
  {
    let user = await usersBL.users();

    res.render('editUsers',{users: user});
  }

  else
  {
    if(req.session.authenticated==true)
    {
      req.session.msg="YOU ARE NOT ADMIN!!";
    }

    else
    {
      req.session.msg="LOG IN FIRST!!";
    }  

    res.redirect("http://localhost:3000/login");
  } 
});

router.get('/menu/edit/userData/add',function(req, res, next) { // add user
  
  if(req.session.authenticated==true && req.session.admin==true) // check if session started
  {
    res.render('userData',{option: 1});
  }

  else
  {
    if(req.session.authenticated==true)
    {
      req.session.msg="YOU ARE NOT ADMIN!!";
    }
    
    else
    {
      req.session.msg="LOG IN FIRST!!";
    }  

    res.redirect("http://localhost:3000/login");
  } 
});

router.get('/menu/edit/userData/update/:name',async function(req, res, next) {  // update user

  if(req.session.authenticated==true && req.session.admin==true) // check if session started
  {
    let user = await usersBL.checkUser(req.params.name);
      
    res.render('userData',{option: 2, data: user});
  }

  else
  {
    if(req.session.authenticated==true)
    {
      req.session.msg="YOU ARE NOT ADMIN!!";
    }
    
    else
    {
      req.session.msg="LOG IN FIRST!!";
    }  

    res.redirect("http://localhost:3000/login");
  } 
});

router.get('/menu/edit/userData/delete/:name',async function(req, res, next) { // delete user

  if(req.session.authenticated==true && req.session.admin==true) // check if session started
  {
    await usersBL.deleteUser(req.params.name);
    await sessionBL.empty(req.params.name); // delete user from session file

    res.redirect("http://localhost:3000/login/menu");
  }

  else
  {
    if(req.session.authenticated==true)
    {
      req.session.msg="YOU ARE NOT ADMIN!!";
    }
    
    else
    {
      req.session.msg="LOG IN FIRST!!";
    }  

    res.redirect("http://localhost:3000/login");
  } 
});

router.post('/menu/edit/userData',async function(req, res, next) { // save users data

  if(req.session.authenticated==true && req.session.admin==true) // check if session started
  {
    if(req.body.do==2) // update
    {
      await usersBL.updateUser(req.body);
      await sessionBL.update(req.body); // update user in session file
    }

    if(req.body.do==1) // add 
    {
      await usersBL.addUser(req.body);
    }

    res.redirect("http://localhost:3000/login/menu"); 
  }

  else
  {
    res.redirect("http://localhost:3000/login");
  } 
});

///////////////////////////////////////////////////////////////////////// search

router.get('/menu/search',function(req, res, next) {  // search page

  if(req.session.authenticated==true && (req.session.credits>0 || req.session.admin==true)) // check if session started
  {
    res.render('search',{});
  }

  else
  {
    req.session.msg="LOG IN FIRST!!";

    if(req.session.credits==0)
    {
      req.session.msg="YOU ARE OUT OF CREDITS!!";
    }

    res.redirect("http://localhost:3000/login");
  } 
});

let jsonMovie, restMovie; // getting movies from all sources
let data, result, names;

router.post('/menu/search/results',async function(req, res, next) { // serach results page
  
  if(req.session.authenticated==true && (req.session.credits>0 || req.session.admin==true)) // check if session started
  {
    data= await searchBL.search(req.body);

    if(data.length==0) // if there isn't results to the search
    {
      result=[];
      result[0]=[];
    }
  
    if(data.length>0) // if there's results to the search
    {
      jsonMovie= await jsonDAL.getMovies();
      restMovie = await restDAL.getMovies();

      result= await resultsBL.result(data);
      names= await genresBL.genre(result[1], result[0]);

      req.session.search = true;
    }

    req.session.credits--;

    res.render('searchResults',{movies: result[0], genre: names});
  }

  else
  {
    res.redirect("http://localhost:3000/login");
  } 
});

router.get('/menu/search/results', function(req, res, next) { // serach results page (if going back)

  if(req.session.authenticated==true && req.session.search==true && (req.session.credits>0 || req.session.admin==true)) // check if session started
  {
    res.render('searchResults',{movies: result[0], genre: names});
  }

  else
  {
    if(req.session.authenticated==true)
    {
      req.session.msg="SERACH SOMETHING FIRST!!";
    }

    else
    {
      req.session.msg="LOG IN FIRST!!";
    }

    if(req.session.credits==0)
    {
      req.session.msg="YOU ARE OUT OF CREDITS!!";
    }

    res.redirect("http://localhost:3000/login");
  } 
});

router.get('/menu/search/results/movie/:id', function(req, res, next) { // movie page

  if(req.session.authenticated==true && req.session.search==true && (req.session.credits>0 || req.session.admin==true)) // check if session started
  {
    let id = req.params.id;
    var image="";
    let movie;
  
    if(id>20) //file NewMovies start with id-21
    {
      movie= jsonMovie.movies.find(x=> x.id==id);
    }

    if(id<21) //REST API ends with id-20
    {
      movie= restMovie.find(x=> x.id==id);
    }

    if(movie.image!=undefined) //if there's image to the movie
    {
      image=movie.image.medium;
    }

    req.session.credits--;

    res.render('movieData',{movie: movie, image: image});
  }

  else
  {
    if(req.session.authenticated==true)
    {
      req.session.msg="SERACH SOMETHING FIRST!!";
    }

    else
    {
      req.session.msg="LOG IN FIRST!!";
    }

    if(req.session.credits==0)
    {
      req.session.msg="YOU ARE OUT OF CREDITS!!";
    }

    res.redirect("http://localhost:3000/login");
  } 
});

///////////////////////////////////////////////////////////////////////// create 

router.post('/menu/createMovies',async function(req, res, next) { // create movies page
  
  if(req.session.authenticated==true && (req.session.credits>0 || req.session.admin==true)) // check if session started
  {
    await moviesBL.movies(req.body);

    req.session.credits--;

    res.redirect("http://localhost:3000/login/menu");
  }

  else
  {
    res.redirect("http://localhost:3000/login");
  } 
});

router.get('/menu/createMovie',function(req, res, next) { 
 
  if(req.session.authenticated==true && (req.session.credits>0 || req.session.admin==true)) // check if session started
  {
   res.render('createMovies',{});
  }
  
  else
  {
    req.session.msg="LOG IN FIRST!!";

    if(req.session.credits==0)
    {
      req.session.msg="YOU ARE OUT OF CREDITS!!";
    }

    res.redirect("http://localhost:3000/login");
  } 
});
////////////////////////////////////////////////

module.exports = router;