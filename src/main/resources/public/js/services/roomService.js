
var app = angular.module("batchApp");

app.service( "roomService", function($resource, $http) {
    var Room = $resource('api/v2/room/:id',{id: '@id'},{update:{method:'PUT', url:'api/v2/room'}});
    var rs = this;

    rs.getEmptyRoom = function(){
        return new Room();
    };

    rs.cloneRoom = function(room){
        return new Room(room);
    };

    rs.create = function(room, success, error){
        room.$save(success, error);
    };

    rs.getAll = function(success, error) {
        Room.query(success, error);
    };

    rs.getById = function(id, success, error){
    	console.log("This is the id being passed in:");
    	console.log(id);
        Room.get({id: id}, success, error);
    };

    rs.update = function(room, success, error){
        console.log("Room just before update");
        console.log(room);
    	Room.update(room, success, error);
    };

    rs.delete = function(room, success, error){
        room.$remove(success, error);
    };

});
