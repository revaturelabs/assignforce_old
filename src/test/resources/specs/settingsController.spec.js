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
        it("case1", function(){
            $scope.self.settings = 'test';
            $scope.self.resetSettings();
            expect($scope.self.settings).toBe('placeholder');
        });
    });
    //case is meant to check if getBuildings() populates $scope.self.buildings with strings
    describe("getBuildingsTest", function(){
        it("case1", function(){
            $scope.self.defaultLocation = 'test';
            var testSample = ['placeholder1', 'placeholder2', 'placeholder3'];
            $scope.self.defaultLocation.buildings = testSample;
            $scope.self.getBuildings();
            expect($scope.self.buildings).toBe(testSample);
        });
    });

});