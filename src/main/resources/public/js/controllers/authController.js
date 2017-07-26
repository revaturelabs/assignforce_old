/**
 *This controller is used to control user access and facilitate user authorization
 */

var app = angular.module("batchApp");
app.constant("ADAPTER_URL", 'api/v2/authorize?redirect_url  =');
app.controller("AuthCtrl", function($scope, $location, $window, $mdToast, $http, $rootScope){

    var ac = this;

    ac.loginError = false;
    ac.loggedIn = false;
    ac.username = '';
    ac.password = '';


    // global function available to all other controllers (as they are all children of authCtrl) to create toast messages
    ac.showToast = function( message ) {
        $mdToast.show( $mdToast.simple().textContent( message ).action("OKAY").position("top right").highlightAction(true) );
    }

    $rootScope.location = $location;

    ac.login = function(){

        $http({
            method :  "POST",
            url    :  "api/v2/auth",
            //data   :  {
                // username : ac.username,
                // password : ac.password
            //}
        })
            .success(function(){
                ac.loggedIn = true;
                window.location = "home";
            })
            .error(function(){
                window.location = "login";
                ac.loginError = true;
                // ac.username = '';
                // ac.password = '';
            });
    }
});
