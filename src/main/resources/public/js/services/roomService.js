
var app = angular.module("batchApp");

app.service( "roomService", function($resource) {
    var Room = $resource('api/v2/room/:roomID',{roomID: '@roomID'},{update:{method:'PUT', url:'api/v2/room'}});
    var rs = this;

    rs.getEmptyRoom = function(){
        return new Room();
    };
    
    rs.getAlmostEmptyRoom = function(buildingID){
    	return new Room(buildingID);
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
        Room.get({id: id}, success, error);
    };

    rs.update = function(room, success, error){
        Room.update(room, success, error);
    };

    rs.delete = function(room, success, error){
        room.$remove(success, error);
    };

});
