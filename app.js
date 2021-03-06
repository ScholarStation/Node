var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//Adds the files to the project?
var routes = require('./routes/index');
var users = require('./routes/users');
var loginApp = require('./routes/LoginUtility');
var profileApp = require('./routes/ProfileUtility');
var dashBoard = require(('./routes/dashBoard'));
var errorPage = require(('./routes/error'));
var studyUtil = require(('./routes/StudyUtility'));
var courseList = require(('./routes/CourseListUtility'));
var feedback = require(('./routes/FeedBackUtility'));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//defines the site extensions for each route
app.use('/', routes);
app.use('/users', users);
app.use('/LoginUtility', loginApp);
app.use('/ProfileUtility', profileApp);
app.use('/StudyUtility', studyUtil);
app.use('/dashBoard', dashBoard);
app.use('/error', errorPage);
app.use('/CourseList',courseList);
app.use('/FeedBackUtility',feedback);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
