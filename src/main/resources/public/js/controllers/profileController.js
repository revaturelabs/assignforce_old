/**
 * Created by Zach Nelson on 2/2/2017.
 */

var assignforce = angular.module( "batchApp" );

assignforce.directive("fileModel", ['$parse', function ($parse) {
    return {
        restrict: 'A', //restricts this directive to be only invoked by attributes
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

assignforce.controller( "profileCtrl", function( $scope, $mdDialog, $mdToast, trainerService, skillService, s3Service) {
    var pc = this;

    // functions
    // calls showToast method of aCtrl
    pc.showToast = function( message ) {
        $scope.$parent.aCtrl.showToast( message );
    };

    pc.addSkills = function () {
        $mdDialog.show({
            templateUrl: "html/templates/skillTemplate.html",
            controller: "skillDialogCtrl",
            controllerAs: "sdCtrl",
            locals: {
                trainer        : pc.trainer,
                skills         : pc.skills,
                newSkill       : skillService.getEmptySkill()},
            bindToController: true,
            clickOutsideToClose: true
        }).then(function () {
            pc.showToast("Skill(s) added.");
            pc.rePullSkills();
        }, function () {
            pc.showToast("Skill(s) not added.")
        });
    };

    pc.uploadResume = function () {
        //This initializes a bucket with the keys obtained from Creds rest controller
        var bucket = new AWS.S3({
            accessKeyId: pc.creds.ID,
            secretAccessKey: pc.creds.SecretKey,
            region: 'us-east-1'
        });

        //set the parameters needed to put an object in the aws s3 bucket
        var params = {
            Bucket: pc.creds.BucketName,
            Key: pc.myFile.name,
            // ACL: 'public-read-write',
            Body: pc.myFile
        };

        //putting an object in the s3 bucket
        bucket.putObject(params, function (err, data) {
            if (err){
                pc.showToast("could not upload file.");
                return;
            }
        });

        //set the trainer to the file name which is the s3 file key in order to grab that object
        pc.trainer.resume = pc.myFile.name;
        //save the modified trainer resume field
        trainerService.update(pc.trainer, function () {
            pc.showToast("Resume upload finished");
        }, function () {
            pc.showToast("Failed to upload resume");
        });

        //set myfile to undefined so that update and label will be hidden in the html
        pc.myFile = undefined;
    };

    //queries the database for skills. to be called after a change to the skills array
    pc.rePullSkills = function(){
        pc.skills = undefined;
        skillService.getAll( function(response) {
            pc.skills = response;
        }, function() {
            pc.showToast("Could not fetch skills.");
        });
    };

    //queries the database for the trainer. to be called after a change to the trainer's properties
    pc.rePullTrainer = function(){
        pc.trainer = undefined;
        trainerService.getById(57, function (response) {
            pc.trainer = response;
        }, function () {
            pc.showToast("Could not fetch trainer.");
        });
    };

    // data gathering

    // id is hard coded for testing. fix this later
    trainerService.getById(3, function (response) {
        pc.trainer = response;
    }, function () {
        pc.showToast("Could not fetch trainer.");
    });

    s3Service.getCreds(function (response) {
        pc.creds = response;
    }, function () {
        pc.showToast("Failed to fetch Credentials")
    });

    skillService.getAll( function(response) {
        pc.skills = response;
    }, function () {
        pc.showToast("Could not fetch skills.");
    });

    //Simply hard coded for now. Just for testing view
    pc.firstName = "Profile";
    pc.lastName = "Test";
    pc.resume = "file.txt";
    pc.resumeBaseURL = "https://console.aws.amazon.com/s3/home?region=us-east-1#&bucket=revature-assignforce&prefix=";
    pc.myFile;
    pc.creds;
});