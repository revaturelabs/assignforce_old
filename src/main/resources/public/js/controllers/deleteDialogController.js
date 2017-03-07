
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "deleteDialogCtrl", function( $scope, $mdDialog, $timeout, locationService, buildingService, roomService ){
        
        var dc = this;

          // functions
            // format text
        function formatText() {
            var title = "Delete ";
            var sumActiveRooms = 0;
            var sumActiveBldgs = 0;
            if (dc.summary.rooms == 1) {
                title += " 1 room";
            } else if (dc.summary.rooms > 1) {
            	
            	 // increment active rooms here for full functionality
                title += sumActiveRooms + " rooms"; 
            }
            
            if (dc.summary.buildings == 1){
            	if(dc.summary.rooms > 0){
            		title += " and";
            	}
            	title += " 1 building";
            } else if (dc.summary.buildings > 1){
            	for(var j = 0; j < dc.list[0].buildings.length; j++){
        		if(dc.list[0].buildings[j].active){
        			sumActiveBldgs++;
        		}
        	}
            	title += sumActiveBldgs + " buildings";
            }

            if (dc.summary.locations == 1) {
                if (dc.summary.rooms > 0 || dc.summary.buildings > 0) {
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
        }formatText();
        
        
        
        

          // Delete Rooms/Buildings/Locations
        dc.delete = function(){
            dc.thinking = true;
            var delList = dc.list;
            dc.deleteHelper(delList);
        };

            // recursively inactivates the first entry in bc.batchesSelected
			// until it is empty
        dc.deleteHelper = function( delList ){
            if (delList.length == 0) {
                $mdDialog.hide();
                return;
            }
            var location = delList.shift();
            
            deleteBuildings(location.buildings);
            locationService.delete(location);
            
            dc.deleteHelper(delList);
            
        };
        
        function deleteBuildings(arr){
        	arr.forEach(function(building){
        		deleteRooms(building.rooms);
        		building = buildingService.cloneBuilding(building);
        		buildingService.delete(building);
        	});
        }
        
        function deleteRooms(arr){
        	arr.forEach(function(room){
        		room = roomService.cloneRoom(room);
            	roomService.delete(room);
        	});
        }  

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
            dc.locations = response;
        }, function() {
            $mdDialog.cancel();
        });
    });
