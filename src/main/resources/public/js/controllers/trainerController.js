
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "trainerCtrl", function( $scope, trainerService ) {
        console.log("Beginning trainer controller.");
        var tc = this;

          // functions
            // calls showToast method of aCtrl
        tc.showToast = function( message ) {
            $scope.$parent.aCtrl.showToast( message );
        };

            // reformats how an array of objects is joined
        tc.joinObjArrayByName = function(elem) {
            return elem.name;
        };

            // holdover until more trainer functionality is created
        tc.goToTrainer = function(event) {
            // nothing for now
        };

          // data

          // page initialization
            // data gathering
        trainerService.getAll( function(response) {
            console.log("  (TC)  Retrieving all trainers.");
            tc.trainers = response;
        }, function(error) {
            console.log("  (TC)  Failed to retrieve all trainers with error", error.data.message);
            tc.showToast("Could not fetch trainers.");
        });
    });