xdescribe('curriculaCtrl', function () {
    var mockScope = {};
    var controller;
    var cc;

    beforeEach(angular.mock.module("batchApp"));

    beforeEach(angular.mock.inject(function ($controller, $rootScope) {
        mockScope = $rootScope.$new();
        controller = $controller("curriculaCtrl", {
            $scope: mockScope,
            $this: cc
        });

    }));

    xdescribe('cc.toggleSkillToolbar', function () {
       it("sets the skillToggle variable to false if it is true", function(){
           controller.skillToggle = true;
           controller.toggleSkillToolbar();
           expect(controller.skillToggle).toEqual(false);
       });

       it("sets the skillToggle variable to true if it is false", function () {
           controller.skillToggle = false;
           controller.toggleSkillToolbar();
           expect(controller.skillToggle).toEqual(true);
       })
    });
});
