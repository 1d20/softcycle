StageController = ($http, stage, $routeParams) ->
	self = @
	console.log $routeParams
	window.DesignGame()

angular.module 'soft.controllers.StageController', []
	.controller 'StageController', ['$http', 'stage', '$routeParams', StageController]
