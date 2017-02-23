
var assignforce = angular.module("batchApp");

assignforce.controller("ptoCtrl", function ($scope, $mdDialog, ptoService) {

    var ptoc = this;

    // ptoService.authorize();

    ptoc.cancel = function () {
        $mdDialog.cancel();

        $mdDialog.show({
            templateUrl: "html/templates/calendarTemplate.html",
            controller: "trainerCtrl",
            controllerAs: "tCtrl",
            bindToController: true,
            clickOutsideToClose: true
        })
    };

    ptoc.send = function (isValid) {
        if(isValid){
            ptoService.addPto(ptoc.trainer, ptoc.startDate, ptoc.endDate);
        }
    };
});



    