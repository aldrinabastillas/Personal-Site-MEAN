/* Modules */
var http = require('http');
var express = require('express');
var path = require('path');

/* Server Set-Up */
var server = express();
var port = process.env.port || 1337;

/* Middleware */
server.use(express.static('public'));

/* Routes */
var router = require('./router');
server.use('/', router);

server.listen(port, () => {
    console.log("server.js listening on port " + port);
});