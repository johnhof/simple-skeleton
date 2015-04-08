var express      = require('express');
var colors       = require('colors');
var mon          = require('mongoman');
var routes       = require('./api/routes');
var err          = require('./api/lib/error');
var json         = require('express-json');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var cookieSession = require('cookie-session')

module.exports = startServer;
// if this is a test, dont run the setup functions
if (require.main !== module) {
  return;
}

//////////////////////////////////////////////////////////////////////////////////
//
// Connect to the mongo database
//
//////////////////////////////////////////////////////////////////////////////////

// if the connection is successful
mon.goose.connection.on("open", function (ref) {
  console.log("\n  Connected to mongo server!\n".blue);

  // register models
  mon.registerAll(__dirname + '/api/components', /_model$/i);

  // exec server startup
  startServer();
});

// if the connection fails
mon.goose.connection.on("error", function (err) {
  console.log("\n!! Could not connect to mongo server !! \n    Try running `[sudo] mongod` in another terminal\n".red);
  process.kill();
});

// connect to the localhost default database
mon.connect();


//////////////////////////////////////////////////////////////////////////////////
//
// Build and start the server
//
//////////////////////////////////////////////////////////////////////////////////

// allow sor log supression for the sake of tests
function startServer (portOverride, suppressLogs) {
  var server = express();

  // load the config.json file from the current directory
  server.config = require('config.json')();

  // apply midleware modules
  server.use(json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  server.use(cookieParser(server.config.secret));
  server.use(session({
    secret: server.config.secret,
    saveUninitialized: true,
    resave: true,
    cookie : {
      expires:  new Date(Date.now() + server.config.sessionLength)
    }
  }));

  // Deliver the static files defined in the config
  for (staticDir in server.config.staticMap) {
    server.use(staticDir, express.static(__dirname + server.config.staticMap[staticDir]));
  }

  // prime routes to set headers and log out route details
  server.use(function init (req, res, next) {
    // set response headers used in every request
    res.set({
      'Content-Type': 'application/json' // we will always return json
    });

    // log the request
    if (!suppressLogs) {
      console.log('  ' + (req.method).cyan.dim + ' ' + (req.url).grey.dim);
    }

    return next();
  });

  // register API routes
  routes.register(server);

  // register error handler
  server.use(err.errorHandler);

  // home should return the index.html page (in other words, our angular app)
  server.get('/', function (req, res) {
    // respond with html, instead of json
    res.set({ 'Content-Type': 'text/html; charset=utf-8' });

    // log the request and send the application file
    if (!suppressLogs) {
      console.log('  ' + (req.method).cyan.dim + ' ' + (req.url).grey.dim);
    }
    res.sendFile(__dirname + '/dist/index.html');

  });

  var finalPort = portOverride || process.env.NODE_PORT || server.config.port;
  server.listen(finalPort);

  if (!suppressLogs) {
    console.log('\n  Listening on port '.green + (finalPort + '').blue + '\n');
  }

  return server;
}