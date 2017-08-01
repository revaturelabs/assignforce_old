/**
 * Created by gdittric on 7/14/2017.
 */
"use strict";

describe('Unavailable Service', function($resource) {
    var Unavailable = $resource('/api/v2/unavailable/:ID',{ID: '@ID'},{update:{method:'PUT'}})
    var batchApp;

    beforeEach(module("batchApp"));
    beforeEach(inject(function(_unavailableService_){
        batchApp = _unavailableService_;
    }));

    it('should exist', function(){
        expect(batchApp).toBeDefined();
    })

    it("getEmptyUnavailableTest", function(){
        var testObj = batchApp.getEmptyUnavailable();
        expect(testObj).toBeDefined();
        expect(testObj).toBeTruthy();
        expect(testObj).toBe(new Unavailable);
    })


});