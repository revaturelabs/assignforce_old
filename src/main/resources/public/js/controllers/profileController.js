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
    trainerService.getById(1, function (response) {
        pc.trainer = response;
    }, function (error) {
        pc.showToast("Could not fetch trainer.");
    })
})