
var assignforce = angular.module( "batchApp");

assignforce.controller("settingsCtrl", function ($scope) {
    var sc = this;

    sc.showToast = function (message) {
        $scope.$parent.aCtrl.showToast(message);
    };

    sc.showContent = function () {
        if (!sc.hidden){
            sc.hidden = true;
        }
    };
    sc.hideContent = function () {
        if (sc.hidden){
            sc.hidden = false;
        }
    };

    //data
    sc.hidden = false;
});
