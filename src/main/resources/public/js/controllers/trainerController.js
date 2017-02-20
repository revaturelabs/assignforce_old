
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
            //if the trainer has a null resume in the database then it will show the toast and stop running the function
            if(fileName == null){
                tc.showToast("This Trainer does not have any resume uploaded.")
                return
            }

            //This initializes a bucket with the keys obtained from Creds rest controller
            var bucket = new AWS.S3({
                accessKeyId: tc.creds.ID,
                secretAccessKey: tc.creds.SecretKey,
                region: 'us-east-1'
            });

            //set the parameters needed to get an object from aws s3 bucket
            var params = {
                Bucket: tc.creds.BucketName,
                Key: fileName,
                Expires: 60 //url expires in 60 seconds with signed urls
            };

            //grabs a url to the object in the s3 bucket
            tc.url = bucket.getSignedUrl('getObject', params);

            //this will create a link, set download and href, and invoke the click action on it having it download the file then delete that link
            var link = document.createElement("a");
            link.download = "test.png";
            link.href = tc.url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

            // reformats how an array of objects is joined
        tc.joinObjArrayByName = function(elem) {
            return elem.name;
        };

            // holdover until more trainer functionality is created
        //may need to take an event parameter (event)
        tc.goToTrainer = function() {
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

        tc.showCalendar = function(){

            $mdDialog.show({
                templateUrl: "html/templates/calendarTemplate.html",
                controller: "trainerCtrl",
                controllerAs: "tCtrl",
                bindToController: true,
                clickOutsideToClose: true
            });
        }

        tc.showPTODialog = function(){

            $mdDialog.show({
                templateUrl: "html/templates/ptoRequest.html",
                controller: "ptoCtrl",
                controllerAs: "ptoCtrl",
                bindToController: true,
                clickOutsideToClose: true
            });
        }

        // page initialization
        //get the S3 bucket credentials and store them in creds
        s3Service.getCreds(function (response) {
            tc.creds = response;
        }, function () {
            tc.showToast("failed to get credentials")
        });

        // gets all trainers and stores them in variable trainers
        trainerService.getAll( function(response) {
            tc.trainers = response;
        }, function() {
            tc.showToast("Could not fetch trainers.");
        });

    });//end trainer controller