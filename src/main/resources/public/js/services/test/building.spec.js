/**
 * Created by roger on 7/14/2017.
 */
describe('Building factory', function(){

    var Building;

    beforeEach(angular.mock.module('api.building'));


    beforeEach(inject(function(_Building_) {
        Building = _Building_;
    }));


    it('should exist', function(){
        expect(Building).toBeDefined();
    });
});