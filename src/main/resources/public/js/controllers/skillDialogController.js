/**
 * Created by Zach Nelson on 2/8/2017.
 */

var assignforce = angular.module("batchApp");

assignforce.controller("skillDialogCtrl", function ($scope, $mdDialog, skillService) {

    var sdc = this;

    //functions
    //close dialog
    sdc.cancel = function () {
        $mdDialog.cancel();
    };

    //save updated skill
    sdc.save = function (isValid) {
        if (isValid){
            skillService.update(sdc.newSkill, function () {
                $mdDialog.hide();
            }, function () {
                $mdDialog.cancel();
            });
            $mdDialog.hide();
        }
    };
});