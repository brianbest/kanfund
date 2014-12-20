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


//  ======================================================================
//  App Configuration
//  ======================================================================

app.use(express.static(__dirname + '/app')); // Folder for files
app.use( bodyParser.json() );                // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({              // to support URL-encoded bodies
  extended: true
}));
app.set('views', __dirname +'/app/views/');  // Set where the views are located
app.set('view engine', 'jade');              // Set our default template engine to "jade"

//  ======================================================================
//  GET Requests
//  ======================================================================
app.get('/', function(req, res){
  //res.sendFile(__dirname + '/app/index.html');
  res.render('index');
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
