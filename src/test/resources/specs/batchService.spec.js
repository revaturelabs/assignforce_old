//batch spec.js for protractor
xdescribe('batchServiceTest', function() {
    var batchService, httpBackend;
    var should;
    var shouldNot;
    var actual;
    beforeEach(function () {
        module('batchApp');
        inject(function ($httpBackend, _batchService_) {
            batchService = _batchService_;
            httpBackend = $httpBackend;
        });
    });
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
    describe('getEmptyBatchTest', function(){
           it('should return an empty batch', function() {
               should = null;
               actual = batchService.getEmptyBatch();
               expect(actual).not.toBe(should);
            });
    });
});