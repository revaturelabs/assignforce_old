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
                trainer : pc.trainer,
                skills  : pc.skills,
                newSkill   : skillService.getEmptySkill()},
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
        console.log(pc.myFile);
        //connection fro assignforce bucket put
        var params = {
            Bucket: '',
            Key: 'user1.doc',
            ACL: 'public-read-write',
            Body: pc.myFile
        };

        var bucket = new AWS.S3({
            accessKeyID: '',
            secretAccessKey: ''
        });

        //putting an object
        // bucket.putObject(params, function(err, data) {
        //     if (err) console.log(err, err.stack); // an error occurred
        //     else     console.log(data);           // successful response
        // });
    };

    pc.updateResume = function () {
        console.log(pc.myFile);
        pc.trainer.resume = pc.myFile.name;
        pc.myFile = undefined;
    };

    // id is hard coded for testing. fix this later
    trainerService.getById(2, function (response) {
        pc.trainer = response;
    }, function () {
        pc.showToast("Could not fetch trainer.");
    });

    skillService.getAll( function(response) {
        pc.skills = response;
    }, function() {
        pc.showToast("Could not fetch skills.");
    });

    s3Service.getCreds(function (response) {
        pc.creds = response;
    }, function (error) {
        console.log(error);
    });

    //queries the database for trainers. to be called after a change to the trainers array
    pc.rePullSkills = function(){
        pc.skills = undefined;
        skillService.getAll( function(response) {
            pc.skills = response;
        }, function() {
            pc.showToast("Could not fetch skills.");
        });
    };

    //Simply hard coded for now. Just for testing view
    pc.firstName = "Profile";
    pc.lastName = "Test";
    pc.resume = "file.txt";
    pc.resumeBaseURL = "https://console.aws.amazon.com/s3/home?region=us-east-1#&bucket=revature-assignforce&prefix=";
    pc.myFile;
});