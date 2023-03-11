#!/usr/bin/env node

require('dotenv').config();


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var session = require('express-session')



var fileUpload = require('express-fileupload')
var db =require('./config/connection')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layouts', layoutDir: __dirname + '/views/layouts', partialDir: __dirname + '/views/partials' }))
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layouts',
  layoutDir: __dirname + '/ views/ layouts/',
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.use(fileUpload())
db.connect((err)=>{//connect to database
  if(err)
  console.log('connection error'+err)
  else
  console.log('connection established')
})



app.use(session({secret:'jojikey',cookie:{maxAge:300000}}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;

// ---------------------------------------------------------------------------------------------------
/**
 * Module dependencies.
 */


// var app = require("./app");
var debug = require("debug")("shopping-cart:server");
var http = require("http");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
// console.log("environment variable:", process.env.MONGO_URL);
/**
 * Create HTTP server.o
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
