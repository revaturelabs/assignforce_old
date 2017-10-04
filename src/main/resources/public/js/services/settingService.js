/**
 * Created by lazar on 2/8/2017.
 */

var app = angular.module("batchApp");

app.service('settingService', function ($resource) {

    var Setting = $resource('api/v2/setting/:settingId', {settingId: '@settingId'},{update:{method:'PUT', url:'api/v2/setting'}});
    $scope.settings = null;

    $scope.getGlobal = function (success, error) {
        if($scope.settings){
            success($scope.settings);
            return;
        }
        Setting.query(function(response){
            $scope.settings = response[0];
            success($scope.settings)
        }, error);
    };

    $scope.getSettingByName = function(name, success, error){
        if($scope.settings && $scope.settings[name]){
            success($scope.settings[name])
            return;
        }

        $scope.getGlobal(function(settings){
            success($scope.settings[name])
        }, error)
    }

    $scope.update = function (setting, success, error) {
        setting.$update(function(response){
            $scope.settings = setting;
            success();
        }, error);
    };
});
