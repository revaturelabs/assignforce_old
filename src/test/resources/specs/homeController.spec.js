describe('homeControllerTest', function(){
    var $controller;
    var $scope = {};
    var ctrl;
    var actual;
    var should;

    beforeEach(function(){
        module('batchApp');
        inject(function(_$controller_){
                // The injector unwraps the underscores (_) from around the parameter names when matching
                $controller = _$controller_;
        });
        ctrl = $controller('homeCtrl', { $scope: $scope });
    });
    describe('calcProgressTest', function(){
            var param1;
            var param2;
            it("case1", function(){
                param1 = 100;
                param2 = 50;
                actual = $scope.calcProgress(param1, param2);
                should = 100;
                expect(actual).toBe(should);
            });
            it("case2", function(){
                param1 = 50;
                param2 = 100;
                actual = $scope.calcProgress(param1, param2);
                should = param1/param2;
                expect(actual).toBe(should);
            });
            it("case3", function(){
                param1 = -10;
                param2 = 100;
                actual = $scope.calcProgress(param1, param2);
                should = 0;
                expect(actual).toBe(should);
            });

            it("case4", function(){
                param1 = 0;
                param2 = 0;
                actual = $scope.calcProgress(param1, param2);
                should = true;
                expect(isNaN(actual)).toBe(should);
            });
            it("case5", function(){
                param1 = 'AVAILABLE';
                param2 = 'anything';
                actual = $scope.calcProgress(param1, param2);
                should = 100;
                expect(actual).toBe(should);
            });
            it("case6", function(){
                param1 = 'UNAVAILABLE';
                param2 = 'anything';
                actual = $scope.calcProgress(param1, param2);
                should = 0;
                expect(actual).toBe(should);
            });
            it("case7", function(){
                param1 = 'OTHER';
                param2 = 'anything';
                actual = $scope.calcProgress('OTHER', 'anything');
                should = true;
                expect(isNaN(actual)).toBe(should);
            });
            it("case8", function(){
                var today = new Date().getTime();
                param1 = today-1000000;
                param2 = today+1000000;
                actual = $scope.calcProgress(param1, param2);
                should = (100*(today-param1)/(param2-param1)).toFixed(5);
                expect(actual).toBe(should);
                x=100;
            });
            it("case9", function(){
                var today = new Date().getTime();
                param1 = today-2000000;
                param2 = today-1000000;
                actual = $scope.calcProgress(param1, param2);
                should = 100;
                expect(actual).toBe(should);
            });
            it("case10", function(){
                var today = new Date().getTime();
                param1 = today+1000000;
                param2 = today+2000000;
                actual = $scope.calcProgress(param1, param2);
                should = 0;
                expect(actual).toBe(should);
            });
            it("case11", function(){
                var today = new Date().getTime();
                param1 = today;
                param2 = today;
                actual = $scope.calcProgress(param1, param2);
                should = true;
                expect(isNaN(actual)).toBe(should);
            });
    });
    describe('checkAvailabilityTest', function(){
        var now;
        var start;
        var end;
        var param1;
        it('case1', function(){
             now = new Date().getTime();
             start = now-1000000;
             end = now+1000000;
             param1 = [{startDate: start, endDate: end}]
             actual = $scope.checkAvailability(param1);
             should = 'Unavailable';
             expect(actual).toBe(should);
        });
        it('case2', function(){
            param1 = null;
            actual = $scope.checkAvailability(param1);
            should = 'Available';
            expect(actual).toBe(should);
        });
        it('case3', function(){
            now = new Date().getTime();
            start = now+1000000;
            end = now+2000000;
            param1 = [{startDate: start, endDate: end}];
            actual = $scope.checkAvailability(param1);
            should = 'Available';
            expect(actual).toBe(should);
        });
    });
    describe('')
});