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
    xdescribe("resetSettingsTest", function(){
        it("case1", function(){
            $scope.settings = 'test';
            $scope.resetSettings();
            expect($scope.settings).toBe('placeholder');
        });
    });
    //case is meant to check if getBuildings() populates $scope.buildings with strings
    xdescribe("getBulidingsTest", function(){
        it("case2", function(){
            $scope.defaultLocation = 'test';
            var testSample = ['placeholder1', 'placeholder2', 'placeholder3'];
            $scope.defaultLocation.buildings = testSample;
            $scope.getBuildings();
            expect($scope.buildings).toBe(testSample);
        });
    });

});