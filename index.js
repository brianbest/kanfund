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
var cookieParser = require('cookie-parser');
var session = require('express-session')


//  ======================================================================
//  App Configuration
//  ======================================================================
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
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

UserDetails.findOne({
  'username': 'admin'
},function(err,user){
  console.log(user);
});

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
    // Auth Check Logic
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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  console.log('Auth Failed!!!');
  res.redirect('/login')
}

//  ======================================================================
//  GET Requests
//  ======================================================================
app.get('/',ensureAuthenticated, function(req, res){
  console.log(req.user);
  res.render('index',{
    username: 'Pork'
  });
});

app.get('/signin',function(req,res){
  res.render('login');
});

app.get('/loginFailure',function(req,res){
  res.redirect('/login');
});

app.get('/login',function(req,res){
  console.log('got login req');
  res.render('login');
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

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);




//  ======================================================================
//  HTTP Server
//  ======================================================================

http.listen(3000, function(){
  console.log('listening on *:3000');
});
