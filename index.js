// Load basics
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT|| 3000;
var socketioJwt = require('socketio-jwt');
require('dotenv').config({path: '../laravel/.env'});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var request = require('request');
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}
var management = io.of('management');
var it = io.of('it');
var tl = io.of('tl');

const url = "https://mamahome360.com/webapp/api/messages";
const url2 = "https://mamahome360.com/webapp/api/ManagementMessages";
const iturl = "https://mamahome360.com/webapp/api/itMessages";
const tlurl = "https://mamahome360.com/webapp/api/tlMessages";

// Let express show auth.html to client
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/sorry.html');
});
// app.get('/', function (req, res, next) {
//     res.sendFile(__dirname + '/auth.html');
// });
app.get('/invoices', function (req, res, next) {
    res.sendFile(__dirname + '/department.html');
});
app.get('/it', function (req, res, next) {
    res.sendFile(__dirname + '/it.html');
});
app.get('/mhtl', function (req, res, next) {
    res.sendFile(__dirname + '/mhtl.html');
});

// Management Chat
management.on('connection', function(socket) {
    var sessionid = socket.id;
    console.log('new user '+sessionid+' has connected');
    socket.on('disconnect', function(user){
        console.log(sessionid+' has disconnected');
    });
    var options = {
        url: url2,
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
            url: 'https://mamahome360.com/webapp/api/ManagementMessage',
            method: 'POST',
            headers: headers,
            form: {'body': msg.msg,'id': msg.id}
        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                length = body.data.length;
                var message = body.data.body+"<br><small>-"+body.data.name+"</small>";
                management.emit('chat message', message);
            }else{
                console.log(body)
            }
        })
    });
 });

//  All Group Chat
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

// IT Chat
it.on('connection', function(socket) {
    var sessionid = socket.id;
    console.log('new user '+sessionid+' has connected');
    socket.on('disconnect', function(user){
        console.log(sessionid+' has disconnected');
    });
    var options = {
        url: iturl,
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
            url: 'https://mamahome360.com/webapp/api/itMessage',
            method: 'POST',
            headers: headers,
            form: {'body': msg.msg,'id': msg.id}
        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                length = body.data.length;
                var message = body.data.body+"<br><small>-"+body.data.name+"</small>";
                it.emit('chat message', message);
            }else{
                console.log(body)
            }
        })
    });
 });

// IT Chat
tl.on('connection', function(socket) {
    var sessionid = socket.id;
    console.log('new user '+sessionid+' has connected');
    socket.on('disconnect', function(user){
        console.log(sessionid+' has disconnected');
    });
    var options = {
        url: tlurl,
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
            url: 'https://mamahome360.com/webapp/api/tlMessage',
            method: 'POST',
            headers: headers,
            form: {'body': msg.msg,'id': msg.id}
        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                length = body.data.length;
                var message = body.data.body+"<br><small>-"+body.data.name+"</small>";
                tl.emit('chat message', message);
            }else{
                console.log(body)
            }
        })
    });
 });

server.listen(port);

// When authenticated, send back name + email over socket
io.on('authenticated', function (socket) {
    console.log(socket.decoded_token);
    socket.emit('name', socket.decoded_token.name);
    socket.emit('email', socket.decoded_token.email);
});
