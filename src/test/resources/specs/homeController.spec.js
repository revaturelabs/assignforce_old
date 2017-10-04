describe('homeControllerTest', function(){
    var $controller;
    var $scope = {};
    var ctrl;
    beforeEach(function(){
        module('batchApp');
        inject(function(_$controller_){
                // The injector unwraps the underscores (_) from around the parameter names when matching
                $controller = _$controller_;
        });
        ctrl = $controller('homeCtrl', { $scope: $scope });
    });
    describe("testable1", function(){
            it("case1", function(){
                var result = $scope.calcProgress(100, 50);
                expect(result).toBe(100);
            });
            it("case2", function(){
                var result = $scope.calcProgress(50, 100);
                expect(result).toBe(50/100);
            });
            it("case3", function(){
                var result = $scope.calcProgress(-10, 100);
                expect(result).toBe(0);
            });

            it("case4", function(){
                var result = $scope.calcProgress(0, 0);
                expect(isNaN(result)).toBe(true);
            });
            it("case5", function(){
                var result = $scope.calcProgress(50, 100);
                expect(result).toBe(50/100);
            });
            it("case6", function(){
                var result = $scope.calcProgress('AVAILABLE', 'anything');
                expect(result).toBe(100);
            });
            it("case7", function(){
                var result = $scope.calcProgress('UNAVAILABLE', 'anything');
                expect(result).toBe(0);
            });
            it("case8", function(){
                var result = $scope.calcProgress('OTHER', 'anything');
                expect(isNaN(result)).toBe(true);
            });
            it("case8", function(){
                var result = $scope.calcProgress('OTHER', 'anything');
                expect(isNaN(result)).toBe(true);
            });
            it("case8", function(){
                var result = $scope.calcProgress('OTHER', 'anything');
                expect(isNaN(result)).toBe(true);
            });
    });
});