/**
 *This controller is used to control user access and facilitate user authorization
 */

var app = angular.module("batchApp");
app.constant("ADAPTER_URL", 'api/v2/authorize?redirect_url  =');
app.controller("AuthCtrl", function($scope, $location, $window, $mdToast, $http, $rootScope){

    var ac = this;

    ac.loginerror = false;
    ac.loggedin = false;
    ac.username = '';
    ac.password = '';


    // global function available to all other controllers (as they are all children of authctrl) to create toast messages
    ac.showtoast = function( message ) {
        $mdToast.show( $mdToast.simple().textcontent( message ).action("okay").position("top right").highlightaction(true) );
    }

    $rootScope.location = $location;

    ac.login = function(){

        $http({
            method :  "post",
            url    :  "api/v2/auth",
            //data   :  {
                // username : ac.username,
                // password : ac.password
            //}
        })
            .success(function(){
                ac.loggedin = true;
                window.location = "home";
            })
            .error(function(){
                window.location = "login";
                ac.loginerror = true;
                // ac.username = '';
                // ac.password = '';
            });
    }
});
