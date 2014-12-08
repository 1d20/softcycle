StageController = ($log, $scope, $http, $routeParams, $window, stage, stats) ->
	self = @

	stageId = $routeParams.id

	self.stage = stage.data
	self.stats = stats.data
	self.title = stage.data.title;
	self.description = stage.data.description;
	self.rules = '';
	self.max_score = stats.data.max_score;
	self.scores = stats.data.scores;
	self.game = $window["GameStage#{stageId}"].game

	gameFinished = ->
		$http.post "/api/stage/#{stageId}/", {score: self.game.score}
			.success (data) ->
				self.max_score = data.max_score
				self.scores = data.scores
			.error (data) ->
				console.log data

	self.init = ->
		$window["GameStage#{stageId}"].init $scope, gameFinished
		
	self

angular.module 'soft.controllers.StageController', []
	.controller 'StageController', [
		'$log', 
		'$scope', 
		'$http', 
		'$routeParams', 
		'$window', 
		'stage', 
		'stats', 
		StageController
	]
