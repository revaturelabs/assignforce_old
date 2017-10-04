
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "menuCtrl", function( $scope, $location, $rootScope, $http) {
        var mc = this;

        $http.get("/api/v2/userinfo")
       .then(function(response) {
           $rootScope.data = response.data;
           
           $rootScope.role = response.data.roleName;
           $rootScope.token = response.data.accessToken;
           $rootScope.fName = response.data.firstName;
           $rootScope.lName = response.data.lastName;
       }, function () {

    }).then(function(){
        if ($rootScope.role === "Trainers"){
            $scope.toggle = true;
        }else{
            $scope.toggle = false;
        }
    })
            

          // functions
            // sets navbar to current page even on refresh
        mc.findCurrentPage = function(){

            var path = $location.path().replace("/", "");
            if (path === "home") {
                return "home";
            } else {
                return path;
            }
        };

       
        

          // data
        mc.currentPage = mc.findCurrentPage();
    });