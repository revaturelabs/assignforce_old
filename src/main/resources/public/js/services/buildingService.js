
var app = angular.module("batchApp");

app.service( "buildingService", function($resource) {
    var Building = $resource('api/v2/building/:buildingID',{buildingD: '@buildingID'},{update:{method:'PUT', url:'api/v2/building'}});
    var rs = this;

    rs.getEmptyBuilding = function(){
        return new Building();
    };

    rs.cloneBuilding = function(building){
        return new Building(building);
    };

    rs.create = function(building, success, error){
        building.$save(success, error);
    };

    rs.getAll = function(success, error) {
        Building.query(success, error);
    };

    rs.getById = function(id, success, error){
        Building.get({id: id}, success, error);
    };

    rs.update = function(building, success, error){
        building.$update(success, error);
    };

    rs.delete = function(building, success, error){
        building.$remove(success, error);
    };

});