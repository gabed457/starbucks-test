var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var eventsRouter = require('./routes/events');

var app = express();

// view engine setup
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', eventsRouter);

const defaultPort = process.env.PORT || 8000;
if(process.env.NODE_ENV === 'test') {
    module.exports = (port) => {
        port = port || defaultPort
        console.log(`listening at http://localhost:${port}`)
        return app.listen(port);
    };
} else {
    console.log(`listening at http://localhost:${defaultPort}`)
    app.listen(defaultPort);
    module.exports = app;
}