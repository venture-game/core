class TokenService

  constructor: (@localStorageService) ->
    @token_key = 'token'

  save: (token) ->
    @localStorageService.set(@token_key, token)

  get: () ->
    @localStorageService.get(@token_key)

  delete: () ->
    @localStorageService.remove(@token_key)

  payload: () ->
    token = @get()
    payload = atob token.split('.')[1]
    JSON.parse payload

client.service 'token_service', TokenService
