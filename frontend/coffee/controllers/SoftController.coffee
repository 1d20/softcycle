SoftController = ($http, Profile) ->
	self = @
	self.username = ''
	self.email = ''

	Profile
		.getData()
		.success (data) ->
			self = angular.extend self, data

	self

angular.module 'soft.controllers.SoftController', []
	.controller 'SoftController', ['$http', 'Profile', SoftController]
