"use strict";

var express = require('express'),
    app = express(),
    seneca = require('seneca')().client(),
    path = require('path'),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/login', function(req, res, next) {
});

module.exports.client = app;
