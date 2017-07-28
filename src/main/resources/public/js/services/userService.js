/**
 * User service will provide user based functionality especially for authentication
 */
var app = angular.module("batchApp");

app.constant('authorizeUrl', 'api/v2/authorize');

app.service('userService', function($resource, $rootScope, $http){
    var us = this;

   $http.get("/auth/userinfo")
       .then(function(response) {
           $rootScope.data = response.data;
           console.log($rootScope.data);

           $rootScope.role = response.data.roleName;
           $rootScope.token = response.data.accessToken;
           $rootScope.fName = response.data.firstName;
           $rootScope.lName = response.data.lastName;
       }, function (error) {

    })
});