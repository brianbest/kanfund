/**
 * Created by brianbest on 14-11-19.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.bodyParser());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/app/index.html');




});

app.post('/payus', function(req,res){
  var stripe = require("stripe")("sk_test_Fe7hexNKtkDQEjv9AZ7VT2xC");
  console.log(req.body.stripeToken);
// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form
//  var stripeToken = req.body.stripeToken;
//
//
//  var charge = stripe.charges.create({
//    amount: 1000, // amount in cents, again
//    currency: "cad",
//    card: stripeToken,
//    description: "payinguser@example.com"
//  }, function(err, charge) {
//    if (err && err.type === 'StripeCardError') {
//      // The card has been declined
//    }
//  });
});

app.use(express.static(__dirname + '/app'));




http.listen(3000, function(){
  console.log('listening on *:3000');
});
