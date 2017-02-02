var app = angular.module("batchApp");

app.service('trainerService', function($resource) {
    var Trainer = $resource('api/v2/trainer/:trainerID',{trainerID:'@trainerID'});
    var ts = this;

    ts.getEmptyTrainer = function () {
        return new Trainer();
    }
    
    ts.getAll = function(success, error) {
    	Trainer.query(success, error);
    };

    ts.getById = function(id, success, error){
        Trainer.get({trainerID: id}, success, error);
    }

    ts.create = function (trainer, success, error) {
        trainer.$save(success, error);
    }
});