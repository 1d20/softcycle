Profile = ($http) ->
	service =
		getData: ->
			$http.get '/api/profile'

angular.module 'soft.services.Profile', []
	.service 'Profile', ['$http', Profile]

