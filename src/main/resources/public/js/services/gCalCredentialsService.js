var app = angular.module("batchApp");

app.service('gCalService', function ($resource) {
    var gCalCreds = $resource('/api/v2/gCalCreds');
    var gcals = this;

    gcals.getCreds = function (success, error) {
        gCalCreds.get(success, error);
    }
});
