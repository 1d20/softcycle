StageController = ($http, stage, $routeParams) ->
	self = @
	console.log $routeParams
	window["GameStage#{$routeParams.id}"]()

angular.module 'soft.controllers.StageController', []
	.controller 'StageController', ['$http', 'stage', '$routeParams', StageController]