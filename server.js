// requires
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// configs
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;

// route
// static
app.use('', express.static(path.join(__dirname, 'public')));

// general
var middleware = require('./router/middleware');
app.use('/middleware', middleware);
// api
var api = require('./router/api');
app.use('/api', api);

// execute
app.listen(port);
console.log("Server running on port: " + port);
