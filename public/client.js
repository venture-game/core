"use strict";

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
            username: email,
            password: password
        })
    };

    self.login = function(email, password) {
        $http.post(ACCOUNT_SERVICE + '/login', {
            account_id: email,
            password: password
        }).then(function(res) {
            if (!res.authenticated) {
                self.register(email, password)
            }
        });
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
            .then(handleRequest, handleRequest)
    };
    self.register = function() {
        user.register(self.email, self.password)
            .then(handleRequest, handleRequest)
    };
    self.logout = function() {
        user.logout()
    };
    self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
    }
}
