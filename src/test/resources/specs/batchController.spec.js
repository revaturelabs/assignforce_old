//testing this batchCtrl
describe('batchCtrl', function () {
    var $controller;
    var $scope= {};
    var ctrl;


     var actual;
     var should;
     var shouldNot;


   beforeEach(function(){
           module('batchApp');

           inject(function($controller){
              ctrl = $controller('batchCtrl', {
                 $scope: $scope,
                 //trainerSvc: trainerService
              });
           });
   });

   describe('testing calcTrainerSkillRatio', function(){
        it("if selected skills are null", function(){ //passed
            ctrl.selectedSkills = null;
            var result = ctrl.calcTrainerSkillRatio();
            expect(result).toBe(0);
        });

        it("if selected skills are empty array", function(){ //passed
            ctrl.selectedSkills = [];
            var result = ctrl.calcTrainerSkillRatio();
            expect(result).toBe(100);
        });

        it("if selected skills have values", function(){ //passed
             ctrl.selectedSkills = [1,2,3,4];
             var trainer = {skills: [{skillId: 1}, {skillId: 2}]};
             var result = ctrl.calcTrainerSkillRatio(trainer);
             var should = Math.floor((2 / 4) * 100);
             expect(result).toBe(should);
        });


   });

   describe('testing calcProgress', function(){
        var param1;
        var param2
           it("When param1 is null", function(){ //passed
               param1 = null;
               param2 = 50;
               var actual = ctrl.calcProgress(param1, param2);
               var should = 0;
               expect(actual).toBe(should);
           });

            it("When param2 is null", function(){ //passed
               param1 = 50;
               param2 = null;
               var actual = ctrl.calcProgress(param1, param2);
               var should = 0;
               expect(actual).toBe(should);
            });

            it("When both parm1 and param2 are null", function(){ //passed
                param1 = null;
                param2 = null;
                var actual = ctrl.calcProgress(param1, param2);
                var should = 0;
                expect(actual).toBe(should);
            });

             it("When both parm1 and param2 are 0", function(){ //passed
                 param1 = 0;
                 param2 = 0;
                 var actual = ctrl.calcProgress(param1, param2);
                 var should = 0; //because 0 is falsy  so parameter as 0 should return 0
                 expect(actual).toBe(should);
             });

             it("When difference is 0", function(){ //passed
                  param1 = 1000000;
                  param2 = 1000000;
                  var actual = ctrl.calcProgress(param1, param2);
                  var should = 100; //because the difference is 0 and anything divided by 0 in JS results in infinity
                  expect(actual).toBe(should);
             });

             it("When difference is not 0", function(){  //passed
                  today = new Date().getTime();
                  param1 = today-2000000;
                  param2 = today+1000000;
                  today -= param1;
                  var diff = param2 - param1;

                  var actual = ctrl.calcProgress(param1, param2);
                  var should = (today * 100 / diff).toFixed(5);
                  expect(actual).toBe(should);
             });

             it("When param1 is negative", function(){ //passed
                  today = new Date().getTime();
                  param1 = -2000000;
                  param2 = 1000000;
                  today -= param1;
                  var diff = param2 - param1; //difference is 3000000

                  var actual = ctrl.calcProgress(param1, param2);
                  var should = 0;
                  expect(actual).toBe(should);
             });

             it("When param2 is negative", function(){ //passed
                  today = new Date().getTime();
                  param1 = 2000000;
                  param2 = -1000000;
                  today -= param1;
                  var diff = param2 - param1;

                  var actual = ctrl.calcProgress(param1, param2);
                  var should = 0;
                  expect(actual).toBe(should);
             });


             it("When both param1 and param2 are negative", function(){ //passed
                  today = new Date().getTime();
                  param1 = -2000000;
                  param2 = -1000000;
                  today -= param1;
                  var diff = param2 - param1;

                  var actual = ctrl.calcProgress(param1, param2);
                  var should = 0;
                  expect(actual).toBe(should);
             });


             it("When param2 is less than param1", function(){
                  today = new Date().getTime();
                  param1 = 2000000;
                  param2 = 1000000;
                  today -= param1;
                  var diff = param2 - param1;

                  var actual = ctrl.calcProgress(param1, param2);
                  var should = 0;
                  expect(actual).toBe(should);
             });

      });




});
