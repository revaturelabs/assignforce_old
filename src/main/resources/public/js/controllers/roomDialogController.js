
var assignforce = angular.module( "batchApp" );

assignforce.controller( "roomDialogCtrl", function( $scope, $mdDialog, locationService, buildingService, roomService ){
        
        var rdc = this;
        
          // functions
            // close dialog
        rdc.cancel = function() {
            $mdDialog.cancel();
        };

            // save changes/new
        rdc.save = function(isValid) {

            if (isValid) {               
                
                if (rdc.state == "edit") {
                    rdc.swapRoom( rdc.room );
                } else if (rdc.state == "create") {
                	rdc.room.building = rdc.building.id;
                    rdc.building.rooms.push( rdc.room );
                }

                roomService.create( rdc.room, function(){
                    $mdDialog.hide();
                }, function(){
                    $mdDialog.cancel();
                });
            
            }
        };

            // returns building that contains given room
        rdc.findBuildingFromRoom = function() {

            if (rdc.buildings != undefined) {
                rdc.buildings.forEach( function(building){
                    if (building.rooms.length != 0) {
                        building.rooms.forEach( function(room){
                            if (room.roomID == rdc.room.roomID) {
                                rdc.building = building;
                                return;
                            }
                        });
                    }
                });
            }
        };

            // swaps editted room out for old one
        rdc.swapRoom = function(newRoom) {
            
            if (rdc.building.rooms.length == 0) {
                rdc.building.rooms.push(newRoom);
            } else {
                rdc.building.rooms.forEach( function(room){
                    if (room.roomID == newRoom.roomID) {
                        room.roomName = newRoom.roomName;
                    }
                });
            }
        };

          // data
        
          // page initialization
            // data gathering
        buildingService.getAll( function(response) {
            //console.log("  (RDC) Retrieving all locations.")
            rdc.buildings = response;
            if (rdc.state == "create") {
                rdc.title = "Add new room to " + rdc.building.name;
            } else if (rdc.state == "edit") {
                rdc.findBuildingFromRoom();
                rdc.title = "Edit " + rdc.room.roomName + " at " + rdc.building.name;
            }
        }, function(error) {
            $mdDialog.cancel();
        });
    });