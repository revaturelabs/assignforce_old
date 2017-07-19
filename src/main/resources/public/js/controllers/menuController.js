
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "menuCtrl", function( $scope, $location ) {
        var mc = this;

          // functions
            // sets navbar to current page even on refresh
        mc.findCurrentPage = function(){

            var path = $location.path().replace("/", "");
            if (path == "home") {
                return "overview";
            } else {
                return path;
            }
        };

        // if ($scope.role == "trainer"){
        //     $scope.toggle = true;
        // }else{
        //     $scope.toggle = false;
        // }

        $scope.toggle = false;
          // data
        mc.currentPage = mc.findCurrentPage();
    });