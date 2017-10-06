describe('settingsControllerTest', function(){
    var calendarService;
    var $scope = {};
    var should, shouldNot, actual;
    var param1, param2; //startDate, endDate,
    const secondsInDay = 86400;
    const milisecondsInSecond = 1000;
    const secondsInWeek = 604800;

    beforeEach(function(){
        module('batchApp');
        inject(function(_calendarService_){
                calendarService = _calendarService_;
        });
    });
    describe('countWeeksTest', function(){

        it('tests when param1<param2, should be some positive number', function(){
            param1 = 1000000;
            param2 = 2000000;
            should = Math.ceil(((param2-param1)/milisecondsInSecond)/secondsInWeek);
            actual = calendarService.countWeeks(param1, param2);
            expect(actual).toBe(should);
        });
        it('tests when param1===param2, should be 0', function(){
            param1 = 1000000;
            param2 = 1000000;
            should = 0;
            actual = calendarService.countWeeks(param1, param2);
            expect(actual).toBe(should);
        });
        it('tests when param1>param2, should be some negative number', function(){
            param1 = 2000000;
            param2 = 1000000;
            should = Math.ceil(((param2-param1)/milisecondsInSecond)/secondsInWeek);
            actual = calendarService.countWeeks(param1, param2);
            expect(actual).toBe(should);
        });
        it('tests when params are not numbers, should be true if actual is NaN', function(){
            param1 = "beef";
            param2 = "jerky";
            should = true;
            actual = calendarService.countWeeks(param1, param2);
            expect(isNaN(actual)).toBe(should);
        });
    });
    describe('countDaysTest', function(){
        var param1; //startDate
        var param2; //endDate
        const secondsInDay = 86400;
        const milisecondsInSecond = 1000;
        const secondsInWeek = 604800;
        it('tests when param1<param2, should be some positive number', function(){
            param1 = 1000000;
            param2 = 2000000;
            should = Math.ceil(((param2-param1)/milisecondsInSecond)/secondsInDay);
            actual = calendarService.countDays(param1, param2);
            expect(actual).toBe(should);
        });
        it('tests when param1===param2, should be 0', function(){
            param1 = 1000000;
            param2 = 1000000;
            should = 0;
            actual = calendarService.countDays(param1, param2);
            expect(actual).toBe(should);
        });
        it('tests when param1>param2, should be some negative number', function(){
            param1 = 2000000;
            param2 = 1000000;
            should = Math.ceil(((param2-param1)/milisecondsInSecond)/secondsInDay);
            actual = calendarService.countDays(param1, param2);
            expect(actual).toBe(should);
        });
        it('tests when params are not numbers, should be true if actual is NaN', function(){
            param1 = "beef";
            param2 = "jerky";
            should = true;
            actual = calendarService.countDays(param1, param2);
            expect(isNaN(actual)).toBe(should);
        });
    });
    describe('countSecondsTest', function(){
        it('tests when param1<param2, should be some positive number', function(){
            param1 = 1000000;
            param2 = 2000000;
            should = Math.ceil(((param2-param1)/milisecondsInSecond));
            actual = calendarService.countSeconds(param1, param2);
            expect(actual).toBe(should);
        });
        it('tests when param1===param2, should be 0', function(){
            param1 = 1000000;
            param2 = 1000000;
            should = 0;
            actual = calendarService.countSeconds(param1, param2);
            expect(actual).toBe(should);
        });
        it('tests when param1>param2, should be some negative number', function(){
            param1 = 2000000;
            param2 = 1000000;
            should = Math.ceil(((param2-param1)/milisecondsInSecond));
            actual = calendarService.countSeconds(param1, param2);
            expect(actual).toBe(should);
        });
        it('tests when params are not numbers, should be true if actual is NaN', function(){
            param1 = "beef";
            param2 = "jerky";
            should = true;
            actual = calendarService.countSeconds(param1, param2);
            expect(isNaN(actual)).toBe(should);
        });
    });
    describe('createDateTest', function(){
        it('tests when an invalid date is given, should be empty string', function(){
            param1 = "123beef";
            should = '';
            actual = calendarService.createDate(param1);
            expect(actual).toBe(should);
        });
        it('tests when valid date is given as a number, should be a date', function(){
            param1 = 12345;
            shouldNot = '';
            actual = calendarService.createDate(param1);
            expect(actual).not.toBe(shouldNot);
        });
        it('tests when valid date is given as a string, should be a date', function(){
            param1 = '12345';
            shouldNot = '';
            actual = calendarService.createDate(param1);
            expect(actual).not.toBe(shouldNot);
        });
    });
});