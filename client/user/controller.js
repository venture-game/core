// Generated by CoffeeScript 1.10.0
(function() {
  var UserController;

  UserController = (function() {
    function UserController(user_service, auth, $location) {
      this.user_service = user_service;
      this.auth = auth;
      this.$location = $location;
    }

    UserController.prototype.handle_request = function(res) {
      var token;
      token = res.data ? res.data.token : null;
      if (token) {
        return console.log("got token: " + token);
      }
    };

    UserController.prototype.login = function() {
      return this.user_service.login(this.email, this.password).then((function(_this) {
        return function(res) {
          if (!res.data.authenticated) {
            return console.log('Auth failed');
          } else {
            socket.emit('user logged in: ', self.email);
            return _this.$location.path('/');
          }
        };
      })(this), this.handle_request);
    };

    UserController.prototype.register = function() {
      return this.user_service.register(this.email, this.password).then(this.handle_request, this.handle_request);
    };

    UserController.prototype.logout = function() {
      this.auth.deleteToken();
      socket.emit('user logged out');
      return this.$location.path('/login');
    };

    UserController.prototype.is_logged_in = function() {
      return Boolean(this.auth.get_token());
    };

    return UserController;

  })();

  UserController.$inject = ['user_service', 'auth', '$location'];

  client.controller('User', UserController);

}).call(this);

//# sourceMappingURL=controller.js.map