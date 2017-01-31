
var app = angular.module("batchApp");

app.service( "locationService", function($resource) {
    var Location = $resource('/api/v2/location/:id',{id: '@id'},{update:{method:'PUT', url:'api/v2/location'}});
    var ls = this;
    
    ls.getEmptyLocation = function(){
        return new Location();
    };

    ls.create = function(location, success, error){
        location.$save(success, error);
    };

    ls.getAll = function(success, error) {
        Location.query(success, error);
    };

    ls.getById = function(id, success){
        Location.get({id: id}, success, error);
    };

    ls.update = function(location, success, error){
        location.$update(success, error);
    };

    //I am not really changing ls
    ls.delete = function(location, success, error){
        location.$remove(success, error);
    };
});