/**
 * Created by gdittric on 7/14/2017.
 */
"use strict";

describe('Unavailable Service', function() {
    var batchApp;

    beforeEach(module("batchApp"));
    beforeEach(inject(function(_unavailableService_){
        batchApp = _unavailableService_;
    }));

    it('should exist', function(){
        expect(batchApp).toBeDefined();
    })

    it("getEmptyUnavailableTest", function(){
        ;
    })
});