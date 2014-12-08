StageController = ($log, $scope, $http, $routeParams, $window, stage, stats) ->
	self = @

	stageId = $routeParams.id

	scoreTransform = (score) ->
		if(score)
			score: score.score
			date: new Date score.date

	self.stage = stage.data
	self.stats = stats.data
	self.title = stage.data.title;
	self.description = stage.data.description
	self.rules = ''
	self.max_score = scoreTransform stats.data.max_score
	self.scores = stats.data.scores.map scoreTransform

	self.game = $window["GameStage#{stageId}"].game


	gameFinished = ->
		$http.post "/api/stage/#{stageId}/", {score: self.game.score}
			.success (data) ->
				self.max_score = scoreTransform data.max_score
				self.scores = data.scores.map scoreTransform
			.error (data) ->
				console.log data

		$window["GameStage#{stageId}"].destroy()

	self.init = ->
		console.log 'init'
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
