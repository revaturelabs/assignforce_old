/**
 * Created by roger on 7/14/2017.
 */
describe('Building factory', function(){

    var Building;

    var EmptyBuilding;

    // var BuildingTest = $resource('/api/v2/building/:id',{id: '@id'},{update:{method:'PUT', url:'api/v2/building'}});

    beforeEach(angular.mock.module('batchApp'));

    beforeEach(inject(function(_Building_) {
        Building = _Building_
    }));

    //A simple test to verify the Building service exist
    it('should exist', function(){
        expect(Building).toBeDefined();
    });

    //A set of tests for our Building.getEmptyBuilding() method
    describe('.getEmptyBuilding()', function(){

        //A test to verify the method getEmptyBuilding exists
        it('should exist', function(){
            expect(Building.getEmptyBuilding()).toBeDefined();
        });

        it('give empty building object', function(){
            expect(Building.getEmptyBuilding()).toEqual(EmptyBuilding);
        })
    });
});