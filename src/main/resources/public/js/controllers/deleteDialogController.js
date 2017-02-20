
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
            	
//            	for(var i = 0; i < dc.list[0].rooms.length; i++){
//            		if(dc.list[0].rooms[i].active){
//            			sumActiveRooms++;
//            		}
//            	}
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

            // recursively inactivates the first entry in bc.batchesSelected until
			// it is empty
        dc.deleteHelper = function( delList ){
            if (delList.length == 0) {
                $mdDialog.hide();
                return;
            }
            	
            var elem = delList.shift();
            
            //if a location was selected, recurse building/room inactivation
            if (Array.isArray(elem.buildings)){
            	//if it has buildings
            	if(elem.buildings.length > 0){
            		angular.forEach(elem.buildings, function(building){
            		
        				//if it has rooms
            			if(building.rooms.length > 0){
            				building.rooms.forEach(function(room){
            					room.active = false;
            					
            					roomService.update( room, function(){
            		            }, function(){
            		                $mdDialog.cancel();
            		            });
            					
            				});
            			}
            			building.active = false;
            			buildingService.update( building, function(){   
                        }, function(){
                        	//TODO HERE
                            $mdDialog.cancel();
                        });
            		});            		
            	}
            	elem.active = false;
                //runs the locationService update, concentric with another deleteHelper call upon success.
            	
                locationService.update( elem, function(){
                	
                }, function(){
                	$mdDialog.cancel();
                });
                
            dc.deleteHelper(delList);
            
            }

            //else if a building was selected, recurse room inactivation
            else if ( Array.isArray(elem.rooms) ) {   
               angular.forEach(elem.rooms, function(room){
                    room.active = false;
                    
                    roomService.update( room, function(){
		            }, function(){
		                $mdDialog.cancel();
		            });
                });
                elem.active = false;
                
                buildingService.update( elem, function(){   
                }, function(){
                    $mdDialog.cancel();
                });
                dc.deleteHelper(delList);
            }
            //else room was called, so simply:
            else {
            	elem.active = false;
            	
            	roomService.update( elem, function(){
	            }, function(){
	                $mdDialog.cancel();
	            });
            	dc.deleteHelper(delList);
            }
            //}
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
