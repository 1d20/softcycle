Stage = ($http) ->
	service =
		getStage: (id) ->
			$http.get "/api/positions/#{id}"
		getStages: ->
			$http.get "/api/positions/"
		getStats: (id) ->
			$http.get "/api/stage/#{id}"

angular.module 'soft.services.Stage', []
	.service 'Stage', ['$http', Stage]

