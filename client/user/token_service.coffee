class TokenService

  constructor: (@localStorageService) ->
    @token_key = 'token'

  save: (token) ->
    @localStorageService.set(@token_key, token)

  get: () ->
    @localStorageService.get(@token_key)

  delete: () ->
    @localStorageService.remove(@token_key)

client.service 'token_service', TokenService
