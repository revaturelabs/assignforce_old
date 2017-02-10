
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "trainerCtrl", function( $scope, $mdDialog, $mdToast, trainerService ) {
        var tc = this;
        // console.log("start trainers")
          // functions
            // calls showToast method of aCtrl
        tc.showToast = function( message ) {
            $scope.$parent.aCtrl.showToast( message );
        };

        //adds a trainer by popping up a dialog box
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

        tc.removeTrainer = function (trainerRM) {
            // $mdToast.show( $mdToast.simple().textContent( "Do you want to remove this trainer" ).action("OKAY").position("top right").highlightAction(true) );
            trainerRM.active = false;

            trainerService.update(trainerRM, function () {
                tc.showToast("success");
                tc.rePullTrainers();
            }, function () {
                tc.showToast("failed");
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

            //queries the database for trainers. to be called after a change to the trainers array
        tc.rePullTrainers = function(){
            tc.trainers = undefined;
            trainerService.getAll( function(response) {
                tc.trainers = response;
            }, function(error) {
                tc.showToast("Could not fetch trainers.");
            });
        };
        
        tc.convertUnavailability = function(incoming){
        	return new Date(incoming);
        }

        //data
        tc.weeks = 5;

          // page initialization
            // gets all trainers and stores them in variable trainers
        trainerService.getAll( function(response) {
            tc.trainers = response;
        }, function(error) {
            tc.showToast("Could not fetch trainers.");
        });

        tc.showCalendar = function () {
            console.log("lol");
            $mdDialog.show({
                templateUrl: "html/templates/calendarTemplate.html",
                // controller: "ptoCalendarCtrl",
                // controllerAs: "ptoCtrl",
                // locals: {
                //     trainer : trainerService.getEmptyTrainer(),
                //     state    : "create" },
                bindToController: true,
                clickOutsideToClose: true
            }).then(function () {
                // tc.showToast("Trainer success.");
                // tc.rePullTrainers();
            }, function () {
                // tc.showToast("Trainer Fails.")
            });
        };

        // trainerService.getById(1, function (response) {
        //     tc.singleTrainer = response;
        // }, function (error) {
        //     tc.showToast("could not fetch a trainer")
        // });
    });//end trainer controller