/**
 * Created by NV on 3/2/2017.
 */

var assignforce = angular.module("batchApp");



assignforce.directive('getGradGraph', function() {
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



assignforce.directive('getTrainGraph', function() {
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



assignforce.directive('getFocusGraph', function() {
    return {
        restrict: 'ACE',
        scope: true,
        template: '<div id="container3" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
        bindToController: true,
        controller: function($scope) {
            $scope.myGraph3();
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



assignforce.directive('getTrainTableTemplate', function() {
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/incomingTableTemplate.html",
        bindToController: true
    };
});



assignforce.directive('getTrainTableToolbar', function() {
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/toolbars/traineeTableToolbar.html",
        bindToController: true
    };
});


assignforce.directive('getGradTableToolbar', function() {
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/toolbars/gradTableToolbar.html",
        bindToController: true
    };
});


assignforce.directive('getBatchGenTableToolbar', function() {
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/toolbars/batchGenToolbar.html",
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


/** Had a bug when pulling this template in so code is in reports.html
assignforce.directive('getBatchGenTemplate', function() {
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/batchGenTemplate.html",
        bindToController: true
    };
});
 */

