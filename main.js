var express = require('express');
var fs = require('fs');
var url = require('url');
var images = require('images');
var cookieParser = require('cookie-parser');
var randomString = require('randomstring');
var mysql = require('mysql');
var http = require('http');

var app = express();
app.use(cookieParser());
app.use(express.static('public'));

// MySQL Connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'yasir',
    password: 'Magbouls2305',
    database: 'tracking'
});

connection.connect();

app.on('request', function(req, res){
	console.log("REQUEST: "+req.url);
});

app.get('/', function(req, res){
    //Handle cookies
    if(req.cookies.cid == undefined){
        res.cookie('cid', randomString.generate(30), {'path':'/'});
        console.log("Cookie generated");
    }else{
        console.log("Cookies were received");
        console.log(req.cookies);
    }
    res.set('content-type','text/html');
    res.sendFile(__dirname+'/index.html');
});

app.get('/thanks', function(req, res){
    if(req.cookies.cid == undefined){
        res.cookie('cid', randomString.generate(30), {'path':'/'});
    }else{
        console.log(req.cookies);
    }
    res.set('content-type', 'text/html');
    res.sendFile(__dirname+'/thanks.html');
});

app.get('/snake', function(req, res){
    res.set('content-type', 'text/html');
    res.sendFile(__dirname+'/GAMEZ.html');
});

app.get('/other-page', function(req, res){
    if(req.cookies.cid == undefined){
        res.cookie('cid', randomString.generate(30), {'path':'/'});
    }else{
        console.log(req.cookies);
    }
    res.set('content-type', 'text/html');
    res.sendFile(__dirname+'/otherPage.html');
});

app.get('/test', function(req, res){
	res.set('content-type', 'text/html');
	res.sendFile(__dirname+'/test.html');
});

app.get('/embedded', function(req, res){
	res.set('content-type', 'text/html');
	res.sendFile(__dirname+'/embedded.html');
});

app.get('/tracking-pixel', function(request, result){
    var domain = request.hostname;
    var ip = request.ip;
    var useragent = request.headers['user-agent'];
    
    //Read url parameters
    var title = "";
    var link = request.query.url;
    title = request.query.title;

    images(1,1)
          .fill(255,255,255)
          .save('p.jpg');
    result.set('content-type','image/jpg');
    result.sendFile(__dirname+'/p.jpg');
    
    var usersSql = "INSERT INTO users (cookie, ip_address, user_agent) VALUES (?, ? ,?)";
    var userValues = [request.cookies.cid, request.ip, request.headers['user-agent']];

    var historySql = "INSERT INTO user_history (cookie, domain, history, page_title) VALUES (?, ? ,?, ?)";
    var historyValues = [request.cookies.cid, domain, link, title];
    usersSql = mysql.format(usersSql, userValues);
    historySql = mysql.format(historySql, historyValues);
    
    var userQuery = connection.query(usersSql, function(err, result){
        console.log("Updated users database");
    });

    var historyQuery = connection.query(historySql, function(err, result){
        console.log("Updated history database");
    });

    console.log('Domain: '+domain);
    console.log('IP Address: '+ip);
    console.log('User Agent: '+useragent);
    console.log('Url: '+link);
    console.log('Title: '+title);
});

http.createServer(app).listen(8080, '10.131.24.117');
console.log("Server running at http://10.131.24.117:8080/");
