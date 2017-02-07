/**
 * Created by Zach Nelson on 2/2/2017.
 */
var assignforce = angular.module( "batchApp" );

assignforce.controller( "profileCtrl", function( $scope, trainerService ) {
    var pc = this;

    // functions
    // calls showToast method of aCtrl
    pc.showToast = function( message ) {
        $scope.$parent.aCtrl.showToast( message );
    };

    // data gathering

    // id is hard coded for testing. fix this later
    trainerService.getById(1, function (response) {
        pc.trainer = response;
    }, function (error) {
        pc.showToast("Could not fetch trainer.");
    })


    //Simply hard coded for now. Just for testing view
    pc.firstName = "Profile";
    pc.lastName = "Test";
    pc.resume = "file.txt";
    pc.resumeBaseURL = "https://console.aws.amazon.com/s3/home?region=us-east-1#&bucket=revature-assignforce&prefix=";

})