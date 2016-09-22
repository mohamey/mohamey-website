const express = require('express');
const fs = require('fs');
const url = require('url');
const images = require('images');
const cookieParser = require('cookie-parser');
const randomString = require('randomstring');
const mysql = require('mysql');
const http = require('http');
const bodyParser = require('body-parser')
const validator = require('validator')
const createDOMPurify = require('dompurify')
const jsdom = require('jsdom')
const window = jsdom.jsdom('', {
  features: {
    FetchExternalResources: false,
    ProcessExternalResources: false
  }
}).defaultView
const DOMPurify = createDOMPurify(window)

const app = express();
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

// MySQL Connection
const trackingConnection = mysql.createConnection({
  host: 'localhost',
  user: process.argv[2],
  password: process.argv[3],
  database: 'tracking'
});

const formConnection = mysql.createConnection({
  host: 'localhost',
  user: process.argv[2],
  password: process.argv[3],
  database: 'mohamey_forms'
});
// Connect to MySql Database
// try{
//   connection.connect();
// }catch(e){
//   console.err(e)
// }

app.on('request', function(req, res){
  // console.log("REQUEST: "+req.url);
});

app.get('/', function(req, res){
  // If no cookie has been sent with the request, generate a new one for tge user
  if(req.cookies.cid == undefined){
    res.cookie('cid', randomString.generate(30), {'path':'/'});
  }
  res.set('content-type','text/html');
  res.sendFile(__dirname+'/index.html');
});

app.get('/thanks', function(req, res){
  // If no cookie has been sent with the request, generate a new one for tge user
  if(req.cookies.cid == undefined){
    res.cookie('cid', randomString.generate(30), {'path':'/'});
  }
  res.set('content-type', 'text/html');
  res.sendFile(__dirname+'/thanks.html');
});

// Handle form submissions
app.post('/thanks', function(req, res){
  // Save form details to database
  const formSql = "INSERT INTO form_submissions (Name, Email, Message) VALUES (?, ?, ?)"
  const formValues = [DOMPurify.sanitize(req.body.name), DOMPurify.sanitize(req.body.email), DOMPurify.sanitize(req.body.message)]
  const formQuery = mysql.format(formSql, formValues)
  try{
    const formSubmission = formConnection.query(formQuery, (err, result) => {
      if (err) {
        console.log(err)
      }
    })
  } catch (err) {
    console.err(err)
  }

  res.set('content-type', 'text/html')
  res.sendFile(`${__dirname}/thanks.html`)
})

app.get('/snake', function(req, res){
  // If no cookie has been sent with the request, generate a new one for tge user
  if(req.cookies.cid == undefined){
    res.cookie('cid', randomString.generate(30), {'path':'/'});
  }
  res.set('content-type', 'text/html');
  res.sendFile(__dirname+'/GAMEZ.html');
});

app.get('/tracking-pixel', function(request, result){
  // If no cookie has been sent with the request, generate a new one for tge user
  if(req.cookies.cid == undefined){
    res.cookie('cid', randomString.generate(30), {'path':'/'});
  }

  images(1,1)
    .fill(255,255,255)
    .save('p.jpg');
  result.set('content-type','image/jpg');
  result.sendFile(__dirname+'/p.jpg');

  var usersSql = "INSERT INTO users (cookie, ip_address, user_agent) VALUES (?, ? ,?)";
  var userValues = [request.cookies.cid, request.ip, request.headers['user-agent']];

  var historySql = "INSERT INTO user_history (cookie, domain, history, page_title) VALUES (?, ? ,?, ?)";
  var historyValues = [request.cookies.cid, request.hostname, request.query.url, request.query.title];
  usersSql = mysql.format(usersSql, userValues);
  historySql = mysql.format(historySql, historyValues);

  var userQuery = trackingConnection.query(usersSql, function(err, result){
    // console.log("Updated users database");
    if (err) {
      console.err(err)
    }
  });

  var historyQuery = trackingConnection.query(historySql, function(err, result){
    // console.log("Updated history database");
    if (err){
      console.err(err)
    }
  });
});

app.listen(8080, () => {})
// http.createServer(app).listen(8000, 'localhost');
console.log("Server running at http://127.0.0.1:8080/");
