
var assignforce = angular.module( "batchApp");

assignforce.controller("settingsCtrl", function ($scope, settingService, locationService) {
    var sc = this;


    //functions
        //calls Show Toast method of aCtrl
    sc.showToast = function (message) {
        $scope.$parent.aCtrl.showToast(message);
    };

    sc.updateSettings = function () {
        //setting the default location in settings
        sc.settings[2].settingValue = sc.defaultLocation.id;

        for(var i = 0; i < sc.settings.length-1; i++){
            //save each setting
            settingService.update(sc.settings[i], thing(), thing());
        }

        sc.showToast("Settings updated!");
    };

    var thing = function () {

    };

    sc.resetSettings = function () {

        sc.settings[0].settingValue = 5;
        sc.settings[1].settingValue = 12;
        sc.settings[2].settingValue = 1;
        sc.settings[3].settingValue = 1;

        for(var i = 0; i < sc.settings.length-1; i++){
            //save each setting
            settingService.update(sc.settings[i], thing(), thing());
        }

        sc.showToast("Settings updated!");
    };

    //Get all Settings
    settingService.getAll( function (response) {
        sc.settings = response;
        //this will initialize the Locations variable after the settings are loaded in.
        sc.getLocations();
    }, function () {
        sc.showToast("Could not fetch settings.");
    });

    //get all locations
    sc.getLocations = function() {
        locationService.getAll(function (response) {
            sc.locations = response;

            angular.forEach(sc.locations, function (location) {
                if (sc.settings[2].settingValue == location.id) {
                    sc.defaultLocation = location.name;
                }
            })
        }, function () {
            sc.showToast("could not fetch locations.");
        });
    };

    //data
    sc.defaultLocation;
    sc.settings;
    sc.locations;
});
