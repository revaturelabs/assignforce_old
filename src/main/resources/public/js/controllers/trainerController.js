
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "trainerCtrl", function( $scope, $mdDialog, trainerService ) {
        console.log("Beginning trainer controller.");
        var tc = this;
        tc.weeks = 5;

          // functions
            // calls showToast method of aCtrl
        tc.showToast = function( message ) {
            $scope.$parent.aCtrl.showToast( message );
        };

        //adds Trainers
        tc.addTrainer = function () {
            $mdDialog.show({
                templateUrl: "html/templates/trainerTemplate.html",
                controller: "trainerDialogCtrl",
                controllerAs: "tdCtrl",
                locals: {
                    trainer : trainerService.getEmptyTrainer(),
                    state    : "create" },
                bindToController: true,
                clickOutsideToClose: true
            }).then(function () {
                tc.showToast("Trainer success.");
                tc.rePullTrainers();
            }, function () {
                tc.showToast("Trainer Fails.")
            });
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
            // gets all trainers and stores them in variable trainers
        trainerService.getAll( function(response) {
            // console.log("  (TC)  Retrieving all trainers.");
            tc.trainers = response;
            console.log(tc.trainers);
        }, function(error) {
            //console.log("  (TC)  Failed to retrieve all trainers with error", error.data.message);
            tc.showToast("Could not fetch trainers.");
        });

        tc.rePullTrainers = function(){
            tc.trainers = undefined;
            trainerService.getAll( function(response) {
                // console.log("  (TC)  Retrieving all trainers.");
                tc.trainers = response;
                // console.log(tc.trainers);
            }, function(error) {
                //console.log("  (TC)  Failed to retrieve all trainers with error", error.data.message);
                tc.showToast("Could not fetch trainers.");
            });
        };

        trainerService.getById(1, function (response) {
            // console.log("getting a single Trainer");
            tc.singleTrainer = response;
            // console.log(tc.namedTrainer);
        }, function (error) {
            tc.showToast("could not fetch a trainer")
        });
    });//end trainer controller