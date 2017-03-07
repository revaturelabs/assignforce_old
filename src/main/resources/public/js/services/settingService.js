/**
 * Created by lazar on 2/8/2017.
 */

var app = angular.module("batchApp");

app.service('settingService', function ($resource) {

    var Setting = $resource('api/v2/setting/:settingId', {settingId: '@settingId'},{update:{method:'PUT', url:'api/v2/setting'}});
    var ss = this;

    ss.getAll = function (success, error) {
        Setting.query(success, error);
    };

    ss.getById = function (settingId, success, error) {
        Setting.get({settingId: settingId}, success, error);
    };

    ss.update = function (setting, success, error) {
        setting.$update(success, error);
    };
});
