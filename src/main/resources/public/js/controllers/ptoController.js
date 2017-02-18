
var assignforce = angular.module("batchApp");

assignforce.controller("ptoCtrl", function ($scope, $mdDialog, ptoService) {

    var ptoc = this;

    ptoc.cancel = function () {
        $mdDialog.cancel();
    };

    ptoc.send = function (isValid) {
        if(isValid){
            // console.log("ayy");
            ptoService.sendRequest();
        }
    };
});