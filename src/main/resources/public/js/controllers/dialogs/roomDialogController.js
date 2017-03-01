var assignforce = angular.module( "batchApp" );

assignforce.controller( "roomDialogCtrl", function( $scope, $mdDialog, locationService, buildingService, roomService ){
        
        var rdc = this;
        
          // functions
            // close dialog
        rdc.cancel = function() {
            $mdDialog.cancel();
        };

            // save changes/new room
        rdc.save = function(roomForm) {

            if (roomForm.$valid) { //check if the room dialog form is valid
                
                if (rdc.state == "edit") { //edit an existing room
                    roomService.update( rdc.room, function(){
                        $mdDialog.hide();
                    }, function(){
                        $mdDialog.cancel();
                    });
                } else if (rdc.state == "create") { //Create a new room
                    rdc.room.building = rdc.building.id;

                    roomService.create( rdc.room, function() {
                        $mdDialog.hide();
                    }, function () {
                        $mdDialog.cancel();
                    })
                }
            } else {
                //display an error message saying that the name field is empty
            }
        };
});