//used to test
describe('trainerControllerTest', function(){
    var $controller;
    var $scope = {};
    var ctrl;

     //functions within the trainerController
     //
     //    Total     tested
     -----------------------------
     //     13          0




    beforeEach(function(){
        module('batchApp');
        inject(function(_$controller_){
                // make comment here...
                $controller = _$controller_;
        });
        ctrl = $controller('trainerCtrl', { $scope: $scope });
    });


    //this function is used to add a trainer by popping up a dialog box
    describe("addTrainerTest", function(){
        it("TEST", function(){
            $scope.self.settings = 'test';
            $scope.self.resetSettings();
            expect($scope.self.settings).toBe('placeholder');
        });
    });

    //deactivates a single trainer
    describe("removeTrainerTest", function(){
        it("TEST", function(){
            ctrl.
            expect().toBe();
        });
    });

    //connects to aws s3 to grab an object
    describe("grabS3ResumeTest", function(){
        it("TEST", function(){
            $scope.self.settings = 'test';
            $scope.self.resetSettings();
            expect($scope.self.settings).toBe('placeholder');
        });
    });

    // activates a trainer
    describe("activateTrainerTest", function(){
        it("TEST", function(){
            ctrl.
            expect().toBe();
        });
    });

    // reformats how an array of objects is joined
    describe("joinObjArrayByNameTest", function(){
        it("TEST", function(){
            $scope.self.settings = 'test';
            $scope.self.resetSettings();
            expect($scope.self.settings).toBe('placeholder');
        });
    });

    // redirects the url to go to the profile page
    // appends the trainer id so that the profile page can load that id in
    describe("goToTrainerTest", function(){
        it("TEST", function(){
            ctrl.
            expect().toBe();
        });
    });
    // queries the database for trainers. to be called after a change to the trainers array
    describe("rePullTrainersTest", function(){
        it("TEST", function(){
            $scope.self.settings = 'test';
            $scope.self.resetSettings();
            expect($scope.self.settings).toBe('placeholder');
        });
    });

    //make comment here...
    describe("convertUnavailabilityTest", function(){
        it("TEST", function(){
            ctrl.
            expect().toBe();
        });
    });

    //make comment here...
    describe("showCalendarTest", function(){
        it("TEST", function(){
            $scope.self.settings = 'test';
            $scope.self.resetSettings();
            expect($scope.self.settings).toBe('placeholder');
        });
    });

    //make comment here...
    describe("hideCalendarTest", function(){
        it("TEST", function(){
            ctrl.
            expect().toBe();
        });
    });

    //make comment here...
    describe("showPTODialogTest", function(){
        it("TEST", function(){
            $scope.self.settings = 'test';
            $scope.self.resetSettings();
            expect($scope.self.settings).toBe('placeholder');
        });
    });

    // get the S3 bucket credentials and store them in creds using the s3Service
    describe("getCredsTest", function(){
        it("TEST", function(){
            ctrl.
            expect().toBe();
        });
    });

    // gets all trainers and stores them in variable trainers
    describe("getAllTest", function(){
        it("TEST", function(){
            ctrl.
            expect().toBe();
        });
    });
});