describe('locationControllerTest', function(){
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
        ctrl = $controller('locationCtrl', { $scope: $scope });
    });
    describe('openLocationTest', function(){

    });
    describe('openBuildingTest', function(){

    });
    describe('addLocationTest', function(){

    });
    describe('addBuildingTest', function(){

    });
    describe('addRoomTest', function(){

    });
    describe('removeBuildingsTest', function(){

    });
    describe('editSelectedTest', function(){

    });
    describe('deleteSelectedTest', function(){

    });
    describe('formatMessageTest', function(){

    });
    describe('categorizeSelectedTest', function(){

    });
    describe('existsTest', function(){

    });
    describe('toggleTest', function(){

    });
    describe('visibleTest', function(){

    });
    describe('repullTest', function(){

    });
});