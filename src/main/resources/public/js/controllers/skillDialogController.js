/**
 * Created by Zach Nelson on 2/8/2017.
 */

var assignforce = angular.module("batchApp");

assignforce.controller("skillDialogCtrl", function ($scope, $mdDialog, $mdToast, skillService, trainerService) {

    var sdc = this;

    //functions

    //close dialog
    sdc.cancel = function () {
        $mdDialog.cancel();
    };

    // adds/removes skill from selectedSkills
    sdc.toggle = function(obj) {
        sdc.selectedSkills = sdc.trainer.skill;

        var idx = sdc.selectedSkills.indexOf(obj);
        if (idx == -1) {
            sdc.selectedSkills.push(obj);
        } else {
            sdc.selectedSkills.splice(idx, 1);
        }
    };

    // checks box if location/room is in selectedList
    sdc.exists = function(obj) {
        return sdc.selectedSkills.indexOf(obj) > -1;
    };

    //save updated skill
    sdc.save = function (isValid) {
        if (isValid){
            //this creates a skill and adds it to the database
            if (sdc.newSkill.name != null) {
                skillService.update(sdc.newSkill, function () {
                    $mdDialog.hide();
                }, function () {
                    $mdDialog.cancel();
                });
            }
            $mdDialog.hide();
        }
    };

    //this will be an array of skills
    sdc.selectedSkills;
});