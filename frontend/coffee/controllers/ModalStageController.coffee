ModalStageController = ($scope, $modalInstance, stage) ->
	self = @
	self.stage = stage;

	self.ok = ->
		$modalInstance.close stage

	self.cancel = ->
		$modalInstance.dismiss 'cancel'

	self

angular.module 'soft.controllers.ModalStageController', []
	.controller 'ModalStageController', ['$scope', '$modalInstance', 'stage', ModalStageController]
