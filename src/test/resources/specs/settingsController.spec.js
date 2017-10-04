//used to test
describe('authContr', function(){

    beforeEach(module('batchApp'));
    var $controller;
    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));
    it("testable1", function(){
        var $scope = {};
        var controller = $controller('settingsCtrl', { $scope: $scope });
        $scope.settings = 'test';
        $scope.resetSettings();
        expect($scope.settings).toBe(null);
    });


});