//used to test
describe('settingsControllerTest', function(){
    var $controller;
    var $scope = {};
    var ctrl;
    var should;
    var shouldNot;
    var actual;

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
            ctrl.settings = 'test';
            ctrl.resetSettings();
            actual = ctrl.settings;
            should = 'placeholder';
            expect(actual).toBe(should);
        });
    });
    //case is meant to check if getBuildings() populates ctrl.buildings with strings
    xdescribe("getBuildingsTest", function(){
        it("should move the buildings in the default location into the buildings variable", function(){
            should = ctrl.buildings;
            ctrl.getBuildings();
            actual = ctrl.buildings;
            expect(actual).not.toBe(should);
        });
    });
});