
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "trainerCtrl", function( $scope, $mdDialog, $mdToast, trainerService, s3Service ) {
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
            }, function () {
                tc.showToast("failed");
            });
        };


        //connects to aws s3 to grab an object
        tc.grabS3Resume = function (fileName) {
            console.log(fileName);

            var bucket = new AWS.S3({
                accessKeyID: '',
                secretAccessKey: ''
            });

            var paramsGet = {
                Bucket: '',
                Key: fileName,
                Expires: 60 //url expires in 60 seconds with signed urls
            };

            //downloading a file
            // tc.url = bucket.getSignedUrl('getObject', paramsGet);
            // console.log('The URL is', tc.url);

            // var link = document.createElement("a");
            // link.download = "test.png";
            // link.href = tc.url;
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            // delete link;
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
            }, function() {
                tc.showToast("Could not fetch trainers.");
            });
        };
        
        tc.convertUnavailability = function(incoming){
        	return new Date(incoming);
        };

        // page initialization

        //get the S3 bucket credentials and store them in creds
        s3Service.getCreds(function (response) {
            tc.creds = response;
        }, function (error) {
            console.log(error);
        });

        // gets all trainers and stores them in variable trainers
        trainerService.getAll( function(response) {
            tc.trainers = response;
        }, function() {
            tc.showToast("Could not fetch trainers.");
        });
    });//end trainer controller