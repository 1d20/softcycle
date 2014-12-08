HomeController = ($http, $location, $modal, Stage) ->
	self = @

	self.icons = [
		'fa-lightbulb-o'
		'fa-wrench'
		'fa-book'
		'fa-line-chart'
		'fa-picture-o'
		'fa-cogs'
		'fa-desktop'
		'fa-globe'
		'fa-briefcase'
		'fa-flag-checkered'
	]

	Stage.getStages()
		.success (data) ->
			self.states = data

	self.show = (stage) ->
		modalInstance = $modal.open {
			templateUrl: '/static/frontend/templates/modals/stage.html'
			controller: 'ModalStageController'
			controllerAs: 'modal'
			size: 'lg'
			resolve:
				stage: ->
					stage
		}

		modalInstance.result.then ->
			$location.path "/stage/#{stage.id}"

	window.testInit()

	self

angular.module 'soft.controllers.HomeController', []
	.controller 'HomeController', ['$http', '$location', '$modal', 'Stage', HomeController]
