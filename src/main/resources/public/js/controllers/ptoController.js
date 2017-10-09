var assignforce = angular.module("batchApp");

assignforce.controller("ptoCtrl", function ($scope, $mdDialog, ptoService) {

    var ptoc = this;

    ptoc.cancel = function () {
        $mdDialog.cancel();

        $mdDialog.show({
            templateUrl: "html/templates/dialogs/calendarDialog.html",
            controller: "trainerCtrl",
            controllerAs: "tCtrl",
            bindToController: true,
            clickOutsideToClose: true
        })
    };

    ptoc.send = function (isValid) {
        console.log("outer");
        if(isValid){
            console.log("In");
            ptoService.addPto(ptoc.trainer, ptoc.startDate, ptoc.endDate);
        }
    };
});
