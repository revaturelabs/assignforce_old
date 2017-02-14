/**
 * Created by Zach Nelson on 2/2/2017.
 */
var assignforce = angular.module( "batchApp" );

assignforce.controller( "profileCtrl", function( $scope, $mdDialog, $mdToast, trainerService, skillService) {
        var pc = this;

    // functions
    // calls showToast method of aCtrl
    pc.showToast = function( message ) {
        $scope.$parent.aCtrl.showToast( message );
    };

    // data gathering

    // id is hard coded for testing. fix this later
    trainerService.getById(57, function (response) {
        console.log(response);
        pc.trainer = response;
    }, function (error) {
        pc.showToast("Could not fetch trainer.");
    })

    skillService.getAll( function(response) {
        pc.skills = response;
    }, function(error) {
        pc.showToast("Could not fetch skills.");
    });

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

    //queries the database for the trainer. to be called after a change to the trainer's properties
    pc.rePullTrainer = function(){
        pc.trainer = undefined;
        trainerService.getById(57, function (response) {
            console.log(response);
            pc.trainer = response;
        }, function (error) {
            pc.showToast("Could not fetch trainer.");
        });
    };

    //queries the database for skills. to be called after a change to the skills array
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

})