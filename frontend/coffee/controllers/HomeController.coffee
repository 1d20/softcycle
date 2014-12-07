HomeController = ($http, Profile) ->
	self = @
	self.username = ''
	self.email = ''
	
	Profile
		.getData()
		.success (data) ->
			self = angular.extend self, data

angular.module 'soft.controllers.HomeController', []
	.controller 'HomeController', ['$http', 'Profile', HomeController]
