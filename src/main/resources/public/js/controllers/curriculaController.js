var assignforce = angular.module( "batchApp" );

assignforce.controller("curriculaCtrl", function ($scope, $rootScope, $mdDialog, curriculumService, skillService, $route) {
    var cc = this;

    $scope.isManager = $rootScope.role === "VP of Technology";

    //functions

    //calls showToast method of aCtrl
    cc.showToast = function ( message ) {
        $scope.$parent.aCtrl.showtoast( message )
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

    //removes a core
        cc.removeCore = function (curr) {
            curr.active = false;
            curriculumService.update(curr, function () {
                cc.showToast("Removed core successfully")
            }, function () {
                cc.showToast("Unable to remove core")
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

    //Show Add Core Dialog
    $scope.showAddCore = function(event) {
       $mdDialog.show({
            targetEvent: event,
            clickOutsideToClose: true,
            templateUrl : "html/templates/dialogs/curriculumFormDialog.html",
            locals: {
                       curricI: {
                            name: "Core Name"
                       }
                     },
            controller: CoreDialogController
       });
       function CoreDialogController($scope, $mdDialog, curricI) {

           $scope.skills = cc.skills;
           $scope.curricI = curricI;

           $scope.cancel = function() {
            $mdDialog.cancel();
           }
           $scope.saveCurriculum = function(x) {
                var curric = {
                           name    : $scope.curricI.name,
                           skills  : $scope.curricI.skills,
                           active  : true,
                           core    : true
                       };
                       curriculumService.create(curric, function () {
                           cc.showToast("Core created");
                           $route.reload(); //this is not ideal. Newly created curricula do not appear initially
                       }, function () {
                           cc.showToast("Could not add Core")
                       })


                $mdDialog.hide();
           }
       }
    };

    //Show Add Focus Dialog
    $scope.showAddFocus = function(event) {
       $mdDialog.show({
            targetEvent: event,
            clickOutsideToClose: true,
            templateUrl : "html/templates/dialogs/curriculumFormDialog.html",
            locals: {
                       curricI: {
                                   name: "Focus Name"
                              }
                     },
            controller: FocusDialogController
       });
       function FocusDialogController($scope, $mdDialog, curricI) {

           $scope.skills = cc.skills;
          $scope.curricI = curricI;

           $scope.cancel = function() {
            $mdDialog.cancel();
           }
           $scope.saveCurriculum = function(x) {
                var curric = {
                           name    : $scope.curricI.name,
                           skills  : $scope.curricI.skills,
                           active  : true,
                           core    : false
                       };
                       curriculumService.create(curric, function () {
                           cc.showToast("Focus created");
                           $route.reload(); //this is not ideal. Newly created curricula do not appear initially
                       }, function () {
                           cc.showToast("You could not add focus")
                       })

                $mdDialog.hide();
           }
       }
    };

    //Show Edit Curriculum Dialog
    $scope.showEditCurriculum = function(event,curr) {
       $mdDialog.show({
            targetEvent: event,
            clickOutsideToClose: true,
            templateUrl : "html/templates/dialogs/curriculumFormDialog.html",
            locals: {
                       curricI: {
                            name: curr.name,
                            skills: cc.skills.filter(function check(x){
                               curr.skills.map(function(y) {
                                 return y.name;
                               }).includes(x.name);
                            })
                       }
                     },
            controller: EditCurriculumDialogController
       });
       function EditCurriculumDialogController($scope, $mdDialog, curricI) {

           $scope.skills = cc.skills;
           $scope.curricI = curricI;

           $scope.cancel = function() {
            $mdDialog.cancel();
           }

           $scope.saveCurriculum = function(x) {
               curr.name = $scope.curricI.name
               curr.skills = $scope.curricI.skills
               curriculumService.update(curr, function () {
                   cc.showToast("Curriculum updated");
               }, function () {
                   cc.showToast("Could not edit Curriculum")
               })
               $mdDialog.hide();
           }
       }
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