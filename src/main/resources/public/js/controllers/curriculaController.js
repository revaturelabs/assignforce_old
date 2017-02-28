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

    //create a skill and add it to the database
    cc.createSkill = function (skillForm) {
        if(skillForm.$valid) {
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

    //hides and shows the skill card's content when called
    cc.toggleSkillToolbar = function () {
        if(cc.skillToggle){
            cc.skillToggle = false;
            $("#skillArrow").text("keyboard_arrow_down");
        } else {
            cc.skillToggle = true;
            $("#skillArrow").text("keyboard_arrow_up");
        }

        $("#skill").slideToggle();
    };

    //hides and shows the core card's content when called
    cc.toggleCoreToolbar = function () {
        if(cc.coreToggle){
            cc.coreToggle = false;
            $("#coreArrow").text("keyboard_arrow_down");
        } else {
            cc.coreToggle = true;
            $("#coreArrow").text("keyboard_arrow_up");
        }

        $('#core').slideToggle();
    };

    //focus functions
    //create a focus
    cc.createFocus = function (focusForm) {
        //show a hidden field with a list of skill to select from, a name field, and a save button
        if(focusForm.$valid){
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
                skills  : skillList,
                active  : true,
                core    : false
            };

            curriculumService.create(curriculum, function () {
                cc.showToast("Focus created")
            }, function () {
                cc.showToast("Failed to create focus")
            })

            //reload curriculum
            cc.curricula.push(curriculum);

        } else {
            cc.showToast("Missing input fields.")
        }

        cc.selectedSkills = [];
        cc.focusName = undefined;
    };

    //Used to show the create focus card
    cc.toggleFocusStatus = function () {
        if(cc.focusStatus){
            cc.focusStatus = false;
        } else {
            cc.focusStatus = true;
        }
    };

    //hides and shows the focus card's content when called
    cc.toggleFocusToolbar = function () {
        if(cc.focusToggle){
            cc.focusToggle = false;
            $("#focusArrow").text("keyboard_arrow_down");
        } else {
            cc.focusToggle = true;
            $("#focusArrow").text("keyboard_arrow_up");
        }

        $('#focus').slideToggle();
    };

    //removes a focus
    cc.removeFocus = function (curr) {
        curr.active = false;
        curriculumService.update(curr, function () {
            cc.showToast("Removed focus successfully")
        }, function () {
            cc.showToast("Unable to remove focus")
        })
    };

    cc.editFocus = function (focus) {
        cc.focusName = focus.name;
        cc.selectedSkills = focus.skills;

    };

    //used to join the skills together
    cc.joinObjArrayByName = function(elem) {
        return elem.name;
    };

    cc.rePullCurricula = function () {
        cc.curricula = undefined;
        curriculumService.getAll(function (response) {
            cc.curricula = response;
        }, function () {
            cc.showToast("Could not fetch curricula.");
        });
    };

    //retrieving data

    //Grabs all Curriculums
    curriculumService.getAll(function (response) {
        cc.curricula = response;
    }, function () {
        cc.showToast("Could not fetch curricula.");
    });

    //Grabs all Skills
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
    cc.skillToggle = true;
    cc.focusToggle = true;
    cc.coreToggle = true;

});