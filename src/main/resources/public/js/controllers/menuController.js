
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "menuCtrl", function( $scope, $location, $rootScope, $http, $cookies) {
        var mc = this;

        if ($rootScope.role == "Trainers"){
            $scope.toggle = true;
        }else{
            $scope.toggle = false;
        }


          // functions
            // sets navbar to current page even on refresh
        mc.findCurrentPage = function(){

            var path = $location.path().replace("/", "");
            if (path == "home") {
                return "home";
            } else {
                return path;
            }
        };

       
        

        // $scope.toggle = false;
          // data
        mc.currentPage = mc.findCurrentPage();
    });