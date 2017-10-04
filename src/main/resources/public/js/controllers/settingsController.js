
var assignforce = angular.module( "batchApp");

assignforce.controller("settingsCtrl", function ($scope, $rootScope, settingService, locationService) {

    $scope.isManager = $rootScope.role === "VP of Technology";

    //functions
        //calls Show Toast method of aCtrl
    $scope.showToast = function (message) {
        $scope.$parent.aCtrl.showToast(message);
    };
    //testable1
    $scope.resetSettings = function () {
        $scope.settings = null;
    };

    $scope.updateSettings = function () {
        settingService.update($scope.settings, function(){
            $scope.showToast("All settings have been updated")
        }, null);
    };

    //get all locations
    //testable2
    $scope.getLocations = function() {
        locationService.getAll(function (response) {
            $scope.locations = response;

            angular.forEach($scope.locations, function (location) {
                if ($scope.settings.defaultLocation === location.id) {
                    $scope.defaultLocation = location;
                    $scope.buildings = [];
                	angular.forEach(location.buildings, function (building){
                		$scope.buildings.push(building);
                	});
                }
            });
        }, function () {
            $scope.showToast("could not fetch locations.");
        });
    };
    //testable3
    $scope.getBuildings = function(){

    	$scope.buildings = [];
    	angular.forEach($scope.defaultLocation.buildings, function(building){

    		$scope.buildings.push(building);
    	})
    };

    //Get all Settings
    settingService.getGlobal( function (response) {
        $scope.settings = response;
        $scope.getLocations();//this will initialize the Locations variable after the settings are loaded in.

    }, function () {
        $scope.showToast("Could not fetch settings.");
    });

    //data
    $scope.defaultLocation;
    $scope.settings;
    $scope.locations;
});
