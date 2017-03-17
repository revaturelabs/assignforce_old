/**
 *This controller is used to control user access and facilitate user authorization
 */

var app = angular.module("batchApp");
app.constant("ADAPTER_URL", 'api/v2/authorize?redirect_url=');
app.controller("AuthCtrl", function($scope, $location, $window, $mdToast){

    var ac = this;

    ac.loginError = false;
    ac.loggedIn = false;

    // global function available to all other controllers (as they are all children of authCtrl) to create toast messages
    ac.showToast = function( message ) {
        $mdToast.show( $mdToast.simple().textContent( message ).action("OKAY").position("top right").highlightAction(true) );
    }

    ac.login = function(){
        if (success){ /* successful login */
            ac.loggedIn = true;
        } else {
            ac.loginError = true;
        }
    }
});
