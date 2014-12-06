StageController = ($http, stage, $routeParams) ->
	self = @
	console.log $routeParams

angular.module 'soft.controllers.StageController', []
	.controller 'StageController', ['$http', 'stage', '$routeParams', StageController]
