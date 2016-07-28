var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var http = require('http');
//var mysql = require('mysql');
//var request = require('request');
var fs = require('fs');
var util = require('util');
var app = express();
//app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
var sess;
var router = express.Router();
var swaggerTools = require('swagger-tools');
var serverPort = 8082;
var async = require('async');
// swaggerRouter configuration
var options = {
  swaggerUi: '/swagger.json',
  controllers: './controllers',
  useStubs: process.env.NODE_ENV === 'development' ? true : false, // Conditionally turn on stubs (mock mode)
  name: 'oauth2'
};
// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync('./api/swagger.json');
var swaggerDoc = JSON.parse(spec);

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());
console.log('middleware', JSON.stringify(middleware));
  // Provide the security handlers
  app.use(middleware.swaggerSecurity({
    tokenAuth: function (req, def, scopes, callback) {
      console.log('------------------swagger security check------------------');
      sess = req.session; 
      console.log('sess.auth_key: ', sess.auth_key);
      console.log("req.headers['authorization']: ", req.headers['authorization']);
      if(sess.auth_key == undefined || req.headers['authorization'] === ''){
         callback(new Error('Error in authentication. No login detected.'));
      }
      else if(sess.auth_key === req.headers['authorization']){
        callback();
      }
      else{
        callback(new Error('Error in authentication. Unauthorized.'));
      }
    }
  }));

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});

app.set('port', process.env.PORT || 9999);

app.set('view engine', 'jade');

app.use('/', router);

app.use(express.static(__dirname));

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/getTestPins', function (req, res) {
  console.log('hellooooo');
    
});

app.listen(app.get('port'));
WriteLog('Listening at ' + app.get('port'));

function WriteLog(message, type){
console.log(type || 'Success' + ': ' + message);
}