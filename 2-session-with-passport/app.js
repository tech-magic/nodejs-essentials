//npm -ddd install express --save

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var bodyParser = require('body-parser');

// Constants
var PORT = 3030;

// App
var app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
  }, 
  function(request, username, password, done) {
    console.log('Reaches the passport auth callback !!!!');
    if(username == "wimal") {
      return done(null, { "username" : "wimal", "tenant" : "halebop" }, { message: 'Login successful.' });
    } else {
      return done(null, false, { message: 'Login Not Successful.' });
    }
  })
);

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated())
     return next();
   else
     res.redirect('/login');
}

app.get('/', function (req, res) {
  res.send('Hello world\n');
});

app.get('/login', function(req, res) {
  res.sendFile('views/login.html', {"root": __dirname});
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  })
);

app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

app.get("/content", isLoggedIn, function (req, res) {
    console.log(req.session.passport);
    var curr_user = req.session.passport["user"];
    var curr_tenant = curr_user["tenant"];    
    res.send("Congratulations! you've successfully logged in to " + curr_tenant);
});

app.get("/logout", function (req, res) {
    req.logout();
    res.send("logout success!");
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

