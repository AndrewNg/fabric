var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Gun = require('gun');
var fs = require('fs');
var modelCount = 0;

var routes = require('./routes/index');
var users = require('./routes/users');

// initialize gun
var gun = Gun({
    file: 'data.json'
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// endpoint for sending the final three.js object and STL file
app.post('/export', function(req, res) {
    console.log('writing to gun');
    gun.set({
        type: "STLFile",
        posi: modelCount,
        stl: req.body.stl,
        json: req.body.json
    }).key('model/' + modelCount);

    fs.writeFile("./public/javascripts/" + modelCount + ".stl", req.body.stl, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
    }
    });

    modelCount++;
    res.end((modelCount - 1).toString());
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
