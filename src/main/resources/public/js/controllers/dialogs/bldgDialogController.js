var assignforce = angular.module("batchApp");

assignforce.controller("bldgDialogCtrl", function($scope, $mdDialog,
		locationService, buildingService) {
	// console.log("Beginning building dialog controller.");
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
			} else if (bdc.state == "create") {
				bdc.building.location = bdc.location.id; //saves the location id reference to building
				bdc.location.buildings.push(bdc.building);
			}
//TODO may have to adjust this to have building contain location
//			buildingService.update(bdc.building, function() {
//				$mdDialog.hide();
//			}, function() {
//				$mdDialog.cancel();
//			});
			buildingService.create(bdc.building, function() {
				$mdDialog.hide();
			}, function() {
				$mdDialog.cancel();
			});

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
					building.name = newbuilding.name;
				}
			});
		}
	};

	// data

//	if (bdc.building.name.split("-").length > 1) {
//		bdc.building = bdc.building.name.split("-")[0].trim();
//		bdc.building.name = bdc.building.name.split("-")[1]
//				.trim(); 
//	} else {
//		bdc.building = "";
//	}

	// page initialization
	// data gathering
	locationService.getAll(function(response) {
		// console.log(" (bdc) Retrieving all locations.")
		bdc.locations = response;
		if (bdc.state == "create") {
			bdc.title = "Add new building to " + bdc.location.name;
		} else if (bdc.state == "edit") {
			bdc.findLocationFromBuilding();
			bdc.title = "Edit " + bdc.building.name + " at "
					+ bdc.location.name;
		}
	}, function(error) {
		// console.log(" (bdc) Failed to retrieve all locations with error:",
		// error.data.message);
		$mdDialog.cancel();
	});
});
