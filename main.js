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
//   trackingConnection.connect();
//   formConnection.connect();
// }catch(e){
//   console.log(e)
// }

app.get('/', (req, res) => {
  // If no cookie has been sent with the request, generate a new one for tge user
  if(!req.cookies.cid){
    res.cookie('cid', randomString.generate(30), {'path':'/'});
  }
  res.set('content-type','text/html');
  res.sendFile(__dirname+'/index.html');
});

app.get('/thanks', (req, res) => {
  // If no cookie has been sent with the request, generate a new one for tge user
  if(!req.cookies.cid){
    res.cookie('cid', randomString.generate(30), {'path':'/'});
  }
  res.set('content-type', 'text/html');
  res.sendFile(__dirname+'/thanks.html');
});

// Handle form submissions
app.post('/thanks', (req, res) => {
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
    console.log(err)
  }

  res.set('content-type', 'text/html')
  res.sendFile(`${__dirname}/thanks.html`)
})

app.get('/snake', (req, res) => {
  // If no cookie has been sent with the request, generate a new one for tge user
  if(!req.cookies.cid){
    res.cookie('cid', randomString.generate(30), {'path':'/'});
  }
  res.set('content-type', 'text/html');
  res.sendFile(__dirname+'/GAMEZ.html');
});

app.get('/tracking-pixel', (request, result) => {
  // If no cookie has been sent with the request, generate a new one for tge user
  if(!request.cookies.cid){
    result.cookie('cid', randomString.generate(30), {'path':'/'});
  }

  images(1,1)
    .fill(255,255,255)
    .save('p.jpg');
  result.set('content-type','image/jpg');
  result.sendFile(__dirname+'/p.jpg');

  const usersSql = "INSERT INTO users (cookie, ip_address, user_agent) VALUES (?, ? ,?)";
  const userValues = [request.cookies.cid, request.ip, request.headers['user-agent']];

  const historySql = "INSERT INTO user_history (cookie, domain, history, page_title) VALUES (?, ? ,?, ?)";
  const historyValues = [request.cookies.cid, request.hostname, request.query.url, request.query.title];
  const userSqlQuery = mysql.format(usersSql, userValues);
  const historySqlQuery = mysql.format(historySql, historyValues);

  const userQuery = trackingConnection.query(userSqlQuery, (err, result) => {
    if (err) {
      console.log(err)
    }
  })

  const historyQuery = trackingConnection.query(historySqlQuery, (err, request) => {
    // console.log("Updated history database");
    if (err){
      console.log(err)
    }
  });
});

app.listen(8080, () => {})
// http.createServer(app).listen(8080, '10.131.24.117');
console.log("Server running at http://10.131.24.117/");
