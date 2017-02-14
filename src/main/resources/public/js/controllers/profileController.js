/**
 * Created by Zach Nelson on 2/2/2017.
 */

var assignforce = angular.module( "batchApp" );

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
        //connection fro assignforce bucket put
        var params = {
            Bucket: pc.c
        }

    };

    // id is hard coded for testing. fix this later
    trainerService.getById(1, function (response) {
        pc.trainer = response;
    }, function (error) {
        pc.showToast("Could not fetch trainer.");
    });

    skillService.getAll( function(response) {
        pc.skills = response;
    }, function(error) {
        pc.showToast("Could not fetch skills.");
    });

    s3Service.getCreds(function (response) {
        pc.creds = response;
        console.log(pc.creds);
    }, function (error) {
        console.log(error);
    });

    //queries the database for trainers. to be called after a change to the trainers array
    pc.rePullSkills = function(){
        pc.skills = undefined;
        skillService.getAll( function(response) {
            pc.skills = response;
        }, function(error) {
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