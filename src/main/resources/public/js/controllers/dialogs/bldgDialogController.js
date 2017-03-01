var assignforce = angular.module("batchApp");

assignforce.controller("bldgDialogCtrl", function($scope, $mdDialog,
		locationService, buildingService) {
	var bdc = this;

	// functions
	// close dialog
	bdc.cancel = function() {
		$mdDialog.cancel();
	};

	// save changes/new
	bdc.save = function(isValid) {

		if (isValid) {

			if (bdc.state == "edit") {
				buildingService.update( bdc.building, function () {
                    $mdDialog.hide();
                }, function () {
                    $mdDialog.cancel();
                });
			} else if (bdc.state == "create") {
				bdc.building.location = bdc.location.id; //saves the location id reference to building

				buildingService.create(bdc.building, function() {
                    $mdDialog.hide();
                }, function() {
                    $mdDialog.cancel();
                });
			}
		}
	};
});

