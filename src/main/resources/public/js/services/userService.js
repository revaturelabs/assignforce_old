/**
 * User service will provide user based functionality especially for authentication
 */
var app = angular.module("batchApp");

app.constant('authorizeUrl', 'api/v2/authorize');
//may need $http, authorizeUrl as parameters
app.service('userSrv', function(){

    //D1
    var User = $resource('api/v2/userinfo');
    var us = this;

    $RootScope.foo = User.roleId;

    us.getAll = function(success, error) {
        User.query(success, error);
        console.log("User");
    };
});

// app.service('username', function(){
//     this.user = "";
//     this.setUser = function(input){
//         this.user = input;
//     }

// })