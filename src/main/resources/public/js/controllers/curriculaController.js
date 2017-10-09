var assignforce = angular.module( "batchApp" );

assignforce.controller("curriculaCtrl", function ($scope, curriculumService, skillService) {
    var cc = this;
    //$scope.skillToggle = false;

    //functions

    //calls showToast method of aCtrl therefore no need to test
    cc.showToast = function ( message ) {
        $scope.$parent.aCtrl.showToast( message )
    };

    //calls skillService therefore no need to test
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

    //Skill toolbar are not implemented on the developer side therefore no need to test
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

     //conducted TEST for this function but failed beacuse of a bug in line 55
    //hides and shows the core card's content when called
    cc.toggleCoreToolbar = function () {
        if(cc.coreToggle){
            cc.coreToggle = false;
            $("#coreArrow").text("keyboard_arrow_down");  //Don't need this since the toggle button works fine without it
        } else {
            cc.coreToggle = true;
            $("#coreArrow").text("keyboard_arrow_up"); ////Don't need this since the toggle button works fine without it
        }

        $('#core').slideToggle();
    };

    //No need to test this since it calls curruculumService
    //focus functions
    //create a focus
    //I want to fix this to be readable - Sam
    cc.createFocus = function (focusForm) {
        //show a hidden field with a list of skill to select from, a name field, and a save button
        if(focusForm.$valid){
            var skillList = [];
            for(var i = 0; i < cc.selectedSkills.length; i++){  //if skills has a,b,c and selectedSkills has a,b then skillList has a,b
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

    //Successfully tested this function
    //Used to show the create focus card
    cc.toggleFocusStatus = function () {
        if(cc.focusStatus){
            cc.focusStatus = false;
        } else {
            cc.focusStatus = true;
        }
    };

     //there is bug in line 120 so can't test this until the bug is fixed
    //hides and shows the focus card's content when called
    cc.toggleFocusToolbar = function () {
        if(cc.focusToggle){
            cc.focusToggle = false;
            $("#focusArrow").text("keyboard_arrow_down"); //Don't need this since the toggle button works fine without it
        } else {
            cc.focusToggle = true;
           $("#focusArrow").text("keyboard_arrow_up"); //Don't need this since the toggle button works fine without it
        }

        $('#focus').slideToggle();
    };

    //No test needed since it calls showToast method in authController
    //removes a focus
    cc.removeFocus = function (curr) {
        curr.active = false;
        curriculumService.update(curr, function () {
            cc.showToast("Removed focus successfully")
        }, function () {
            cc.showToast("Unable to remove focus")
        })
    };

    //functio not tested since its incomplete
    //started the code for editing a focus. to be finished at a later time
    cc.editFocus = function (focus) {
        cc.focusName = focus.name;
        cc.selectedSkills = focus.skills;
        cc.focusStatus = true;
    };

    //This function does not need to be tested since there is not logic
    //used to join the skills together
    cc.joinObjArrayByName = function(elem) {
        return elem.name;
    };

    //retrieving data

    //Not tested since it just calls Curiculla Service
    //Grabs all Curricula
    curriculumService.getAll(function (response) {
        cc.curricula = response;
    }, function () {
        cc.showToast("Could not fetch curricula.");
    });

    //Not tested since it calls skillService
    //Grabs all Skills
    skillService.getAll(function (response) {
        cc.skills = response;
    }, function () {
        cc.showToast("Could not fetch skills.")
    });

    //variables
    // cc.curricula;
    // cc.skills;
    cc.selectedSkills = [];
    cc.focusName = undefined;
    cc.skillName = undefined;
    cc.focusStatus = false;
    cc.skillToggle = true;
    cc.focusToggle = true;
    cc.coreToggle = true;

});