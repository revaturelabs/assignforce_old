/**
 * User service will provide user based functionality especially for authentication
 */
var app = angular.module("batchApp");

app.constant('authorizeUrl', 'api/v2/authorize');

app.service('userSrv', function($http, authorizeUrl){

	
});