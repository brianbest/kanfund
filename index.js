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
var session = require('express-session');
var stripe = require("stripe")("sk_test_Fe7hexNKtkDQEjv9AZ7VT2xC");


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
  username  : String,
  password  : String,
  email     : String,
  stripeID  : String
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
//  Stripe Stuff
//  ======================================================================

stripe.customers.list({ limit: 3 }, function(err, customers) {
  console.log(customers);
});


//  ======================================================================
//  GET Requests
//  ======================================================================
app.get('/', function(req, res){
  var users = ''; // fall back if user is not logged in yet
  if(req.user){ users = req.user.username}
  res.render('index',{
    username: users
  });
});

app.get('/register', function(req,res) {
  res.render('registration');
});

app.get('/profile',ensureAuthenticated, function(req,res) {

  var hasStripe = false;

  if (typeof req.user.stripeID !== 'undefined') {
    // the variable is defined
    hasStripe = true;
  }

  res.render('profile',{
    user : req.user.username,
    email : req.user.email,
    stripe : hasStripe
  });
});

app.get('/campaign',function(req,res){
  res.render('campaign');
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


app.post('/regNewClient', function(req,res){
  console.log('got something');
  console.log(req.body);
  var user = req.body.username,
    pass = req.body.password,
    emails = req.body.email;

  var newClient = new UserDetails({
    username : user,
    password : pass,
    email    : emails
  });

  newClient.save(function(err){
    console.log('we good');
    res.redirect('/profile');
    //res.redirect('https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_5WkZBZb2kSLdoMu7Ioc7V5jJLgjTMYH7');
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
