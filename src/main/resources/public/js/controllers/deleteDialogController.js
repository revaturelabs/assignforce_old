
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
            	
            var elem = delList.shift();
            var updatedLocations = [];
            var updatedBuildings = [];
            var updatedRooms = [];
            var locID;
            var buildingID;
            
            // location was selected
            // elem = location;
            if (Array.isArray(elem.buildings)){
            	updatedLocations.push(elem); //push elem onto list of locations to be updated (should not be necessary since there should only be one location)
            	locID = elem.id; //id for finding the location by ID later
            	locationService.getById(elem.id, function(response){
            		
            		locationService.delete(response, function(){}, function(){});
            	}, function(){
            		
            	});
            	
            	// if it has buildings            	
            	/*if(elem.buildings.length > 0){
            		angular.forEach(elem.buildings, function(building){
            			buildingService.getById(building.id, function(response){
            				buildingService.delete(response, function(){}, function(){});
            			}, function(){
            				
            			});
            			buildingID = building.id; // id for finding the location by ID later
            			updatedBuildings.push(building); // push building onto list of buildings to be updated.
        				
            			// if it has rooms
            			if(building.rooms.length > 0){
            				angular.forEach(building.rooms, function(room){
            					roomService.getById(room.roomID, function(response){
            						roomService.delete(response, function(){}, function(){});
            					}, function(){
            						
            					});
            					updatedRooms.push(room); // push room onto the list of rooms to be updated.
            					/*            					
            					buildingService.getById(buildingID, function(response){
            						room.building = response;
            						updatedRooms.push(room);
            						/*
            						room.active = false;
                					room.building.rooms = [];
                					room.building.location = undefined;
                					roomService.update( room, function(){
                    	            }, function(){
                    	                $mdDialog.cancel();
                    	            });   *//* 
            					}, function(){
            						
            					});
            					      					
            				});
            			}*/
            			
            			//Inactivate building - inactive, location must be original, location's buildings cannot recurse, building's rooms cannot recurse
            			/*
            			locationService.getById(locID, function(response){
            				building.location = response;
            				updatedBuildings.push(building);
            				building.active = false;
            				building.location.buildings = [];
            				building.rooms = [];
            				buildingService.update( building, function(){
                            }, function(){
                                $mdDialog.cancel();
                            });
            			});           			
            		});            		
            	}*/
            	
            	console.log(updatedRooms);
            	console.log(updatedBuildings);
            	
            	
            	
            	
            	//Inactivate location - not active, starting location, buildings array cannot recurse
            	//elem.active = false;
            	//elem.buildings = [];  Taking this out because it might be affecting my room updates.
            	/*roomService.updateAll( updatedRooms, function(){
            		buildingService.updateAll( updatedBuildings, function(){
            			locationService.update( elem, function(){
                        	
                        }, function(){
                        	$mdDialog.cancel();
                        });
                	}, function(){
                		
                	});
	            }, function(){
	                
	            });*/
                
                
                
                
                
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
            dc.deleteHelper(delList); //should I do all my stuff after this call??
            
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
