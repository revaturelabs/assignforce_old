var assignforce = angular.module( "batchApp" );

assignforce.controller( "deleteDialogCtrl", function( $scope, $mdDialog, $timeout, locationService, buildingService, roomService ){

    var dc = this;
    
      // functions	
        // format text
    function formatText() {
        var title = "Delete ";

        if(dc.summary.locations > 0){
            title += dc.summary.locations + " Location(s), ";
        }

        if(dc.summary.buildings > 0){
            title += dc.summary.buildings + " Building(s), ";
        }

        if(dc.summary.rooms > 0){
            title += "and " + dc.summary.rooms + " Room(s).";
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
        if (delList.length == 0) {
            $mdDialog.hide();
            return;
        }

        for(var i = 0; i < delList.length; i++){
            var obj = delList.shift();

            if(obj.buildings != undefined){ //location
                for(var j = 0; j < obj.buildings.length; j++){
                    deleteBuildings(obj.buildings);
                }
                obj = locationService.getClone(obj);
                obj.active = false;
                locationService.update(obj, function(){
                	//Location updated
                }, function(){
                	//Error during inactivation
                });
                
            } else if(obj.rooms != undefined){ //building
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
        }
        // this.deleteHelper(delList);
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
            	//Inactivation unseccessful
            });
        })

    }

    function deleteRooms(arr){
        arr.forEach(function(room){
            room = roomService.cloneRoom(room);
            room.active = false;
            roomService.update(room, function(){
            	dc.showToast("Inactivation successful.");
            }, function(){
            	dc.showToast("Inactivation unseccessful.");
            });
        })
    }
});
