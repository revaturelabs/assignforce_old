
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
			// until
			// it is empty
        dc.deleteHelper = function( delList ){
            if (delList.length == 0) {
                $mdDialog.hide();
                return;
            }
            	
            var elem = delList.shift();
            //var updatedLocations = [];
            var updatedBuildings = [];
            var updatedRooms = [];
            var locID;
            var buildingID;
            // elem is location
            if (Array.isArray(elem.buildings)){
            	//updatedLocations.push(elem);
            	locID = elem.id;
            	// if it has buildings            	
            	if(elem.buildings.length > 0){
            		angular.forEach(elem.buildings, function(building){
            		buildingID = building.id;
            		updatedBuildings.push(building);
        				// if it has rooms
            			if(building.rooms.length > 0){
            				building.rooms.forEach(function(room){
            					updatedRooms.push(room);
            					//Inactivate room - inactive, location doesn't matter as room does not need location id, room's buildings cannot recurse
            					
            					buildingService.getById(buildingID, function(response){
            						room.building = response;
            						
            						room.active = false;
                					room.building.rooms = [];
                					room.building.location = undefined;
                					roomService.update( room, function(){
                    	            }, function(){
                    	                $mdDialog.cancel();
                    	            });    
            					}, function(){
            						
            					});
            					      					
            				});
            			}
            			
            			//Inactivate building - inactive, location must be original, location's buildings cannot recurse, building's rooms cannot recurse
            			
            			locationService.getById(locID, function(response){
            				building.location = response;
            				
            				building.active = false;
            				building.location.buildings = [];
            				building.rooms = [];
            				buildingService.update( building, function(){
                            }, function(){
                                $mdDialog.cancel();
                            });
            			});           			
            		});            		
            	}
            	
            	//Inactivate location - not active, starting location, buildings array cannot recurse
            	elem.active = false;
            	elem.buildings = [];
            	
                locationService.update( elem, function(){
                }, function(){
                	$mdDialog.cancel();
                });
                /*
                updatedBuildings.forEach(function (building){
                	building.rooms = [];
                	buildingService.update( building, function(){
                		console.log(updatedBuildings);
                    }, function(){
                        $mdDialog.cancel();
                    });
                })                
                
                updatedRooms.forEach(function (room){
                	roomService.update( room, function(){
                		console.log(updatedRooms);
    	            }, function(){
    	                $mdDialog.cancel();
    	            });  
                })                 
                */
            dc.deleteHelper(delList);
            
            }
            //Inactivate Building/Rooms
            else if ( Array.isArray(elem.rooms) ) {
            	var temp = elem.location;
            	var tempBuild = elem;
            	angular.forEach(elem.rooms, function(room){
            	    
            		room.active = false;
    /**Works Here*/	room.building = tempBuild;
					room.building.location = undefined;
					room.building.rooms = [];
                    
                    roomService.update( room, function(){
		            }, function(){
		                $mdDialog.cancel();
		            });
                });
            	
                elem.active = false;
                elem.location = temp;
                elem.location.buildings = [];
                elem.rooms = [];
                
                buildingService.update( elem, function(){
                }, function(){
                    $mdDialog.cancel();
                });
                dc.deleteHelper(delList);
            }            
            //Inactivate room
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
