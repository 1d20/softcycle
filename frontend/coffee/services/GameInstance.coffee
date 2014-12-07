GameInstance = ($window) ->
	service =
		Stage1: {}
		Stage2: {}
		Stage3: $window.GameStage3
		Stage4: {}
		Stage5: {}
		Stage6: {}
		Stage7: {}

angular.module 'soft.services.GameInstance', []
	.service 'GameInstance', ['$window', GameInstance]
