"use strict";

var express = require('express'),
    app = express(),
    seneca = require('seneca')().client(),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('jade', require('jade').__express);
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

// AUTHENTICATION
passport.use(new LocalStrategy({usernameField: 'account_id'}, function(account_id, password, done) {
    process.nextTick(function() {
        seneca.act('service:account,action:check',
            {account_id: account_id, password: password},
            function (error, res) {
                if (error) {
                    console.log(error);
                    return done(error);
                }
                if (res.passed) {
                    seneca.act('service:account,action:get', {id: account_id}, function (error, res) {
                        return done(null, res);
                    });
                }
                if (!res.passed){
                    console.log(res);
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
            if (info) console.log('- info: '+ info.message);
            res.end();
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            console.log('- auth succeeded');
            console.log('- logged in user: '+req.user.id);
            res.end();
        });
    })(req, res, next);
});

module.exports.client = app;
