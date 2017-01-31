var app = angular.module("batchApp");

app.service('trainerService', function($resource) {
    var Trainer = $resource('api/v2/trainer/:trainerID',{trainerID:'@trainerID'});
    var ts = this;
    
    ts.getAll = function(success, error) {
    	Trainer.query(success, error);
    };

    ts.getById = function(id, success, error){
        Trainer.get({trainerID: id}, success, error);
    }
});