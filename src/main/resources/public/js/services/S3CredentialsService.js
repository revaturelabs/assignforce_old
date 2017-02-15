/**
 * Created by lazar on 2/13/2017.
 */

var app = angular.module("batchApp");

app.service('s3Service', function ($resource) {
    var S3Creds = $resource('/api/v2/s3Creds');
    var s3s = this;

    s3s.getCreds = function (success, error) {
        S3Creds.get(success, error);
    }
});
