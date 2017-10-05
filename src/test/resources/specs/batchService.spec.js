//batch spec.js for protractor
describe('batchServiceTest', function() {
    var batchService, httpBackend;

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

    it('should have a title', function() {
        browser.get('http://localhost:8080/batches');

        expect(browser.getTitle()).toEqual('AssignForce');
    });

    it('getEmptyBatch', function () {

        var returnData = new Batch();

        expect(batchService.getEmptyBatch()).toEqual(returnData);

    });

});