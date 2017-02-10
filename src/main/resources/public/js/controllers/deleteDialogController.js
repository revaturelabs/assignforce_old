
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "deleteDialogCtrl", function( $scope, $mdDialog, $timeout, locationService, buildingService, roomService ){
        
        var dc = this;

          // functions
            // format text
        function formatText() {
            var title = "Delete ";

            if (dc.summary.rooms == 1) {
                title += " 1 room";
            } else if (dc.summary.rooms > 1) {
                title += dc.summary.rooms + " rooms"; 
            }
            
            if (dc.summary.buildings ==1){
            	if(dc.summary.rooms > 0){
            		title += " and";
            	}
            	title += " 1 building";
            } else if (dc.summary.buildings > 1){
            	title += dc.summary.buildings + " buildings";
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
            console.log(dc.list + " is what dc.list is.")
            var delList = dc.list;//wth is list coming from?
            dc.deleteHelper(delList);
        };

            // recursively inactivates the first entry in bc.batchesSelected until
			// it is empty
        dc.deleteHelper = function( delList ){
            console.log("In deleteHelper")
            if (delList.length == 0) {
                $mdDialog.hide();
                return;
            }

            var elem = delList.shift();
            
            //if a location was selected
            if (Array.isArray(elem.buildings)){
            	console.log("A location was selected");
            	//if it has buildings
            	if(elem.buildings.length > 0){
            		elem.buildings.forEach(function(building){
        				//if it has rooms
            			if(building.rooms.length > 0){
            				building.rooms.forEach(function(room){
            					room.active = false;
            				});
            			}
            			building.active = false;
            		});            		
            	};
            }

            else if ( Array.isArray(elem.rooms) ) {
            	console.log("A building was selected");                
                elem.rooms.forEach( function(room){
                    room.active = false;
                });
            }
            elem.active = false; // inactivate whatever was selected
            
            //else if(Array.isArray(elem.buildings)){
            	//console.log("isArray(elem.buildings)");
            	//var roomIn = elem;
            	//elem.buildings.forEach(function(building){
            		//if(building.rooms.length > 0){
            			//building.rooms.forEach(function(room){
            				//if(room.roomID == roomIn.roomID){
            					//room.active = false;
            					//elem = building;
            				//}
            			//});
            		//}
            	//});
            //}
            //else {
            	//console.log("else statement in deletedialog");

                //var buildingIn = elem;
                //dc.locations.forEach( function(location){		
                    //if (location.buildings.length > 0) {		
                        //location.buildings.forEach( function(building){		
                            //if (building.buildingID == buildingIn.buildingID) {	
                                //building.active = false;
                                //elem = location;
                            //}		
                        //});		
                    //}		
                //});
            //}

            locationService.update( elem, function(){
                dc.deleteHelper(delList);
            }, function(error){
                console.log(" (LC) Failed to delete room/location with error:", error.data.message);
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
            // console.log(" (DC) Retrieving all locations.")
            dc.locations = response;
        }, function(error) {
            // console.log(" (DC) Failed to retrieve all locations with error:",
			// error.data.message);
            $mdDialog.cancel();
        });
    });
