/**
 * Created by brianbest on 14-11-19.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/app/index.html');
});

app.use(express.static(__dirname + '/dist'));

//app.use("/styles", express.static(__dirname + '/app/styles'));
//app.use("/scripts", express.static(__dirname + '/app/scripts/'));
//app.use("/elements", express.static(__dirname + '/app/elements/'));
//app.use("/images", express.static(__dirname + '/app/images/'));
//app.use("/bower_components", express.static(__dirname + '/app/bower_components/'));

http.listen(3000, function(){
  console.log('listening on *:3000');
});
