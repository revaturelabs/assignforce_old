var assignforce = angular.module( "batchApp" );

assignforce.controller( "deleteDialogCtrl", function( $scope, $mdDialog, $timeout, locationService, buildingService, roomService ){

    var dc = this;
    
      // functions	
        // format text
    function formatText() {
        var title = "Delete ";
        // This could be optimized

		// locations alone
        if(dc.summary.locations > 0){
            title += dc.summary.locations + " Location(s)";
        }
        
        // 1 location, 1 building, and 1 room
        if(dc.summary.locations > 0 && dc.summary.buildings > 0 && dc.summary.rooms > 0){
        	title += ", ";
        }
        
        // 1 location and 1 room || 1 location and 1 building
        if (dc.summary.locations > 0){
            if((dc.summary.buildings === 0 && dc.summary.rooms > 0) || (dc.summary.buildings > 0 && dc.summary.rooms === 0))){
        	    title += " and ";
        	}
        }

        // + Buildings
        if(dc.summary.buildings > 0){
            title += dc.summary.buildings + " Building(s)";
        }
        
        // 1 building and 1 room
        if(dc.summary.buildings > 0 && dc.summary.rooms > 0){
        	title += " and ";
        }

        // + rooms
        if(dc.summary.rooms > 0){
            title += dc.summary.rooms + " Room(s)";
        }

        title += "?";
        dc.desc = title;
    }formatText();

    dc.cancel = function () {
        $mdDialog.cancel();
    };

      // Delete Rooms/Buildings/Locations
    dc.delete = function(){
        var delList = dc.list;
        dc.deleteHelper(delList);
    };

    dc.deleteHelper = function( delList ) {
        if (delList.length === 0) {
            $mdDialog.hide();
            return;
        }

        delList.forEach(function(obj){

            if(obj.buildings !== undefined){ //location
                for(var j = 0; j < obj.buildings.length; j++){
                    deleteBuildings(obj.buildings);
                }
                obj = locationService.getClone(obj);
                obj.active = false;
                locationService.update(obj, function(){
                	//Location inactivated
                }, function(){
                	//Unable to inactivate location
                });
                
            } else if(obj.rooms !== undefined){ //building
                for(var k = 0; k < obj.rooms.length; k++){
                    deleteRooms(obj.rooms);
                }
                obj = buildingService.cloneBuilding(obj);
                obj.active = false;
                
                buildingService.update(obj, function(){
                	//Building, room(s) inactivated
                }, function(){
                	//Error while inactivating building, room(s)
                });
                
            } else { //room
                obj = roomService.cloneRoom(obj);
            	obj.active = false;
            	
                roomService.update(obj, function(){
                	//Room inactivated
                }, function(){
                	//Could not inactivate room
                });
            }
        })
        $mdDialog.hide();
    };

    function deleteBuildings(arr){
        arr.forEach(function(building){
            deleteRooms(building.rooms);
            building = buildingService.cloneBuilding(building);
            building.active = false;
            buildingService.update(building, function(){
            	//Inactivation successful
            }, function(){
            	//Inactivation unsuccessful
            });
        })

    }

    function deleteRooms(arr){
        arr.forEach(function(room){
            room = roomService.cloneRoom(room);
            room.active = false;
            roomService.update(room, function(){
            	//Inactivation successful
            }, function(){
            	//Inactivation unsuccessful
            });
        })
    }
});
