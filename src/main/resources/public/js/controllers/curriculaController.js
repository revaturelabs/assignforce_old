/**
 * Created by lazar on 2/22/2017.
 */

var assignforce = angular.module( "batchApp" );

assignforce.controller("curriculaCtrl", function ($scope, curriculumService, skillService) {
    var cc = this;

    //functions

    //calls showToast method of aCtrl
    cc.showToast = function ( message ) {
        $scope.$parent.aCtrl.showToast( message )
    };

    //create a focus
    cc.createFocus = function () {
        //show a hidden field with a list of skill to select from, a name field, and a save button
        if($scope.focusForm.$valid){
            var skillList = [];
            for(var i = 0; i < cc.selectedSkills.length; i++){
                for(var j = 0; j < cc.skills.length; j++){
                    if(cc.skills[j].skillId == cc.selectedSkills[i]){
                        skillList.push(cc.skills[j]);
                        break;
                    }
                }
            }

            var curriculum = {
                name    : cc.focusName,
                skills  : skillList
            };

            curriculumService.create(curriculum, function () {
                cc.showToast("Focus created")
            }, function () {
                cc.showToast("Failed to create focus")
            })

        } else {
            cc.showToast("Missing input fields.")
        }

        cc.selectedSkills = [];
        cc.focusName = undefined;
    };

    cc.createSkill = function () {


        if($scope.skillForm.$valid) {
            var skill = skillService.getEmptySkill();
            skill.name = cc.skillName;
            skill.skillId = 0;
            skill.active = true;

            skillService.update(skill, function () {
                cc.showToast("Skill Created")
            }, function () {
                cc.showToast("Failed to create skill")
            })
        } else {
            cc.showToast("Missing input fields.")
        }

        cc.skillName = undefined;
    };

    cc.toggleFocusStatus = function () {
        if(!!cc.focusStatus){
            cc.focusStatus = false;
        } else {
            cc.focusStatus = true;
        }
    };

    //retrieving data
    curriculumService.getAll(function (response) {
        cc.curricula = response;
    }, function () {
        cc.showToast("Could not fetch curricula.");
    });

    skillService.getAll(function (response) {
        cc.skills = response;
    }, function () {
        cc.showToast("Could not fetch skills.")
    });


    //variables
    cc.curricula;
    cc.skills;
    cc.selectedSkills = [];
    cc.focusName = undefined;
    cc.skillName = undefined;
    cc.focusStatus = false;

});