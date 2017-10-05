//used to test
describe('trainerControllerTest', function(){
    var $controller;
    var $scope = {};
    var ctrl;

     //functions within the trainerController
     //
     //    Total     completed      tests
     //--------------------------------------
     //     12          1             1




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
            should =  ctrl.url === undefined;
            expect(actual).toBe(should);

            //check to see if tc.url is undefined or not
        });
    });
//
//    // activates a trainer
//    xdescribe("activateTrainerTest", function(){
//        it("TEST", function(){
//            ctrl.
//            actual = ;
//            should = ;
//            expect(actual).toBe(should);
//        });
//    });
//
//    // reformats how an array of objects is joined
//    xdescribe("joinObjArrayByNameTest", function(){
//        it("TEST", function(){
//            ctrl.
//            actual = ;
//            should = ;
//            expect(actual).toBe(should);
//        });
//    });
//
//    // redirects the url to go to the profile page
//    // appends the trainer id so that the profile page can load that id in
//    xdescribe("goToTrainerTest", function(){
//        it("TEST", function(){
//            ctrl.
//            actual = ;
//            should = ;
//            expect(actual).toBe(should);
//        });
//    });
//    // queries the database for trainers. to be called after a change to the trainers array
//    xdescribe("rePullTrainersTest", function(){
//        it("TEST", function(){
//            ctrl.
//            actual = ;
//            should = ;
//            expect(actual).toBe(should);
//        });
//    });
//
//    //make comment here...
//    xdescribe("convertUnavailabilityTest", function(){
//        it("TEST", function(){
//            ctrl.
//            actual = ;
//            should = ;
//            expect(actual).toBe(should);
//        });
//    });
//
//    //make comment here...
//    xdescribe("showCalendarTest", function(){
//        it("TEST", function(){
//            ctrl.
//            actual = ;
//            should = ;
//            expect(actual).toBe(should);
//        });
//    });
//
//    //make comment here...
//    xdescribe("hideCalendarTest", function(){
//        it("TEST", function(){
//            ctrl.
//            actual = ;
//            should = ;
//            expect(actual).toBe(should);
//        });
//    });
//
//    //make comment here...
//    xdescribe("showPTODialogTest", function(){
//        it("TEST", function(){
//            ctrl.
//            actual = ;
//            should = ;
//            expect(actual).toBe(should);
//        });
//    });
//
//    // get the S3 bucket credentials and store them in creds using the s3Service
//    xdescribe("getCredsTest", function(){
//        it("TEST", function(){
//            ctrl.
//            actual = ;
//            should = ;
//            expect(actual).toBe(should);
//        });
//    });
//
//    // gets all trainers and stores them in variable trainers
//    xdescribe("getAllTest", function(){
//        it("TEST", function(){
//            ctrl.
//            actual = ;
//            should = ;
//            expect(actual).toBe(should);
//        });
//    });
});