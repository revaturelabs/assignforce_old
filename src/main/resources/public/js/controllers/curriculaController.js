/**
 * Created by lazaro on 2/22/2017.
 */

var assignforce = angular.module( "batchApp" );

assignforce.controller("curriculaCtrl", function ($scope, $rootScope, $mdDialog, curriculumService, skillService) {
    var cc = this;

    $scope.isManager = $rootScope.role === "VP of Technology";

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
    cc.createCurriculum = function (focusForm,isCore) {

        //show a hidden field with a list of skill to select from, a name field, and a save button
        if(focusForm.$valid){

            let selectedSkills = cc.selectedSkills.map((x) => {
                return parseInt(x);
            });
            let skillList = cc.skills
                .filter( (skill) => selectedSkills.includes(skill.skillId) );

            let curriculum = {
                name    : isCore?cc.coreName:cc.focusName,
                skills  : skillList,
                active  : true,
                core    : isCore
            };

            curriculumService.create(curriculum, function () {
                cc.showToast("" + isCore? "Core":"Focus" +" created")
            }, function () {
                cc.showToast("Failed to create " + isCore? "core":"focus")
            })

            //reload curriculum
            cc.curricula.push(curriculum);

        } else {
            cc.showToast("Missing input fields.")
        }

        cc.selectedSkills = [];
        cc.focusName = undefined;

    };
    //create a focus
    //I want to fix this to be readable - Sam
    cc.createFocus = function (focusForm) {

        cc.createCurriculum(focusForm,false);
        cc.focusName = undefined;

    };

    //create a core
    cc.createCore = function (coreForm) {
        cc.createCurriculum(coreForm,true);
        cc.coreName = undefined;
    };

    //Used to show the create focus card
    cc.toggleFocusStatus = function () {
        if(cc.focusStatus){
            cc.focusStatus = false;
        } else {
            cc.focusStatus = true;
        }
    };

    //Used to show the create core card
    cc.toggleCoreStatus = function (){
        if(cc.coreStatus) {
            cc.coreStatus = false;
        } else{
            cc.coreStatus =true;
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

    //started the code for editing a focus. to be finished at a later time
    cc.editFocus = function (focus) {
        cc.focusName = focus.name;
        cc.selectedSkills = focus.skills;
        cc.focusStatus = true;
    };

    //used to join the skills together
    cc.joinObjArrayByName = function(elem) {
        return elem.name;
    };

    //retrieving data

    //Grabs all Curricula
    curriculumService.getAll(function (response) {
        cc.curricula = response;
    }, function () {
        cc.showToast("Could not fetch curricula.");
    });

    //Grabs all Skills
    skillService.getAll(function (response) {
        cc.skills = response;
        $rootScope.skills = cc.skills;
    }, function () {
        cc.showToast("Could not fetch skills.")
    });

    //Show Edit Curriculum Dialog
    $scope.showCurriculum = function(event) {
       $mdDialog.show({
            targetEvent: event,
            template:
            '<md-dialog>' +
            '   <md-dialog-content>' +
            '       <form name = curriculumForm>' +
            '           <h3>Core Curriculum</h3>' +
            '	        <md-input-container>' +
            '		        <label>Curriculum Name</label>' +
            '		        <input name="curriculumName" ng-model="coreN" ng-init= "New Curriculum">' +
            '           </md-input-container>' +
            '           <br>' +
            '	        <md-input-container>' +
            '		        <h5>Skill Selection</h5>' +
            '               <select ng-model="skillz" multiple="multiple">' +
            '                   <option ng-repeat="x in skills">{{x.name}}</option>' +
            '               </select>' +
            '           </md-input-container>' +
            '       </form>' +
            '   </md-dialog-content>' +
            '   <md-dialog-actions>' +
            '       <md-button ng-click="cancel()" class="md-primary">Cancel</md-button>' +
            '       <md-button ng-click="createCore()" class="md-primary">Save</md-button>' +
            '   </md-dialog-actions>' +
            '</md-dialog>',
            locals: {
                       skills: $rootScope.skills
                     },
            controller: DialogController
       });
       function DialogController($scope, $mdDialog, skills) {

           $scope.skills = skills;

           $scope.cancel = function() {
            $mdDialog.cancel();
           }
           $scope.createCore = function() {
                var curric = {
                           name    : $scope.coreN,
                           skills  : $scope.skillz,
                           active  : true,
                           core    : true
                       };
                       curriculumService.create(curric, function () {
                           cc.showToast("Core created")
                       }, function () {
                           cc.showToast("You're not authorized Scrub")
                       })

                       cc.curricula.push(curric);
                $mdDialog.hide();
           }
       }
    };

    //Show Edit Focus Dialog
    $scope.showFocus = function(event) {
        var prompt = $mdDialog.prompt()
          .title('New Focus')
          .placeholder('focusName')
          .ariaLabel('focusName')
          .initialValue('Focus Name')
          .ok('Create')
          .cancel('Cancel')
          .targetEvent(event);
       $mdDialog.show(prompt).then(function(result){
            var curric = {
                name    : result,
                skills  : {},
                active  : true,
                core    : false
            };
            curriculumService.create(curric, function () {
                cc.showToast("Focus created")
            }, function () {
                cc.showToast("You're not authorized Scrub")
            })

            cc.curricula.push(curric);
       });
    };
    //variables
    cc.selectedSkills = [];
    cc.focusName = undefined;
    cc.coreName = undefined; //added for add Core usecase
    cc.skillName = undefined;
    cc.focusStatus = false;
    cc.coreStatus = false; //added for add Core usecase
    cc.skillToggle = true;
    cc.focusToggle = true;
    cc.coreToggle = true;

});