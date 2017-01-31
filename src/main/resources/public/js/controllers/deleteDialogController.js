
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "deleteDialogCtrl", function( $scope, $mdDialog, $timeout, locationService ){
        console.log("Beginning deletion controller.");
        var dc = this;

          // functions
            // format text
        dc.formatText = function() {

            var title = "Delete ";

            if (dc.summary.rooms == 1) {
                title += " 1 room";
            } else if (dc.summary.rooms > 1) {
                title += dc.summary.rooms + " rooms"; 
            }

            if (dc.summary.locations == 1) {
                if (dc.summary.rooms > 0) {
                    title += " and";
                }
                title += " 1 location";
            } else if (dc.summary.locations > 1) {
                if (dc.summary.rooms > 0) {
                    title += " and";
                }
                title += " " + dc.summary.locations + " locations";
            }
            title += "?";

            dc.desc = title;
        }();

            // delete rooms/locations
        dc.delete = function(){
            
            dc.thinking = true;
            var delList = dc.list;
            dc.deleteHelper(delList);
        };

            // recursively deletes the first entry in bc.batchesSelected until it is empty
        dc.deleteHelper = function( delList ){
            
            if (delList.length == 0) {
                $mdDialog.hide();
                return;
            }

            var elem = delList.shift();

            if ( Array.isArray(elem.rooms) ) {
                elem.active = false;
                elem.rooms.forEach( function(room){
                    room.active = false;
                });
            } else {

                var roomIn = elem;
                dc.locations.forEach( function(location){		
                    if (location.rooms.length > 0) {		
                        location.rooms.forEach( function(room){		
                            if (room.roomID == roomIn.roomID) {	
                                room.active = false;
                                elem = location;
                            }		
                        });		
                    }		
                });
            }

            locationService.update( elem, function(){
                dc.deleteHelper(delList);
            }, function(error){
                console.log("  (LC)  Failed to delete room/location with error:", error.data.message);
                $mdDialog.cancel();
            });
        };

            // cancel deletion
        dc.cancel = function(){
            $mdDialog.cancel();
        };

            // finds location that holds given room
        dc.findLocationFromRoom = function( roomIn ){

            dc.locations.forEach( function(location){		
                if (location.rooms.length > 0) {		
                    location.rooms.forEach( function(room){		
                        if (room.roomID == roomIn.roomID) {	
                            room.active = false;
                            return location;
                        }		
                    });		
                }		
            });
        };

          // data
        dc.thinking = ( dc.deleted == (dc.summary.rooms + dc.summary.locations) );

          // page initialization
            // data gathering
        locationService.getAll( function(response) {
            console.log("  (DC)  Retrieving all locations.")
            dc.locations = response;
        }, function(error) {
            console.log("  (DC)  Failed to retrieve all locations with error:", error.data.message);
            $mdDialog.cancel();
        });
    });