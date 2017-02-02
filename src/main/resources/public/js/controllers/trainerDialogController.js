
var assignforce = angular.module("batchApp");

assignforce.controller("trainerDialogCtrl", function ($scope, $mdDialog, trainerService) {

    var tdc = this;


    //functions
        //close dialog
    tdc.cancel = function () {
        $mdDialog.cancel();
    };

    //save new
    tdc.save = function (isValid) {
        console.log(isValid);
        if (isValid){
            if (tdc.state == "create"){
                console.log(tdc.trainer)
                trainerService.create(tdc.trainer, function () {
                    console.log("pass");
                    $mdDialog.hide();
                }, function () {
                    console.log("cancel");
                    $mdDialog.cancel();
                });

                console.log("not called");
                $mdDialog.hide();
            }
        }
    };


    //data
    tdc.stateMux = { "create" : "Create new trainer" };


});