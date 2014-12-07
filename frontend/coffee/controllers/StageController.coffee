StageController = ($log, $scope, $http, stage, $routeParams, $window) ->
	self = @

	stage = $routeParams.id

	stage.title = '';
	stage.description = '';
	stage.rules = '';
	stage.highscore = [];
	stage.highscores = [];

	gameFinished = ->
		$http.post "/api/stage/#{stage}/", {score: self.game.result}
			.success (data) ->
				console.log data
			.error (data) ->
				console.log data

	$window["GameStage#{stage}"].init $scope, gameFinished
	self.game = $window["GameStage#{stage}"].game

	console.log self.game
	
	self

angular.module 'soft.controllers.StageController', []
	.controller 'StageController', ['$log', '$scope', '$http', 'stage', '$routeParams', '$window', StageController]
