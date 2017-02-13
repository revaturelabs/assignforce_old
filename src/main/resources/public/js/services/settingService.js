/**
 * Created by lazar on 2/8/2017.
 */

var app = angular.module("batchApp");

app.service('settingService', function ($resource) {

    var Setting = $resource('api/v2/setting/:settingID', {settingID: '@settingID'},{update:{method:'PUT'}});
    var ss = this;

    ss.getAll = function (success, error) {
        Setting.query(success, error);
    };

    ss.getById = function (id, success, error) {
        return Setting.get({settingID: id}, success, error);
    };

    ss.update = function (setting, success, error) {
        setting.$update(success, error);
    };
});
