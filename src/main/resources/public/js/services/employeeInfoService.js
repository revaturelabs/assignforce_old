var app = angular.module("batchApp");

app.service('employeeInfoService', function($resource, $rootScope) {
    var me;
    var eis = this;
    var Employee = $resource('/auth/userinfo',
        {
            get:{ method: "GET", url: "/auth/userinfo"}
        }
    );

    eis.isLoaded = function(){
        return me;
    }

    eis.getEmployeeInfo = function(success, error){
        Employee.get(success, error);
    }

    eis.setMe = function(anEmployee){
        me = anEmployee;
    }

    eis.getRoleName = function(){
        return me.roleName;
    }

    eis.getAccessToken = function(){
        return me.accessToken;
    }

    eis.getFirstName = function(){
        return me.firstName;
    }

    eis.getLastName = function(){
        return me.lastName;
    }
});