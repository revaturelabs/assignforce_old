
var assignforce = angular.module("batchApp");

assignforce.controller("trainerDialogCtrl", function ($scope, $mdDialog, trainerService) {

    var tdc = this;

    //close dialog
    tdc.cancel = function () {
        $mdDialog.cancel();
    };

    //save new
    tdc.save = function (isValid) {
    	
            if (isValid && tdc.state === "create"){
                trainerService.create(tdc.trainer, function () {
                    $mdDialog.hide();
                }, function () {
                    $mdDialog.cancel();
                });
                $mdDialog.hide();
            }
    };

    //data
    tdc.stateMux = { "create" : "Create new trainer" };

});