var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var dbBrowser = require('./routes/db-browser');
var errorHandler = require('./routes/error');

var CONSTANTS = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
}

function beforeRouteSetup(app) {
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  // app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
}

function routeSetup(conn, app) {
  dbBrowser.registerRoutes(conn, app);
}

function afterRouteSetup(app) {
  // error handlers
  errorHandler.registerRoutes(app);
}

function MySQLConnection(mysql) {
  var connection = mysql.createConnection({
    host: CONSTANTS.host,
    user: CONSTANTS.user,
    password: CONSTANTS.password,
    database: CONSTANTS.database
  });
  connection.connect();
  return connection;
}

/** Entry Point */

function start(){
  var app = express();
  var conn = MySQLConnection(mysql);

  beforeRouteSetup(app);
  routeSetup(conn, app);
  afterRouteSetup(app);
  module.exports = app;
};
start();