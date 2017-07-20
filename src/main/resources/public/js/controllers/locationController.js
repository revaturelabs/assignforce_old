
var assignforce = angular.module("batchApp");

assignforce.controller("locationCtrl", function($scope, $filter, $mdDialog, locationService, buildingService, roomService) {
	var lc = this;

	$scope.isManager = false;

	// functions
	// calls showToast method of aCtrl
	lc.showToast = function(message) {
		$scope.$parent.aCtrl.showToast(message);
	};

	// opens building list for locations
	lc.openLocation = function(location) {
		if ($filter("activeItem")(location.buildings).length > 0) {
			var id = "#loc" + location.id;
			$(id).slideToggle();
		}
	};
	// opens room list for buildings
	lc.openBuilding = function(building) {
		if ($filter("activeItem")(building.rooms).length > 0) {
			var id = "#bldg" + building.id;
			$(id).slideToggle();
		}
	};

	// adds location
	lc.addLocation = function() {
		$mdDialog.show({
			templateUrl : "html/templates/dialogs/locationDialog.html",
			controller : "locationDialogCtrl", //locationDialogController.js
			controllerAs : "ldCtrl",
			locals : {
				location : locationService.getEmptyLocation(),
                title    : "Creating a Location",
				state : "create"
			},
			bindToController : true,
			clickOutsideToClose : true
		}).then(function() {
			lc.showToast("Location created.");
			lc.repull();
		}, function() {
			lc.showToast("Failed to create location.");
		});
	};

	// add building
	lc.addBuilding = function() {
		if (lc.selectedList.length > 1) {
			lc.showToast("Please select only one location.");
		}
		// indicates that the list item is actually a location and not something
		else if (lc.selectedList.length == 0) {
			lc.showToast("Please select a location.");
		} else if(lc.selectedList[0].buildings == undefined) {
            lc.showToast("Buildings can only be added to locations.");
        } else {
			$mdDialog.show({
				templateUrl : "html/templates/dialogs/buildingDialog.html",
				controller : "bldgDialogCtrl", //bldgDialogController.js
				controllerAs : "bldgCtrl",
				locals : {
					location : lc.selectedList[0],
					building : buildingService.getEmptyBuilding(),
                    title    : "Creating a Building",
					state : "create"
				},
				bindToController : true,
				clickOutsideToClose : true
			}).then(function() {
				lc.showToast("Building added.");
				lc.repull();
			}, function() {
				lc.showToast("Failed to add building.");
			});
		}
	};

	// add room to location
	lc.addRoom = function() {
		if (lc.selectedList.length > 1) {
			lc.showToast("Please select only one building.");
		}
		// indicates that the list item is actually a building and not a location
		else if (lc.selectedList.length == 0) {
			lc.showToast("Please select a building.");
		} else if (lc.selectedList[0].rooms == undefined) {
            lc.showToast("Rooms can only be added to Buildings.")
		} else {
			$mdDialog.show({
				templateUrl : "html/templates/dialogs/roomDialog.html",
				controller : "roomDialogCtrl", //roomDialogController.js
				controllerAs : "rdCtrl",
				locals : {
					building : lc.selectedList[0], //just a building object
                    room     : roomService.getEmptyRoom(),
                    title    : "Creating a Room",
					state    : "create"
				},
				bindToController : true,
				clickOutsideToClose : true
			}).then(function() {
				lc.showToast("Room added.");
				lc.repull();
			}, function() {
				lc.showToast("Failed to add room.");
			});
		}
	};

	// removes buildings from selectedList on location menu close
	lc.removeBuildings = function(location) {
		if (location.buildings.length > 0) {
			location.buildings.forEach(function(building) {
				var idx = lc.selectedList.indexOf(building);
				if (idx > -1) {
					lc.selectedList.splice(idx, 1);
				}
			});
		}
	};

	// edit location
	lc.editSelected = function() {

		if (lc.selectedList.length > 1) {
			lc.showToast("Please select only one item.");
		} else if (lc.selectedList.length == 0) {
			lc.showToast("Please select an item.");
		} else {
			// edit location
			//if statement checks if the selected has a list of buildings (only locations gots those)
			if (Array.isArray(lc.selectedList[0].buildings)) {
				$mdDialog.show({
					templateUrl : "html/templates/dialogs/locationDialog.html",
					controller : "locationDialogCtrl",
					controllerAs : "ldCtrl",
					locals : {
						location : lc.selectedList[0],
                        title    : "Edit Location",
						state : "edit"
					},
					bindToController : true,
					clickOutsideToClose : true
				}).then(function() {
					lc.showToast("Location updated.");
					lc.repull();
				}, function() {
					lc.showToast("Failed to update location.");
				});
			}
			//Edit Building
			else if(Array.isArray(lc.selectedList[0].rooms)){
				$mdDialog.show({
					templateUrl : "html/templates/dialogs/buildingDialog.html",
					controller : "bldgDialogCtrl",
					controllerAs : "bldgCtrl",
					locals : {
						building : lc.selectedList[0],
                        title    : "Edit Building",
						state : "edit"
					},
					bindToController : true,
					clickOutsideToClose : true
				}).then(function() {
					lc.showToast("Building updated.");
					lc.repull();
				}, function() {
					lc.showToast("Failed to update building.");
				});
			}
			//Edit Room
			else{
				$mdDialog.show({
					templateUrl : "html/templates/dialogs/roomDialog.html",
					controller : "roomDialogCtrl",
					controllerAs : "rdCtrl",
					locals : {
						room  : lc.selectedList[0],
                        title : "Edit Room",
						state : "edit"
					},
					bindToController : true,
					clickOutsideToClose : true
				}).then(function() {
					lc.showToast("Room updated.");
					lc.repull();
				}, function() {
					lc.showToast("Failed to update room.");
				});
			}
		}
	};

	// delete Room/Building/Location
	lc.deleteSelected = function() {
        if (lc.selectedList.length == 0) {
            lc.showToast("Please select an item.");
        } else {
            var summary = lc.categorizeSelected();
            $mdDialog.show({
                templateUrl: "html/templates/dialogs/deleteDialog.html",
                controller: "deleteDialogCtrl", //deleteDialogController.js
                controllerAs: "dCtrl",
                locals: {
                    location: lc.selectedList[0].location,
                    list: lc.selectedList,
                    summary: summary
                },
                bindToController: true,
                clickOutsideToClose: true
            }).then(function () {
                lc.showToast(lc.formatMessage(summary) + " inactivated.");
                lc.showToast("Item inactivated.");
                lc.repull();
            }, function () {
                lc.showToast("Failed to inactivate rooms/buildings/locations.");
            });
        }
	};

	// formats toast message based on deletion summary
	lc.formatMessage = function(summary) {

		var message = "";
		if (summary.rooms == 1) {
			message += "1 room";
		} else if (summary.rooms > 1) {
			message += summary.rooms + " rooms";
		}
		
		if(summary.buildings == 1) {
			message += "1 building";
		} else if (summary.buildings > 1){
			message += summary.buildings + " buildings";
		}

		if (summary.locations == 1) {
			if (summary.rooms > 0) {
				message += " and ";
			}
			message += "1 location";
		} else if (summary.locations > 1) {
			if (summary.rooms > 0) {
				message += " and ";
			}
			message += summary.locations + " locations";
		}
		return message;
	};

	// counts the number of rooms/buildings/locations selected
	lc.categorizeSelected = function() {

		var summary = {
			rooms : 0,
			buildings: 0,
			locations : 0
		};

		if (lc.selectedList.length > 0) {
			lc.selectedList.forEach(function(item) {
				// Building was selected
				if (Array.isArray(item.rooms)) {
					item.rooms.forEach(function(room){
						if(room.active){
							summary.rooms++;
						}
					});
					summary.buildings++;
				}
				// Location was selected
				else if (Array.isArray(item.buildings)){
					item.buildings.forEach(function(building){
						if(building.active){
							summary.buildings++;
						}						
						building.rooms.forEach(function(room){
							if (room.active){
								summary.rooms++;
							}
						})
					});
					summary.locations++;
				}
				// Else item is a room
				else{
					summary.rooms++;
				}
			});
		}

		return summary;
	};

	// checks box if location/room is in selectedList
	lc.exists = function(obj) {
		return lc.selectedList.indexOf(obj) > -1;
	};

	// adds/removes location/room from selectedList
	lc.toggle = function(obj) {

		var idx = lc.selectedList.indexOf(obj);
		if (idx == -1) {
			lc.selectedList.push(obj);
		} else {
			lc.selectedList.splice(idx, 1);
		}
	};

	// tests whether room list of given location is visible
	lc.visible = function(location) {

		var element = $("#loc" + location.id)[0];
		if (!element) {
			return false;
		} else {
			var style = window.getComputedStyle(element);
			return style.display == "none";
		}
	};

	// repulls all locations
	lc.repull = function() {
		lc.locations = undefined;
		lc.selectedList = [];
		locationService.getAll(function(response) {
			lc.locations = response;
		}, function() {
			lc.showToast("Could not fetch locations.");
		});
	};

	// data
	lc.selectedList = [];

	// page initialization
	// data gathering
	locationService.getAll(function(response) {
		lc.locations = response;
	}, function() {
		lc.showToast("Could not fetch locations.");
	});

});
