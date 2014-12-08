SoftController = ($scope, $http, Profile) ->
	self = @
	self.username = ''
	self.email = ''

	getData = ->
		Profile
			.getData()
			.success (data) ->
				self = angular.extend self, data

	getData()

	$scope.$on 'updateStats', getData

	self.showStats = -> 
		console.log self

	self

angular.module 'soft.controllers.SoftController', []
	.controller 'SoftController', ['$scope', '$http', 'Profile', SoftController]
