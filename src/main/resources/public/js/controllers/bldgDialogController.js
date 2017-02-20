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
				bdc.swapBuilding(bdc.building);
				
				buildingService.update(bdc.building, function() {
					$mdDialog.hide();
				}, function() {
					$mdDialog.cancel();
				});
				
			} else if (bdc.state == "create") {
				bdc.building.location = bdc.location.id; //saves the location id reference to building
				bdc.location.buildings.push(bdc.building);
				
				buildingService.create(bdc.building, function() {
					$mdDialog.hide();
				}, function() {
					$mdDialog.cancel();
				});
				
			}

			

		}
	};

	// returns locations that contains given building
	bdc.findLocationFromBuilding = function() {

		if (bdc.locations != undefined) {
			bdc.locations.forEach(function(location) {
				if (location.buildings.length != 0) {
					location.buildings.forEach(function(building) {
						if (building.buildingID == bdc.building.buildingID) {
							bdc.location = location;
							return;
						}
					});
				}
			});
		}
	};

	// swaps editted building out for old one
	bdc.swapBuilding = function(newBuilding) {

		if (bdc.location.buildings.length == 0) {
			bdc.location.buildings.push(newBuilding);
		} else {
			bdc.location.buildings.forEach(function(building) {
				if (building.buildingID == newBuilding.buildingID) {
					building.name = newBuilding.name;
				}
			});
		}
	};

	// data



	// page initialization
	// data gathering
	locationService.getAll(function(response) {
		bdc.locations = response;
		if (bdc.state == "create") {
			bdc.title = "Add new building to " + bdc.location.name;
		} else if (bdc.state == "edit") {
			bdc.findLocationFromBuilding();
			bdc.title = "Edit " + bdc.building.name + " at "
					+ bdc.location.name;
		}
	}, function() {
		$mdDialog.cancel();
	});
});