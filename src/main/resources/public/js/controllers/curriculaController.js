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
    cc.removeCurriculum = function (event,curr) {
        var confirm = $mdDialog.confirm()
              .title('Are You Sure?')
              .textContent('Are you sure you would like to remove this curriculum?')
              .ariaLabel('curricRemove')
              .targetEvent(event)
              .ok('Remove')
              .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            curr.active = false;
            curriculumService.update(curr, function () {
                cc.showToast("Removed core successfully")
            }, function () {
                cc.showToast("Unable to remove core")
            })
            }, function() {

        });
    };

    //used to join the skills together
    cc.joinObjArrayByName = function(elem) {
        return elem.name;
    };

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