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
        sdc.selectedSkills = sdc.trainer.skill;
        return sdc.selectedSkills.indexOf(obj) > -1;
    };

    //save updated skill
    sdc.save = function (isValid) {
        if (isValid){
            if (sdc.newSkill.name != null) {
                skillService.update(sdc.newSkill, function () {
                    $mdDialog.hide();
                }, function () {
                    $mdDialog.cancel();
                });
            }

            trainerService.update(sdc.trainer, function(response){
                // sdc.showToast("Trainer updated.");
                sdc.rePullTrainer();
            }, function (error){
                // sdc.showToast("Error updating trainer.");
            });
            $mdDialog.hide();
        }
    };

    //queries the database for the trainer. to be called after a change to the trainer's properties
    sdc.rePullTrainer = function(){
        console.log("starting sdc.rePullTrainer");
        console.log(sdc.trainer);
        //sdc.trainer = undefined;
        trainerService.getById(57, function (response) {
            sdc.trainer = response;
        }, function (error) {
            sdc.showToast("Could not fetch trainer.");
        });
        console.log("ending sdc.rePullTrainer");
        console.log(sdc.trainer);
    };
});