/**
 * Created by NV on 3/2/2017.
 */

var assignforce = angular.module("batchApp");



assignforce.directive('getGradData', function() {
    return {
        restrict: 'ACE',
        scope: true,
        template: '<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
        bindToController: true,
        controller: function($scope) {
            $scope.myGraph();
        }
    };
});



assignforce.directive('getTrainData', function() {
    return {
        restrict: 'ACE',
        scope: true,
        template: '<div id="container2" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
        bindToController: true,
        controller: function($scope) {
            $scope.myGraph2();
        }
    };
});



assignforce.directive('getFocusData', function() {
    return {
        restrict: 'ACE',
        scope: true,
        template: '<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
        bindToController: true,
        controller: function($scope) {
            $scope.myGraph();
        }
    };
});



assignforce.directive('getGradTableTemplate', function() {
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/gradTableTemplate.html",
        bindToController: true
    };
});



assignforce.directive('getIncomingTableTemplate', function() {
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/incomingTableTemplate.html",
        bindToController: true
    };
});



assignforce.directive('getBatchGenTemplate', function() {
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/batchGenTemplate.html",
        bindToController: true
    };
});
