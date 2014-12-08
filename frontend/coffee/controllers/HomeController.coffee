HomeController = ($http, Stage) ->
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

	window.testInit()

	self

angular.module 'soft.controllers.HomeController', []
	.controller 'HomeController', ['$http', 'Stage', HomeController]
