var createError = require('http-errors');
var express = require('express');
var path = require('path');

const connectDB = require('./server/config/db');
require('dotenv').config();

var rootRouter = require('./routes/index');
var { cors } = require('./routes/middleware/cors');
var app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors)

app.use('/', rootRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(res.statusCode || err.status || 500).send(err);
});

module.exports = app;
