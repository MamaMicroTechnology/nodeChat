// Load basics
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socketioJwt = require('socketio-jwt');
require('dotenv').config({path: '../laravel/.env'});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var request = require('request');
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

const url = "https://mamahome360.com/webapp/api/messages";

// Let express show auth.html to client
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/auth.html');
});

io.on('connection', function(socket){
    var sessionid = socket.id;
    console.log('new user '+sessionid+' has connected');
    socket.on('disconnect', function(user){
        console.log(sessionid+' has disconnected');
    });
    var options = {
        url: url,
        method: 'GET',
        headers: headers
    }
    request(options, function (error, response, body) {
        var title = "";
        if(!error && response.statusCode == 200){
            body = JSON.parse(body);
            length = body.data.length;
            for(var i=0;i<length;i++){
                title += "<p>"+body.data[i].body+"<br><small>-"+body.data[i].name+"</small></p>";
            }
            socket.emit('old chat message', title);
        }else{
            console.log(error)
        }
    });
    socket.on('chat message', function(msg){
        var options = {
            url: 'https://mamahome360.com/webapp/api/message',
            method: 'POST',
            headers: headers,
            form: {'body': msg.msg,'id': msg.id}
        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                length = body.data.length;
                var message = body.data.body+"<br><small>-"+body.data.name+"</small>";
                io.emit('chat message', message);
            }else{
                console.log(body)
            }
        })
    });
});

server.listen(5000, function(){
    console.log('listening on *:5000');
});

// When authenticated, send back name + email over socket
io.on('authenticated', function (socket) {
    console.log(socket.decoded_token);
    socket.emit('name', socket.decoded_token.name);
    socket.emit('email', socket.decoded_token.email);
});
