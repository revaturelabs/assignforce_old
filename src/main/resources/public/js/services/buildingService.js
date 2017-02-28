
var app = angular.module("batchApp");

app.service( "buildingService", function($resource) {
    var Building = $resource('/api/v2/building/:id',{id: '@id'},{update:{method:'PUT', url:'api/v2/building'}});
    var bs = this;

    bs.getEmptyBuilding = function(){
        return new Building();
    };
    
    bs.getAlmostEmptyBuilding = function(location){
        return new Building(location);
    };
    
    bs.create = function(building, success, error){
        building.$save(success, error);
    };
    
    bs.getAll = function(success, error) {
        Building.query(success, error);
    };

    bs.getById = function(id, success, error){
        Building.get({id: id}, success, error);
    };

    bs.update = function(building, success, error){
        Building.update(building, success, error);
    };
    
    bs.updateAll = function(buildings, success, error){
    	buildings.forEach(function(building){
    		console.log("getting building by ID now");
    		bs.getById (building.id, function(response){
    			response.active = false;
    			console.log("updating building now");
    			Building.update (response, function(){console.log("Building update success");}, function(){console.log("Building update failure");});
    		}, function(){
    			console.log("building getById failure");
    		});	
    	});
    };

    bs.delete = function(building, success, error){
        building.$remove(success, error);
    };
    
    bs.cloneBuilding = function(building){
        return new Building(building);
    };

});