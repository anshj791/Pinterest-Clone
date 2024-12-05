var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Passport Configuration
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
 
  res.render('login',{error : req.flash("error")});
});
router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username : req.session.passport.user
  })
  res.render('profile',{user});
});

router.post('/register', function(req, res) {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname
  });
  
  userModel.register(userData, req.body.password)
    .then(function() {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/profile");
      });
    })
    .catch(function(err) {
      res.redirect('/');
    });
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: '/login',
  failureFlash:true
}), function(req, res) {
  // The function here is optional since the redirects are handled by passport.authenticate
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
