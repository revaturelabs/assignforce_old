
var app = angular.module("batchApp");

app.service( "buildingService", function($resource) {
    var Building = $resource('/api/v2/building/:id',{id: '@id'},{update:{method:'PUT', url:'api/v2/building'}});
    var bs = this;

    bs.getEmptyBuilding = function(){
        return new Building();
    };
    
    bs.getAlmostEmptyBuilding = function(location){
    	console.log("almost empty function called");
        return new Building(location);
    };
    
    bs.create = function(building, success, error){
    	console.log(building);
        building.$save(success, error);
    };
    
    bs.getAll = function(success, error) {
        Building.query(success, error);
    };

    bs.getById = function(id, success, error){
        Building.get({id: id}, success, error);
    };

    bs.update = function(building, success, error){
        building.$update(success, error);
    };

    bs.delete = function(building, success, error){
        building.$remove(success, error);
    };
    
    bs.cloneBuilding = function(building){
        return new Building(building);
    };

});