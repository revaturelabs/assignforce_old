//used to test
xdescribe('settingsControllerTest', function(){
    var $controller;
    var $scope = {};
    var ctrl;

    beforeEach(function(){
        module('batchApp');
        inject(function(_$controller_){
                // The injector unwraps the underscores (_) from around the parameter names when matching
                $controller = _$controller_;
        });
        ctrl = $controller('settingsCtrl', { $scope: $scope });
    });
    //checks if the dummy function resetSettings() works
    describe("resetSettingsTest", function(){
        it("should set the settings to placeholder", function(){
            $scope.self.settings = 'test';
            $scope.self.resetSettings();
            expect($scope.self.settings).toBe('placeholder');
        });
    });
    //case is meant to check if getBuildings() populates $scope.self.buildings with strings
    xdescribe("getBuildingsTest", function(){
        it("should move the buildings in the default location into the buildings variable", function(){
            $scope.self.getBuildings();
            expect($scope.self.buildings).toBe(testSample);
        });
    });
});