"use strict";

function routes($routeProvider, auth) {
    $routeProvider.
        when('/login', {
            templateUrl: 'partials/login.jade'
        })
        .when('/register', {
            templateUrl: 'partials/register.jade'
        })
        .otherwise({
            redirectTo: '/'
        })
}
