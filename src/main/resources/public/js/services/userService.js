/**
 * User service will provide user based functionality especially for authentication
 */
var app = angular.module("batchApp");

app.constant('authorizeUrl', 'api/v2/authorize');
//may need $http, authorizeUrl as parameters
app.service('userSrv', function(){
<<<<<<< HEAD
	var User = $resource('api/v2/userinfo');
    var us = this;
	
	us.getAll = function(success, error) {
		User.query(success, error);
		console.log("User");
    };
});
=======

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
>>>>>>> 45746d0db7d64a3943a2b5c309bb746a7bd21b4f
