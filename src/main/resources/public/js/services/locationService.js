
var app = angular.module("batchApp");

app.service( "locationService", function($resource) {
    var Location = $resource('/api/v2/location/:id',{id: '@id'},{update:{method:'PUT', url:'api/v2/location'}});
    var ls = this;
    
    ls.getEmptyLocation = function(){
        return new Location();
    };

    ls.getClone = function (loc) {
        return new Location(loc);
    };

    ls.create = function(location, success, error){
        return location.$save(success, error);
    };

    ls.getAll = function(success, error) {
        return Location.query(success, error);
    };

    ls.getById = function(id, success, error){
        return Location.get({id: id}, success, error);
    };

    ls.update = function(location, success, error){
        return Location.update(location, success, error);
    };

    //I am not really changing location
    ls.delete = function(location, success, error){
        location.$remove(success, error);
    };
});