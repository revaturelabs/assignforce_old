
var assignforce = angular.module( "batchApp");

assignforce.controller("settingsCtrl", function ($scope, settingService, locationService) {
    var sc = this;


    //functions
        //calls Show Toast method of aCtrl
    sc.showToast = function (message) {
        $scope.$parent.aCtrl.showToast(message);
    };

    //Get all Settings
    settingService.getAll( function (response) {
        sc.settings = response;
        console.log(sc.settings);
    }, function (error) {
        sc.showToast("Could not fetch settings.");
        console.log(error);
    });

    //get all locations
    locationService.getAll(function (response) {
        sc.locations = response;
        console.log(sc.locations);
    }, function (error) {
        sc.showToast("could not fetch locations.")
    })

    //Get one setting by its ID
    // settingService.getById(1, function (response) {
    //     sc.setting = response;
    //     console.log(sc.setting);
    // }, function (error) {
    //     sc.showToast("Setting not found");
    // })
});
