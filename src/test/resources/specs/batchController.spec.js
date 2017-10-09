//testing this batchCtrl
describe('batchCtrl', function () {
    var $controller;
    var $scope= {};
    var ctrl;



   beforeEach(function(){
           module('batchApp');

           inject(function($controller){
              ctrl = $controller('batchCtrl', {
                 $scope: $scope
              });

           });

       });



   describe('testing calcTrainerSkillRatio', function(){
        it("if selected skills are null", function(){ //passed
            ctrl.selectedSkills = null;
            var result = ctrl.calcTrainerSkillRatio();
            expect(result).toBe(0);
        });

        it("if selected skills are empty array", function(){
                    ctrl.selectedSkills = [];
                    var result = ctrl.calcTrainerSkillRatio();
                    expect(result).toBe(100);
        });

        xit("if selected skills have values", function(){
                            ctrl.selectedSkills = [{skillId: 1, name: Java Basic, active: true};
                            var result = ctrl.calcTrainerSkillRatio();
                            expect(result).toBe();
                        });

   });


});
