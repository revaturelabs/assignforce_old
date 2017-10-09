//Describing our tests for Report Controller!
xdescribe('reportControllerTest', function(){

    //These variables link the controller's scope and self to this test file
    //This enables us to access all of the controller's stuff
    var $controller;
    var $scope = {};
    var ctrl;

    //Variables for comparing our observations with our expectations
    var actual;
    var should;
    var shouldNot;

    //Injecting our controller into each test
    //Because injections are science, and science is cool
    beforeEach(function(){
        module('batchApp');
        inject(function(_$controller_){
                // The injector unwraps the underscores (_) from around the parameter names when matching
                $controller = _$controller_;
        });
        ctrl = $controller('reportCtrl', { $scope: $scope });
    });


    describe('calcProgressTest', function(){
            var param1;
            var param2;
            it("tests where param1>param2, should be 100", function(){
                param1 = 100;
                param2 = 50;
                actual = $scope.self.calcProgress(param1, param2);
                should = 100;
                expect(actual).toBe(should);
            });
            it("tests where param1<=param2, should be param1/param2", function(){
                param1 = 50;
                param2 = 100;
                actual = $scope.self.calcProgress(param1, param2);
                should = param1/param2;
                expect(actual).toBe(should);
            });
            it("tests where param1<0, should be 0", function(){
                param1 = -10;
                param2 = 100;
                actual = $scope.self.calcProgress(param1, param2);
                should = 0;
                expect(actual).toBe(should);
            });

            it("tests divide by zero, should be true, if actual is NaN", function(){
                param1 = 0;
                param2 = 0;
                actual = $scope.self.calcProgress(param1, param2);
                should = true;
                expect(isNaN(actual)).toBe(should);
            });
            it("tests where param1 is available, should be 100", function(){
                param1 = 'AVAILABLE';
                param2 = 'anything';
                actual = $scope.self.calcProgress(param1, param2);
                should = 100;
                expect(actual).toBe(should);
            });
            it("tests where param1 is unavailable, should be 0", function(){
                param1 = 'UNAVAILABLE';
                param2 = 'anything';
                actual = $scope.self.calcProgress(param1, param2);
                should = 0;
                expect(actual).toBe(should);
            });
            it("tests where param1 is something else, should be true if actual is NaN", function(){
                param1 = 'OTHER';
                param2 = 'anything';
                actual = $scope.self.calcProgress('OTHER', 'anything');
                should = true;
                expect(isNaN(actual)).toBe(should);
            });
            it("tests where today falls inbetween the date range of param1 and param2, should be that big equation", function(){
                var today = new Date().getTime();
                param1 = today-1000000;
                param2 = today+1000000;
                actual = $scope.self.calcProgress(param1, param2);
                should = (100*(today-param1)/(param2-param1)).toFixed(5);
                expect(actual).toBe(should);
            });
            it("tests where today is after the date range of param1 and param2, should be 100", function(){
                var today = new Date().getTime();
                param1 = today-2000000;
                param2 = today-1000000;
                actual = $scope.self.calcProgress(param1, param2);
                should = 100;
                expect(actual).toBe(should);
            });
            it("tests where today is before the data range of param1 and param2, should be 0", function(){
                var today = new Date().getTime();
                param1 = today+1000000;
                param2 = today+2000000;
                actual = $scope.self.calcProgress(param1, param2);
                should = 0;
                expect(actual).toBe(should);
            });
            it("tests where the start date(param1) and end date(param2) are equal, should be true if actual is NaN", function(){
                var today = new Date().getTime();
                param1 = today;
                param2 = today;
                actual = $scope.self.calcProgress(param1, param2);
                should = true;
                expect(isNaN(actual)).toBe(should);
            });
    });
    describe('checkAvailabilityTest', function(){
        var now;
        var start;
        var end;
        var param1;
        it('tests where now is between start and end, should be Unavailable', function(){
             now = new Date().getTime();
             start = now-1000000;
             end = now+1000000;
             param1 = [{startDate: start, endDate: end}]
             actual = $scope.self.checkAvailability(param1);
             should = 'Unavailable';
             expect(actual).toBe(should);
        });
        it('tests where param1 is null, should be Available', function(){
            param1 = null;
            actual = $scope.self.checkAvailability(param1);
            should = 'Available';
            expect(actual).toBe(should);
        });
        it('tests where now does not fall between any dates, should be Available', function(){
            now = new Date().getTime();
            start = now+1000000;
            end = now+2000000;
            param1 = [{startDate: start, endDate: end}];
            actual = $scope.self.checkAvailability(param1);
            should = 'Available';
            expect(actual).toBe(should);
        });
    });
    describe('findRoomsAvailableTest', function(){
        var param1;
        it('tests where param1 is null, should be 0', function(){
            param1 = null;
            actual = $scope.self.findRoomsAvailable(param1);
            should = 0;
            expect(actual).toBe(should);
        });
        it('tests where the param1 has dates available, should be 2', function(){
            now = new Date().getTime();
            start = now-1000000;
            end = now+1000000;
            param1 = [{startDate: start, endDate: end}, {startDate: start, endDate: end}];
            actual = $scope.self.findRoomsAvailable(param1);
            should = 2;
            expect(actual).toBe(should);
        });
    });
    describe('formatBatchesTest', function(){
            it('should return a populated array, and shouldNot return an empty array', function(){
                actual = $scope.self.formatBatches();
                shouldNot = [];
                expect(actual).not.toBe(shouldNot);
            });
    });
});