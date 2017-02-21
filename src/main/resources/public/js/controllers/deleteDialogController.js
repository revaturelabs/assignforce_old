
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

          // delete rooms/locations
        dc.delete = function(){
            dc.thinking = true;
            var delList = dc.list;
            dc.deleteHelper(delList);
        };

            // recursively inactivates the first entry in bc.batchesSelected
			// until
			// it is empty
        dc.deleteHelper = function( delList ){
            if (delList.length == 0) {
                $mdDialog.hide();
                return;
            }
            	
            var elem = delList.shift();
            
            // if a location was selected, recurse building/room inactivation
            if (Array.isArray(elem.buildings)){
            	// if it has buildings
            	if(elem.buildings.length > 0){
            		angular.forEach(elem.buildings, function(building){
            		
        				// if it has rooms
            			if(building.rooms.length > 0){
            				building.rooms.forEach(function(room){
            					room.active = false;
            	                console.log("Should not even be here");
            					room.building.rooms = [];
            					room.building.location = undefined;
            					roomService.update( room, function(){
            						// donothing
            		            }, function(){
            		                $mdDialog.cancel();
            		            });            					
            				});
            			}
            			building.active = false;
            			building.location.buildings = [];
            			building.rooms = [];
            			buildingService.update( building, function(){   
            				// donothing
                        }, function(){
                            $mdDialog.cancel();
                        });
            		});            		
            	}
            	elem.active = false;
            	elem.buildings = [];
                //runs the locationService update, concentric with another deleteHelper call upon success.
            	//Need the empty array [] here too?
                locationService.update( elem, function(){
                	// donothing
                }, function(){
                	$mdDialog.cancel();
                });
                
            dc.deleteHelper(delList);
            
            }

            //else if a building was selected, recurse room inactivation
            else if ( Array.isArray(elem.rooms) ) {
            	var temp;
            	angular.forEach(elem.rooms, function(room){
                   if(room.building.location != undefined){
                	   temp = room.building.location.id;
                   } 
            	   room.active = false;            	   
            	   
                    room.building.rooms = [];                    
                    room.building.location = undefined;
                    
                    roomService.update( room, function(){
                    	console.log("Room SUCCESS");
		            }, function(){
		            	console.log("Room FAILURE");
		                $mdDialog.cancel();
		            });
                });
                elem.active = false;

                /* elem needs location before I can set buildings.
                 * Setting elem.location = temp here not only
                 * doesn't work, but it breaks the successful
                 * inactivation of the rooms
                 */
                elem.location.buildings = [];
                elem.rooms = [];
                buildingService.update( elem, function(){ 
                	console.log("Building SUCCESS");
                }, function(){
                	console.log("Building FAILURE");
                    $mdDialog.cancel();
                });
                dc.deleteHelper(delList);
            }
            
            //else room was called, so simply:
            else {
            	elem.active = false;
            	elem.building.rooms = [];
            	elem.building.location = undefined;
            	roomService.update( elem, function(){
            		// donothing
	            }, function(){
	                $mdDialog.cancel();
	            });
            	dc.deleteHelper(delList);
            }
            // }
            $mdDialog.hide();
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
            dc.locations = response;
        }, function() {
            $mdDialog.cancel();
        });
    });
