
var app = angular.module("batchApp");

app.service( "roomService", function($resource) {
    var Room = $resource('api/v2/room/:roomID',{roomID: '@roomID'},{update:{method:'PUT', url:'api/v2/room'}});
    var rs = this;

    rs.getEmptyRoom = function(){
        return new Room();
    };
    
    rs.getAlmostEmptyRoom = function(buildingID){
    	return new Room(buildingID);
    }

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
    
    rs.updateAll = function(rooms, success, error){
    	console.log("I got in");
    	rooms.forEach(function(room){
    		console.log(room);
    		console.log(room.roomID);
    		room.active = false;
    		room.building.rooms = [];
    		room.batches = [];
    		//circular reference here because room.building.location references building etc.
    		console.log("updating room now");
    		Room.update(room, function(){console.log("Room update success");}, function(){console.log("Room update failure");});
    		//rs.getById (room.roomID, function(response){
    			//response.active = false;
    			//console.log("Before update");
    			//Room.update (response, function(){}, function(){});
    			//console.log("OK Wassup?");
    			//console.log(response);
    		//}, function(){
    			//conosle.log("room failure");
    		//});
    	});
    };

    rs.delete = function(room, success, error){
        room.$remove(success, error);
    };

});