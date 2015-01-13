/**
 * Created by brianbest on 14-11-19.
 */
//  ======================================================================
//  App dependencies
//  ======================================================================
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongoose = require('mongoose/');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//  ======================================================================
//  App Configuration
//  ======================================================================

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/app')); // Folder for files
app.use( bodyParser.json() );                // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({              // to support URL-encoded bodies
  extended: true
}));
app.set('views', __dirname +'/app/views/');  // Set where the views are located
app.set('view engine', 'jade');              // Set our default template engine to "jade"


//  ======================================================================
//  Mongo Config
//  ======================================================================

mongoose.connect('mongodb://brianbest:thisisatest1@dogen.mongohq.com:10032/rally_point');

var Schema = mongoose.Schema;
var UserDetail = new Schema({
  username: String,
  password: String
}, {
  collection: 'kf_users'
});
var UserDetails = mongoose.model('kf_users', UserDetail);


//  ======================================================================
//  Passport Info
//  ======================================================================

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    UserDetails.findOne({
      'username': username
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
}));

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/signin');
};//

//  ======================================================================
//  GET Requests
//  ======================================================================
app.get('/', function(req, res){
  res.render('index');




});

app.get('/signin',function(req,res){
  res.render('login');
});

app.get('/login',function(req,res){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginFailure'
  })
});

app.get('/loginFailure',function(req,res){
  res.redirect('/login');
});


//  ======================================================================
//  POST Requests
//  ======================================================================

app.post('/payus', function(req,res){
  var stripe = require("stripe")("sk_test_Fe7hexNKtkDQEjv9AZ7VT2xC");
  console.log(req.body);
// Get the credit card details submitted by the form
  var stripeToken = req.body.stripeToken;


  var charge = stripe.charges.create({
    amount: 1000, // amount in cents, again
    currency: "cad",
    card: stripeToken,
    description: req.body.stripeEmail,
    receipt_email : req.body.stripeEmail
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
    }else{
      res.sendFile(__dirname + '/app/thankyou.html');
    }
  });
});




//  ======================================================================
//  HTTP Server
//  ======================================================================

http.listen(3000, function(){
  console.log('listening on *:3000');
});
