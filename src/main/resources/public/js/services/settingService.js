/**
 * Created by lazar on 2/8/2017.
 */

var app = angular.module("batchApp");

app.service('settingService', function ($resource) {

    var Setting = $resource('api/v2/setting/:settingId', {settingId: '@settingId'},{update:{method:'PUT', url:'api/v2/setting'}});
    var ss = this;
    ss.settings = null;

    ss.getGlobal = function (success, error) {
        if(ss.settings){
            success(ss.settings);
            return;
        }
        Setting.query(function(response){
            ss.settings = response[0];
            success(ss.settings)
        }, error);
    };

    ss.getSettingByName = function(name, success, error){
        if(ss.settings && ss.settings[name]){
            success(ss.settings[name])
            return;
        }

        ss.getGlobal(function(settings){
            success(ss.settings[name])
        }, error)
    }

    ss.update = function (setting, success, error) {
        setting.$update(success, error);
    };
});
