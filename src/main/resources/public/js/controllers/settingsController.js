
var assignforce = angular.module( "batchApp");

assignforce.controller("settingsCtrl", function ($scope, settingService, locationService, buildingService) {
    var sc = this;

    //functions
        //calls Show Toast method of aCtrl
    sc.showToast = function (message) {
        $scope.$parent.aCtrl.showToast(message);
    };

    sc.resetSettings = function () {
        for(var i = 0; i < sc.settings.length; i++){
            switch(sc.settings[i].settingId){
                case 1:
                    sc.settings[i].settingValue = 5;
                    break;
                case 2:
                    sc.settings[i].settingValue = 12;
                    break;
                case 5:
                    sc.settings[i].settingValue = 0;
                    break;
                case 6:
                    sc.settings[i].settingValue = 15;
                    break;
                case 7:
                    sc.settings[i].settingValue = 11;
                    break;
                case 8:
                    sc.settings[i].settingValue = 18;
                    break;
                default:
                    sc.settings[i].settingValue = 1;
                    break;
            }
            //add the rest of the settings

            //save each setting
            settingService.update(sc.settings[i]);
        }

        sc.showToast("Settings updated!");
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
    
    settingService.getById(3, function(response){
    	sc.defLoc = response;
    	console.log(sc.defLoc);
    }, function(){
    	sc.showToast("Unable to find default location");
    });
    
    //Get all Settings
    settingService.getAll( function (response) {
        sc.settings = response;
        sc.getLocations();//this will initialize the Locations variable after the settings are loaded in.
        //sc.getBuildings();
        
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
                if (sc.defLoc.settingValue == location.id) {
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
    }

    //ex of getting a single setting
    /*
    settingService.getById(1, function(response){
    	//success
    	sc.test = response;
    }, function(){
    	//failure
    });
*/

    //data
    sc.defaultLocation;
    sc.settings;
    sc.locations;
});
