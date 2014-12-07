Stage = ($http) ->
	service =
		getStage: (id) ->
			$http.get "/api/stage/#{id}"

angular.module 'soft.services.Stage', []
	.service 'Stage', ['$http', Stage]

