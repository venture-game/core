class UserController

    constructor: (@user_service, @token_service, @$location, @$mdDialogm, @$scope, @ACCOUNT_SERVICE) ->
        @$scope.profile = null
        if @is_logged_in()
            @populate_profile()

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

    populate_profile: () ->
        @user_service.get_profile()
        .then (res) =>
            @$scope.profile = res
        , (res) =>
            console.log res


UserController.$inject = ['user_service', 'token_service', '$location', '$mdDialog', '$scope', 'ACCOUNT_SERVICE']

client.controller 'User', UserController
