"use strict";

var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.get('/', function (req, res) {
    res.render('index');
});
app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
});

module.exports = app;
