
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "roomDialogCtrl", function( $scope, $mdDialog, locationService, roomService ){
        console.log("Beginning room dialog controller.");
        var rdc = this;
        
          // functions
            // close dialog
        rdc.cancel = function() {
            $mdDialog.cancel();
        };

            // save changes/new
        rdc.save = function(isValid) {

            if (isValid) {
                
                if (rdc.building) {
                    rdc.room.roomName = rdc.building + " - " + rdc.room.roomName;
                }
                
                if (rdc.state == "edit") {
                    rdc.swapRoom( rdc.room );
                } else if (rdc.state == "create") {
                    rdc.location.rooms.push( rdc.room );
                }

                locationService.update( rdc.location, function(){
                    $mdDialog.hide();
                }, function(){
                    $mdDialog.cancel();
                });
            
            }
        };

            // returns locations that contains given room
        rdc.findLocationFromRoom = function() {

            if (rdc.locations != undefined) {
                rdc.locations.forEach( function(location){
                    if (location.rooms.length != 0) {
                        location.rooms.forEach( function(room){
                            if (room.roomID == rdc.room.roomID) {
                                rdc.location = location;
                                return;
                            }
                        });
                    }
                });
            }
        };

            // swaps editted room out for old one
        rdc.swapRoom = function(newRoom) {
            
            if (rdc.location.rooms.length == 0) {
                rdc.location.rooms.push(newRoom);
            } else {
                rdc.location.rooms.forEach( function(room){
                    if (room.roomID == newRoom.roomID) {
                        room.roomName = newRoom.roomName;
                    }
                });
            }
        };

          // data
        if (rdc.room.roomName.split("-").length > 1) {
            rdc.building = rdc.room.roomName.split("-")[0].trim();
            rdc.room.roomName = rdc.room.roomName.split("-")[1].trim();
        } else {
            rdc.building = "";
        }
        
          // page initialization
            // data gathering
        locationService.getAll( function(response) {
            console.log("  (RDC) Retrieving all locations.")
            rdc.locations = response;
            if (rdc.state == "create") {
                rdc.title = "Add new room to " + rdc.location.name;
            } else if (rdc.state == "edit") {
                rdc.findLocationFromRoom();
                rdc.title = "Edit " + rdc.room.roomName + " at " + rdc.location.name;
            }
        }, function(error) {
            console.log("  (RDC) Failed to retrieve all locations with error:", error.data.message);
            $mdDialog.cancel();
        });
    });