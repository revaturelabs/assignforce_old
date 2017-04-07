
var assignforce = angular.module( "batchApp");

assignforce.controller("settingsCtrl", function ($scope, settingService, locationService) {
    var sc = this;

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

        for(var i = 0; i < sc.settings.length; i++){
            if(sc.settings[i].settingId == 3){
                sc.settings[i].settingValue = sc.defaultLocation.id;
            }
            else if (sc.settings[i].settingId == 23){
            	sc.settings[i].settingName = sc.defaultPattern;
            }
            else if (sc.settings[i].settingId == 9){
            	sc.settings[i].settingValue = sc.defaultBuilding.id;
            }
            //save each setting
            settingService.update(sc.settings[i]);
        }

        sc.showToast("Settings updated!");
    };
    
    //Get all Settings
    settingService.getAll( function (response) {
        sc.settings = response;
        sc.getLocations();//this will initialize the Locations variable after the settings are loaded in.
        
        sc.patterns = [];
        angular.forEach(sc.settings, function(pattern){
        	if (pattern.settingId > 14 && pattern.settingId < 23){
        		sc.patterns.push(pattern);
        	}
        	else if (pattern.settingId == 23){
        		sc.defaultPattern = pattern.settingName;
        	}
        })
        
    }, function () {
        sc.showToast("Could not fetch settings.");
    });

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
    	sc.buildings = [];
    	angular.forEach(sc.defaultLocation.buildings, function(building){
    		sc.buildings.push(building);
    	})
    };

    //data
    sc.defaultLocation;
    sc.settings;
    sc.locations;
});
