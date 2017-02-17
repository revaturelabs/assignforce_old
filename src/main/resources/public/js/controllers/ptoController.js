
var assignforce = angular.module("batchApp");

assignforce.controller("ptoCtrl", function ($scope, $mdDialog, ptoService) {

    var ptoc = this;

    ptoc.cancel = function () {
        $mdDialog.cancel();
    };

    tdc.send = function (isValid) {
        console.log("ayy");
        ptoService.sendRequest();
        
    };
});