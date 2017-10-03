//used to test
describe('authContr', function(){

    beforeEach(module('batchApp'));
    var $controller;
    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));
    it("practice test", function(){
        var $scope = {};
        var controller = $controller('settingsCtrl', { $scope: $scope });
        $scope.poo.settings = 'ass';
        $scope.check('buns');
        expect($scope.poo.settings).not.toBe('ass');
    });


});