"use strict";

var express = require('express'),
    app = express(),
    seneca = require('seneca')(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function(id, password, done) {
    process.nextTick(function() {
        seneca.act('service:account,action:check', {account_id: id, password: password}, function (error, res) {
            if (res.passed) {
                seneca.act('service:account,action:get', {account_id: id}, function (error, res) {
                    return done(null, res);
                });
            } else {
                return done(null, false, {message: 'Auth failed'});
            }
        })
    });
}));

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            console.log('- auth failed');
            return next();
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            console.log('- auth succeeded')
        });
    })(req, res, next);
});

module.exports.client = app;
