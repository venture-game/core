"use strict";

angular.module('client', ['ngMaterial', 'ngRoute'])
    .factory('authInterceptor', authInterceptor)
    .service('user', userService)
    .service('auth', authService)
    .constant('ACCOUNT_SERVICE', 'http://localhost:3001/account')
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    })
    .controller('Main', MainCtrl)
    .config(['$routeProvider', routes])
    .config(function($mdThemingProvider, $mdIconProvider){
        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu"       , "./assets/svg/menu.svg"        , 24)
            .icon("share"      , "./assets/svg/share.svg"       , 24)
            .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
            .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
            .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
            .icon("account"    , "./assets/svg/ic_account_circle_48px.svg", 512)
            .icon("phone"      , "./assets/svg/phone.svg"       , 512);

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('purple');

    });

function routes($routeProvider) {
    $routeProvider.
        when('/login', {
            templateUrl: 'partials/login.jade'
        })
        .when('/register', {
            templateUrl: 'partials/register.jade'
        })
}

function authInterceptor(ACCOUNT_SERVICE, auth) {

    return {
        // automatically attach Authorization header
        request: function(config) {
            var token = auth.getToken();
            if(config.url.indexOf(ACCOUNT_SERVICE) === 0 && token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        },

        // If a token was sent back, save it
        response: function(res) {
            if(res.config.url.indexOf(ACCOUNT_SERVICE) === 0 && res.data.token) {
                auth.saveToken(res.data.token);
            }
            return res;
        }
    }
}

function authService($window) {
    var self = this;

    self.saveToken = function(token) {
        $window.localStorage['jwtToken'] = token;
    };

    self.getToken = function() {
        return $window.localStorage['jwtToken'];
    };

    self.deleteToken = function() {
        $window.localStorage.removeItem('jwtToken');
    };

    self.isAuthed = function() {
        return Boolean(self.getToken());
    }
}

function userService($http, ACCOUNT_SERVICE, auth) {
    var self = this;

    self.register = function(email, password) {
        return $http.post(ACCOUNT_SERVICE + '/register', {
            email: email,
            password: password
        })
    };

    self.login = function(email, password) {
        return $http.post(ACCOUNT_SERVICE + '/login', {
            account_id: email,
            password: password
        })
    };

    self.logout = function() {
        auth.deleteToken();
    }
}

// We won't touch anything in here
function MainCtrl(user, auth) {
    var self = this;

    function handleRequest(res) {
        var token = res.data ? res.data.token : null;
        if(token) { console.log('JWT:', token); }
        self.message = res.data.message;
    }

    self.login = function() {
        user.login(self.email, self.password)
            .then(function(res) {
                if (!res.data.account_id) {
                    self.register(self.email, self.password)
                } else if(res.data.account_id && !res.data.authenticated) {
                    console.log('Auth failed')
                } else {
                    socket.emit('user logged in', self.email);
                }
            },
            handleRequest)
    };
    self.register = function() {
        user.register(self.email, self.password)
            .then(handleRequest, handleRequest)
    };
    self.logout = function() {
        user.logout();
        socket.emit('user logged out');
    };
    self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
    }
}
