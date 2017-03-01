var assignforce = angular.module( "batchApp" );

assignforce.controller( "deleteDialogCtrl", function( $scope, $mdDialog, $timeout, locationService, buildingService, roomService ){

    var dc = this;

      // functions
        // format text
    function formatText() {
        var title = "Delete ";

        console.log(dc.location);
        console.log(dc.list);


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
        dc.thinking = true;
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
                locationService.delete(obj);
            } else if(obj.rooms != undefined){ //building
                for(var k = 0; k < obj.rooms.length; k++){
                    deleteRooms(obj.rooms);
                }
                obj = buildingService.cloneBuilding(obj);
                buildingService.delete(obj);
            } else { //room
                obj = roomService.cloneRoom(obj);
                roomService.delete(obj);
            }
        }
        // this.deleteHelper(delList);
        $mdDialog.hide();
    };

    function deleteBuildings(arr){
        arr.forEach(function(building){
            console.log(building);
            deleteRooms(building.rooms);
            building = buildingService.cloneBuilding(building);
            buildingService.delete(building);
        })

    }

    function deleteRooms(arr){
        arr.forEach(function(room){
            console.log(room);
            room = roomService.cloneRoom(room);
            roomService.delete(room);
        })
    }
});
