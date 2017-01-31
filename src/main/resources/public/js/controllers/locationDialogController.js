
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "locationDialogCtrl", function ( $scope, $mdDialog, USstates, locationService ){
        console.log("Beginning location dialog controller.");
        var ldc = this;

          // functions
            // close dialog
        ldc.cancel = function() {
            $mdDialog.cancel();
        };

            // save changes/new
        ldc.save = function(isValid) {

            if (isValid) {
                if (ldc.state == "edit") {
                    locationService.update( ldc.location, function(){
                        $mdDialog.hide();
                    }, function(){
                        $mdDialog.cancel();
                    });
                } else if (ldc.state == "create") {
                    locationService.create( ldc.location, function(){
                        $mdDialog.hide();
                    }, function(){
                        $mdDialog.cancel();
                    });
                }
            }
        };

          // data
        ldc.stateMux = { "edit"  : "Edit " + ldc.location.name,
                         "create": "Create new location" };
        ldc.title = ldc.stateMux[ ldc.state ];
        ldc.USstates = USstates;
    });