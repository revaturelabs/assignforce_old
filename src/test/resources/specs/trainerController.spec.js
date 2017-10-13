//used to test
describe('trainerControllerTest', function(){
    var $controller;
    var $scope = {};
    var ctrl;

     //functions within the trainerController
     //
     //    Total     completed      tests
     //--------------------------------------
     //     4          4             5




    beforeEach(function(){
        module('batchApp');
        inject(function(_$controller_){
                // make comment here...
                $controller = _$controller_;
        });
        ctrl = $controller('trainerCtrl', { $scope: $scope });
    });


    //deactivates a single trainer
    describe("removeTrainerTest", function(){
        it("Tests to make sure the trainerRM.active is being marked as false", function(){
            var trainerRM = {};
            ctrl.removeTrainer(trainerRM)
            actual = trainerRM.active;
            should = false;
            expect(actual).toBe(should);
        });
    });

    //connects to aws s3 to grab an object
    describe("grabS3ResumeTest", function(){
        it("Tests to make sure it returns if the filename is null", function(){
            var trainer = {};
            trainer.resume = null;
            ctrl.grabS3Resume(trainer)
            actual = ctrl.url;
            should = undefined;
            expect(actual).toBe(should);

            //check to see if tc.url is undefined or not
        });
    });

    // reformats how an array of objects is joined
    describe("joinObjArrayByNameTest", function(){
        it("Testing to see if null is returned", function(){
            var elem = {};
            elem.name = null;
            actual = ctrl.joinObjArrayByName(elem);
            should = null;
            expect(actual).toBe(should);
        });
        it("Testing to see if 45 is returned", function(){
            var elem = {};
            elem.name = 45;
            actual = ctrl.joinObjArrayByName(elem);
            should = 45;
            expect(actual).toBe(should);
        });
    });

    //this is used to compare two different dates but for some reason it doesnt work.
    describe("convertUnavailabilityTest", function(){
        it("TEST", function(){
            var incoming = "October 13, 2014";
            var actual = ctrl.convertUnavailability(incoming);
            var should = new Date("October 13, 2014");
            console.log(actual);
            console.log(should);
            expect(actual).toBe(should);
        });
    });

});