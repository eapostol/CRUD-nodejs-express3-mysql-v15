var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//load customers route
var customers = require('./routes/customers');
var app = express();
var connection  = require('express-myconnection');
var mysql = require('mysql');

// var users = require('./routes/user');

var app = express();

// view engine setup
// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(favicon());

//http://stackoverflow.com/questions/23494956/how-to-use-morgan-logger
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

/*------------------------------------------
 connection peer, register as middleware
 type koneksi : single,pool and request
 -------------------------------------------*/
app.use(

    connection(mysql,{

        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'nodejs'
    },'request')
);
//route index, hello world
app.get('/', routes.index);//route customer list

app.get('/customers', customers.list);//route add customer, get n post
app.get('/customers/add', customers.add);
app.post('/customers/add', customers.save);//route delete customer
app.get('/customers/delete/:id', customers.delete_customer);//edit customer route , get n post
app.get('/customers/edit/:id', customers.edit);
app.post('/customers/edit/:id',customers.save_edit);

app.use(app.router);

// app.get('/users', users.list);
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
