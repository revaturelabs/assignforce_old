
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
                    state   : "create" },
                bindToController: true,
                clickOutsideToClose: true
            }).then(function () {
                tc.showToast("Trainer success.");
                tc.rePullTrainers();
            }, function () {
                tc.showToast("Trainer Fails.")
            });
        };

        //deactivates a single trainer
        tc.removeTrainer = function (trainerRM) {
            //set active to false deactivating the trainer in the front end
            trainerRM.active = false;

            //calls the update method to set active to false in the database.
            trainerService.update(trainerRM, function () {
                tc.showToast("success");
                // tc.rePullTrainers(); might not need this since i set actice to false already
            }, function () {
                tc.showToast("failed");
            });
        };


        //connects to aws s3 to grab an object
        // tc.grabS3Resume = function () {
        //     var bucketName = "revature-assignforce";
        //
        //     var bucket = new AWS.S3({
        //         accessKeyId: 'AKIAIJCZHWEPE6SODSXQ',
        //         secretAccessKey: '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'
        //     });
        //
        //     var params = {
        //         Bucket: bucketName,
        //     };
        //
        //     //aws stuff
        //     bucket.headBucket(params, function (err, data){
        //        if(err){} else {}
        //     });
        //
        // };

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

        // trainerService.getById(1, function (response) {
        //     tc.singleTrainer = response;
        // }, function (error) {
        //     tc.showToast("could not fetch a trainer")
        // });
    });//end trainer controller