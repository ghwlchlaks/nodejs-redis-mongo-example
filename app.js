// modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);

// router files
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const sessionRouter = require('./routes/session');
const mongoRouter = require('./routes/mongoose');

// config files
const redis = require('./config/redis');
const mongoose = require('./config/mongoose');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('mongoose connection!');
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'session',
  cookie: { maxAge : 1000 * 60 * 3}, //쿠키 유효시간 3분
  store: new RedisStore({
    client: redis
  })
}))

// default parent routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/session', sessionRouter);
app.use('/mongo', mongoRouter);

/* redis session example */
// redis session set
app.get('/session/set/:value', sessionRouter);
// redis session get
app.get('/session/get/:value', sessionRouter);

/* mongo get example */
app.get('/mongo/get', mongoRouter);


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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
