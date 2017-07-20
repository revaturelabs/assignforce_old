
var assignforce = angular.module( "batchApp");

assignforce.controller("settingsCtrl", function ($scope, settingService, locationService) {
    var sc = this;

    var isManager = false;

    //functions
        //calls Show Toast method of aCtrl
    sc.showToast = function (message) {
        $scope.$parent.aCtrl.showToast(message);
    };

    sc.resetSettings = function () {
        settingService.getAll(function(response){
            sc.settings = response;
        })
    };

    sc.updateSettings = function () {
        settingService.update(sc.settings, function(){
            sc.showToast("All settings have been updated")
        }, null);
    };

    //get all locations
    sc.getLocations = function() {
        locationService.getAll(function (response) {
            sc.locations = response;

            angular.forEach(sc.locations, function (location) {
                if (sc.settings.defaultLocation == location.id) {
                    sc.defaultLocation = location;
                    sc.buildings = [];
                	angular.forEach(location.buildings, function (building){
                		sc.buildings.push(building);
                	});
                }
            });
        }, function () {
            sc.showToast("could not fetch locations.");
        });
    };
    
    sc.getBuildings = function(){
        console.log("getting buildings")
    	sc.buildings = [];
    	angular.forEach(sc.defaultLocation.buildings, function(building){
    	    console.log(building);
    		sc.buildings.push(building);
    	})
    };

    //Get all Settings
    settingService.getGlobal( function (response) {
        sc.settings = response;
        sc.getLocations();//this will initialize the Locations variable after the settings are loaded in.

    }, function () {
        sc.showToast("Could not fetch settings.");
    });

    //data
    sc.defaultLocation;
    sc.settings;
    sc.locations;
});
