Profile = ($http, $location) ->
	service =
		getData: ->
			$http.get '/api/profile'
				.success (data) ->
					data
				.error (data) ->
					{}

angular.module 'soft.services.Profile', []
	.service 'Profile', ['$http', '$location', Profile]

