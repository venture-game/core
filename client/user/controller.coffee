class UserController

  constructor: (@user_service, @token_service, @$location, @$mdDialog) ->

  handle_request: (res) ->
    token = if res.data then res.data.token else null
    if token then console.log "got token: #{token}"

  login: () ->
    @user_service.login @email, @password
      .then (res) =>
        if !res.data.authenticated
          console.log 'Auth failed'
        else
          socket.emit 'user logged in: ', self.email
          @$location.path '/'
      , @handle_request

  register: () ->
    @user_service.register @email, @password
      .then @handle_request, @handle_request

  logout: () ->
    @token_service.delete();
    socket.emit 'user logged out'
    @$location.path '/login'

  is_logged_in: () ->
    Boolean @token_service.get()

  get_id: () ->
    @token_service.payload().id



UserController.$inject = ['user_service', 'token_service', '$location', '$mdDialog']

client.controller 'User', UserController
