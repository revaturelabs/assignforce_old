
var assignforce = angular.module( "batchApp");

assignforce.controller("settingsCtrl", function ($scope, settingService, locationService) {
    var sc = this;


    //functions
        //calls Show Toast method of aCtrl
    sc.showToast = function (message) {
        $scope.$parent.aCtrl.showToast(message);
    };

    sc.updateSettings = function () {

        for(var i = 0; i < sc.settings.length-1; i++){
            //setting the default location in settings
            if (i == 2){
                sc.settings[i].settingValue = sc.defaultLocation.id;
            }

            //save each setting
            settingService.update(sc.settings[i], function (success) {
                status = true;
            }, function (error) {
                status = false;
            });

        }

        if(status){
            sc.showToast("Settings updated!");
            status = false;
        } else {
            sc.showToast("Failed to update!");
        }
    };

    sc.resetSettings = function () {
        for(var i = 0; i < sc.settings.length-1; i++){
            switch (i){
                case 0:
                    sc.settings[i].settingValue = 5;
                    break;

                case 1:
                    sc.settings[i].settingValue = 12;
                    break;

                case 2:
                    sc.settings[i].settingValue = 1;
                    break;

                case 3:
                    sc.settings[i].settingValue = 1;
                    break;
            }

            //save each setting
            settingService.update(sc.settings[i], function (success) {
                status = true;
            }, function (error) {
                status = false;
            });

        }

        if(status){
            sc.showToast("Settings updated!");
            status = false;
        } else {
            sc.showToast("Failed to update!");
        }
    };

    //Get all Settings
    settingService.getAll( function (response) {
        sc.settings = response;
        //this will initialize the Locations variable after the settings are loaded in.
        sc.getLocations();
    }, function (error) {
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
        }, function (error) {
            sc.showToast("could not fetch locations.");
        });
    };


    //data
    sc.defaultLocation;
    sc.settings;
    sc.locations;
    var status = false;



    // angular.forEach(values, function(value, key) {
    //     this.push(key + ': ' + value);
    // }, log);
    // expect(log).toEqual(['name: misko', 'gender: male']);

    //Get one setting by its ID
    // settingService.getById(1, function (response) {
    //     sc.setting = response;
    //     console.log(sc.setting);
    // }, function (error) {
    //     sc.showToast("Setting not found");
    // })
});
