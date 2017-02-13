var app = angular.module("batchApp");

app.service('trainerService', function($resource) {
    var Trainer = $resource('api/v2/trainer/:trainerID',{trainerID:'@trainerID'},{update:{method:'PUT', url:'api/v2/trainer'}});
    //remove url in the put method
    var ts = this;

    //created an empty Trainer
    ts.getEmptyTrainer = function () {
        return new Trainer();
    }

    //Gets all trainers in the database
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