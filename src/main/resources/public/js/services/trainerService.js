var app = angular.module("batchApp");

app.service('trainerService', function($resource) {
    var Trainer = $resource('api/v2/trainer/:trainerID',{trainerID:'@trainerID'},{update:{method:'PUT', url:'api/v2/trainer'}});
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

    ts.update = function (trainer, success, error) {
        trainer.$update(success, error);
    }

    ts.delete = function (id, success, error) {
        Trainer.delete({trainerID: id}, success, error);
    }
});