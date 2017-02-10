
var assignforce = angular.module( "batchApp");

assignforce.controller("settingsCtrl", function ($scope, settingService, locationService) {
    var sc = this;


    //functions
        //calls Show Toast method of aCtrl
    sc.showToast = function (message) {
        $scope.$parent.aCtrl.showToast(message);
    };
    $scope.testing = {};
    sc.updateSettings = function () {

      console.log($scope.testing);
      for(var i = 0; i < sc.settings.length; i++){
          console.log(sc.settings[i].settingValue);
        }
    };

    //Get all Settings
    settingService.getAll( function (response) {
        sc.settings = response;
        console.log(sc.settings);
        sc.getLocations();
    }, function (error) {
        sc.showToast("Could not fetch settings.");
        console.log(error);
    });

    //get all locations
    sc.getLocations = function() {
        locationService.getAll(function (response) {
            sc.locations = response;
            console.log(sc.locations);

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
