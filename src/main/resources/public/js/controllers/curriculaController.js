/**
 * Created by lazaro on 2/22/2017.
 */

var assignforce = angular.module( "batchApp" );

assignforce.controller("curriculaCtrl", function ($scope, $rootScope, curriculumService, skillService) {
    
    $scope.isManager = $rootScope.role === "VP of Technology";

    //functions

    //calls showToast method of aCtrl
    $scope.showToast = function ( message ) {
        $scope.$parent.aCtrl.showToast( message )
    };

    //create a skill and add it to the database
    $scope.createSkill = function (skillForm) {
        if(skillForm.$valid) {
            var skill = skillService.getEmptySkill();
            skill.name = $scope.skillName;
            skill.skillId = 0;
            skill.active = true;

            skillService.update(skill, function () {
                $scope.showToast("Skill Created")
            }, function () {
                $scope.showToast("Failed to create skill")
            })
        } else {
            $scope.showToast("Missing input fields.")
        }

        $scope.skillName = undefined;
    };

    //hides and shows the skill card's content when called
    $scope.toggleSkillToolbar = function () {
        if($scope.skillToggle){
            $scope.skillToggle = false;
            $("#skillArrow").text("keyboard_arrow_down");
        } else {
            $scope.skillToggle = true;
            $("#skillArrow").text("keyboard_arrow_up");
        }

        $("#skill").slideToggle();
    };

    //hides and shows the core card's content when called
    $scope.toggleCoreToolbar = function () {
        if($scope.coreToggle){
            $scope.coreToggle = false;
            $("#coreArrow").text("keyboard_arrow_down");
        } else {
            $scope.coreToggle = true;
            $("#coreArrow").text("keyboard_arrow_up");
        }

        $('#core').slideToggle();
    };

    //focus functions
    $scope.createCurriculum = function (focusForm,isCore) {

        //show a hidden field with a list of skill to select from, a name field, and a save button
        if(focusForm.$valid){

            let selectedSkills = $scope.selectedSkills.map((x) => {
                return parseInt(x);
            });
            let skillList = $scope.skills
                .filter( (skill) => selectedSkills.includes(skill.skillId) );

            let curriculum = {
                name    : isCore?$scope.coreName:$scope.focusName,
                skills  : skillList,
                active  : true,
                core    : isCore
            };

            curriculumService.create(curriculum, function () {
                $scope.showToast("" + isCore? "Core":"Focus" +" created")
            }, function () {
                $scope.showToast("Failed to create " + isCore? "core":"focus")
            })

            //reload curriculum
            $scope.curricula.push(curriculum);

        } else {
            $scope.showToast("Missing input fields.")
        }

        $scope.selectedSkills = [];
        $scope.focusName = undefined;

    };
    //create a focus
    //I want to fix this to be readable - Sam
    $scope.createFocus = function (focusForm) {

        $scope.createCurriculum(focusForm,false);
        $scope.focusName = undefined;

    };

    //create a core
    $scope.createCore = function (coreForm) {
        $scope.createCurriculum(coreForm,true);
        $scope.coreName = undefined;
    };

    //Used to show the create focus card
    $scope.toggleFocusStatus = function () {
        if($scope.focusStatus){
            $scope.focusStatus = false;
        } else {
            $scope.focusStatus = true;
        }
    };

    //Used to show the create core card
    $scope.toggleCoreStatus = function (){
        if($scope.coreStatus) {
            $scope.coreStatus = false;
        } else{
            $scope.coreStatus =true;
        }
    };

    //hides and shows the focus card's content when called
    $scope.toggleFocusToolbar = function () {
        if($scope.focusToggle){
            $scope.focusToggle = false;
            $("#focusArrow").text("keyboard_arrow_down");
        } else {
            $scope.focusToggle = true;
            $("#focusArrow").text("keyboard_arrow_up");
        }

        $('#focus').slideToggle();
    };

    //removes a focus
    $scope.removeFocus = function (curr) {
        curr.active = false;
        curriculumService.update(curr, function () {
            $scope.showToast("Removed focus successfully")
        }, function () {
            $scope.showToast("Unable to remove focus")
        })
    };

    //started the code for editing a focus. to be finished at a later time
    $scope.editFocus = function (focus) {
        $scope.focusName = focus.name;
        $scope.selectedSkills = focus.skills;
        $scope.focusStatus = true;
    };

    //used to join the skills together
    $scope.joinObjArrayByName = function(elem) {
        return elem.name;
    };

    //retrieving data

    //Grabs all Curricula
    curriculumService.getAll(function (response) {
        $scope.curricula = response;
    }, function () {
        $scope.showToast("Could not fetch curricula.");
    });

    //Grabs all Skills
    skillService.getAll(function (response) {
        $scope.skills = response;
    }, function () {
        $scope.showToast("Could not fetch skills.")
    });

    //variables
    $scope.selectedSkills = [];
    $scope.focusName = undefined;
    $scope.coreName = undefined; //added for add Core usecase
    $scope.skillName = undefined;
    $scope.focusStatus = false;
    $scope.coreStatus = false; //added for add Core usecase
    $scope.skillToggle = true;
    $scope.focusToggle = true;
    $scope.coreToggle = true;

});